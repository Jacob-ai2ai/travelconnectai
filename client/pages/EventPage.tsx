import React, {useState} from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Star, Play, MapPin } from 'lucide-react';
import TripSummaryBox from '@/components/TripSummaryBox';
import { addSummaryItem } from '@/lib/tripSummary';

const SAMPLE_EVENTS = [
  {
    id: 'evt-1',
    name: 'Ubud Cultural Dance Night',
    date: '2025-05-12T19:00',
    venue: 'Ubud Palace',
    price: 25,
    image: '/placeholder.svg',
    description: 'Traditional Balinese dance performance with live gamelan orchestra.',
    rating: 4.7,
    isLive: false,
    videos: ['/placeholder.svg'],
    seatCategories: [ { id: 'cat-1', name: 'Adult (13+)', price: 25, available: 100 }, { id: 'cat-2', name: 'Child (2-12)', price: 12, available: 50 }, { id: 'cat-3', name: 'Infant (0-1)', price: 0, available: 50 } ],
    guidelines: ['Arrive 20 minutes early', 'No flash photography during performances'],
    safety: ['Wheelchair accessible seating available', 'Staff trained for emergencies'],
    suggestedProducts: [ { id: 'prod-dance-fan', name: 'Hand Fan', price: 5, image: '/placeholder.svg' } ]
  },
  {
    id: 'evt-2',
    name: 'Sanur Beach Music Festival',
    date: '2025-05-14T18:00',
    venue: 'Sanur Beach',
    price: 40,
    image: '/placeholder.svg',
    description: 'Local and international bands performing by the beach.',
    rating: 4.6,
    isLive: true,
    viewers: 120,
    videos: [],
    seatCategories: [ { id: 'cat-1', name: 'General Admission', price: 40, available: 500 } ],
    guidelines: ['No outside food allowed', 'Follow event staff instructions'],
    safety: ['Security on site', 'First aid tent available'],
    suggestedProducts: [ { id: 'prod-earplugs', name: 'Ear Plugs', price: 3, image: '/placeholder.svg' } ]
  },
];

export default function EventPage() {
  const { eventId } = useParams();
  const ev = SAMPLE_EVENTS.find((e) => e.id === eventId) || SAMPLE_EVENTS[0];
  const [tickets, setTickets] = useState<number>(1);

  const changeTickets = (delta: number) => setTickets((t) => Math.max(1, t + delta));

  const handleBuy = () => {
    // add tickets to trip summary
    addSummaryItem({ id: ev.id, type: 'event', title: ev.name, price: ev.price, qty: tickets, image: ev.image, meta: { venue: ev.venue, date: ev.date } });
    alert(`Added ${tickets} ticket(s) for ${ev.name} to trip summary`);
  };

  const handleContact = () => {
    alert('Contact organizer (simulated)');
  };

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="container mx-auto">
        <nav className="text-sm text-muted-foreground mb-3">
          <Link to="/trip-details/standard-bali">Back to trip</Link>
        </nav>

        <div className="grid md:grid-cols-3 gap-6">
          <main className="md:col-span-2">
            <Card className="overflow-hidden">
              <div className="aspect-video relative">
                <img src={ev.image} alt={ev.name} className="w-full h-full object-cover" />
                {ev.isLive && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full flex items-center text-sm">
                    <Play className="h-4 w-4 mr-2" /> LIVE • {ev.viewers}
                  </div>
                )}
              </div>

              <CardContent>
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold mb-1">{ev.name}</h1>
                    <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                      <div className="flex items-center"><Star className="h-4 w-4 text-yellow-400 mr-1" />{ev.rating}</div>
                      <div className="flex items-center"><MapPin className="h-4 w-4 mr-1" />{ev.venue}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold">${ev.price}</div>
                    <div className="text-sm text-muted-foreground">per ticket</div>
                  </div>
                </div>

                <p className="mt-4 text-muted-foreground">{ev.description}</p>

                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">When</h4>
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-2 mb-1"><Calendar className="h-4 w-4" /> <span>{new Date(ev.date).toLocaleDateString()}</span></div>
                      <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> <span>{new Date(ev.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</span></div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Tickets</h4>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center border rounded overflow-hidden text-sm">
                        <button className="px-3 py-1" onClick={() => changeTickets(-1)}>-</button>
                        <div className="px-3 py-1">{tickets}</div>
                        <button className="px-3 py-1" onClick={() => changeTickets(1)}>+</button>
                      </div>
                      <div className="text-sm text-muted-foreground">${(ev.price * tickets).toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button className="bg-travel-blue" onClick={handleBuy}>Buy Ticket</Button>
                  <Button variant="outline" onClick={handleContact}>Contact Organizer</Button>
                  {ev.isLive ? <Button onClick={() => window.open(`/live/${ev.id}`, '_blank')}>Watch Live</Button> : null}
                </div>
              </CardContent>
            </Card>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">More Events Nearby</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {SAMPLE_EVENTS.filter(e => e.id !== ev.id).map(e => (
                  <Card key={e.id} className="overflow-hidden">
                    <div className="h-36 overflow-hidden"><img src={e.image} alt={e.name} className="w-full h-full object-cover" /></div>
                    <CardContent>
                      <div className="font-medium">{e.name}</div>
                      <div className="text-xs text-muted-foreground">{new Date(e.date).toLocaleDateString()} • ${e.price}</div>
                      <div className="mt-3 flex space-x-2">
                        <Link to={`/event/${e.id}`}><Button size="sm">View</Button></Link>
                        <Button size="sm" variant="outline">Buy</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

          </main>

          <aside className="md:col-span-1">
            <Card className="mb-4 p-4 w-full max-w-sm">
              <h4 className="font-semibold mb-3">Tickets</h4>
              <div className="text-2xl font-bold mb-3">${ev.price}</div>
              <div className="mb-4 text-sm text-muted-foreground">Secure your spot. Electronic tickets sent instantly.</div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex items-center border rounded overflow-hidden text-sm">
                  <button className="px-3 py-1" onClick={() => changeTickets(-1)}>-</button>
                  <div className="px-3 py-1">{tickets}</div>
                  <button className="px-3 py-1" onClick={() => changeTickets(1)}>+</button>
                </div>
                <div className="text-sm text-muted-foreground">${(ev.price * tickets).toFixed(2)}</div>
              </div>
              <Button className="w-full" onClick={handleBuy}>Buy Ticket</Button>
            </Card>

            <Card className="mt-4">
              <CardContent>
                <div className="text-sm font-semibold mb-2">Need help?</div>
                <Button variant="ghost" className="w-full">Contact support</Button>
              </CardContent>
            </Card>

            {/* Trip summary shared box */}
            <div className="mt-4">
              <TripSummaryBox />
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}
