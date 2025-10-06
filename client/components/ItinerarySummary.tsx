import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ItinDetail = { id: string; people?: number; class?: string; date?: string; title?: string; price?: number };

export default function ItinerarySummary() {
  const [items, setItems] = useState<ItinDetail[]>([]);

  useEffect(() => {
    const load = () => {
      const rawDetails = localStorage.getItem("itineraryDetails");
      const details = rawDetails ? JSON.parse(rawDetails) : {};
      const flightsRaw = localStorage.getItem("itineraryFlights");
      const flights = flightsRaw ? JSON.parse(flightsRaw) : [];

      const list: ItinDetail[] = [];

      // flights
      flights.forEach((fid: string) => {
        const d = details[fid] || {};
        list.push({ id: fid, people: d.people ?? 1, class: d.class ?? "", date: d.date ?? "", title: fid, price: d.price ?? undefined });
      });

      // also include other items present in details (stays/experiences/products)
      Object.keys(details).forEach((key) => {
        if (!flights.includes(key)) {
          const d = details[key];
          list.push({ id: key, people: d.people ?? 1, class: d.class ?? "", date: d.date ?? "", title: d.title ?? key, price: d.price ?? undefined });
        }
      });

      setItems(list);
    };

    load();

    const onStorage = () => load();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const updatePeople = (id: string, next: number) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, people: next } : it)));
    const raw = localStorage.getItem("itineraryDetails");
    const details = raw ? JSON.parse(raw) : {};
    details[id] = { ...(details[id] || {}), people: next };
    localStorage.setItem("itineraryDetails", JSON.stringify(details));
    // trigger other listeners
    window.dispatchEvent(new Event("storage"));
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    const raw = localStorage.getItem("itineraryDetails");
    const details = raw ? JSON.parse(raw) : {};
    delete details[id];
    localStorage.setItem("itineraryDetails", JSON.stringify(details));
    // also remove from flights list
    const flightsRaw = localStorage.getItem("itineraryFlights");
    const flights = flightsRaw ? JSON.parse(flightsRaw) : [];
    const nextFlights = flights.filter((f: string) => f !== id);
    localStorage.setItem("itineraryFlights", JSON.stringify(nextFlights));
    window.dispatchEvent(new Event("storage"));
  };

  const subtotal = items.reduce((s, it) => s + ((it.price ?? 0) * (it.people ?? 1)), 0);

  return (
    <Card className="mt-4 w-full max-w-sm">
      <CardContent>
        <div>
          <h4 className="font-semibold mb-3">Your Itinerary</h4>

          {items.length === 0 ? (
            <div className="text-xs text-muted-foreground mb-4">No items in your itinerary.</div>
          ) : (
            <div className="space-y-3 mb-4">
              {items.map((it) => (
                <div key={it.id} className="border rounded p-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{it.title}</div>
                    <div className="text-sm text-muted-foreground">{it.date ?? ""}</div>
                    <div className="text-sm text-muted-foreground">${it.price ?? ""} each</div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="px-2 py-1 border rounded" onClick={() => updatePeople(it.id, Math.max(1, (it.people ?? 1) - 1))}>-</button>
                    <div className="px-3">{it.people ?? 1}</div>
                    <button className="px-2 py-1 border rounded" onClick={() => updatePeople(it.id, (it.people ?? 1) + 1)}>+</button>
                    <button className="text-sm text-muted-foreground ml-2" onClick={() => removeItem(it.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="text-xl font-bold">${subtotal.toFixed(2)}</div>
          </div>

          <div className="space-y-2">
            <Button className="w-full">Checkout</Button>
            <Button variant="outline" className="w-full">Save Trip</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
