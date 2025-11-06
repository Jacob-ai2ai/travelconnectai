import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, Users, Search, Hash } from "lucide-react";

interface DiscoverDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const sampleReels = [
  { id: 'r1', title: 'Sunset in Santorini', user: 'AvaTravel', duration: '0:30', tags: ['Greece','beach'] },
  { id: 'r2', title: 'Street Food Tokyo', user: 'FoodNomad', duration: '0:45', tags: ['Japan','food'] },
  { id: 'r3', title: 'Hiking Patagonia', user: 'TrailBlazer', duration: '0:22', tags: ['Chile','adventure'] },
];

export default function DiscoverDialog({ open, onOpenChange }: DiscoverDialogProps) {
  const [query, setQuery] = useState("");
  const [reels] = useState(sampleReels);

  const filtered = reels.filter(r => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return r.title.toLowerCase().includes(q) || r.user.toLowerCase().includes(q) || r.tags.join(' ').includes(q);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Play className="h-4 w-4" /> Discover
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <div className="flex items-center gap-2 p-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search reels, spaces, users or tags" className="flex-1 border rounded-md p-2" />
            <Button variant="ghost" onClick={() => setQuery('')} className="ml-2">Clear</Button>
          </div>

          <div className="mt-3 grid gap-3">
            {filtered.map(r => (
              <div key={r.id} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                <div className="w-20 h-12 bg-gray-100 rounded-md flex items-center justify-center text-sm font-medium">{r.duration}</div>
                <div className="flex-1">
                  <div className="font-semibold">{r.title}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <span>@{r.user}</span>
                    <span className="flex items-center gap-1">{r.tags.slice(0,3).map(t => <span key={t} className="rounded px-2 py-0.5 bg-gray-100 text-[11px]">#{t}</span>)}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Button onClick={() => alert(`Playing ${r.title}`)}>Play</Button>
                  <Button variant="outline" onClick={() => alert(`Opened travel space for ${r.user}`)} className="px-2 py-1">Join Space</Button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="p-6 text-center text-sm text-muted-foreground">No reels or spaces found.</div>
            )}
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Users className="h-4 w-4" /> Travel Spaces</div>
              <Button onClick={() => alert('Browse all travel spaces')}>Browse</Button>
            </div>
            <div className="mt-3 p-3 bg-white rounded-md shadow-sm text-sm">Explore itineraries, user posts and join live conversations with creators and travelers around the world.</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
