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
        list.push({ id: fid, people: d.people ?? 1, class: d.class ?? "", date: d.date ?? "", title: d.title ?? fid, price: d.price ?? undefined });
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

  // Nova assistant states
  const [novaMinimized, setNovaMinimized] = useState(true);
  const [novaMessages, setNovaMessages] = useState<{ from: 'user' | 'nova'; text: string }[]>([]);
  const [novaInput, setNovaInput] = useState("");

  const processCommand = (text: string) => {
    const t = text.toLowerCase();
    // simple commands: remove <name>, increase <name>, decrease <name>
    if (t.startsWith('remove')) {
      const name = t.replace('remove', '').trim();
      const found = items.find((it) => it.title?.toLowerCase().includes(name));
      if (found) {
        removeItem(found.id);
        return `Removed ${found.title} from your itinerary.`;
      }
      return `Could not find "${name}" in your itinerary.`;
    }

    if (t.startsWith('increase') || t.startsWith('decrease')) {
      const inc = t.startsWith('increase');
      const name = t.replace('increase', '').replace('decrease', '').trim();
      const found = items.find((it) => it.title?.toLowerCase().includes(name));
      if (found) {
        updatePeople(found.id, Math.max(1, (found.people ?? 1) + (inc ? 1 : -1)));
        return `${found.title} quantity updated.`;
      }
      return `Could not find "${name}" to update.`;
    }

    if (t.startsWith('total')) {
      return `Your current total is $${subtotal.toFixed(2)}.`;
    }

    return "Sorry, I didn't understand that. Try: 'remove <item>', 'increase <item>' or 'total'";
  };

  const sendNovaMessage = (text: string) => {
    if (!text || !text.trim()) return;
    setNovaMessages((prev) => [...prev, { from: 'user', text: text.trim() }]);
    const reply = processCommand(text.trim());
    setTimeout(() => {
      setNovaMessages((prev) => [...prev, { from: 'nova', text: reply }]);
      // speak optional
      const w: any = window as any;
      if (w.speechSynthesis && reply) {
        const u = new SpeechSynthesisUtterance(reply);
        w.speechSynthesis.cancel();
        w.speechSynthesis.speak(u);
      }
    }, 300);
    setNovaInput("");
  };

  // show Nova when there are items in itinerary (interpreted as AI itinerary generated or active)
  const showNova = items.length > 0;

  return (
    <>
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

      {/* Nova assistant floating UI - only shown when itinerary has items */}
      {showNova && (
        <>
          {!novaMinimized ? (
            <div className="fixed bottom-6 right-6 w-80 bg-white border rounded p-3 shadow-lg z-50">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">Nova</div>
                <div className="flex items-center space-x-2">
                  <button aria-label="Close Nova" className="px-2 py-1 text-sm rounded bg-gray-100" onClick={() => setNovaMinimized(true)}>—</button>
                </div>
              </div>

              <div className="h-28 overflow-auto mb-2 space-y-2">
                {novaMessages.length === 0 ? (
                  <div className="text-xs text-muted-foreground">Nova will display responses here.</div>
                ) : (
                  novaMessages.map((m, i) => (
                    <div key={i} className={`text-sm ${m.from === 'nova' ? 'text-slate-800' : 'text-sky-600'}`}>
                      <strong>{m.from === 'nova' ? 'Nova:' : 'You:'}</strong> {m.text}
                    </div>
                  ))
                )}
              </div>

              <textarea
                id="nova-prompt-summary"
                className="w-full border rounded p-2 text-sm"
                rows={2}
                placeholder="Type a request, e.g. 'Remove the spa'"
                value={novaInput}
                onChange={(e) => setNovaInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendNovaMessage(novaInput); } }}
              />

              <div className="mt-2 flex justify-between items-center">
                <button className="text-xs text-muted-foreground" onClick={() => { if (novaInput.trim()) sendNovaMessage(novaInput); }}>Send</button>
                <div className="text-xs text-muted-foreground">AI assistant</div>
              </div>
            </div>
          ) : (
            <div className="fixed right-6 bottom-6 z-50">
              <button className="w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center" onClick={() => setNovaMinimized(false)} aria-label="Open Nova">
                N
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
