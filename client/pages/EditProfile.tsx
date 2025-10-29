import React, { useEffect, useState } from 'react';
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
      setAvatarPreview(data);
    };
    reader.readAsDataURL(f);
  }

  function save(){
    const u = {
      ...(user || {}),
      username,
      bio,
      preferences,
      isPublic,
      avatar: avatarPreview,
    };
    localStorage.setItem('user', JSON.stringify(u));
    // navigate back to profile
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
                {avatarPreview ? (
                  <div className="mb-2">
                    <img src={avatarPreview} alt="avatar" className="w-28 h-28 rounded-full object-cover" />
                  </div>
                ) : null}
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
