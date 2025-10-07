import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Play,
  Video,
  Users,
  MapPin,
  Star,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  ShoppingBag,
  Calendar,
  Clock,
  DollarSign,
  Heart,
  Share2,
  Camera,
  Utensils,
  TreePine,
  Building2,
  Waves,
  Mountain,
  Ticket,
  ShoppingCart,
  Eye,
  Phone,
  MessageCircle,
  Shield,
  Award,
  Zap,
  Radio,
  Route,
  Plane,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import RouteMap from "./RouteMap";

interface Accommodation {
  id: string;
  name: string;
  type: string;
  rating: number;
  price: number;
  images: string[];
  videoUrl: string;
  amenities: string[];
  nearbyAttractions: string[];
  description: string;
  isLiveStreamAvailable: boolean;
  liveStreamViewers?: number;
}

interface Experience {
  id: string;
  name: string;
  category: string;
  duration: string;
  startDate?: string;
  price: number;
  rating: number;
  description: string;
  image: string;
  isLiveDemo: boolean;
  liveViewers?: number;
  highlights: string[];
}

interface Service {
  id: string;
  name: string;
  provider: string;
  price: number;
  description: string;
  features: string[];
  rating: number;
  isAvailable: boolean;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  image: string;
  description: string;
  isLiveSale: boolean;
  liveViewers?: number;
  inStock: number;
}

export default function TripDetails() {
  const { planId } = useParams();
  const [selectedTab, setSelectedTab] = useState("full");
  const [selectedAccommodation, setSelectedAccommodation] = useState<
    string | null
  >(null);

  // Track kept quantities for itinerary items (keyed by item id)
  const [keptItems, setKeptItems] = useState<Record<string, number>>({});

  const changeKeptQty = (id: string, delta: number) => {
    setKeptItems((prev) => {
      const cur = prev[id] ?? 1;
      const next = Math.max(0, cur + delta);
      return { ...prev, [id]: next };
    });
  };

  // Track items currently in the itinerary (by category)
  const [itinerary, setItinerary] = useState<{
    flights: string[];
    stays: string[];
    experiences: string[];
    products: string[];
  }>({
    flights: [],
    stays: ["villa-1"],
    experiences: ["exp-1"],
    products: ["prod-1"],
  });

  const [peopleCounts, setPeopleCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    // initialize people count for flights in this page
    setPeopleCounts(Object.fromEntries(flights.map((f: any) => [f.id, 1])));
  }, []);

  const changePeople = (id: string, delta: number) => {
    setPeopleCounts((prev) => {
      const cur = prev[id] ?? 1;
      let next = cur + delta;

      // If this id belongs to an experience, allow zero (removes from itinerary)
      const isExperience = experiences.some((e) => e.id === id);
      if (isExperience) {
        next = Math.max(0, next);
        // schedule itinerary update outside of state setter using timeout to avoid nested state updates
        setTimeout(() => {
          if (next > 0 && !itinerary.experiences.includes(id)) addToItinerary("experiences", id);
          if (next === 0 && itinerary.experiences.includes(id)) removeFromItinerary("experiences", id);
        }, 0);
      } else {
        // For non-experience items (e.g., flights) keep minimum 1
        next = Math.max(1, next);
      }

      return { ...prev, [id]: next };
    });
  };

  const addToItinerary = (category: keyof typeof itinerary, id: string) => {
    setItinerary((prev) => ({
      ...prev,
      [category]: Array.from(new Set([...(prev[category] as string[]), id])),
    }));
  };

  const removeFromItinerary = (
    category: keyof typeof itinerary,
    id: string,
  ) => {
    setItinerary((prev) => ({
      ...prev,
      [category]: (prev[category] as string[]).filter((i) => i !== id),
    }));
  };

  const replaceInItinerary = (
    category: keyof typeof itinerary,
    oldId: string,
    newId: string,
  ) => {
    setItinerary((prev) => ({
      ...prev,
      [category]: (prev[category] as string[]).map((i) =>
        i === oldId ? newId : i,
      ),
    }));
  };

  // Sample data
  const accommodations: Accommodation[] = [
    {
      id: "villa-1",
      name: "Luxurious Beachfront Villa",
      type: "Private Villa",
      rating: 4.9,
      price: 450,
      images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      videoUrl: "/placeholder.svg",
      amenities: [
        "Private Pool",
        "Ocean View",
        "WiFi",
        "Kitchen",
        "Parking",
        "AC",
      ],
      nearbyAttractions: [
        "Kuta Beach (2km)",
        "Waterbom Bali (3km)",
        "Beachwalk Mall (1.5km)",
        "Sunset Point (500m)",
      ],
      description:
        "Stunning beachfront villa with panoramic ocean views, private pool, and direct beach access.",
      isLiveStreamAvailable: true,
      liveStreamViewers: 23,
    },
    {
      id: "resort-1",
      name: "Royal Paradise Resort & Spa",
      type: "5-Star Resort",
      rating: 4.7,
      price: 320,
      images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      videoUrl: "/placeholder.svg",
      amenities: [
        "Spa",
        "Multiple Pools",
        "Restaurant",
        "Beach Access",
        "Gym",
        "WiFi",
      ],
      nearbyAttractions: [
        "Uluwatu Temple (15km)",
        "Padang Padang Beach (5km)",
        "Blue Point Beach (3km)",
      ],
      description:
        "Luxury resort offering world-class spa treatments and multiple dining options.",
      isLiveStreamAvailable: true,
      liveStreamViewers: 45,
    },
  ];

  const experiences: Experience[] = [
    {
      id: "exp-1",
      name: "Sunrise Mount Batur Hiking",
      category: "Adventure",
      duration: "6 hours",
      startDate: "2025-05-11T04:30:00",
      price: 85,
      rating: 4.8,
      description:
        "Witness breathtaking sunrise from the active volcano peak with professional guide.",
      address: "Kintamani, Bali",
      image: "/placeholder.svg",
      isLiveDemo: true,
      liveViewers: 156,
      highlights: [
        "Professional Guide",
        "Breakfast Included",
        "Hotel Pickup",
        "Safety Equipment",
      ],
    },
    {
      id: "exp-2",
      name: "Traditional Balinese Cooking Class",
      category: "Culture",
      duration: "4 hours",
      startDate: "2025-05-12T10:00:00",
      price: 65,
      rating: 4.9,
      description:
        "Learn authentic Balinese recipes in a traditional village setting.",
      address: "Ubud Village, Bali",
      image: "/placeholder.svg",
      isLiveDemo: true,
      liveViewers: 89,
      highlights: [
        "Market Tour",
        "Recipe Book",
        "Lunch Included",
        "Certificate",
      ],
    },
    {
      id: "exp-3",
      name: "White Water Rafting Adventure",
      category: "Adventure",
      duration: "5 hours",
      startDate: "2025-05-13T08:30:00",
      price: 45,
      rating: 4.6,
      description:
        "Thrilling rafting experience through tropical rainforest and rice terraces.",
      address: "Ayung River, Ubud",
      image: "/placeholder.svg",
      isLiveDemo: false,
      highlights: ["Safety Briefing", "Equipment Included", "Lunch", "Photos"],
    },
  ];

  // Events are spectator items (tickets) — different from experiences
  const events: { id: string; name: string; date: string; venue: string; price: number; rating?: number; image?: string; description?: string }[] = [
    { id: 'evt-1', name: 'Ubud Cultural Dance Night', date: '2025-05-12T19:00', venue: 'Ubud Palace', price: 25, rating: 4.7, image: '/placeholder.svg', description: 'Traditional Balinese dance performance with live gamelan orchestra.' },
    { id: 'evt-2', name: 'Sanur Beach Music Festival', date: '2025-05-14T18:00', venue: 'Sanur Beach', price: 40, rating: 4.6, image: '/placeholder.svg', description: 'Local and international bands performing by the beach.' },
  ];

  // Ensure there is a people count entry for each experience (default 0 if not included, 1 if included)
  // Run once on mount to initialize counts for experiences without causing re-render loops.
  useEffect(() => {
    setPeopleCounts((prev) => {
      const next: Record<string, number> = { ...prev };
      let changed = false;
      experiences.forEach((e) => {
        if (next[e.id] == null) {
          next[e.id] = itinerary.experiences.includes(e.id) ? 1 : 0;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const services: Service[] = [
    {
      id: "transfer-1",
      name: "Private Airport Transfer",
      provider: "Bali Premium Transport",
      price: 25,
      description:
        "Comfortable private car transfer from/to airport with English-speaking driver.",
      features: ["Meet & Greet", "Free Waiting", "Child Seats", "24/7 Service"],
      rating: 4.8,
      isAvailable: true,
    },
    {
      id: "guide-1",
      name: "Personal Tour Guide",
      provider: "Bali Cultural Tours",
      price: 150,
      description:
        "Professional local guide for full-day cultural and historical exploration.",
      features: [
        "English Speaking",
        "Cultural Expert",
        "Photography",
        "Flexible Itinerary",
      ],
      rating: 4.9,
      isAvailable: true,
    },
    {
      id: "spa-1",
      name: "In-Villa Spa Treatment",
      provider: "Bali Wellness Spa",
      price: 180,
      description:
        "Relaxing spa treatments in the comfort of your accommodation.",
      features: [
        "Certified Therapists",
        "Organic Products",
        "Custom Treatments",
        "All Equipment",
      ],
      rating: 4.7,
      isAvailable: true,
    },
  ];

  const flights = [
    {
      id: "flight-1",
      airline: "Air Bali",
      flightNumber: "AB123",
      from: "NYC",
      to: "DPS",
      depart: "2025-05-10 08:00",
      arrive: "2025-05-10 22:00",
      duration: "14h",
      price: 899,
      class: "Economy",
    },
    {
      id: "flight-2",
      airline: "Sky Indonesia",
      flightNumber: "SI456",
      from: "DPS",
      to: "SUB",
      depart: "2025-05-15 09:00",
      arrive: "2025-05-15 10:30",
      duration: "1h 30m",
      price: 120,
      class: "Economy",
    },
  ];

  const products: Product[] = [
    {
      id: "prod-1",
      name: "Premium Travel Backpack",
      category: "Luggage",
      price: 89,
      originalPrice: 129,
      rating: 4.5,
      image: "/placeholder.svg",
      description:
        "Waterproof 40L travel backpack with multiple compartments and laptop sleeve.",
      isLiveSale: true,
      liveViewers: 234,
      inStock: 12,
    },
    {
      id: "prod-2",
      name: "Underwater Camera",
      category: "Electronics",
      price: 159,
      originalPrice: 199,
      rating: 4.7,
      image: "/placeholder.svg",
      description:
        "4K waterproof action camera perfect for underwater adventures.",
      isLiveSale: true,
      liveViewers: 178,
      inStock: 8,
    },
    {
      id: "prod-3",
      name: "Travel First Aid Kit",
      category: "Health & Safety",
      price: 35,
      rating: 4.6,
      image: "/placeholder.svg",
      description:
        "Comprehensive medical kit for international travel with essential medications.",
      isLiveSale: false,
      inStock: 25,
    },
    {
      id: "prod-4",
      name: "Portable Phone Charger",
      category: "Electronics",
      price: 45,
      originalPrice: 65,
      rating: 4.4,
      image: "/placeholder.svg",
      description: "20000mAh power bank with fast charging and multiple ports.",
      isLiveSale: true,
      liveViewers: 91,
      inStock: 15,
    },
  ];

  const requestLiveStream = (accommodationId: string) => {
    alert(
      `Live stream request sent for ${accommodations.find((a) => a.id === accommodationId)?.name}. You'll be notified when the stream starts!`,
    );
  };

  const renderAccommodationCard = (accommodation: Accommodation) => {
    const included = itinerary.stays.includes(accommodation.id);
    const discount = accommodation.originalPrice ? Math.round(((accommodation.originalPrice - accommodation.price) / accommodation.originalPrice) * 100) : 0;

    return (
      <Card key={accommodation.id} className="overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative">
            <div className="aspect-video relative bg-muted">
              <img src={accommodation.images[0]} alt={accommodation.name} className="w-full h-full object-cover" />

              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Button size="lg" className="bg-white/90 text-black hover:bg-white">
                  <Play className="h-5 w-5 mr-2" />
                  Watch Walkthrough
                </Button>
              </div>

              {accommodation.isLiveStreamAvailable && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-red-500 hover:bg-red-600">
                    <Radio className="h-3 w-3 mr-1" />
                    LIVE • {accommodation.liveStreamViewers}
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex space-x-2 p-4">
              {accommodation.images.slice(1, 4).map((image, index) => (
                <div key={index} className="w-16 h-16 rounded-lg overflow-hidden">
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-xs font-medium">+12 more</div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold mb-1">{accommodation.name}</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{accommodation.type}</Badge>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{accommodation.rating}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold">
                  ${accommodation.price}{accommodation.originalPrice ? (<span className="text-sm text-muted-foreground line-through ml-2">${accommodation.originalPrice}</span>) : null}
                </div>
                <div className="text-sm text-muted-foreground">per night</div>
                {accommodation.originalPrice && <div className="text-sm text-red-600 font-semibold">{discount}% OFF</div>}
              </div>
            </div>

            <p className="text-muted-foreground mb-4">{accommodation.description}</p>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Amenities</h4>
              <div className="flex flex-wrap gap-2">
                {accommodation.amenities.map((amenity, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">{amenity}</Badge>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2 flex items-center"><MapPin className="h-4 w-4 mr-1" />Nearby Attractions</h4>
              <div className="space-y-1">
                {accommodation.nearbyAttractions.map((attraction, index) => (
                  <div key={index} className="text-sm text-muted-foreground">• {attraction}</div>
                ))}
              </div>
            </div>

            <div className="flex space-x-3 items-start">
              <div>
                <Button
                  size="sm"
                  className={included ? "bg-green-100 text-green-800" : ""}
                  onClick={() => {
                    if (included) removeFromItinerary("stays", accommodation.id);
                    else addToItinerary("stays", accommodation.id);
                  }}
                >
                  {included ? "Added" : "Add"}
                </Button>
              </div>

              <Button onClick={() => requestLiveStream(accommodation.id)} className="flex-1 bg-travel-blue hover:bg-travel-blue/90">
                <Video className="h-4 w-4 mr-2" />
                Request Live Tour
              </Button>

              <Link to={`/property/${accommodation.id}`} className="flex-1" state={{ fromItinerary: true, replacePropertyId: accommodations[0].id, planId }}>
                <Button variant="outline" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              to="/ai-planner"
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Plans</span>
            </Link>
            <div className="h-6 w-px bg-border"></div>
            <span className="text-xl font-bold bg-gradient-to-r from-travel-blue to-travel-purple bg-clip-text text-transparent">
              Classic Bali Experience
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Heart className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Trip Overview */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Badge className="bg-travel-blue/10 text-travel-blue border-travel-blue/20">
              ⭐ Standard Package
            </Badge>
            <Badge variant="secondary">7 Days, 6 Nights</Badge>
            <Badge variant="secondary">$1,599 per person</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Classic Bali Experience
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Immerse yourself in the beauty and culture of Bali with luxury
            accommodations, authentic experiences, and unforgettable adventures.
          </p>
        </div>

        {/* Navigation Tabs */}
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="full" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Full Itinerary</span>
            </TabsTrigger>
            <TabsTrigger
              value="flights"
              className="flex items-center space-x-2"
            >
              <Plane className="h-4 w-4" />
              <span>Flights</span>
            </TabsTrigger>
            <TabsTrigger value="stays" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>Stays</span>
            </TabsTrigger>
            <TabsTrigger
              value="experiences"
              className="flex items-center space-x-2"
            >
              <Mountain className="h-4 w-4" />
              <span>Experiences</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center space-x-2">
              <Ticket className="h-4 w-4" />
              <span>Events</span>
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="flex items-center space-x-2"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Products</span>
            </TabsTrigger>
          </TabsList>

          {/* Full Itinerary Tab */}
          <TabsContent value="full" className="mt-6">
            <RouteMap showHeader={false} />
          </TabsContent>

          {/* Flights Tab */}
          <TabsContent value="flights" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Your Flights</h2>
                <Badge variant="secondary">
                  {itinerary.flights.length} Selected
                </Badge>
              </div>

              <div className="grid gap-4">
                {flights.map((f) => (
                  <Card key={f.id} className="p-4">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Left times column */}
                      <div className="col-span-3 text-center">
                        <div className="text-xl font-bold">
                          {f.departureTime}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {f.from}
                        </div>
                      </div>

                      {/* Middle details */}
                      <div className="col-span-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-semibold text-lg">
                              {f.airline} • {f.flightNumber}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {f.aircraft} • {f.class} ��{" "}
                              {f.stops === 0 ? "Direct" : `${f.stops} stop(s)`}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-red-500 text-white">
                              {f.discount ? `${f.discount}% OFF` : ""}
                            </Badge>
                            <div className="flex items-center justify-end mt-2">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                              <span className="text-sm">{f.rating}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>{f.duration}</span>
                          </div>
                          <div className="px-2 py-1 border rounded text-xs">
                            {f.class}
                          </div>
                          <div className="text-xs">
                            {f.amenities?.length ?? 0} amenities
                          </div>
                        </div>

                        <div className="mt-4 flex items-center space-x-3">
                          <Link to={`/flight/${f.id}`}>
                            <Button variant="outline" className="w-36">
                              View Details
                            </Button>
                          </Link>
                          <Button className="bg-travel-blue text-white w-36">
                            Book Now
                          </Button>
                        </div>
                      </div>

                      {/* Right price & controls */}
                      <div className="col-span-3 flex flex-col items-end justify-center space-y-2">
                        <div className="flex items-center space-x-2">
                          {itinerary.flights.includes(f.id) && (
                            <>
                              <div className="flex items-center space-x-2 mr-2">
                                <button
                                  className="px-3 py-1 border rounded text-sm"
                                  aria-label="decrease"
                                  onClick={() => changePeople(f.id, -1)}
                                >
                                  -
                                </button>
                                <div className="px-3 py-1 text-sm leading-5">
                                  {peopleCounts[f.id] ?? 1}
                                </div>
                                <button
                                  className="px-3 py-1 border rounded text-sm"
                                  aria-label="increase"
                                  onClick={() => changePeople(f.id, 1)}
                                >
                                  +
                                </button>
                              </div>
                            </>
                          )}

                          <div className="text-2xl font-bold">${f.price}</div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          per person
                        </div>

                        <div>
                          <Link to={`/replace-options/${f.id}`}>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="p-1 h-8 w-8"
                            >
                              <Zap className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

            </div>
          </TabsContent>

          {/* Accommodations Tab */}
          <TabsContent value="stays" className="mt-6">
            <div className="space-y-8">
              {/* Your Accommodations - only show stays included in itinerary */}
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Your Accommodations</h2>
                  <Badge variant="secondary">{itinerary.stays.length} Properties Selected</Badge>
                </div>

                <div className="mt-4">
                  {accommodations.filter((a) => itinerary.stays.includes(a.id)).length === 0 ? (
                    <div className="text-sm text-muted-foreground">No accommodations included in your itinerary.</div>
                  ) : (
                    <div className="grid gap-6">
                      {accommodations.filter((a) => itinerary.stays.includes(a.id)).map(renderAccommodationCard)}
                    </div>
                  )}
                </div>
              </div>

              {/* All Properties - other options for the user */}
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">All Properties</h2>
                  <Badge variant="secondary">{accommodations.length} Properties</Badge>
                </div>

                <div className="mt-4 grid gap-6">
                  {accommodations.filter((a) => !itinerary.stays.includes(a.id)).map(renderAccommodationCard)}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Experiences Tab */}
          <TabsContent value="experiences" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Your Experiences</h2>
                <Badge variant="secondary">{itinerary.experiences.length} Selected</Badge>
              </div>

              {/* Your Experiences - only show experiences included in itinerary */}
              <div>
                {experiences.filter((e) => itinerary.experiences.includes(e.id)).length === 0 ? (
                  <div className="text-sm text-muted-foreground">No experiences included in your itinerary.</div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {experiences
                      .filter((e) => itinerary.experiences.includes(e.id))
                      .map((experience) => (
                        <Card key={experience.id} className="overflow-hidden">
                          <div className="relative">
                            <div className="aspect-video relative">
                              <img
                                src={experience.image}
                                alt={experience.name}
                                className="w-full h-full object-cover"
                              />
                              {experience.isLiveDemo && (
                                <div className="absolute top-4 left-4">
                                  <Badge className="bg-red-500 hover:bg-red-600">
                                    <Radio className="h-3 w-3 mr-1" />
                                    LIVE DEMO • {experience.liveViewers}
                                  </Badge>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <Button
                                  size="sm"
                                  className="bg-white/90 text-black hover:bg-white"
                                >
                                  <Play className="h-4 w-4 mr-2" />
                                  {experience.isLiveDemo ? "Join Live Demo" : "Watch Preview"}
                                </Button>
                              </div>
                            </div>
                          </div>

                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-1">
                              <Badge variant="outline">{experience.category}</Badge>
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm">{experience.rating}</span>
                              </div>
                            </div>

                            <div className="mb-3">
                              <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold mb-1">{experience.name}</h3>
                            </div>

                              <div className="text-sm text-muted-foreground mb-2">{experience.address}</div>
                              <p className="text-base text-muted-foreground mb-3">{experience.description}</p>
                            </div>

                            <div className="mb-4 text-xs text-muted-foreground">
                              {experience.highlights.slice(0, 2).join(' • ')}
                            </div>

                            <div className="flex items-center justify-between mb-3">
                              <div className="text-sm text-muted-foreground flex items-center space-x-2">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{new Date(experience.startDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span className="whitespace-nowrap">{new Date(experience.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                                </div>
                              </div>

                              <div className="flex items-center w-full justify-between">
                                <div className="flex items-center border rounded overflow-hidden text-xs ml-2 space-x-1">
                                  <button className="px-1 py-0.5" aria-label="decrease" onClick={() => changePeople(experience.id, -1)}>-</button>
                                  <div className="px-2 py-0.5">{peopleCounts[experience.id] ?? 1}</div>
                                  <button className="px-1 py-0.5" aria-label="increase" onClick={() => changePeople(experience.id, 1)}>+</button>
                                </div>

                                <div className="text-right">
                                  <div className="text-lg font-bold">{`$${experience.price * (peopleCounts[experience.id] ?? 1)}`}</div>
                                </div>
                              </div>
                            </div>

                            <Button className="w-full" size="sm">{experience.isLiveDemo ? "Join Live Demo" : "Book Experience"}</Button>


                            <div className="mt-3">
                              <Link to={`/experience/${experience.id}`}>
                                <Button variant="outline" className="w-full py-3">View Details</Button>
                              </Link>
                            </div>

                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </div>

              {/* More Experiences - show experiences not in itinerary */}
              <div>
                <div className="flex items-center justify-between mt-6">
                  <h2 className="text-2xl font-bold">More Experiences</h2>
                  <Badge variant="secondary">{experiences.filter((e) => !itinerary.experiences.includes(e.id)).length} Options</Badge>
                </div>

                <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {experiences
                    .filter((e) => !itinerary.experiences.includes(e.id))
                    .map((experience) => (
                      <Card key={experience.id} className="overflow-hidden">
                        <div className="relative">
                          <div className="aspect-video relative">
                            <img src={experience.image} alt={experience.name} className="w-full h-full object-cover" />
                            {experience.isLiveDemo && (
                              <div className="absolute top-4 left-4">
                                <Badge className="bg-red-500 hover:bg-red-600">
                                  <Radio className="h-3 w-3 mr-1" />
                                  LIVE DEMO • {experience.liveViewers}
                                </Badge>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <Button size="sm" className="bg-white/90 text-black hover:bg-white">
                                <Play className="h-4 w-4 mr-2" />
                                {experience.isLiveDemo ? "Join Live Demo" : "Watch Preview"}
                              </Button>
                            </div>
                          </div>
                        </div>

                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-1">
                            <Badge variant="outline">{experience.category}</Badge>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{experience.rating}</span>
                            </div>
                          </div>

                          <div className="mb-3">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold mb-1">{experience.name}</h3>
                            </div>
                            <div className="text-sm text-muted-foreground mb-2">{experience.address}</div>
                            <p className="text-base text-muted-foreground mb-3">{experience.description}</p>
                          </div>

                          <div className="mb-4 text-xs text-muted-foreground">
                            {experience.highlights.slice(0, 2).join(' • ')}
                          </div>

                          <div className="flex items-center justify-between mb-3">
                            <div className="text-sm text-muted-foreground flex items-center space-x-2">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{new Date(experience.startDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span className="whitespace-nowrap">{new Date(experience.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                                </div>
                              </div>

                            <div className="flex items-center w-full justify-between">
                              {itinerary.experiences.includes(experience.id) ? (
                                <>
                                  <div className="flex items-center border rounded overflow-hidden text-xs ml-2 space-x-1">
                                    <button className="px-1 py-0.5" aria-label="decrease" onClick={() => changePeople(experience.id, -1)}>-</button>
                                    <div className="px-2 py-0.5">{peopleCounts[experience.id] ?? 1}</div>
                                    <button className="px-1 py-0.5" aria-label="increase" onClick={() => changePeople(experience.id, 1)}>+</button>
                                  </div>

                                  <div className="text-right">
                                    <div className="text-lg font-bold">{`$${experience.price * (peopleCounts[experience.id] ?? 1)}`}</div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div>
                                    <Button size="sm" onClick={() => { setPeopleCounts(prev => ({ ...prev, [experience.id]: 1 })); addToItinerary("experiences", experience.id); }}>Add</Button>
                                  </div>

                                  <div className="text-right">
                                    <div className="text-lg font-bold">{`$${experience.price * (peopleCounts[experience.id] ?? 1)}`}</div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>


                          <Button className="w-full" size="sm">{experience.isLiveDemo ? "Join Live Demo" : "Book Experience"}</Button>


                          <div className="mt-3">
                            <Link to={`/experience/${experience.id}`}>
                              <Button variant="outline" className="w-full py-3">View Details</Button>
                            </Link>
                          </div>

                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Events</h2>
                <Badge variant="secondary">{events.length} Events</Badge>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((ev) => (
                  <Card key={ev.id} className="overflow-hidden">
                    <div className="relative">
                      <div className="aspect-video relative">
                        <img src={ev.image} alt={ev.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Button size="sm" className="bg-white/90 text-black hover:bg-white">
                            <Play className="h-4 w-4 mr-2" />
                            Watch Preview
                          </Button>
                        </div>
                      </div>
                    </div>

                    <CardContent>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                          <div className="font-semibold">{ev.name}</div>
                          <div className="text-xs text-muted-foreground flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(ev.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span className="whitespace-nowrap">{new Date(ev.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">• {ev.venue}</div>
                          </div>
                        </div>

                        <div className="text-lg font-bold ml-4">${ev.price}</div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">{ev.description}</p>

                      <div className="flex items-center space-x-3">
                        <Button className="w-36" onClick={() => { addBillItem({ id: `evt-${ev.id}`, type: 'service', refId: undefined, title: ev.name, price: ev.price, qty: 1 }); alert('Ticket added to your bill'); }}>
                          Buy Ticket
                        </Button>
                        <Link to={`/event/${ev.id}`}>
                          <Button variant="outline" size="sm">View Details</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Additional Services</h2>
                <Badge variant="secondary">
                  {services.length} Services Available
                </Badge>
              </div>

              <div className="grid gap-4">
                {services.map((service) => (
                  <Card key={service.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-bold">
                              {service.name}
                            </h3>
                            <Badge
                              variant={
                                service.isAvailable ? "default" : "secondary"
                              }
                            >
                              {service.isAvailable ? "Available" : "Booked"}
                            </Badge>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{service.rating}</span>
                            </div>
                          </div>

                          <p className="text-muted-foreground mb-3">
                            {service.description}
                          </p>
                          <p className="text-sm text-muted-foreground mb-3">
                            Provider: {service.provider}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {service.features.map((feature, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="text-right ml-6">
                          <div className="text-2xl font-bold mb-2">
                            ${service.price}
                          </div>
                          <div className="space-y-2">
                            <Button size="sm" disabled={!service.isAvailable}>
                              {service.isAvailable
                                ? "Book Service"
                                : "Unavailable"}
                            </Button>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Phone className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Travel Essentials & Gear</h2>
                <Badge variant="secondary">{products.length} Products</Badge>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="relative">
                      <div className="aspect-square relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        {product.isLiveSale && (
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-red-500 hover:bg-red-600 text-xs">
                              <Zap className="h-3 w-3 mr-1" />
                              LIVE SALE • {product.liveViewers}
                            </Badge>
                          </div>
                        )}
                        {product.originalPrice && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-travel-orange text-xs">
                              {Math.round(
                                ((product.originalPrice - product.price) /
                                  product.originalPrice) *
                                  100,
                              )}
                              % OFF
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <Badge variant="outline" className="text-xs mb-2">
                        {product.category}
                      </Badge>

                      <h3 className="font-bold mb-2 text-sm">{product.name}</h3>
                      <p className="text-xs text-muted-foreground mb-3">
                        {product.description}
                      </p>

                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{product.rating}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {product.inStock} in stock
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 mb-3">
                        {itinerary.products.includes(product.id) ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              removeFromItinerary("products", product.id)
                            }
                          >
                            Remove
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() =>
                              addToItinerary("products", product.id)
                            }
                          >
                            Add
                          </Button>
                        )}

                        <div className="text-lg font-bold">
                          ${product.price}
                        </div>
                        {product.originalPrice && (
                          <div className="text-sm text-muted-foreground line-through">
                            ${product.originalPrice}
                          </div>
                        )}

                        <Link to={`/product/${product.id}`}>
                          <Button size="sm" variant="ghost" className="p-1 h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>

                        <Link to={`/replace-options/${product.id}`}>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="p-1 h-8 w-8"
                          >
                            <Zap className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>

                      <div className="space-y-2">
                        <Button className="w-full" size="sm">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {product.isLiveSale
                            ? "Join Live Sale"
                            : "Add to Cart"}
                        </Button>
                        {product.isLiveSale && (
                          <Button
                            variant="outline"
                            className="w-full"
                            size="sm"
                          >
                            <Video className="h-4 w-4 mr-2" />
                            Watch Live Demo
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-40">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl font-bold">Total: $1,599</div>
              <div className="text-sm text-muted-foreground">per person</div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <Heart className="h-4 w-4 mr-2" />
                Save Trip
              </Button>
              <Button
                size="lg"
                className="bg-travel-blue hover:bg-travel-blue/90"
              >
                Book Complete Package
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
