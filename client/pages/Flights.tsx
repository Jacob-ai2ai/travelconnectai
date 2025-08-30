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
  Plane,
  Clock,
  Users,
  Star,
  DollarSign,
  Video,
  Radio,
  Eye,
  Heart,
  ArrowRight,
  Calendar,
  Filter,
} from "lucide-react";
import { Link } from "react-router-dom";

interface FlightType {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  class: string;
  aircraft: string;
  stops: number;
  amenities: string[];
  isLiveDeal: boolean;
  liveViewers?: number;
  isDeal: boolean;
  rating: number;
  reviews: number;
}

export default function Flights() {
  const [currentLocation, setCurrentLocation] = useState<string>(
    "Detecting location...",
  );
  const [walletBalance] = useState(1250.75);
  const [isSignedIn] = useState(true);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  const flightTypes: FlightType[] = [
    {
      id: "economy",
      name: "Economy",
      icon: "💺",
      description: "Budget-friendly comfort",
    },
    {
      id: "premium",
      name: "Premium Economy",
      icon: "🛋️",
      description: "Extra space and comfort",
    },
    {
      id: "business",
      name: "Business",
      icon: "💼",
      description: "Premium service and lounges",
    },
    {
      id: "first",
      name: "First Class",
      icon: "👑",
      description: "Ultimate luxury experience",
    },
    {
      id: "direct",
      name: "Direct Flights",
      icon: "✈️",
      description: "Non-stop convenience",
    },
    {
      id: "connecting",
      name: "Connecting",
      icon: "🔄",
      description: "Budget with stops",
    },
    {
      id: "red-eye",
      name: "Red-eye",
      icon: "🌙",
      description: "Overnight savings",
    },
    {
      id: "last-minute",
      name: "Last Minute",
      icon: "⚡",
      description: "Quick departures",
    },
    {
      id: "multi-city",
      name: "Multi-city",
      icon: "🌍",
      description: "Multiple destinations",
    },
    {
      id: "group",
      name: "Group Bookings",
      icon: "👥",
      description: "10+ passengers",
    },
    {
      id: "charter",
      name: "Private Charter",
      icon: "🛩️",
      description: "Exclusive flights",
    },
    {
      id: "cargo",
      name: "Cargo Space",
      icon: "📦",
      description: "Extra luggage capacity",
    },
  ];

  const sampleFlights: Flight[] = [
    // Deal Flights
    {
      id: "deal-1",
      airline: "Garuda Indonesia",
      flightNumber: "GA 235",
      from: "Denpasar (DPS)",
      to: "Jakarta (CGK)",
      departureTime: "08:30",
      arrivalTime: "10:45",
      duration: "2h 15m",
      price: 120,
      originalPrice: 180,
      discount: 33,
      class: "Economy",
      aircraft: "Boeing 737",
      stops: 0,
      amenities: ["WiFi", "Meal", "Entertainment"],
      isLiveDeal: false,
      isDeal: true,
      rating: 4.6,
      reviews: 234,
    },
    {
      id: "deal-2",
      airline: "Singapore Airlines",
      flightNumber: "SQ 942",
      from: "Denpasar (DPS)",
      to: "Singapore (SIN)",
      departureTime: "14:20",
      arrivalTime: "17:05",
      duration: "2h 45m",
      price: 280,
      originalPrice: 400,
      discount: 30,
      class: "Business",
      aircraft: "Airbus A350",
      stops: 0,
      amenities: ["Lie-flat Seats", "Premium Dining", "Lounge Access", "WiFi"],
      isLiveDeal: false,
      isDeal: true,
      rating: 4.9,
      reviews: 567,
    },

    // Live Deal Flights
    {
      id: "live-1",
      airline: "Emirates",
      flightNumber: "EK 398",
      from: "Denpasar (DPS)",
      to: "Dubai (DXB)",
      departureTime: "23:45",
      arrivalTime: "05:30+1",
      duration: "7h 45m",
      price: 850,
      class: "First Class",
      aircraft: "Airbus A380",
      stops: 0,
      amenities: ["Private Suite", "Shower", "Bar", "Chauffeur"],
      isLiveDeal: true,
      liveViewers: 89,
      isDeal: false,
      rating: 4.8,
      reviews: 1203,
    },
    {
      id: "live-2",
      airline: "Cathay Pacific",
      flightNumber: "CX 780",
      from: "Denpasar (DPS)",
      to: "Hong Kong (HKG)",
      departureTime: "11:30",
      arrivalTime: "16:45",
      duration: "4h 15m",
      price: 380,
      class: "Business",
      aircraft: "Airbus A330",
      stops: 0,
      amenities: ["Lie-flat Seats", "Premium Dining", "WiFi", "Lounge"],
      isLiveDeal: true,
      liveViewers: 45,
      isDeal: false,
      rating: 4.7,
      reviews: 789,
    },

    // Regular Flights
    {
      id: "regular-1",
      airline: "AirAsia",
      flightNumber: "QZ 540",
      from: "Denpasar (DPS)",
      to: "Kuala Lumpur (KUL)",
      departureTime: "16:15",
      arrivalTime: "19:00",
      duration: "2h 45m",
      price: 95,
      class: "Economy",
      aircraft: "Airbus A320",
      stops: 0,
      amenities: ["WiFi", "Food Purchase"],
      isLiveDeal: false,
      isDeal: false,
      rating: 4.2,
      reviews: 456,
    },
    {
      id: "regular-2",
      airline: "Thai Airways",
      flightNumber: "TG 434",
      from: "Denpasar (DPS)",
      to: "Bangkok (BKK)",
      departureTime: "12:40",
      arrivalTime: "15:35",
      duration: "2h 55m",
      price: 165,
      class: "Economy",
      aircraft: "Boeing 787",
      stops: 0,
      amenities: ["Meal", "Entertainment", "USB Power"],
      isLiveDeal: false,
      isDeal: false,
      rating: 4.5,
      reviews: 678,
    },
  ];

  useEffect(() => {
    const fallback = (msg: string) => {
      setLocationError(msg);
      setCurrentLocation("Location unavailable");
      setIsLoadingLocation(false);
      setFlights(sampleFlights);
    };

    if (!("geolocation" in navigator)) {
      fallback(
        "Geolocation not supported in this browser. Using default location.",
      );
      return;
    }
    if (!window.isSecureContext) {
      fallback("Geolocation requires HTTPS. Using default location.");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyNavigator: any = navigator as any;
    if (anyNavigator.permissions && anyNavigator.permissions.query) {
      try {
        anyNavigator.permissions
          .query({ name: "geolocation" as PermissionName })
          .then((result: PermissionStatus) => {
            if (result.state === "denied") {
              fallback("Location permission denied. Using default location.");
            } else {
              navigator.geolocation.getCurrentPosition(
                () => {
                  setCurrentLocation("Denpasar, Bali, Indonesia");
                  setIsLoadingLocation(false);
                  setFlights(sampleFlights);
                },
                (error) => {
                  const codeMsg =
                    error.code === 1
                      ? "Permission denied"
                      : error.code === 2
                        ? "Position unavailable"
                        : error.code === 3
                          ? "Request timed out"
                          : "Unknown error";
                  console.warn("Geolocation error", {
                    code: error.code,
                    message: error.message,
                  });
                  fallback(`${codeMsg}. Using default location.`);
                },
                { timeout: 8000, maximumAge: 60000, enableHighAccuracy: false },
              );
            }
          });
        return;
      } catch {
        // continue
      }
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        setCurrentLocation("Denpasar, Bali, Indonesia");
        setIsLoadingLocation(false);
        setFlights(sampleFlights);
      },
      (error) => {
        const codeMsg =
          error.code === 1
            ? "Permission denied"
            : error.code === 2
              ? "Position unavailable"
              : error.code === 3
                ? "Request timed out"
                : "Unknown error";
        console.warn("Geolocation error", {
          code: error.code,
          message: error.message,
        });
        fallback(`${codeMsg}. Using default location.`);
      },
      { timeout: 8000, maximumAge: 60000, enableHighAccuracy: false },
    );
  }, []);

  const getDealFlights = () => flights.filter((f) => f.isDeal);
  const getLiveDealFlights = () => flights.filter((f) => f.isLiveDeal);
  const getRegularFlights = () =>
    flights.filter((f) => !f.isDeal && !f.isLiveDeal);

  const handleLocationSearch = (newLocation: string) => {
    setCurrentLocation(newLocation);
    // In a real app, this would fetch flights from the new location
  };

  const handleLocationKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLocationSearch(currentLocation);
    }
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
        {locationError && (
          <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
            {locationError}
          </div>
        )}
        {/* Flight Type Categories */}
        <section className="mb-12">
          <div className="flex overflow-x-auto space-x-6 pb-4">
            {flightTypes.map((type) => (
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

        {/* Amazing Flight Deals */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              💰 Amazing Flight Deals
            </h2>
            <Badge className="bg-red-100 text-red-700">Limited Time</Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {getDealFlights().map((flight) => (
              <Card
                key={flight.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-travel-blue/10 rounded-lg flex items-center justify-center">
                        <Plane className="h-6 w-6 text-travel-blue" />
                      </div>
                      <div>
                        <h3 className="font-bold">{flight.airline}</h3>
                        <p className="text-sm text-muted-foreground">
                          {flight.flightNumber} • {flight.aircraft}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-red-500 text-white mb-2">
                        {flight.discount}% OFF
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{flight.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-center">
                      <div className="font-semibold">
                        {flight.departureTime}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {flight.from}
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col items-center mx-4">
                      <div className="text-xs text-muted-foreground">
                        {flight.duration}
                      </div>
                      <div className="w-full h-px bg-border my-1 relative">
                        <Plane className="h-3 w-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background text-travel-blue" />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {flight.stops === 0 ? "Direct" : `${flight.stops} stop`}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">{flight.arrivalTime}</div>
                      <div className="text-sm text-muted-foreground">
                        {flight.to}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{flight.class}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {flight.amenities.length} amenities
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold">
                          ${flight.price}
                        </span>
                        {flight.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${flight.originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        per person
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button variant="outline" className="w-full" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button className="w-full" size="sm">
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Live Flight Deals */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              📹 Live Flight Deals
            </h2>
            <Badge className="bg-red-500 text-white animate-pulse">LIVE</Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {getLiveDealFlights().map((flight) => (
              <Card
                key={flight.id}
                className="overflow-hidden hover:shadow-lg transition-shadow border-2 border-red-200"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                        <Video className="h-6 w-6 text-red-500" />
                      </div>
                      <div>
                        <h3 className="font-bold">{flight.airline}</h3>
                        <p className="text-sm text-muted-foreground">
                          {flight.flightNumber} • {flight.aircraft}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-red-500 text-white mb-2">
                        <Radio className="h-3 w-3 mr-1" />
                        LIVE • {flight.liveViewers}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{flight.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-center">
                      <div className="font-semibold">
                        {flight.departureTime}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {flight.from}
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col items-center mx-4">
                      <div className="text-xs text-muted-foreground">
                        {flight.duration}
                      </div>
                      <div className="w-full h-px bg-border my-1 relative">
                        <Plane className="h-3 w-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background text-red-500" />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Direct
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">{flight.arrivalTime}</div>
                      <div className="text-sm text-muted-foreground">
                        {flight.to}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{flight.class}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {flight.amenities.length} amenities
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">${flight.price}</div>
                      <span className="text-xs text-muted-foreground">
                        per person
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      className="w-full bg-red-500 hover:bg-red-600"
                      size="sm"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Join Live Deal
                    </Button>
                    <Button variant="outline" className="w-full" size="sm">
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* All Flights */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">All Flights</h2>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          <div className="grid gap-4">
            {getRegularFlights().map((flight) => (
              <Card
                key={flight.id}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="font-semibold">
                          {flight.departureTime}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {flight.from}
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-xs text-muted-foreground">
                          {flight.duration}
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <div className="text-xs text-muted-foreground">
                          {flight.stops === 0
                            ? "Direct"
                            : `${flight.stops} stop`}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">
                          {flight.arrivalTime}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {flight.to}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="font-semibold">{flight.airline}</div>
                        <div className="text-sm text-muted-foreground">
                          {flight.flightNumber}
                        </div>
                      </div>
                      <Badge variant="outline">{flight.class}</Badge>
                      <div className="text-right">
                        <div className="text-xl font-bold">${flight.price}</div>
                        <div className="text-xs text-muted-foreground">
                          per person
                        </div>
                      </div>
                      <Button size="sm">Book</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
