import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function MyMedia(){
  const [media, setMedia] = useState<{id:string;url:string;uploadedAt:string}[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(()=>{
    try{
      const m = JSON.parse(localStorage.getItem('media') || '[]');
      setMedia(m);
    }catch(e){
    }
  },[]);

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
