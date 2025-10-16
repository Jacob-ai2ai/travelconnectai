import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Star, Play, MapPin } from 'lucide-react';
import TripSummaryBox from '@/components/TripSummaryBox';
import { addSummaryItem } from '@/lib/tripSummary';

export const SAMPLE_EXPERIENCES = [
  {
    id: 'exp-1',
    name: 'Sunrise Mount Batur Hiking',
    description: 'Witness breathtaking sunrise from the active volcano peak with professional guide. Includes hotel pickup, guide, breakfast, and photos.',
    duration: '6 hours',
    price: 85,
    image: '/placeholder.svg',
    rating: 4.8,
    highlights: ['Professional Guide','Breakfast Included','Hotel Pickup','Safety Gear'],
    startDate: '2025-05-11T04:30:00',
    isLiveDemo: true,
    liveViewers: 156,
    videos: ['/placeholder.svg'],
    availableDates: ['2025-05-11T04:30:00','2025-05-12T04:30:00','2025-05-18T04:30:00'],
    location: 'Batur Village, Kintamani, Bali (meeting point: Hotel lobby pickup)',
    seatCategories: [
      { id: 'cat-1', name: 'Adult', price: 85, capacity: 20, available: 15 },
      { id: 'cat-2', name: 'Child', price: 60, capacity: 10, available: 5 }
    ],
    host: { id: 'host-batur', name: 'Batur Hikes Co.', avatar: '/placeholder.svg', about: 'Local guides with 10+ years of experience leading safe sunrise hikes.' },
    guidelines: ['Bring warm clothing for early mornings', 'Wear good hiking shoes', 'Not suitable for pregnant travelers'],
    safety: ['Certified local guides', 'Safety briefing before hike', 'Emergency first-aid kit available'],
    suggestedProducts: [
      { id: 'prod-surf-rent', name: 'Surfboard Rental', price: 20, image: '/placeholder.svg' },
      { id: 'prod-headlamp', name: 'Headlamp', price: 12, image: '/placeholder.svg' }
    ]
  },
  {
    id: 'exp-2',
    name: 'Traditional Balinese Cooking Class',
    description: 'Learn authentic Balinese recipes in a traditional village setting. Market visit and recipe booklet included.',
    duration: '4 hours',
    price: 65,
    image: '/placeholder.svg',
    rating: 4.9,
    highlights: ['Market Tour','Recipe Book','Lunch Included'],
    startDate: '2025-05-12T10:00:00',
    isLiveDemo: true,
    liveViewers: 89,
    videos: [],
    seatCategories: [ { id: 'cat-1', name: 'General Admission', price: 65, capacity: 30, available: 25 } ],
    availableDates: ['2025-05-12T10:00:00'],
    location: 'Ubud Market, Bali',
    host: { id: 'host-bali-kitchen', name: 'Bali Kitchen Collective', avatar: '/placeholder.svg', about: 'Family-owned cooking school specializing in traditional Balinese cuisine.' },
    guidelines: ['Arrive 15 minutes early', 'Comfortable clothing recommended'],
    safety: ['Hygiene standards maintained', 'Instructor-led sessions'],
    suggestedProducts: [ { id: 'prod-apron', name: 'Cooking Apron', price: 8, image: '/placeholder.svg' } ]
  },
  {
    id: 'exp-3',
    name: 'White Water Rafting Adventure',
    description: 'Thrilling rafting experience through tropical rainforest and rice terraces. Includes safety briefing and photos.',
    duration: '5 hours',
    price: 45,
    image: '/placeholder.svg',
    rating: 4.6,
    highlights: ['Equipment Included','Photos','Transport'],
    isLiveDemo: false,
    videos: [],
    seatCategories: [ { id: 'cat-1', name: 'Raft Slot', price: 45, capacity: 40, available: 30 } ],
    availableDates: ['2025-05-20T08:00:00','2025-05-25T08:00:00'],
    location: 'Ayung River, Ubud',
    host: { id: 'host-river-rapids', name: 'River Rapids Ltd.', avatar: '/placeholder.svg', about: 'Experienced rafting operators with full safety compliance.' },
    guidelines: ['Must be at least 12 years old', 'Swimwear recommended'],
    safety: ['Life jackets provided', 'Certified guides', 'Safety briefing mandatory'],
    suggestedProducts: [ { id: 'prod-rashguard', name: 'Rash Guard', price: 15, image: '/placeholder.svg' } ]
  }
];

export default function ExperiencePage() {
  const { experienceId } = useParams();
  const exp = SAMPLE_EXPERIENCES.find((e) => e.id === experienceId) || SAMPLE_EXPERIENCES[0];
  const [people, setPeople] = useState<number>(1);

  // selected seats per category
  const [selectedSeats, setSelectedSeats] = useState<Record<string, number>>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    const init: Record<string, number> = {};
    (exp.seatCategories || []).forEach((c: any) => { init[c.id] = 0; });
    setSelectedSeats(init);
    setSelectedDate((exp.availableDates && exp.availableDates[0]) || null);
    setShowFullDescription(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exp.id]);

  const changePeople = (delta: number) => setPeople((p) => Math.max(1, p + delta));

  const changeSeatQty = (catId: string, delta: number) => {
    setSelectedSeats((prev) => {
      const cur = prev[catId] ?? 0;
      const cat = (exp.seatCategories || []).find((s:any) => s.id === catId);
      const maxAllowed = typeof cat?.available === 'number' ? cat.available : Infinity;
      const next = Math.max(0, Math.min(maxAllowed, cur + delta));
      return { ...prev, [catId]: next };
    });
  };

  const seatsTotal = () => {
    return (exp.seatCategories || []).reduce((sum: number, c: any) => {
      const qty = selectedSeats[c.id] ?? 0;
      return sum + (qty * (c.price || 0));
    }, 0);
  };

  const handleAddToItinerary = () => {
    // add to shared trip summary
    addSummaryItem({ id: exp.id, type: 'experience', title: exp.name, price: exp.price, qty: people, image: exp.image, meta: { startDate: exp.startDate } });
    // show confirmation
    alert(`${exp.name} (x${people}) added to trip summary`);
  };

  const handleJoinLive = () => {
    if (exp.isLiveDemo) window.open(`/live/${exp.id}`, '_blank');
    else alert('No live demo currently available');
  };

  const handleRequest = () => {
    alert('Request sent to provider');
  };

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="container mx-auto">
        <nav className="text-sm text-muted-foreground mb-3">
          <Link to="/trip-details/standard-bali">Back to trip</Link>
        </nav>

        <div className="grid md:grid-cols-3 gap-6">
          <main className="md:col-span-2">
            <Card className="overflow-hidden mb-6">
              <div className="h-72 overflow-hidden relative bg-muted">
                {exp.videos && exp.videos.length > 0 ? (
                  <video className="w-full h-full object-cover" src={exp.videos[0]} controls />
                ) : (
                  <img src={exp.image} alt={exp.name} className="w-full h-full object-cover" />
                )}
                {exp.isLiveDemo && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full flex items-center text-sm">
                    <Play className="h-4 w-4 mr-2" /> LIVE DEMO • {exp.liveViewers}
                  </div>
                )}
              </div>

              <CardContent>
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold mb-1">{exp.name}</h1>
                    <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                      <div className="flex items-center"><Star className="h-4 w-4 text-yellow-400 mr-1" />{exp.rating}</div>
                      <div className="flex items-center"><Calendar className="h-4 w-4 mr-1" />{exp.duration}</div>
                    </div>

                    {/* When & Where side-by-side */}
                    <div className="mt-3 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>
                        <div className="font-medium text-sm mb-1">When</div>
                        {exp.startDate ? (
                          <div>
                            <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> <span>{new Date(exp.startDate).toLocaleDateString()}</span></div>
                            <div className="flex items-center gap-2 mt-1"><Clock className="h-4 w-4" /> <span>{new Date(exp.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
                            <div className="mt-3">
                              <Button size="sm" onClick={exp.isLiveDemo ? handleJoinLive : handleRequest}>{exp.isLiveDemo ? 'Join Live Demo' : 'Request Live Demo'}</Button>
                            </div>
                          </div>
                        ) : (
                          <div>TBA</div>
                        )}
                      </div>

                      <div>
                        <div className="font-medium text-sm mb-1">Where</div>
                        {exp.location ? (
                          <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> <span>{exp.location}</span></div>
                        ) : (
                          <div>TBA</div>
                        )}
                      </div>
                    </div>

                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold">${exp.price}</div>
                    <div className="text-sm text-muted-foreground">per person</div>
                  </div>
                </div>


                {/* About / Guidelines / Map - full width below the columns */}
                <div className="mt-6">
                  {/* Provider information (moved) */}
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">About this experience</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {showFullDescription ? exp.description : (exp.description && exp.description.length > 160 ? `${exp.description.slice(0,160)}...` : exp.description)}
                      {exp.description && exp.description.length > 160 && (
                        <button className="ml-2 text-sm text-blue-600" onClick={() => setShowFullDescription((s)=>!s)}>{showFullDescription ? 'See less' : 'See more'}</button>
                      )}
                    </p>

                    {/* Highlights inside About */}
                    <div className="mb-3">
                      <h5 className="font-semibold mb-2">Highlights</h5>
                      <div className="flex flex-wrap gap-2">
                        {exp.highlights?.map((h) => (
                          <Badge key={h} variant="secondary" className="text-xs">{h}</Badge>
                        ))}
                      </div>
                    </div>

                    {/* Guidelines inside About */}
                    <div className="mb-3">
                      <h5 className="font-semibold mb-2">Guidelines & eligibility</h5>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {(exp.guidelines||[]).map((g:any)=> <li key={g}>{g}</li>)}
                        {(exp.safety||[]).map((s:any)=> <li key={s}>{s}</li>)}
                      </ul>
                    </div>

                  </div>

                  {/* Provider information after About (clickable) */}
                  {exp.host && (
                    <div className="mb-4 border rounded p-3">
                      <div className="font-semibold">Provider</div>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-muted"><img src={exp.host.avatar} alt={exp.host.name} className="w-full h-full object-cover" /></div>
                        <div className="text-sm">
                          <Link to={`/provider/${exp.host.id}`} className="font-medium hover:underline">{exp.host.name}</Link>
                          <div className="text-xs text-muted-foreground"><Link to={`/provider/${exp.host.id}`} className="hover:underline">{exp.host.about}</Link></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Find the location</h4>
                    <div className="w-full h-48 rounded overflow-hidden border">
                      <iframe
                        title="experience-location"
                        src={`https://www.google.com/maps?q=${encodeURIComponent(exp.name)}&output=embed`}
                        className="w-full h-full"
                        loading="lazy"
                      />
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* Suggested products / similar experiences */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Similar Experiences</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {SAMPLE_EXPERIENCES.filter(e => e.id !== exp.id).map(e => (
                  <Card key={e.id} className="overflow-hidden">
                    <div className="h-36 overflow-hidden"><img src={e.image} alt={e.name} className="w-full h-full object-cover" /></div>
                    <CardContent>
                      <div className="font-medium">{e.name}</div>
                      <div className="text-xs text-muted-foreground">${e.price}</div>
                      <div className="mt-3 flex space-x-2">
                        <Link to={`/experience/${e.id}`}><Button size="sm">View</Button></Link>
                        <Button size="sm" variant="outline">Book</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Suggested products for this experience */}
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Suggested products</h4>
                <div className="grid grid-cols-2 gap-3">
                  {(exp.suggestedProducts||[]).map((p:any)=>(
                    <Card key={p.id} className="p-3">
                      <div className="flex items-center">
                        <div className="w-16 h-12 overflow-hidden rounded mr-3"><img src={p.image} alt={p.name} className="w-full h-full object-cover" /></div>
                        <div className="flex-1">
                          <div className="font-medium">{p.name}</div>
                          <div className="text-xs text-muted-foreground">${p.price}</div>
                        </div>
                        <div>
                          <Button size="sm" onClick={()=>{ addSummaryItem({ id: p.id, type: 'product', title: p.name, price: p.price, qty: 1, image: p.image }); alert('Added '+p.name); }}>Add</Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

            </div>

          </main>

          <aside className="md:col-span-1">
            <Card className="mb-4">
              <CardHeader>
                <div className="text-sm font-semibold">Booking</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-3">${exp.price}</div>
                <div className="mb-4 text-sm text-muted-foreground">Includes guide, transfers, and breakfast where applicable.</div>

                {/* Dates selector */}
                <div className="mb-3">
                  <label className="text-sm font-medium">Choose date</label>
                  <select className="w-full border rounded mt-1 p-2" value={selectedDate || ''} onChange={(e) => setSelectedDate(e.target.value)}>
                    {(exp.availableDates||[]).map((d:string) => (
                      <option key={d} value={d}>{new Date(d).toLocaleDateString()} • {new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</option>
                    ))}
                  </select>
                </div>

                {/* Participants / categories */}
                <div className="space-y-2 mb-4">
                  {(exp.seatCategories||[]).map((cat:any)=> (
                    <div key={cat.id} className="flex items-center justify-between border rounded p-2">
                      <div>
                        <div className="font-medium">{cat.name}</div>
                        <div className="text-xs text-muted-foreground">${cat.price} • {cat.available} available</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1 border rounded" onClick={()=> changeSeatQty(cat.id, -1)}>-</button>
                        <div className="px-3 py-1">{selectedSeats[cat.id] ?? 0}</div>
                        <button className="px-3 py-1 border rounded" onClick={()=> changeSeatQty(cat.id, 1)}>+</button>
                      </div>
                    </div>
                  ))}

                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-sm">Total</div>
                    <div className="text-lg font-bold">${seatsTotal().toFixed(2)}</div>
                  </div>
                </div>

                <div className="mt-3 flex items-center space-x-2 mb-4">
                  <div className="flex items-center border rounded overflow-hidden text-sm">
                    <button className="px-3 py-1" onClick={() => changePeople(-1)}>-</button>
                    <div className="px-3 py-1">{people}</div>
                    <button className="px-3 py-1" onClick={() => changePeople(1)}>+</button>
                  </div>
                </div>

                <Button className="w-full mb-2">Reserve</Button>
                <Button onClick={handleAddToItinerary} className="w-full">Add to trip</Button>
              </CardContent>
            </Card>

            <Card className="mb-4">
              <CardContent>
                <div className="text-sm font-semibold mb-3">Special offers & promotions</div>
                <div className="space-y-3">
                  <div className="p-3 border rounded flex items-center justify-between">
                    <div>
                      <div className="font-medium">Early Bird — 10% off</div>
                      <div className="text-sm text-muted-foreground">Book 14+ days in advance.</div>
                    </div>
                    <Button variant="outline">Apply</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-4">
              <TripSummaryBox />
            </div>

          </aside>
        </div>
      </div>

      {/* Nova assistant floating */}
      <div className="fixed right-6 bottom-6">
        <button aria-label="Nova Assistant" onClick={() => { const el = document.getElementById('nova-panel'); if (el) el.classList.toggle('hidden'); }} className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">N</button>
        <div id="nova-panel" className="hidden w-80 bg-white border rounded shadow-lg mt-2">
          <div className="p-3 border-b flex items-center justify-between">
            <div className="font-semibold">Nova</div>
            <button onClick={() => { const el = document.getElementById('nova-panel'); if (el) el.classList.add('hidden'); }} className="text-sm text-muted-foreground">Close</button>
          </div>
          <div className="p-3 text-sm text-muted-foreground">Hi, I'm Nova — your travel assistant. Ask me to add this experience to your itinerary.</div>
          <div className="p-3 border-t"><input placeholder="Ask Nova..." className="w-full border rounded px-2 py-1 text-sm" /></div>
        </div>
      </div>
    </div>
  );
}
