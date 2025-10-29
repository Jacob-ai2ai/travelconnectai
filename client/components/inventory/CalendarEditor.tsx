import React, { useState } from 'react';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export type CalendarSlot = {
  id: string;
  date: string; // YYYY-MM-DD
  capacityTotal: number;
  capacityRemaining?: number;
  basePrice?: number;
};

function isoDateAddDays(dateStr: string, days: number){
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0,10);
}

export default function CalendarEditor({ initial }:{initial?: CalendarSlot[]}){
  const start = new Date();
  const defaultSlots: CalendarSlot[] = initial || Array.from({length:14}).map((_,i)=>({ id: `s-${i}`, date: isoDateAddDays(start.toISOString().slice(0,10), i), capacityTotal: 12, capacityRemaining: 12, basePrice: 85 }));

  const [slots, setSlots] = useState<CalendarSlot[]>(defaultSlots);
  const [selected, setSelected] = useState<CalendarSlot | null>(null);

  function openEdit(s: CalendarSlot){ setSelected(s); }

  function saveSlot(updated: CalendarSlot){
    setSlots(prev => prev.map(p=> p.id === updated.id ? updated : p));
    setSelected(null);
  }

  function bulkUpdate(from: string, to: string, changes: Partial<CalendarSlot>){
    setSlots(prev => prev.map(s => {
      if(s.date >= from && s.date <= to) return {...s, ...changes};
      return s;
    }));
  }

  return (
    <div>
      <Card className="mb-4">
        <CardHeader>
          <div className="text-sm font-semibold">Calendar & Availability</div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-3">Edit per-date capacity and price. Use bulk actions to apply changes across ranges.</div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="space-y-2 max-h-72 overflow-auto">
                {slots.map(s=> (
                  <div key={s.id} className="flex items-center justify-between border rounded p-2">
                    <div>
                      <div className="font-medium">{s.date}</div>
                      <div className="text-xs text-muted-foreground">{s.capacityRemaining ?? s.capacityTotal} / {s.capacityTotal} • ${s.basePrice}</div>
                    </div>
                    <div>
                      <Button size="sm" onClick={()=> openEdit(s)}>Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2">
                <div className="text-xs text-muted-foreground">Bulk update</div>
                <BulkUpdateForm onApply={(from,to,changes)=> bulkUpdate(from,to,changes)} />
              </div>

              {selected && (
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Edit {selected.date}</div>
                  <div className="grid grid-cols-1 gap-2">
                    <label className="block">
                      <div className="text-xs mb-1">Capacity Total</div>
                      <input type="number" className="w-full border rounded p-2" value={selected.capacityTotal} onChange={e => setSelected({...selected, capacityTotal: Number(e.target.value)})} />
                    </label>
                    <label className="block">
                      <div className="text-xs mb-1">Base Price</div>
                      <input type="number" className="w-full border rounded p-2" value={selected.basePrice} onChange={e => setSelected({...selected, basePrice: Number(e.target.value)})} />
                    </label>

                    <div className="flex items-center gap-2 mt-2">
                      <Button onClick={() => saveSlot(selected)}>Save</Button>
                      <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function BulkUpdateForm({ onApply }:{ onApply:(from:string,to:string,changes:Partial<CalendarSlot>)=>void }){
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [capacity, setCapacity] = useState<number | ''>('' as any);
  const [price, setPrice] = useState<number | ''>('' as any);

  return (
    <div className="border rounded p-2">
      <div className="grid grid-cols-2 gap-2">
        <input type="date" className="border rounded p-2" value={from} onChange={e=> setFrom(e.target.value)} />
        <input type="date" className="border rounded p-2" value={to} onChange={e=> setTo(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <input type="number" placeholder="Capacity" className="border rounded p-2" value={capacity as any} onChange={e=> setCapacity(e.target.value ? Number(e.target.value) : '')} />
        <input type="number" placeholder="Price" className="border rounded p-2" value={price as any} onChange={e=> setPrice(e.target.value ? Number(e.target.value) : '')} />
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Button onClick={() => onApply(from, to, { ...(capacity !== '' ? { capacityTotal: capacity as number } : {}), ...(price !== '' ? { basePrice: price as number } : {}) })}>Apply</Button>
      </div>
    </div>
  );
}
