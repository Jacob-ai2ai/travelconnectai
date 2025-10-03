import React from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Heart, Share2, Play, Video, MapPin, Star, Eye, VideoIcon, Car, Coffee, Dumbbell } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Property {
  id: string;
  name: string;
  pricePerNight: number;
  images: string[];
  description: string;
  amenities: string[];
  services: string[];
  experiences: string[];
  videos: { id: string; title: string; url: string; isLive: boolean; viewers?: number }[];
  rating: number;
  reviewsCount: number;
  host: { name: string; avatar?: string };
  location: { address: string; lat?: number; lng?: number };
}

const SAMPLE_PROPERTIES: Property[] = [
  {
    id: "villa-1",
    name: "Sobha Heartland II Villas",
    pricePerNight: 116,
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
    ],
    description:
      "Proudly presenting a brand-new spacious villa apartment with exclusive access to the building swimming pool and gym. This apartment is perfect for solo travellers, couples on a holiday and even business travellers.",
    amenities: ["4 Bedrooms", "3 Bathrooms", "Indoor Parking", "WiFi", "Pool", "AC", "Kitchen"],
    services: ["Airport Transfer", "Daily Housekeeping", "In-villa Spa"],
    experiences: ["Sunset Cruise", "Guided Temple Tour", "Cooking Class"],
    videos: [
      { id: "v1", title: "Walkthrough", url: "/placeholder.svg", isLive: false },
      { id: "v2", title: "Hosted Live Tour", url: "/placeholder.svg", isLive: true, viewers: 23 },
    ],
    rating: 4.9,
    reviewsCount: 124,
    host: { name: "Azalea Hosts", avatar: "/placeholder.svg" },
    location: { address: "Palm Jumeirah, Dubai Marina" },
  },
];

export default function PropertyPage() {
  const { propertyId } = useParams();
  const property =
    SAMPLE_PROPERTIES.find((p) => p.id === propertyId) || SAMPLE_PROPERTIES[0];

  const location = useLocation();
  const navigate = useNavigate();
  // check if opened from itinerary replacement flow
  const state: any = (location && (location.state as any)) || {};
  const fromItinerary: boolean = !!state.fromItinerary;
  const replacePropertyId: string | undefined = state.replacePropertyId;
  const replaceProperty = SAMPLE_PROPERTIES.find((p) => p.id === replacePropertyId);

  // Itinerary state and handlers (cart-like)
  const [itineraryCandidates, setItineraryCandidates] = React.useState<Property[]>([]);
  const [inItinerary, setInItinerary] = React.useState<boolean>(false);

  // cart items: each item has id and nights (quantity)
  const [itineraryItems, setItineraryItems] = React.useState<{ id: string; nights: number }[]>([]);

  const addToItinerary = (id: string) => {
    setItineraryItems((prev) => {
      const exists = prev.find((i) => i.id === id);
      if (exists) return prev;
      return [...prev, { id, nights: 1 }];
    });
    if (id === property.id) setInItinerary(true);
  };

  const changeNights = (id: string, delta: number) => {
    setItineraryItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, nights: Math.max(1, i.nights + delta) } : i))
        .filter(Boolean)
    );
  };

  const removeFromItinerary = (id: string) => {
    setItineraryItems((prev) => prev.filter((i) => i.id !== id));
    if (id === property.id) setInItinerary(false);
  };

  const handleDragStart = (e: React.DragEvent, payload: { type: string; id: string; title?: string; price?: number; refId?: string }) => {
    try {
      e.dataTransfer.setData("text/plain", JSON.stringify(payload));
      e.dataTransfer.effectAllowed = "move";
    } catch (err) {
      console.warn('drag start error', err);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropToItinerary = (e: React.DragEvent) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData("text/plain");
    if (!raw) return;
    let payload: any;
    try {
      payload = JSON.parse(raw);
    } catch (err) {
      payload = { type: 'stay', id: raw };
    }

    if (!payload || !payload.type) return;

    if (payload.type === 'stay') {
      // payload.id is property id
      addBilledStay(payload.id);
      return;
    }

    // for experience/service/fee -> add as billed item
    const itemId = payload.id || `${payload.type}-${Date.now()}`;
    const title = payload.title || 'Item';
    const price = typeof payload.price === 'number' ? payload.price : 0;
    addBillItem({ id: itemId, type: payload.type as any, refId: payload.refId, title, price, qty: 1 });
  };

  const handleRemoveCandidate = (id: string) => {
    setItineraryCandidates((prev) => prev.filter((p) => p.id !== id));
  };

  const handleChooseCandidate = (id: string) => {
    alert(`Chosen ${id} (simulated)`);
  };

  const handleRemoveThis = () => {
    // placeholder behavior: in real app call API to update itinerary
    alert("Removed property from itinerary (simulated)");
    navigate(-1);
  };

  const handleChooseThis = (chosenId: string) => {
    // placeholder: simulate replacing itinerary item and navigate back
    alert(`Replaced itinerary property with ${chosenId} (simulated)`);
    navigate(-1);
  };

  // Billed itinerary: show full bill (stays, experiences, services, fees)
  type BilledItem = { id: string; type: "stay" | "experience" | "service" | "fee"; refId?: string; title: string; price: number; qty: number };
  const [billedItems, setBilledItems] = React.useState<BilledItem[]>(() => [
    { id: `stay-${property.id}`, type: "stay", refId: property.id, title: property.name, price: property.pricePerNight, qty: 1 },
    ...(property.experiences[0]
      ? [{ id: `exp-1`, type: "experience", title: property.experiences[0], price: 45, qty: 2 }]
      : []),
    ...(property.services[0]
      ? [{ id: `svc-1`, type: "service", title: property.services[0], price: 30, qty: 1 }]
      : []),
    { id: `fee-cleaning`, type: "fee", title: "Cleaning Fee", price: 50, qty: 1 },
  ]);

  const changeBilledQty = (id: string, delta: number) => {
    setBilledItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        if (it.type === "stay") return it; // stays fixed at 1
        return { ...it, qty: Math.max(1, it.qty + delta) };
      })
    );
  };

  const removeBilledItem = (id: string) => {
    setBilledItems((prev) => prev.filter((it) => it.id !== id));
    if (id === `stay-${property.id}`) setInItinerary(false);
  };

  const addBilledStay = (propId: string) => {
    const p = SAMPLE_PROPERTIES.find((x) => x.id === propId);
    if (!p) return;
    setBilledItems((prev) => {
      if (prev.some((it) => it.refId === p.id && it.type === "stay")) return prev;
      return [...prev, { id: `stay-${p.id}`, type: "stay", refId: p.id, title: p.name, price: p.pricePerNight, qty: 1 }];
    });
    if (propId === property.id) setInItinerary(true);
  };

  const addBillItem = (item: BilledItem) => {
    setBilledItems((prev) => {
      if (prev.some((it) => it.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  // Voice assistant: Nova using Web Speech API (basic)
  const recognitionRef = React.useRef<any>(null);
  const [isListening, setIsListening] = React.useState(false);
  const [isAwake, setIsAwake] = React.useState(false);

  const [novaMessages, setNovaMessages] = React.useState<{ from: 'user' | 'nova'; text: string }[]>([]);

  React.useEffect(() => {
    const w: any = window as any;
    const SpeechRecognition = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const r = new SpeechRecognition();
    r.continuous = true;
    r.interimResults = false;
    r.lang = 'en-US';
    r.onstart = () => setIsListening(true);
    r.onresult = (ev: any) => {
      // take the most recent result
      const last = ev.results[ev.results.length - 1];
      const transcript = last && last[0] && last[0].transcript ? last[0].transcript.trim() : '';
      if (transcript) {
        setNovaMessages((prev) => [...prev, { from: 'user', text: transcript }]);
        handleTranscript(transcript, 'voice');
      }
    };
    r.onerror = (err: any) => console.warn('Speech recognition error', err);
    r.onend = () => {
      setIsListening(false);
    };
    recognitionRef.current = r;
  }, []);

  const speak = (msg: string) => {
    setNovaMessages((prev) => [...prev, { from: 'nova', text: msg }] );
    const w: any = window as any;
    if (!w.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(msg);
    w.speechSynthesis.cancel();
    w.speechSynthesis.speak(utter);
  };

  const respond = (msg: string, source: 'voice' | 'text') => {
    if (source === 'voice') {
      speak(msg);
    } else {
      setNovaMessages((prev) => [...prev, { from: 'nova', text: msg }]);
    }
  };

  const startListening = () => {
    const r = recognitionRef.current;
    if (!r) return alert('Speech recognition not supported in this browser');
    try { r.start(); setIsListening(true); } catch (e) { console.warn(e); }
  };
  const stopListening = () => { const r = recognitionRef.current; if (r) try { r.stop(); } catch (e) {} setIsListening(false); };

  const handleTranscript = (text: string, source: 'voice' | 'text' = 'voice') => {
    const t = text.toLowerCase();
    console.log('Transcript:', t);
    // wake word
    if (t.includes('hey nova') || t.includes('ok nova')) {
      setIsAwake(true);
      respond('Hey traveler, how can I help you?', source);
      return;
    }
    if (!isAwake) return;

    // helper: respond via respond() which chooses between speaking or text-only
    // process simple commands: remove <thing>, add <property name>, increase/decrease <item>
    if (t.includes('remove')) {
      // try match billedItems by title
      const name = t.replace('remove', '').trim();
      const found = billedItems.find((it) => it.title.toLowerCase().includes(name));
      if (found) {
        removeBilledItem(found.id);
        respond(`${found.title} removed from your itinerary`, source);
      } else respond('I could not find that item to remove', source);
      setIsAwake(false);
      return;
    }

    if (t.includes('add')) {
      const name = t.replace('add', '').trim();
      // try find property by name
      const prop = SAMPLE_PROPERTIES.find((p) => p.name.toLowerCase().includes(name));
      if (prop) {
        addBilledStay(prop.id);
        respond(`${prop.name} added to your itinerary`, source);
      } else {
        // try experiences in current property
        const exp = property.experiences.find((e) => e.toLowerCase().includes(name));
        if (exp) {
          addBillItem({ id: `exp-${Date.now()}`, type: 'experience', title: exp, price: 45, qty: 1 });
          respond(`${exp} added to your itinerary`, source);
        } else respond('Could not find the item to add', source);
      }
      setIsAwake(false);
      return;
    }

    if (t.includes('increase') || t.includes('decrease') || t.includes('more') || t.includes('less')) {
      const inc = t.includes('increase') || t.includes('more');
      const name = t.replace('increase', '').replace('decrease','').replace('more','').replace('less','').trim();
      const found = billedItems.find((it) => it.title.toLowerCase().includes(name));
      if (found) {
        changeBilledQty(found.id, inc ? 1 : -1);
        respond(`${found.title} quantity updated`, source);
      } else respond('Item not found', source);
      setIsAwake(false);
      return;
    }

    respond('I did not understand that command', source);
    setIsAwake(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <nav className="text-sm text-muted-foreground mb-3">
            <Link to="/">Home</Link> / <Link to="/trip-details/budget-bali">Classic Bali Experience</Link> / <span className="font-medium">{property.name}</span>
          </nav>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{property.name}</h1>
              <div className="flex items-center space-x-3 mt-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Star className="h-4 w-4 mr-1 text-yellow-500" /> {property.rating} • {property.reviewsCount} reviews
                </div>
                <Badge variant="secondary">Self check in</Badge>
                <Badge variant="secondary">Superhost</Badge>
                <div className="text-sm text-muted-foreground">{property.location.address}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Added / Not added toggle */}
              {(() => {
                const isAdded = billedItems.some((it) => it.type === "stay" && it.refId === property.id);
                return (
                  <Button size="sm" onClick={() => {
                    if (isAdded) removeBilledItem(`stay-${property.id}`);
                    else addBilledStay(property.id);
                  }}>
                    {isAdded ? "Added" : "Add to itinerary"}
                  </Button>
                );
              })()}

              <Button variant="link" size="sm" onClick={() => {
                const el = document.getElementById('more-stays');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}>More properties</Button>

              <div className="flex items-center space-x-2">
                <Button variant="ghost">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="ghost">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left: Gallery and details */}
          <div className="md:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 row-span-2">
                  <img
                    src={property.images[0]}
                    alt={property.name}
                    className="w-full h-[420px] object-cover rounded-lg"
                  />
                </div>
                {property.images.slice(1, 5).map((src, idx) => (
                  <div key={idx} className="h-32 overflow-hidden rounded-lg">
                    <img src={src} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="mt-3 flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        <img src={property.host.avatar} alt="host" className="h-10 w-10 rounded-full object-cover" />
                        <div>
                          <div className="font-medium">Hosted by {property.host.name}</div>
                          <div className="text-xs text-muted-foreground">Superhost • {property.reviewsCount} reviews</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">Contact Host</Button>
                        <Button size="sm">Request Live Walkthrough</Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabs: Overview / Amenities / Services / Experiences / Videos / Reviews */}
                <div className="mt-6">
                  <Tabs defaultValue="overview">
                    <TabsList>
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="amenities">Amenities</TabsTrigger>
                      <TabsTrigger value="services">Services</TabsTrigger>
                      <TabsTrigger value="experiences">Experiences</TabsTrigger>
                      <TabsTrigger value="videos">Videos</TabsTrigger>
                      <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                      {/* Top row: description + quick info */}
                      <div className="mt-4 grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                          <Card>
                            <CardContent>
                              <div className="mb-4">
                                <h4 className="font-semibold">Property Description</h4>
                                <p className="text-sm text-muted-foreground mt-2">{property.description}</p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <div>
                          <Card>
                            <CardContent>
                              <div className="text-sm text-muted-foreground">Quick Info</div>
                              <div className="mt-3">
                                <div className="flex items-center justify-between"><div className="text-sm">Bedrooms</div><div className="font-semibold">4</div></div>
                                <div className="flex items-center justify-between mt-2"><div className="text-sm">Bathrooms</div><div className="font-semibold">3</div></div>
                                <div className="flex items-center justify-between mt-2"><div className="text-sm">Maximum occupancy</div><div className="font-semibold">{(() => { const b = property.amenities.find(a => /bedroom/i.test(a)); const m = b ? b.match(/(\d+)/) : null; return m ? String(parseInt(m[1],10) * 2) : '4'; })()}</div></div>
                                <div className="flex items-center justify-between mt-2"><div className="text-sm">Check in</div><div className="font-semibold">3:00 PM</div></div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Full-width sections that extend under Quick Info */}
                      <div className="mt-6">
                        <Card>
                          <CardContent>
                            <h4 className="font-semibold">Amenities</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                              {property.amenities.map((a) => (
                                <div key={a} className="flex items-center space-x-3 p-3 border rounded">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <div className="text-sm">{a}</div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 text-sm text-muted-foreground">Pets allowed: Yes (additional cleaning fee may apply)</div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="mt-6">
                        <Card>
                          <CardContent>
                            <h4 className="font-semibold">Services (in-property)</h4>
                            <div className="grid md:grid-cols-2 gap-3 mt-3">
                              {property.services.map((s, si) => {
                                const key = s.toLowerCase();
                                let Icon = Video;
                                if (key.includes("airport") || key.includes("transfer")) Icon = Car;
                                else if (key.includes("house") || key.includes("housekeeping")) Icon = Coffee;
                                else if (key.includes("spa")) Icon = Dumbbell;
                                return (
                                  <div key={s} draggable onDragStart={(e) => handleDragStart(e, { type: 'service', id: `svc-${si}-${property.id}`, title: s, price: 30, refId: property.id })} className="flex items-center space-x-3 p-3 border rounded">
                                    <Icon className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                      <div className="font-semibold">{s}</div>
                                      <div className="text-sm text-muted-foreground">Available on request</div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="mt-6">
                        <Card>
                          <CardContent>
                            <h4 className="font-semibold">Experiences & Activities</h4>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
                              {property.experiences.map((e, idx) => (
                                <Card key={e} draggable onDragStart={(ev) => handleDragStart(ev, { type: 'experience', id: `exp-${idx}-${property.id}`, title: e, price: 45, refId: property.id })} className="overflow-hidden">
                                  <div className="h-40 overflow-hidden">
                                    <img src="/placeholder.svg" alt={e} className="w-full h-full object-cover" />
                                  </div>
                                  <CardContent>
                                    <div className="flex items-center justify-between">
                                      <div className="font-semibold">{e}</div>
                                      <div className="text-lg font-bold">${45}</div>
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-2">Bookable activities nearby</div>
                                    <div className="mt-3 flex space-x-2">
                                  <Button size="sm">View</Button>
                                  <Button variant="outline" size="sm" onClick={() => addBillItem({ id: `exp-${Date.now()}`, type: 'experience', title: e, price: 45, qty: 1 })}>Book</Button>
                                </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="mt-6">
                        <Card>
                          <CardContent>
                            <h4 className="font-semibold">Video Library</h4>
                            <div className="grid md:grid-cols-3 gap-4 mt-3">
                              {property.videos.map((v) => (
                                <Card key={v.id} draggable onDragStart={(e) => handleDragStart(e, { type: 'service', id: `vid-${v.id}-${property.id}`, title: v.title, price: 0, refId: property.id })} className="overflow-hidden">
                                  <div className="h-40 overflow-hidden">
                                    <img src={v.url} alt={v.title} className="w-full h-full object-cover" />
                                  </div>
                                  <CardContent>
                                    <div className="font-medium">{v.title}</div>
                                    <div className="text-xs text-muted-foreground">{v.isLive ? "Live stream" : "Pre-recorded"}</div>
                                    <div className="mt-3">
                                      <Button size="sm" className="w-full">{v.isLive ? `Watch Live (${v.viewers})` : "Watch"}</Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="mt-6">
                        <Card>
                          <CardContent>
                            <h4 className="font-semibold">Guest Reviews</h4>
                            <div className="space-y-3 mt-3">
                              <Card>
                                <CardContent>
                                  <div className="font-semibold">Amazing stay</div>
                                  <div className="text-sm text-muted-foreground">The villa was spotless and the host was extremely helpful. Highly recommended!</div>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardContent>
                                  <div className="font-semibold">Fantastic location</div>
                                  <div className="text-sm text-muted-foreground">Minutes from the beach and lots of great restaurants nearby.</div>
                                </CardContent>
                              </Card>
                            </div>
                          </CardContent>
                        </Card>
                      </div>


                      {/* Full width Map under the quick info */}
                      <div className="mt-6">
                        <Card>
                          <CardContent>
                            <h4 className="font-semibold mb-3">Location & Map</h4>
                            <div className="h-64 bg-slate-100 flex items-center justify-center">Map placeholder (full width under Quick Info)</div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Nearby attractions full width */}
                      <div className="mt-6">
                        <h4 className="font-semibold mb-3">Nearby Attractions</h4>
                        <div className="grid md:grid-cols-3 gap-4">
                          <Card>
                            <div className="h-36 overflow-hidden">
                              <img src="/placeholder.svg" alt="Kuta Beach" className="w-full h-full object-cover" />
                            </div>
                            <CardContent>
                              <div className="font-medium">Kuta Beach</div>
                              <div className="text-xs text-muted-foreground">2 km</div>
                            </CardContent>
                          </Card>

                          <Card>
                            <div className="h-36 overflow-hidden">
                              <img src="/placeholder.svg" alt="Waterbom Bali" className="w-full h-full object-cover" />
                            </div>
                            <CardContent>
                              <div className="font-medium">Waterbom Bali</div>
                              <div className="text-xs text-muted-foreground">3 km</div>
                            </CardContent>
                          </Card>

                          <Card>
                            <div className="h-36 overflow-hidden">
                              <img src="/placeholder.svg" alt="Ubud Market" className="w-full h-full object-cover" />
                            </div>
                            <CardContent>
                              <div className="font-medium">Ubud Market</div>
                              <div className="text-xs text-muted-foreground">25 km</div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="amenities">
                      <div className="mt-6">
                        <Card>
                          <CardContent>
                            <h4 className="font-semibold mb-3">Amenities</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {property.amenities.map((a) => (
                                <div key={a} className="flex items-center space-x-3 p-3 border rounded">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <div className="text-sm">{a}</div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 text-sm text-muted-foreground">Pets allowed: Yes (additional cleaning fee may apply)</div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="services">
                      <div className="mt-6">
                        <Card>
                          <CardContent>
                            <h4 className="font-semibold mb-3">Services (In-property)</h4>
                            <div className="grid md:grid-cols-2 gap-4">
                              {property.services.map((s) => {
                                const key = s.toLowerCase();
                                let Icon = Video;
                                if (key.includes("airport") || key.includes("transfer")) Icon = Video;
                                else if (key.includes("house") || key.includes("housekeeping")) Icon = Video;
                                else if (key.includes("spa")) Icon = Video;
                                return (
                                  <div key={s} className="flex items-center space-x-3 p-3 border rounded">
                                    <Icon className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                      <div className="font-semibold">{s}</div>
                                      <div className="text-sm text-muted-foreground">Available on request</div>
                                    </div>
                                    <div className="ml-auto font-bold">From $25</div>
                                  </div>
                                );
                              })}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="experiences">
                      <div className="mt-6">
                        <h4 className="font-semibold mb-3">Experiences & Activities</h4>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {property.experiences.map((e) => (
                            <Card key={e} className="overflow-hidden">
                              <div className="h-40 overflow-hidden">
                                <img src="/placeholder.svg" alt={e} className="w-full h-full object-cover" />
                              </div>
                              <CardContent>
                                <div className="flex items-center justify-between">
                                  <div className="font-semibold">{e}</div>
                                  <div className="text-lg font-bold">${45}</div>
                                </div>
                                <div className="text-sm text-muted-foreground mt-2">Bookable activities nearby</div>
                                <div className="mt-3 flex space-x-2">
                                  <Button size="sm">View</Button>
                                  <Button variant="outline" size="sm">Book</Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="videos">
                      <div className="mt-6">
                        <h4 className="font-semibold mb-3">Video Library</h4>
                        <div className="grid md:grid-cols-3 gap-4">
                          {property.videos.map((v) => (
                            <Card key={v.id} draggable onDragStart={(e) => handleDragStart(e, { type: 'service', id: `vid-${v.id}-${property.id}`, title: v.title, price: 0, refId: property.id })} className="overflow-hidden">
                              <div className="h-40 overflow-hidden">
                                <img src={v.url} alt={v.title} className="w-full h-full object-cover" />
                              </div>
                              <CardContent>
                                <div className="font-medium">{v.title}</div>
                                <div className="text-xs text-muted-foreground">{v.isLive ? "Live stream" : "Pre-recorded"}</div>
                                <div className="mt-3">
                                  <Button size="sm" className="w-full">{v.isLive ? `Watch Live (${v.viewers})` : "Watch"}</Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="reviews">
                      <div className="mt-6">
                        <h4 className="font-semibold mb-3">Guest Reviews</h4>
                        <div className="space-y-3">
                          <Card>
                            <CardContent>
                              <div className="font-semibold">Amazing stay</div>
                              <div className="text-sm text-muted-foreground">The villa was spotless and the host was extremely helpful. Highly recommended!</div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent>
                              <div className="font-semibold">Fantastic location</div>
                              <div className="text-sm text-muted-foreground">Minutes from the beach and lots of great restaurants nearby.</div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </TabsContent>

                  </Tabs>
                </div>


                {/* Similar properties */}
                <div id="more-stays" className="mt-6">
                  <h4 className="font-semibold mb-3">Properties available in the same area</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    {SAMPLE_PROPERTIES.map((p) => (
                      <Card key={p.id} draggable onDragStart={(e) => handleDragStart(e, { type: 'stay', id: p.id, title: p.name, price: p.pricePerNight, refId: p.id })} className="cursor-grab">
                        <div className="h-36 bg-slate-100 overflow-hidden">
                          <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold">{p.name}</div>
                              <div className="text-sm text-muted-foreground">{p.location.address}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">${p.pricePerNight}</div>
                              <div className="text-xs text-muted-foreground">per night</div>
                            </div>
                          </div>
                          <div className="mt-3">
                            <Link to={`/property/${p.id}`}>
                              <Button size="sm" className="w-full">View</Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Placeholder end left column */}
          </div>

          {/* Right: Booking panel */}
          <aside className="sticky top-24">
            {/* Itinerary replace preview when opened from plan */}
            {fromItinerary && replaceProperty && (
              <Card className="mb-4 p-4 w-full max-w-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-20 h-16 overflow-hidden rounded-md">
                    <img src={replaceProperty.images[0]} alt={replaceProperty.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">Replace: {replaceProperty.name}</div>
                    <div className="text-sm text-muted-foreground">${replaceProperty.pricePerNight} / night</div>
                    <div className="mt-3 flex space-x-2">
                      <Button variant="outline" size="sm" onClick={handleRemoveThis}>Remove this</Button>
                      <Button size="sm" onClick={() => handleChooseThis(replaceProperty.id)}>Choose this</Button>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-xs text-muted-foreground">Recently viewed</div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {SAMPLE_PROPERTIES.map((p) => (
                      <div key={p.id} className="flex items-center space-x-2">
                        <div className="w-12 h-12 overflow-hidden rounded-md">
                          <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 text-sm">
                          <div>{p.name}</div>
                          <div className="text-xs text-muted-foreground">${p.pricePerNight}</div>
                        </div>
                        <Button size="xs" variant="ghost" onClick={() => handleChooseThis(p.id)}>Choose</Button>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            <Card className="p-6 w-full max-w-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-12 overflow-hidden rounded-md">
                    <img src={property.images[0]} alt={property.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Self check in • Unlock superhost • Great location</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">${property.pricePerNight}</div>
                  <div className="text-sm text-muted-foreground">per night</div>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium">Check In</label>
                <div className="mt-1">
                  <input type="date" className="w-full border rounded px-3 py-2" />
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium">Check Out</label>
                <div className="mt-1">
                  <input type="date" className="w-full border rounded px-3 py-2" />
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium">Guests</label>
                <div className="mt-1">
                  <select className="w-full border rounded px-3 py-2">
                    <option>1 Guest</option>
                    <option>2 Guests</option>
                    <option>3 Guests</option>
                    <option>4 Guests</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-muted-foreground">Cancellation Policies</div>
                <div className="mt-2 text-sm">Non-Refundable - ${property.pricePerNight} Total</div>
              </div>

              <div className="mb-4">
                <div className="text-lg font-bold">Total Before Taxes:</div>
                <div className="text-2xl font-bold">${property.pricePerNight}</div>
              </div>

              <Button className="w-full bg-black text-white">Reserve</Button>

              <div className="mt-3 text-xs text-muted-foreground">Only 6 hours left to book. The host will stop accepting bookings for your dates soon.</div>
            </Card>

            {/* Current property itinerary card + Recently viewed */}
                      <Card className="mt-4 p-4 w-full max-w-sm">
              <div>
                <h4 className="font-semibold mb-3">Your Itinerary</h4>

                {/* Itinerary items (cart-like) */}
                {billedItems.length === 0 ? (
                  <div className="text-xs text-muted-foreground mb-4">No stays in your itinerary. Add properties below.</div>
                ) : (
                  <div className="space-y-3 mb-4">
                    {billedItems.map((it) => {
                      const p = it.refId ? SAMPLE_PROPERTIES.find((x) => x.id === it.refId) : undefined;
                      const imageSrc = p?.images?.[0] ?? "/placeholder.svg";
                      const title = it.title ?? p?.name ?? "Item";
                      const subtitle = it.type === "stay" ? (p ? `$${p.pricePerNight} / night` : `$${it.price}`) : `$${it.price}`;

                      return (
                        <div key={it.id} className="flex items-center justify-between border rounded p-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-16 h-12 overflow-hidden rounded-md">
                              <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="font-semibold">{title}</div>
                              <div className="text-xs text-muted-foreground">{subtitle}</div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            {it.type === "stay" ? (
                              <div className="px-4 py-1 text-sm">Qty: 1</div>
                            ) : (
                              <div className="flex items-center border rounded">
                                <button className="px-3 py-1 text-sm" onClick={() => changeBilledQty(it.id, -1)}>-</button>
                                <div className="px-4 py-1 text-sm">{it.qty}</div>
                                <button className="px-3 py-1 text-sm" onClick={() => changeBilledQty(it.id, 1)}>+</button>
                              </div>
                            )}
                            <Button size="xs" variant="ghost" onClick={() => removeBilledItem(it.id)}>Remove</Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* small drop zone to add properties by drag & drop */}
                <div className="mt-2 mb-3">
                  <div
                    onDrop={handleDropToItinerary}
                    onDragOver={handleDragOver}
                    className="h-12 border-2 border-dashed rounded flex items-center justify-center text-sm text-muted-foreground"
                  >
                    Drag properties here to add to itinerary
                  </div>
                </div>

                {/* total and checkout */}
                <div className="border-t pt-3 mt-3 mb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-muted-foreground">Total</div>
                    <div className="text-lg font-bold">${billedItems.reduce((s, it) => s + it.price * it.qty, 0).toFixed(2)}</div>
                  </div>
                  <Button className="w-full">Checkout</Button>
                </div>

                {/* total and checkout is above */}

              </div>
            </Card>

            {/* Floating AI assistant (Nova) will appear separately */}
          </aside>
        </div>
      </div>

      {/* Floating Nova assistant */}
      <div className="fixed bottom-6 right-6 w-80 bg-white border rounded p-3 shadow-lg z-50">
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold">Nova</div>
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${isAwake ? 'bg-green-500' : 'bg-gray-300'}`} />
            <button
              aria-label="Toggle mic"
              className={`px-2 py-1 text-sm rounded ${isListening ? 'bg-red-100' : 'bg-gray-100'}`}
              onClick={() => {
                if (isListening) stopListening(); else startListening();
              }}
            >
              {isListening ? 'Listening...' : 'Mic'}
            </button>
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

        <textarea id="nova-prompt" className="w-full border rounded p-2 text-sm" rows={3} placeholder="Type a request, e.g. 'Remove the spa'" />
        <div className="mt-2 flex justify-between">
          <button className="text-xs text-muted-foreground" onClick={() => { const t = (document.getElementById('nova-prompt') as HTMLTextAreaElement).value; if (t.trim()) { setNovaMessages(prev => [...prev, { from: 'user', text: t }]); handleTranscript(t, 'text'); (document.getElementById('nova-prompt') as HTMLTextAreaElement).value = ''; } }}>Send</button>
          <div className="text-xs text-muted-foreground">Voice & AI assistant</div>
        </div>
      </div>

    </div>
  );
}
