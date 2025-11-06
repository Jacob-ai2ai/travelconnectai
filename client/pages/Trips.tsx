import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import TripSummaryBox from '@/components/TripSummaryBox';
import { addSummaryItem, readSummary, SummaryItem } from '@/lib/tripSummary';
import { Trash, ArrowRight } from 'lucide-react';

type SavedItinerary = {
  id: string;
  title: string;
  summary?: string;
  dateSaved?: string;
};

type CompletedTrip = {
  id: string;
  title: string;
  dates?: string;
  notes?: string;
  completedOn?: string;
};

function readSavedItineraries(): SavedItinerary[] {
  try {
    const raw = localStorage.getItem('savedItineraries');
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function writeSavedItineraries(items: SavedItinerary[]) {
  try { localStorage.setItem('savedItineraries', JSON.stringify(items)); } catch (e) {}
}

function readCompletedTrips(): CompletedTrip[] {
  try {
    const raw = localStorage.getItem('completedTrips');
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function writeCompletedTrips(items: CompletedTrip[]) {
  try { localStorage.setItem('completedTrips', JSON.stringify(items)); } catch (e) {}
}

export default function Trips() {
  const [saved, setSaved] = useState<SavedItinerary[]>([]);
  const [completed, setCompleted] = useState<CompletedTrip[]>([]);
  const [cart, setCart] = useState<SummaryItem[]>([]);

  useEffect(() => {
    setSaved(readSavedItineraries());
    setCompleted(readCompletedTrips());
    setCart(readSummary());

    const onSummary = () => setCart(readSummary());
    window.addEventListener('tripSummaryUpdated', onSummary);
    window.addEventListener('storage', onSummary);
    return () => { window.removeEventListener('tripSummaryUpdated', onSummary); window.removeEventListener('storage', onSummary); };
  }, []);

  const removeSaved = (id: string) => {
    const next = saved.filter(s => s.id !== id);
    setSaved(next);
    writeSavedItineraries(next);
  };

  const removeCompleted = (id: string) => {
    const next = completed.filter(c => c.id !== id);
    setCompleted(next);
    writeCompletedTrips(next);
  };

  const addItineraryToCart = (it: SavedItinerary) => {
    // create a generic summary item
    addSummaryItem({ id: it.id, type: 'service', title: it.title, price: 0, qty: 1 });
    setCart(readSummary());
    alert('Added itinerary to cart');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted py-8">
      <div className="container mx-auto px-4 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Your Trips</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="text-lg font-semibold">Saved Itineraries</div>
              </CardHeader>
              <CardContent>
                {saved.length === 0 && <div className="text-sm text-muted-foreground">No saved itineraries yet.</div>}
                <div className="space-y-3 mt-3">
                  {saved.map(s => (
                    <div key={s.id} className="p-3 bg-white rounded flex items-start justify-between">
                      <div>
                        <div className="font-medium">{s.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">Saved {s.dateSaved || '—'}</div>
                        {s.summary && <div className="text-sm mt-2">{s.summary}</div>}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Button variant="ghost" onClick={() => addItineraryToCart(s)}><ArrowRight className="h-4 w-4 mr-1"/>Add to cart</Button>
                        <Button variant="ghost" onClick={() => removeSaved(s.id)}><Trash className="h-4 w-4"/></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="text-lg font-semibold">Completed Trips</div>
              </CardHeader>
              <CardContent>
                {completed.length === 0 && <div className="text-sm text-muted-foreground">No completed trips recorded.</div>}
                <div className="space-y-3 mt-3">
                  {completed.map(c => (
                    <div key={c.id} className="p-3 bg-white rounded flex items-start justify-between">
                      <div>
                        <div className="font-medium">{c.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">{c.dates || 'Dates unknown'}</div>
                        {c.notes && <div className="text-sm mt-2">{c.notes}</div>}
                        <div className="text-xs text-muted-foreground mt-1">Completed {c.completedOn || '—'}</div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Link to="/trip-details/" className="w-full"><Button variant="outline">View</Button></Link>
                        <Button variant="ghost" onClick={() => removeCompleted(c.id)}><Trash className="h-4 w-4"/></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <div className="text-lg font-semibold">Notes & Actions</div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">Manage your saved itineraries and completed trips here. Use the Trip Summary box to view cart items and proceed to checkout.</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <aside>
          <TripSummaryBox />
        </aside>
      </div>
    </div>
  );
}
