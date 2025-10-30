import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { readSummary, addSummaryItem } from '@/lib/tripSummary';

export default function MyMedia(){
  const [media, setMedia] = useState<{id:string;url:string;originalUrl?:string;type?:string;uploadedAt:string;album?:string}[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<'images'|'videos'|'reels'>('images');
  // target size used for resizing subsequent uploads; default 1080x1350 (4:5 portrait)
  const [uploadTarget, setUploadTarget] = useState<{w:number;h:number}>({w:1080,h:1350});
  const trips = useMemo(() => readSummary(), []);

  const albums = useMemo(() => {
    const out: { key: string; label: string; dest?: string; start?: string; end?: string }[] = [];
    const fmtDayMon = (d: string) => {
      try{
        const dt = new Date(d);
        const day = dt.getDate();
        const mon = dt.toLocaleString('en-GB', { month: 'short' });
        return `${day} ${mon}`;
      }catch(e){ return d; }
    };
    const fmtYear = (d: string) => {
      try{ return new Date(d).getFullYear(); } catch(e){ return ''; }
    };
    trips.forEach(it => {
      const meta = it.meta || {};
      const dest = (meta.destination || meta.trip?.destination || it.title || '').toString();
      const sd = meta.startDate || meta.from;
      const ed = meta.endDate || meta.to;
      if(!dest) return;
      let key = dest.toLowerCase();
      let label = dest;
      if(sd && ed){
        const s = fmtDayMon(sd);
        const e = fmtDayMon(ed);
        const yr = fmtYear(ed) || fmtYear(sd);
        label = `${dest} ${s} - ${e} ${yr}`;
        key = `${dest.toLowerCase().replace(/\s+/g,'-')}_${sd}_${ed}`;
      }
      if(!out.find(x=> x.key === key)) out.push({ key, label, dest, start: sd, end: ed });
    });
    return out;
  }, [trips]);

  // cropping/editing state
  const [rawImage, setRawImage] = useState<string | null>(null);
  const imgRef = React.useRef<HTMLImageElement | null>(null);
  const containerW = 300;
  const containerH = Math.round(containerW * 5 / 4);
  const [naturalSize, setNaturalSize] = useState({w:0,h:0});
  const [baseScale, setBaseScale] = useState(1);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({x:0,y:0});
  const draggingRef = React.useRef(false);
  const dragStart = React.useRef({x:0,y:0,ox:0,oy:0});
  const [dragging, setDragging] = useState(false);

  useEffect(()=>{
    try{
      const raw = JSON.parse(localStorage.getItem('media') || '[]');
      const normalized = (raw || []).map((it: any) => {
        const url = it.url || it;
        let type = 'image';
        if(typeof url === 'string'){
          if(url.startsWith('data:video') || url.match(/\.(mp4|webm|ogg)(\?|$)/i)) type = 'video';
          else if(url.startsWith('data:audio') || url.match(/\.(mp3|wav|m4a)(\?|$)/i)) type = 'audio';
          else if(url.match(/\.(jpe?g|png|gif|bmp|webp)(\?|$)/i) || url.startsWith('data:image')) type = 'image';
          else type = 'other';
        }
        return { id: it.id || ('m-'+Date.now()), url, originalUrl: it.originalUrl || url, type, uploadedAt: it.uploadedAt || new Date().toISOString(), album: it.album };
      });
      setMedia(normalized);
    }catch(e){
      // ignore
    }
  },[]);

  // Seed a Goa trip into trip summary so an album is available
  useEffect(()=>{
    try{
      const existing = readSummary();
      const exists = existing.find(it => it.id === 'goa-2025-08-11');
      if(!exists){
        addSummaryItem({
          id: 'goa-2025-08-11',
          type: 'stay',
          title: 'Goa',
          price: 0,
          meta: { destination: 'Goa', startDate: '2025-08-11', endDate: '2025-08-17' }
        });
      }
    }catch(e){/* ignore */}
  },[]);

  function onImageLoad(){
    const img = imgRef.current;
    if(!img) return;
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    setNaturalSize({w:nw,h:nh});
    const coverScale = Math.max(containerW / nw, containerH / nh);
    setBaseScale(coverScale);
    setScale(1);
    const displayedW = nw * coverScale;
    const displayedH = nh * coverScale;
    const ox = (containerW - displayedW) / 2;
    const oy = (containerH - displayedH) / 2;
    setOffset({x: ox, y: oy});
  }

  // Resize images to uploadTarget (cover/crop-to-fill) before storing (convert uploads to 1080x1350 4:5)
  async function resizeImage(dataUrl: string, targetW?: number, targetH?: number){
    return new Promise<string>((resolve)=>{
      const img = new Image();
      img.onload = ()=>{
        const tW = targetW || uploadTarget.w || 1080;
        const tH = targetH || uploadTarget.h || 1350;
        const canvas = document.createElement('canvas');
        canvas.width = tW;
        canvas.height = tH;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#fff';
        ctx.fillRect(0,0,tW,tH);
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        const scale = Math.max(tW / w, tH / h);
        const dw = Math.round(w * scale);
        const dh = Math.round(h * scale);
        const dx = Math.round((tW - dw) / 2);
        const dy = Math.round((tH - dh) / 2);
        ctx.drawImage(img, 0,0,w,h, dx, dy, dw, dh);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = ()=> resolve(dataUrl);
      img.src = dataUrl;
    });
  }

  function startDrag(e: any){
    draggingRef.current = true;
    setDragging(true);
    const p = e.touches ? e.touches[0] : e;
    dragStart.current = { x: p.clientX, y: p.clientY, ox: offset.x, oy: offset.y } as any;
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchmove', onMove);
    document.addEventListener('touchend', endDrag);
  }
  function onMove(e: any){
    if(!draggingRef.current) return;
    const p = e.touches ? e.touches[0] : e;
    const dx = p.clientX - dragStart.current.x;
    const dy = p.clientY - dragStart.current.y;
    const newX = dragStart.current.ox + dx;
    const newY = dragStart.current.oy + dy;
    const displayedW = naturalSize.w * baseScale * scale;
    const displayedH = naturalSize.h * baseScale * scale;
    const minX = Math.min(0, containerW - displayedW);
    const minY = Math.min(0, containerH - displayedH);
    const clampedX = Math.max(minX, Math.min(newX, 0));
    const clampedY = Math.max(minY, Math.min(newY, 0));
    setOffset({x: clampedX, y: clampedY});
  }
  function endDrag(){
    draggingRef.current = false;
    setDragging(false);
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', endDrag);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', endDrag);
  }

  function getCroppedDataUrl(src?: string){
    const imageSrc = src || (selected || rawImage);
    if(!imageSrc) return null;
    const img = new Image();
    img.src = imageSrc;
    return new Promise<string>((resolve)=>{
      img.onload = ()=>{
        const canvas = document.createElement('canvas');
        const outW = uploadTarget.w || 1080;
        const outH = uploadTarget.h || 1350;
        canvas.width = outW;
        canvas.height = outH;
        const ctx = canvas.getContext('2d')!;
        const dispW = naturalSize.w * baseScale * scale;
        const dispH = naturalSize.h * baseScale * scale;
        const ratioX = naturalSize.w / dispW;
        const ratioY = naturalSize.h / dispH;
        const sx = (-offset.x) * ratioX;
        const sy = (-offset.y) * ratioY;
        const sW = containerW * ratioX;
        const sH = containerH * ratioY;
        ctx.drawImage(img, sx, sy, sW, sH, 0, 0, outW, outH);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
    });
  }

  async function applyCropToMedia(){
    const id = selectedId;
    if(!id) return;
    const cropped = await getCroppedDataUrl();
    if(!cropped) return;
    // update only the displayed url but keep originalUrl for recovery
    const updated = media.map(m=> m.id === id ? { ...m, url: cropped, originalUrl: m.originalUrl || m.url } : m);
    setMedia(updated);
    localStorage.setItem('media', JSON.stringify(updated));
    setSelected(cropped);
    setRawImage(null);
  }

  async function useAsAvatar(mediaId?: string){
    // prefer originalUrl of the media item, fallback to currently selected
    const item = mediaId ? media.find(m=> m.id === mediaId) : media.find(m=> m.url === selected || m.originalUrl === selected);
    const url = item?.originalUrl || item?.url || selected;
    if(!url) return;
    try{
      const raw = JSON.parse(localStorage.getItem('user') || '{}');
      raw.avatar = url;
      localStorage.setItem('user', JSON.stringify(raw));
      // update local state if needed
    }catch(e){}
  }

  function openEditFor(id:string, url:string){
    setSelectedId(id);
    setRawImage(url);
  }

  function deleteMedia(id:string){
    const updated = media.filter(m=> m.id !== id);
    setMedia(updated);
    localStorage.setItem('media', JSON.stringify(updated));
    setSelected(null);
  }

  function handleAddFile(file: File, type = 'image'){
    const reader = new FileReader();
    reader.onload = async ()=>{
      const data = reader.result as string;
      let finalData = data;
      if(type === 'image'){
        try{ finalData = await resizeImage(data, uploadTarget.w, uploadTarget.h); }catch(e){ finalData = data; }
      }
      const newItem = { id: 'm-'+Date.now(), url: finalData, originalUrl: data, type, uploadedAt: new Date().toISOString(), album: albums[0]?.key || undefined };
      const updated = [newItem, ...media];
      setMedia(updated);
      localStorage.setItem('media', JSON.stringify(updated));
    };
    reader.readAsDataURL(file);
  }

  function addFileForCategoryInput(cat: string, e: React.ChangeEvent<HTMLInputElement>){
    const f = e.target.files?.[0];
    if(!f) return;
    handleAddFile(f, cat);
    e.currentTarget.value = '';
  }

  const getCurrentIndex = () => media.findIndex(m => m.id === selectedId || m.url === selected || m.originalUrl === selected);
  const goPrev = () => {
    const i = getCurrentIndex();
    if(i > 0){ const m = media[i-1]; setSelected(m.url); setSelectedId(m.id); }
  };
  const goNext = () => {
    const i = getCurrentIndex();
    if(i >= 0 && i < media.length - 1){ const m = media[i+1]; setSelected(m.url); setSelectedId(m.id); }
  };

  return (
    <div className="min-h-screen p-0 bg-background overflow-auto">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full py-4 px-4">
              <CardTitle>My Media</CardTitle>
              <Link to="/profile" className="text-sm text-muted-foreground">Back</Link>
            </div>
          </CardHeader>
          <CardContent>
              <div className="space-y-6">
                <div className="flex gap-2 mt-6 mb-4">
                  <button className={`px-3 py-1 rounded ${tab==="images"?"bg-muted text-foreground":"text-muted-foreground"}`} onClick={()=> setTab('images')}>Images</button>
                  <button className={`px-3 py-1 rounded ${tab==="videos"?"bg-muted text-foreground":"text-muted-foreground"}`} onClick={()=> setTab('videos')}>Videos</button>
                  <button className={`px-3 py-1 rounded ${tab==="reels"?"bg-muted text-foreground":"text-muted-foreground"}`} onClick={()=> setTab('reels')}>Creatives</button>
                </div>
                {/* Images section */}
                <section style={{ display: tab === 'images' ? 'block' : 'none' }}>
                  <div className="flex items-center justify-between mb-2">
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {(() => {
                      const goa = null;
                      if(goa){
                        const has = media.some(m => m.type === 'image' && m.album === goa.key);
                        if(!has){
                          return (
                            <div key={"folder-"+goa.key} className="rounded overflow-hidden bg-white p-4 border flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-2xl">\n                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>\n                          </div>
                                <div>
                                  <div className="font-medium">{goa.label}</div>
                                  <div className="text-xs text-muted-foreground">Empty album</div>
                                </div>
                              </div>
                              <div>
                                <button className="text-sm text-sky-600">Open</button>
                              </div>
                            </div>
                          );
                        }
                      }
                      return null;
                    })()}

                    <div className="rounded overflow-hidden bg-muted p-0 h-80 md:h-96 flex items-center justify-center border-2 border-dashed border-gray-200">
                      <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center" style={{ padding: 0 }}>
                        <input type="file" accept="image/*" onChange={(e)=> addFileForCategoryInput('image', e)} className="hidden" />
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        <div className="text-sm text-sky-600 mt-2">Add</div>
                      </label>
                    </div>

                    {media.filter(m=> m.type === 'image').map(m => (
                      <div key={m.id} className="rounded overflow-hidden bg-muted p-0 h-80 md:h-96">
                        <img src={m.url} alt={m.id} className="block w-full h-full object-cover cursor-pointer" onClick={() => {
                              const img = new Image();
                              img.onload = ()=>{ setUploadTarget({ w: img.naturalWidth, h: img.naturalHeight }); setSelected(m.url); setSelectedId(m.id); };
                              img.src = m.url;
                            }} />
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <div className="font-medium mb-2">Albums</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      <div key={"album-goa"} className="rounded overflow-hidden bg-muted p-0 h-80 md:h-96 flex items-center justify-center border-2 border-dashed border-gray-200">
                        <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-4" style={{ padding: 0 }}>
                          <input type="file" accept="image/*" onChange={(e)=> addFileForCategoryInput('image', e)} className="hidden" />
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                          <div className="text-sm text-sky-600 mt-2">Add</div>
                          <div className="font-medium mt-2">Goa Trip Aug 2025</div>
                          <div className="text-xs text-muted-foreground">Album</div>
                        </label>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Videos section */}
                <section style={{ display: tab === 'videos' ? 'block' : 'none' }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {(() => {
                      const goa = null;
                      if(goa){
                        const has = media.some(m => m.type === 'video' && m.album === goa.key);
                        if(!has){
                          return (
                            <div key={"folder-"+goa.key+"-v"} className="rounded overflow-hidden bg-white p-4 border flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-2xl">\n                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>\n                          </div>
                                <div>
                                  <div className="font-medium">{goa.label}</div>
                                  <div className="text-xs text-muted-foreground">Empty album</div>
                                </div>
                              </div>
                              <div>
                                <button className="text-sm text-sky-600">Open</button>
                              </div>
                            </div>
                          );
                        }
                      }
                      return null;
                    })()}

                    <div className="rounded overflow-hidden bg-muted p-0 flex items-center justify-center border-2 border-dashed border-gray-200 col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-2">
                      <label className="cursor-pointer w-full h-full flex items-center justify-center p-0">
                        <div className="w-full aspect-video md:min-h-[220px] lg:min-h-[260px] flex flex-col items-center justify-center">
                          <input type="file" accept="video/*" onChange={(e)=> addFileForCategoryInput('video', e)} className="hidden" />
                          <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                            <path d="M23 7l-7 5v4l7 5V7z"></path>
                            <circle cx="8.5" cy="12" r="2.5"></circle>
                            <line x1="8.5" y1="10.5" x2="8.5" y2="13.5"></line>
                            <line x1="7" y1="12" x2="10" y2="12"></line>
                          </svg>
                          <div className="text-sm text-sky-600 mt-2">Add</div>
                          <div className="text-xs text-muted-foreground mt-1">1280×720p</div>
                        </div>
                      </label>
                    </div>

                    {media.filter(m=> m.type === 'video').map(m => (
                      <div key={m.id} className="rounded overflow-hidden bg-muted p-0 h-48 md:h-56 flex items-center justify-center">
                        <div className="w-full aspect-video">
                          <video src={m.url} className="w-full h-full object-cover cursor-pointer" onClick={()=> { setSelected(m.url); setSelectedId(m.id); }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Reels section (was Other) */}
                <section style={{ display: tab === 'reels' ? 'block' : 'none' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Creatives</div>
                    <div>
                      <label className="cursor-pointer text-sm text-sky-600">
                        <input type="file" onChange={(e)=> addFileForCategoryInput('other', e)} className="hidden" />
                        + Add
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div className="rounded overflow-hidden bg-muted p-0 flex items-center justify-center border-2 border-dashed border-gray-200 col-span-1">
                      <label className="cursor-pointer w-full h-full flex items-center justify-center p-0">
                        <div className="w-full aspect-square md:min-h-[180px] lg:min-h-[220px] flex flex-col items-center justify-center">
                          <input type="file" onChange={(e)=> addFileForCategoryInput('other', e)} className="hidden" />
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
                          <div className="text-sm text-sky-600 mt-2">Add</div>
                          <div className="text-xs text-muted-foreground mt-1">Square</div>
                        </div>
                      </label>
                    </div>
                    {media.filter(m=> m.type === 'other' || m.type === 'audio').map(m => (
                      <div key={m.id} className="rounded overflow-hidden bg-muted p-0">
                        <div className="w-full aspect-square flex items-center justify-center md:min-h-[180px] lg:min-h-[220px]">
                          <div className="text-sm text-muted-foreground">{m.type}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
          </CardContent>
        </Card>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={()=> setSelected(null)}>
          <div className="max-w-3xl max-h-[80vh] overflow-auto bg-white p-4 rounded relative" onClick={e=> e.stopPropagation()}>
            <button onClick={()=> setSelected(null)} aria-label="Close" className="absolute top-2 right-2 text-sm bg-white/90 rounded-full w-7 h-7 flex items-center justify-center">×</button>
            {!rawImage ? (
              <div className="flex flex-col items-center">
                <div className="relative flex items-center justify-center">
                  <button onClick={(e)=>{ e.stopPropagation(); goPrev(); }} className="absolute left-[-24px] md:left-[-48px] bg-black/30 text-white rounded-full w-8 h-8 flex items-center justify-center">‹</button>
                  <img src={selected || ''} alt="selected" style={{ maxWidth: 'calc(100vw - 160px)', maxHeight: '75vh', width: 'auto', height: 'auto', objectFit: 'contain' }} />
                  <button onClick={(e)=>{ e.stopPropagation(); goNext(); }} className="absolute right-[-24px] md:right-[-48px] bg-black/30 text-white rounded-full w-8 h-8 flex items-center justify-center">›</button>
                </div>
                <div className="mt-3 w-full">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    {selectedId && (
                      <>
                        <button onClick={(e)=>{ e.stopPropagation(); openEditFor(selectedId, selected || ''); }} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm">Edit</button>
                        <button onClick={(e)=>{ e.stopPropagation(); useAsAvatar(selectedId); }} className="px-3 py-1 rounded bg-sky-600 hover:bg-sky-700 text-white text-sm">Use as avatar</button>
                        <button onClick={(e)=>{ e.stopPropagation(); deleteMedia(selectedId); setSelected(null); }} className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm">Delete</button>
                      </>
                    )}
                  </div>
                  <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
                    {media.filter(m=> m.type === 'image' || m.type === 'video').map((it, i) => (
                      <div key={it.id} onClick={(e)=>{ e.stopPropagation(); setSelected(it.url); setSelectedId(it.id); }} className={`border ${it.url === selected ? 'border-sky-500' : 'border-transparent'} rounded overflow-hidden`}>
                        <img src={it.url} alt={it.id} className="w-20 h-12 object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground text-center">{(getCurrentIndex() >= 0 ? getCurrentIndex()+1 : 0)}/{media.filter(m=> m.type === 'image' || m.type === 'video').length}</div>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ width: containerW, height: containerH, position: 'relative', overflow: 'hidden', borderRadius: 8 }}>
                    <img ref={imgRef} src={rawImage || undefined} alt="to-crop" onLoad={onImageLoad} onMouseDown={startDrag} onTouchStart={startDrag} style={{ position: 'absolute', left: offset.x, top: offset.y, transform: `scale(${baseScale * scale})`, transformOrigin: 'top left', cursor: dragging ? 'grabbing' : 'grab', userSelect: 'none' }} />
                    <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none', border: '2px dashed rgba(0,0,0,0.2)', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <div className="text-sm mb-2">Preview</div>
                    <div style={{ width:84, height:84, borderRadius:9999, overflow:'hidden', backgroundColor:'#eee' }}>
                      <div style={{ width: containerW, height: containerH, transform: `translate(${offset.x}px, ${offset.y}px) scale(${baseScale * scale})`, transformOrigin: 'top left', backgroundImage: `url(${rawImage})`, backgroundRepeat: 'no-repeat', backgroundSize: `${naturalSize.w * baseScale * scale}px ${naturalSize.h * baseScale * scale}px`, backgroundPosition: `${offset.x}px ${offset.y}px` }} />
                    </div>
                    <div className="flex gap-2 justify-end mt-3">
                      <Button variant="outline" onClick={()=> setRawImage(null)}>Cancel</Button>
                      <Button onClick={async ()=>{ await applyCropToMedia(); setRawImage(null); setSelected(null); }}>Apply</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
