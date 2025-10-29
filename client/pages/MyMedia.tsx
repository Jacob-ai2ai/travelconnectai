import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function MyMedia(){
  const [media, setMedia] = useState<{id:string;url:string;originalUrl?:string;type?:string;uploadedAt:string}[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // cropping/editing state
  const [rawImage, setRawImage] = useState<string | null>(null);
  const imgRef = React.useRef<HTMLImageElement | null>(null);
  const containerSize = 300;
  const [naturalSize, setNaturalSize] = useState({w:0,h:0});
  const [baseScale, setBaseScale] = useState(1);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({x:0,y:0});
  const draggingRef = React.useRef(false);
  const dragStart = React.useRef({x:0,y:0,ox:0,oy:0});

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
        return { id: it.id || ('m-'+Date.now()), url, originalUrl: it.originalUrl || url, type, uploadedAt: it.uploadedAt || new Date().toISOString() };
      });
      setMedia(normalized);
    }catch(e){
      // ignore
    }
  },[]);

  function onImageLoad(){
    const img = imgRef.current;
    if(!img) return;
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    setNaturalSize({w:nw,h:nh});
    const coverScale = Math.max(containerSize / nw, containerSize / nh);
    setBaseScale(coverScale);
    setScale(1);
    const displayedW = nw * coverScale;
    const displayedH = nh * coverScale;
    const ox = (containerSize - displayedW) / 2;
    const oy = (containerSize - displayedH) / 2;
    setOffset({x: ox, y: oy});
  }

  function startDrag(e: any){
    draggingRef.current = true;
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
    const minX = Math.min(0, containerSize - displayedW);
    const minY = Math.min(0, containerSize - displayedH);
    const clampedX = Math.max(minX, Math.min(newX, 0));
    const clampedY = Math.max(minY, Math.min(newY, 0));
    setOffset({x: clampedX, y: clampedY});
  }
  function endDrag(){
    draggingRef.current = false;
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
        canvas.width = containerSize;
        canvas.height = containerSize;
        const ctx = canvas.getContext('2d')!;
        const dispW = naturalSize.w * baseScale * scale;
        const ratio = naturalSize.w / dispW;
        const sx = (-offset.x) * ratio;
        const sy = (-offset.y) * ratio;
        const sSize = containerSize * ratio;
        ctx.drawImage(img, sx, sy, sSize, sSize, 0, 0, containerSize, containerSize);
        resolve(canvas.toDataURL('image/jpeg'));
      };
    });
  }

  async function applyCropToMedia(){
    const id = selectedId;
    if(!id) return;
    const cropped = await getCroppedDataUrl();
    if(!cropped) return;
    const updated = media.map(m=> m.id === id ? { ...m, url: cropped } : m);
    setMedia(updated);
    localStorage.setItem('media', JSON.stringify(updated));
    setSelected(cropped);
    setRawImage(null);
  }

  async function useAsAvatar(){
    const url = selected;
    if(!url) return;
    try{
      const raw = JSON.parse(localStorage.getItem('user') || '{}');
      raw.avatar = url;
      localStorage.setItem('user', JSON.stringify(raw));
    }catch(e){}
  }

  function openEditFor(id:string, url:string){
    setSelectedId(id);
    setRawImage(url);
  }

  return (
    <div className="min-h-screen p-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <CardTitle>My Media</CardTitle>
              <Link to="/profile" className="text-sm text-muted-foreground">Back</Link>
            </div>
          </CardHeader>
          <CardContent>
            {media.length === 0 ? (
              <div className="text-sm text-muted-foreground">No media yet. Upload from your profile.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {media.map(m => (
                  <div key={m.id} className="rounded overflow-hidden bg-muted p-1">
                    <img src={m.url} alt={m.id} className="w-full h-40 object-cover cursor-pointer" onClick={()=> setSelected(m.url)} />
                    <div className="text-xs text-muted-foreground mt-1">{new Date(m.uploadedAt).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="max-w-3xl max-h-[80vh] overflow-auto bg-white p-4 rounded" onClick={e=> e.stopPropagation()}>
            {!rawImage ? (
              <div>
                <img src={selected} alt="selected" className="w-full h-auto object-contain mb-3" />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={()=> { openEditFor(selectedId || '', selected); }}>Edit</Button>
                  <Button onClick={()=> { useAsAvatar(); setSelected(null); }}>Use as avatar</Button>
                  <Button variant="outline" onClick={()=> setSelected(null)}>Close</Button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ width: containerSize, height: containerSize, position: 'relative', overflow: 'hidden', borderRadius: 8 }}>
                    <img ref={imgRef} src={rawImage || undefined} alt="to-crop" onLoad={onImageLoad} onMouseDown={startDrag} onTouchStart={startDrag} style={{ position: 'absolute', left: offset.x, top: offset.y, transform: `scale(${baseScale * scale})`, transformOrigin: 'top left', cursor: draggingRef.current ? 'grabbing' : 'grab', userSelect: 'none' }} />
                    <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none', border: '2px dashed rgba(0,0,0,0.2)', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <div className="text-sm mb-2">Preview</div>
                    <div style={{ width:84, height:84, borderRadius:9999, overflow:'hidden', backgroundColor:'#eee' }}>
                      <div style={{ width: containerSize, height: containerSize, transform: `translate(${offset.x}px, ${offset.y}px) scale(${baseScale * scale})`, transformOrigin: 'top left', backgroundImage: `url(${rawImage})`, backgroundRepeat: 'no-repeat', backgroundSize: `${naturalSize.w * baseScale * scale}px ${naturalSize.h * baseScale * scale}px`, backgroundPosition: `${offset.x}px ${offset.y}px` }} />
                    </div>
                    <div className="mt-3">
                      <label className="text-xs">Zoom</label>
                      <input type="range" min="0.5" max="2" step="0.01" value={scale} onChange={e=> setScale(Number(e.target.value))} />
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
