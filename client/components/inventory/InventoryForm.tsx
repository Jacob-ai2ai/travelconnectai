import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export type InventoryConfig = {
  id: string;
  name: string;
  bookingUnit: 'per_person' | 'per_group' | 'per_slot';
  capacityDefault: number;
  basePrice: number;
  currency?: string;
};

export default function InventoryForm({ providerId }:{providerId?:string}){
  const [configs, setConfigs] = useState<InventoryConfig[]>([{
    id: 'std-1',
    name: 'Standard',
    bookingUnit: 'per_person',
    capacityDefault: 12,
    basePrice: 85,
    currency: 'USD'
  }]);

  const [editing, setEditing] = useState<InventoryConfig | null>(null);

  function startCreate(){
    setEditing({ id: `new-${Date.now()}`, name: '', bookingUnit: 'per_person', capacityDefault: 1, basePrice: 0, currency: 'USD' });
  }

  function save(cfg: InventoryConfig){
    setConfigs(prev => {
      const exists = prev.find(p=>p.id === cfg.id);
      if(exists) return prev.map(p=> p.id === cfg.id ? cfg : p);
      return [...prev, cfg];
    });
    setEditing(null);
  }

  function remove(id: string){
    setConfigs(prev => prev.filter(p=>p.id !== id));
  }

  return (
    <div>
      <Card className="mb-4">
        <CardHeader>
          <div className="text-sm font-semibold">Inventory</div>
        </CardHeader>
        <CardContent>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Manage inventory configs for your experiences.</div>
            <div><Button onClick={startCreate}>New Inventory</Button></div>
          </div>

          <div className="space-y-2">
            {configs.map(c=> (
              <div key={c.id} className="flex items-center justify-between border rounded p-3">
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.bookingUnit} • {c.capacityDefault} capacity • {c.currency}{c.basePrice}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={()=> setEditing(c)}>Edit</Button>
                  <Button size="sm" variant="outline" onClick={()=> remove(c.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {editing && (
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold">{editing.id.startsWith('new-') ? 'Create' : 'Edit'} Inventory</div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <div className="text-xs text-muted-foreground mb-1">Name</div>
                <input className="w-full border rounded p-2" value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})} />
              </label>

              <label className="block">
                <div className="text-xs text-muted-foreground mb-1">Booking Unit</div>
                <select className="w-full border rounded p-2" value={editing.bookingUnit} onChange={e => setEditing({...editing, bookingUnit: e.target.value as any})}>
                  <option value="per_person">Per person</option>
                  <option value="per_group">Per group</option>
                  <option value="per_slot">Per slot</option>
                </select>
              </label>

              <label className="block">
                <div className="text-xs text-muted-foreground mb-1">Capacity</div>
                <input type="number" className="w-full border rounded p-2" value={editing.capacityDefault} onChange={e => setEditing({...editing, capacityDefault: Number(e.target.value)})} />
              </label>

              <label className="block">
                <div className="text-xs text-muted-foreground mb-1">Base Price ({editing.currency})</div>
                <input type="number" className="w-full border rounded p-2" value={editing.basePrice} onChange={e => setEditing({...editing, basePrice: Number(e.target.value)})} />
              </label>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <Button onClick={() => save(editing)}>Save</Button>
              <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
