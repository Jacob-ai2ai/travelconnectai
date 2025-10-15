import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { readSummary, SummaryItem, changeSummaryQty, removeSummaryItem, summaryTotal } from '@/lib/tripSummary';
import { Trash } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TripSummaryBox() {
  const [items, setItems] = useState<SummaryItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const load = () => {
      const s = readSummary();
      setItems(s);
      setTotal(s.reduce((s, it) => s + it.price * it.qty, 0));
    };
    load();
    const onStorage = () => load();
    window.addEventListener('storage', onStorage);
    window.addEventListener('tripSummaryUpdated', onStorage);
    return () => { window.removeEventListener('storage', onStorage); window.removeEventListener('tripSummaryUpdated', onStorage); };
  }, []);

  const inc = (it: SummaryItem, delta: number) => {
    const next = changeSummaryQty(it.type, it.id, delta, it.meta);
    setItems(next);
    setTotal(next.reduce((s, x) => s + x.price * x.qty, 0));
  };

  const removeItem = (it: SummaryItem) => {
    const next = removeSummaryItem(it.type, it.id, it.meta);
    setItems(next);
    setTotal(next.reduce((s, x) => s + x.price * x.qty, 0));
  };

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="text-lg font-semibold">Trip Summary</div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">No items selected</div>
          <div className="mt-3">
            <Link to="/trip-details/budget-bali"><Button className="w-full">View trip</Button></Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="text-lg font-semibold">Trip Summary</div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((it) => (
            <div key={`${it.type}-${it.id}-${JSON.stringify(it.meta||{})}`} className="flex items-center justify-between p-2 bg-white rounded">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  {it.image ? <img src={it.image} alt={it.title} className="w-full h-full object-cover" /> : null}
                </div>
                <div>
                  <div className="text-sm font-medium">{it.title}</div>
                  <div className="text-xs text-muted-foreground">{it.type}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-sm">${(it.price * it.qty).toFixed(2)}</div>
                <div className="flex items-center border rounded overflow-hidden text-xs">
                  <button className="px-2 py-1" onClick={() => inc(it, -1)}>-</button>
                  <div className="px-3 py-1">{it.qty}</div>
                  <button className="px-2 py-1" onClick={() => inc(it, 1)}>+</button>
                </div>
                <button className="text-red-600 p-1" onClick={() => removeItem(it)} aria-label="remove"><Trash className="h-4 w-4" /></button>
              </div>
            </div>
          ))}

          <div className="mt-2 p-3 border-t">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm">Total</div>
              <div className="text-lg font-bold">${total.toFixed(2)}</div>
            </div>
            <div className="space-y-2">
              <Button className="w-full">Checkout</Button>
              <Link to="/trip-details/budget-bali"><Button variant="outline" className="w-full">View trip</Button></Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
