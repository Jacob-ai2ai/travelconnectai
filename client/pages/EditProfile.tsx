import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';

export default function EditProfile(){
  const navigate = useNavigate();
  const [user, setUser] = useState<any>({});
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [preferences, setPreferences] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // cropping states
  const [rawImage, setRawImage] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [naturalSize, setNaturalSize] = useState({w:0,h:0});
  const [displaySize, setDisplaySize] = useState({w:0,h:0});
  // selection circle (in displayed image coordinates)
  const selSize = 200; // diameter of circle in px
  const [sel, setSel] = useState({ x: 0, y: 0 });
  const draggingSel = useRef(false);
  const selStart = useRef({ x: 0, y: 0, sx: 0, sy: 0 });

  useEffect(()=>{
    try{
      const raw = localStorage.getItem('user');
      const u = raw ? JSON.parse(raw) : {};
      setUser(u);
      setUsername(u?.username || '');
      setBio(u?.bio || '');
      setPreferences(u?.preferences || '');
      setIsPublic(typeof u?.isPublic === 'boolean' ? u.isPublic : true);
      setAvatarPreview(u?.avatar || null);
    }catch(e){
      // ignore
    }
  },[]);

  function onFile(e: React.ChangeEvent<HTMLInputElement>){
    const f = e.target.files?.[0];
    if(!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      setRawImage(data);
      // reset crop
      setScale(1);
      setOffset({x:0,y:0});
      setNaturalSize({w:0,h:0});
      setBaseScale(1);
    };
    reader.readAsDataURL(f);
  }

  function onImageLoad(){
    const img = imgRef.current;
    if(!img) return;
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    setNaturalSize({w:nw,h:nh});
    const dw = img.clientWidth;
    const dh = img.clientHeight;
    setDisplaySize({w: dw, h: dh});
    // place selection at center
    setSel({ x: Math.max(0, (dw - selSize)/2), y: Math.max(0, (dh - selSize)/2) });
  }

  function startSelDrag(e: React.MouseEvent | React.TouchEvent){
    draggingSel.current = true;
    const p = 'touches' in e ? (e as React.TouchEvent).touches[0] : (e as React.MouseEvent);
    selStart.current = { x: p.clientX, y: p.clientY, sx: sel.x, sy: sel.y } as any;
    (document as any).addEventListener('mousemove', selMove);
    (document as any).addEventListener('mouseup', endSelDrag);
    (document as any).addEventListener('touchmove', selMove);
    (document as any).addEventListener('touchend', endSelDrag);
  }
  function selMove(e: any){
    if(!draggingSel.current) return;
    const p = e.touches ? e.touches[0] : e;
    const dx = p.clientX - selStart.current.x;
    const dy = p.clientY - selStart.current.y;
    const newX = selStart.current.sx + dx;
    const newY = selStart.current.sy + dy;
    // clamp within displayed image
    const maxX = Math.max(0, displaySize.w - selSize);
    const maxY = Math.max(0, displaySize.h - selSize);
    const clampedX = Math.max(0, Math.min(newX, maxX));
    const clampedY = Math.max(0, Math.min(newY, maxY));
    setSel({ x: clampedX, y: clampedY });
  }
  function endSelDrag(){
    draggingSel.current = false;
    (document as any).removeEventListener('mousemove', selMove);
    (document as any).removeEventListener('mouseup', endSelDrag);
    (document as any).removeEventListener('touchmove', selMove);
    (document as any).removeEventListener('touchend', endSelDrag);
  }

  function getCroppedDataUrl(){
    if(!rawImage) return null;
    const img = new Image();
    img.src = rawImage;
    return new Promise<string>((resolve)=>{
      img.onload = ()=>{
        const canvas = document.createElement('canvas');
        canvas.width = containerSize;
        canvas.height = containerSize;
        const ctx = canvas.getContext('2d')!;
        // compute scale between natural and displayed
        const dispW = naturalSize.w * baseScale * scale;
        const ratio = naturalSize.w / dispW; // natural per displayed px
        const sx = (-offset.x) * ratio;
        const sy = (-offset.y) * ratio;
        const sSize = containerSize * ratio;
        ctx.drawImage(img, sx, sy, sSize, sSize, 0, 0, containerSize, containerSize);
        resolve(canvas.toDataURL('image/jpeg'));
      };
    });
  }

  async function save(){
    let finalAvatar = avatarPreview;
    if(rawImage){
      const cropped = await getCroppedDataUrl();
      finalAvatar = cropped;
    }
    const u = {
      ...(user || {}),
      username,
      bio,
      preferences,
      isPublic,
      avatar: finalAvatar,
    };
    localStorage.setItem('user', JSON.stringify(u));
    navigate('/profile');
  }

  return (
    <div className="min-h-screen p-4 bg-background">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <CardTitle>Edit Profile</CardTitle>
              <Link to="/profile" className="text-sm text-muted-foreground">Back</Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Display name</label>
                <input value={username} onChange={e=> setUsername(e.target.value)} className="w-full border rounded p-2" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea value={bio} onChange={e=> setBio(e.target.value)} className="w-full border rounded p-2" rows={4} maxLength={2000} />
                <div className="text-xs text-muted-foreground mt-1">Up to 2000 characters</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Profile picture</label>
                {avatarPreview && !rawImage && (
                  <div className="mb-2">
                    <img src={avatarPreview} alt="avatar" className="w-28 h-28 rounded-full object-cover" />
                  </div>
                )}

                {/* cropping UI when a new image is selected */}
                {rawImage && (
                  <div className="mb-3">
                    <div className="flex items-start gap-4">
                      <div style={{ width: containerSize, height: containerSize, position: 'relative', overflow: 'hidden', borderRadius: '8px' }}>
                        <img
                          ref={imgRef}
                          src={rawImage}
                          alt="to-crop"
                          onLoad={onImageLoad}
                          onMouseDown={startDrag}
                          onTouchStart={startDrag}
                          style={{ position: 'absolute', left: offset.x, top: offset.y, transform: `scale(${baseScale * scale})`, transformOrigin: 'top left', cursor: draggingRef.current ? 'grabbing' : 'grab', userSelect: 'none' }}
                        />
                        <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none', border: '2px dashed rgba(255,255,255,0.6)', boxSizing: 'border-box' }} />
                      </div>

                      {/* live preview circle showing exactly what will be used for avatar */}
                      <div style={{ width: 84, height: 84, borderRadius: 9999, overflow: 'hidden', backgroundColor: '#eee', flexShrink: 0, display: 'inline-block' }}>
                        <div style={{
                          width: containerSize,
                          height: containerSize,
                          transform: `translate(${offset.x}px, ${offset.y}px) scale(${baseScale * scale})`,
                          transformOrigin: 'top left',
                          backgroundImage: `url(${rawImage})`,
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: `${naturalSize.w * baseScale * scale}px ${naturalSize.h * baseScale * scale}px`,
                          backgroundPosition: `${offset.x}px ${offset.y}px`
                        }} />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <label className="text-xs">Zoom</label>
                      <input type="range" min="0.5" max="2" step="0.01" value={scale} onChange={e=> setScale(Number(e.target.value))} />
                      <button onClick={async ()=>{
                        const cropped = await getCroppedDataUrl();
                        setAvatarPreview(cropped);
                        setRawImage(null);
                        try{
                          const existing = JSON.parse(localStorage.getItem('media') || '[]');
                          existing.unshift({ id: 'm-'+Date.now(), url: cropped, uploadedAt: new Date().toISOString() });
                          localStorage.setItem('media', JSON.stringify(existing));
                        }catch(e){/* ignore */}
                      }} className="ml-2 px-3 py-1 border rounded">Apply</button>
                      <button onClick={()=> setRawImage(null)} className="ml-2 px-3 py-1 border rounded">Cancel</button>
                    </div>
                  </div>
                )}

                <input type="file" accept="image/*" onChange={onFile} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Travel preferences</label>
                <textarea value={preferences} onChange={e=> setPreferences(e.target.value)} className="w-full border rounded p-2" rows={3} placeholder="e.g. adventure, beaches, budget, luxury" />
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={isPublic} onChange={e=> setIsPublic(e.target.checked)} />
                  <span className="text-sm">Public profile (anyone can see my posts)</span>
                </label>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={()=> navigate('/profile')}>Cancel</Button>
                <Button onClick={save}>Save</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
