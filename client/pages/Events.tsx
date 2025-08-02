import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import ServiceHeader from "@/components/ServiceHeader";
import {
  MapPin,
  Wallet,
  Plus,
  ArrowLeft,
  Ticket,
  Clock,
  Users,
  Star,
  DollarSign,
  Video,
  Radio,
  Eye,
  Heart,
  Calendar,
  Filter,
  Music,
  Trophy,
  PartyPopper,
} from "lucide-react";
import { Link } from "react-router-dom";

interface EventType {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface Event {
  id: string;
  title: string;
  organizer: string;
  location: string;
  venue: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  capacity: number;
  ticketsLeft: number;
  ageRestriction: string;
  highlights: string[];
  isLiveStream: boolean;
  liveViewers?: number;
  isDeal: boolean;
  featured: boolean;
}

export default function Events() {
  const [currentLocation, setCurrentLocation] = useState<string>(
    "Detecting location...",
  );
  const [walletBalance] = useState(1250.75);
  const [isSignedIn] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  const eventTypes: EventType[] = [
    {
      id: "concerts",
      name: "Concerts",
      icon: "🎵",
      description: "Live music performances",
    },
    {
      id: "festivals",
      name: "Festivals",
      icon: "🎪",
      description: "Cultural celebrations",
    },
    {
      id: "sports",
      name: "Sports",
      icon: "🏆",
      description: "Athletic competitions",
    },
    {
      id: "theater",
      name: "Theater",
      icon: "🎭",
      description: "Dramatic performances",
    },
    {
      id: "comedy",
      name: "Comedy",
      icon: "😂",
      description: "Stand-up and humor",
    },
    {
      id: "food",
      name: "Food Events",
      icon: "🍴",
      description: "Culinary experiences",
    },
    {
      id: "art",
      name: "Art Shows",
      icon: "🎨",
      description: "Exhibitions and galleries",
    },
    {
      id: "nightlife",
      name: "Nightlife",
      icon: "🌃",
      description: "Clubs and parties",
    },
    {
      id: "cultural",
      name: "Cultural",
      icon: "🏛️",
      description: "Traditional events",
    },
    {
      id: "seasonal",
      name: "Seasonal",
      icon: "🎄",
      description: "Holiday celebrations",
    },
    {
      id: "wellness",
      name: "Wellness",
      icon: "🧘",
      description: "Health and mindfulness",
    },
    {
      id: "business",
      name: "Business",
      icon: "💼",
      description: "Conferences and networking",
    },
  ];

  const sampleEvents: Event[] = [
    // Deal Events
    {
      id: "deal-1",
      title: "Bali Spirit Festival 2024",
      organizer: "BaliSpirit Events",
      location: "Ubud, Bali",
      venue: "Purnati Centre for the Arts",
      date: "March 28-31, 2024",
      time: "9:00 AM",
      duration: "4 days",
      price: 150,
      originalPrice: 220,
      discount: 32,
      rating: 4.8,
      reviews: 892,
      image: "/placeholder.svg",
      category: "Festivals",
      capacity: 2000,
      ticketsLeft: 156,
      ageRestriction: "All ages",
      highlights: [
        "Yoga workshops",
        "Live music",
        "Wellness talks",
        "Organic food",
      ],
      isLiveStream: false,
      isDeal: true,
      featured: true,
    },
    {
      id: "deal-2",
      title: "Oktoberfest Bali 2024",
      organizer: "German Club Bali",
      location: "Sanur, Bali",
      venue: "Bali Beach Resort",
      date: "October 12-14, 2024",
      time: "5:00 PM",
      duration: "3 days",
      price: 85,
      originalPrice: 120,
      discount: 29,
      rating: 4.6,
      reviews: 567,
      image: "/placeholder.svg",
      category: "Food Events",
      capacity: 1500,
      ticketsLeft: 234,
      ageRestriction: "18+",
      highlights: [
        "German beer",
        "Traditional music",
        "Authentic food",
        "Cultural shows",
      ],
      isLiveStream: false,
      isDeal: true,
      featured: false,
    },

    // Live Stream Events
    {
      id: "live-1",
      title: "Ed Sheeran Live in Bali",
      organizer: "Live Nation Asia",
      location: "Denpasar, Bali",
      venue: "GWK Cultural Park",
      date: "December 15, 2024",
      time: "8:00 PM",
      duration: "3 hours",
      price: 120,
      rating: 4.9,
      reviews: 2341,
      image: "/placeholder.svg",
      category: "Concerts",
      capacity: 15000,
      ticketsLeft: 1234,
      ageRestriction: "All ages",
      highlights: [
        "International artist",
        "State-of-art sound",
        "VIP packages",
        "Meet & greet",
      ],
      isLiveStream: true,
      liveViewers: 15600,
      isDeal: false,
      featured: true,
    },
    {
      id: "live-2",
      title: "Bali Food & Wine Festival",
      organizer: "Culinary Institute Bali",
      location: "Seminyak, Bali",
      venue: "Multiple venues",
      date: "November 8-10, 2024",
      time: "6:00 PM",
      duration: "3 days",
      price: 95,
      rating: 4.7,
      reviews: 445,
      image: "/placeholder.svg",
      category: "Food Events",
      capacity: 800,
      ticketsLeft: 67,
      ageRestriction: "21+",
      highlights: [
        "Celebrity chefs",
        "Wine tastings",
        "Cooking demos",
        "Gala dinner",
      ],
      isLiveStream: true,
      liveViewers: 890,
      isDeal: false,
      featured: false,
    },

    // Regular Events
    {
      id: "regular-1",
      title: "Traditional Balinese Dance Performance",
      organizer: "Ubud Cultural Centre",
      location: "Ubud, Bali",
      venue: "Saraswati Temple",
      date: "Every Saturday",
      time: "7:30 PM",
      duration: "2 hours",
      price: 25,
      rating: 4.5,
      reviews: 234,
      image: "/placeholder.svg",
      category: "Cultural",
      capacity: 200,
      ticketsLeft: 45,
      ageRestriction: "All ages",
      highlights: [
        "Traditional costumes",
        "Live gamelan",
        "Cultural storytelling",
        "Photo opportunities",
      ],
      isLiveStream: false,
      isDeal: false,
      featured: false,
    },
    {
      id: "regular-2",
      title: "Sunset Jazz at The Lawn",
      organizer: "Canggu Jazz Society",
      location: "Canggu, Bali",
      venue: "The Lawn Canggu",
      date: "Every Friday",
      time: "6:00 PM",
      duration: "4 hours",
      price: 35,
      rating: 4.4,
      reviews: 167,
      image: "/placeholder.svg",
      category: "Concerts",
      capacity: 300,
      ticketsLeft: 78,
      ageRestriction: "All ages",
      highlights: [
        "Ocean views",
        "Local musicians",
        "Cocktails",
        "Sunset timing",
      ],
      isLiveStream: false,
      isDeal: false,
      featured: false,
    },
  ];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation("Denpasar, Bali, Indonesia");
          setIsLoadingLocation(false);
          setEvents(sampleEvents);
        },
        (error) => {
          console.error("Error getting location:", error);
          setCurrentLocation("Location unavailable");
          setIsLoadingLocation(false);
          setEvents(sampleEvents);
        },
      );
    } else {
      setCurrentLocation("Geolocation not supported");
      setIsLoadingLocation(false);
      setEvents(sampleEvents);
    }
  }, []);

  const getDealEvents = () => events.filter((e) => e.isDeal);
  const getLiveStreamEvents = () => events.filter((e) => e.isLiveStream);
  const getRegularEvents = () =>
    events.filter((e) => !e.isDeal && !e.isLiveStream);

  const handleLocationSearch = (newLocation: string) => {
    setCurrentLocation(newLocation);
  };

  const handleLocationKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLocationSearch(currentLocation);
    }
  };

  const getTicketAvailability = (ticketsLeft: number, capacity: number) => {
    const percentage = (ticketsLeft / capacity) * 100;
    if (percentage > 50) return { color: "text-green-600", text: "Available" };
    if (percentage > 20)
      return { color: "text-yellow-600", text: "Selling Fast" };
    return { color: "text-red-600", text: "Almost Sold Out" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <ServiceHeader
        currentLocation={isLoadingLocation ? "Detecting..." : currentLocation}
        walletBalance={walletBalance}
        isSignedIn={isSignedIn}
        searchQuery={currentLocation}
        onSearchChange={(value) => {
          setCurrentLocation(value);
          handleLocationSearch(value);
        }}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Event Type Categories */}
        <section className="mb-12">
          <div className="flex overflow-x-auto space-x-6 pb-4">
            {eventTypes.map((type) => (
              <div
                key={type.id}
                className="flex flex-col items-center min-w-[80px] cursor-pointer hover:scale-105 transition-transform"
              >
                <div className="text-4xl mb-2">{type.icon}</div>
                <span className="text-sm font-medium text-center">
                  {type.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Amazing Event Deals */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              💰 Amazing Event Deals
            </h2>
            <Badge className="bg-red-100 text-red-700">Limited Time</Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {getDealEvents().map((event) => (
              <Card
                key={event.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <div className="aspect-video relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-red-500 text-white">
                        {event.discount}% OFF
                      </Badge>
                    </div>
                    {event.featured && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-yellow-500 text-white">
                          <Trophy className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline">{event.category}</Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{event.rating}</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {event.organizer}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {event.venue}, {event.location}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {event.date} at {event.time}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{event.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold">
                            ${event.price}
                          </span>
                          {event.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${event.originalPrice}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          per ticket
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-sm font-medium ${getTicketAvailability(event.ticketsLeft, event.capacity).color}`}
                      >
                        {
                          getTicketAvailability(
                            event.ticketsLeft,
                            event.capacity,
                          ).text
                        }
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {event.ticketsLeft} left
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button variant="outline" className="w-full" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button className="w-full" size="sm">
                      Buy Tickets
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Live Streaming Events */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              📹 Live Streaming Events
            </h2>
            <Badge className="bg-red-500 text-white animate-pulse">LIVE</Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {getLiveStreamEvents().map((event) => (
              <Card
                key={event.id}
                className="overflow-hidden hover:shadow-lg transition-shadow border-2 border-red-200"
              >
                <div className="relative">
                  <div className="aspect-video relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-red-500 text-white">
                        <Radio className="h-3 w-3 mr-1" />
                        LIVE • {event.liveViewers?.toLocaleString()}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        className="bg-white/90 text-black hover:bg-white"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Watch Live
                      </Button>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline">{event.category}</Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{event.rating}</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {event.organizer}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {event.venue}, {event.location}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {event.date} at {event.time}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold">${event.price}</span>
                      <span className="text-xs text-muted-foreground ml-1">
                        per ticket
                      </span>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-sm font-medium ${getTicketAvailability(event.ticketsLeft, event.capacity).color}`}
                      >
                        {
                          getTicketAvailability(
                            event.ticketsLeft,
                            event.capacity,
                          ).text
                        }
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {event.ticketsLeft} left
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      className="w-full bg-red-500 hover:bg-red-600"
                      size="sm"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Watch Live Preview
                    </Button>
                    <Button variant="outline" className="w-full" size="sm">
                      Buy Tickets
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* All Events */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">All Events</h2>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getRegularEvents().map((event) => (
              <Card
                key={event.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <div className="aspect-video relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{event.category}</Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{event.rating}</span>
                    </div>
                  </div>

                  <h3 className="font-bold mb-2 text-sm">{event.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {event.venue}
                  </p>

                  <div className="flex items-center space-x-2 mb-3">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs">{event.date}</span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="font-bold text-lg">${event.price}</span>
                      <span className="text-xs text-muted-foreground ml-1">
                        per ticket
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {event.ticketsLeft} left
                    </div>
                  </div>

                  <Button className="w-full" size="sm">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
