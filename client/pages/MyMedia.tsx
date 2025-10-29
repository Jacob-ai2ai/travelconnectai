import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function MyMedia(){
  const [media, setMedia] = useState<{id:string;url:string;uploadedAt:string}[]>([]);
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
      const m = JSON.parse(localStorage.getItem('media') || '[]');
      setMedia(m);
    }catch(e){
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
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={()=> setSelected(null)}>
          <div className="max-w-3xl max-h-[80vh] overflow-auto">
            <img src={selected} alt="selected" className="w-full h-auto object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
