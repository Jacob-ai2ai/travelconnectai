import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SAMPLE_EVENTS = [
  { id: 'evt-1', name: 'Ubud Cultural Dance Night', date: '2025-05-12T19:00', venue: 'Ubud Palace', price: 25, image: '/placeholder.svg', description: 'Traditional Balinese dance performance with live gamelan orchestra.' },
  { id: 'evt-2', name: 'Sanur Beach Music Festival', date: '2025-05-14T18:00', venue: 'Sanur Beach', price: 40, image: '/placeholder.svg', description: 'Local and international bands performing by the beach.' },
];

export default function EventPage() {
  const { eventId } = useParams();
  const ev = SAMPLE_EVENTS.find((e) => e.id === eventId) || SAMPLE_EVENTS[0];

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto">
        <Link to="/trip-details/budget-bali" className="text-sm text-muted-foreground">Back to trip</Link>
        <h1 className="text-3xl font-bold my-4">{ev.name}</h1>

        <div className="grid md:grid-cols-3 gap-6">
          <main className="md:col-span-2">
            <Card>
              <div className="h-64 overflow-hidden">
                <img src={ev.image} alt={ev.name} className="w-full h-full object-cover" />
              </div>
              <CardContent>
                <p className="mb-4 text-muted-foreground">{ev.description}</p>
                <div className="mb-2">When: <strong>{new Date(ev.date).toLocaleString()}</strong></div>
                <div className="mb-2">Where: <strong>{ev.venue}</strong></div>
                <div className="mb-4">Price: <strong>${ev.price}</strong></div>
                <div className="flex space-x-3">
                  <Button onClick={() => { alert('Ticket added to bill (simulated)'); }}>Buy Ticket</Button>
                  <Button variant="outline">Contact Organizer</Button>
                </div>
              </CardContent>
            </Card>
          </main>

          <aside className="md:col-span-1">
            <Card>
              <CardContent>
                <div className="font-semibold">Tickets</div>
                <div className="text-2xl font-bold my-3">${ev.price}</div>
                <Button className="w-full">Buy Ticket</Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
