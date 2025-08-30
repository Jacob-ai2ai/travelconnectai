import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import ServiceHeader from "@/components/ServiceHeader";
import {
  MapPin,
  Wallet,
  Plus,
  Search,
  Filter,
  Star,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  DollarSign,
  Video,
  Radio,
  Heart,
  Eye,
  Users,
  Bed,
  Home,
  Mountain,
  TreePine,
  Waves,
  Building2,
  Tent,
  Castle,
  Palmtree,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

interface PropertyType {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  emoji: string;
}

interface Property {
  id: string;
  name: string;
  type: string;
  location: string;
  distance: number;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  amenities: string[];
  isLiveStream: boolean;
  liveViewers?: number;
  isDeal: boolean;
  discount?: number;
  host: string;
  beds: number;
  baths: number;
}

export default function Stays() {
  const [currentLocation, setCurrentLocation] = useState<string>(
    "Detecting location...",
  );
  const [destination, setDestination] = useState("");
  const [walletBalance] = useState(1250.75);
  const [isSignedIn] = useState(true); // Simulate signed in user
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  const propertyTypes: PropertyType[] = [
    // Nature & Countryside Escapes
    {
      id: "cabin",
      name: "Cabins",
      category: "nature",
      icon: "🏕️",
      description: "Rustic and cozy, often in forests or mountains",
      emoji: "🌿",
    },
    {
      id: "cottage",
      name: "Cottages",
      category: "nature",
      icon: "🏡",
      description: "Charming, usually countryside or lakeside",
      emoji: "🌿",
    },
    {
      id: "chalet",
      name: "Chalets",
      category: "nature",
      icon: "🏔️",
      description: "Alpine-style home, typically near ski resorts",
      emoji: "🌿",
    },
    {
      id: "farmstay",
      name: "Farmstays",
      category: "nature",
      icon: "🚜",
      description: "On working farms; offers rural immersion",
      emoji: "🌿",
    },
    {
      id: "barn",
      name: "Barns",
      category: "nature",
      icon: "🏚️",
      description: "Modern homes built from old barns",
      emoji: "🌿",
    },

    // Coastal & Waterfront Homes
    {
      id: "beach-house",
      name: "Beach Houses",
      category: "coastal",
      icon: "🏖️",
      description: "Located right on or near the beach",
      emoji: "🌊",
    },
    {
      id: "lake-house",
      name: "Lakeside",
      category: "coastal",
      icon: "🏞️",
      description: "Next to lakes for fishing and peaceful views",
      emoji: "🌊",
    },
    {
      id: "boathouse",
      name: "Waterfront",
      category: "coastal",
      icon: "🛥️",
      description: "House on water; may include dock space",
      emoji: "🌊",
    },
    {
      id: "coastal-villa",
      name: "Coastal Villas",
      category: "coastal",
      icon: "🏖️",
      description: "Luxurious Mediterranean-style by the sea",
      emoji: "🌊",
    },

    // Urban & Luxury Getaways
    {
      id: "penthouse",
      name: "Penthouses",
      category: "urban",
      icon: "🏙️",
      description: "Top-floor apartments with city views",
      emoji: "🏙️",
    },
    {
      id: "loft",
      name: "Lofts",
      category: "urban",
      icon: "🏭",
      description: "Spacious urban apartment with industrial charm",
      emoji: "🏙️",
    },
    {
      id: "luxury-condo",
      name: "Luxury Condos",
      category: "urban",
      icon: "🏢",
      description: "High-end apartments in sought-after destinations",
      emoji: "🏙️",
    },
    {
      id: "townhouse",
      name: "Townhouses",
      category: "urban",
      icon: "🏘️",
      description: "Multi-level homes in cities or suburbs",
      emoji: "🏙️",
    },

    // Exotic & Experiential Stays
    {
      id: "villa",
      name: "Villas",
      category: "exotic",
      icon: "🏛️",
      description: "Private luxury home with pool/garden",
      emoji: "🏝️",
    },
    {
      id: "bungalow",
      name: "Bungalows",
      category: "exotic",
      icon: "🛖",
      description: "Single-story home, tropical or resort-style",
      emoji: "🏝️",
    },
    {
      id: "overwater",
      name: "Overwater",
      category: "exotic",
      icon: "🏘️",
      description: "Built on stilts over water",
      emoji: "🏝️",
    },
    {
      id: "riad",
      name: "Riads",
      category: "exotic",
      icon: "🕌",
      description: "Traditional Moroccan home with courtyards",
      emoji: "🏝️",
    },

    // Unique & Alternative Stays
    {
      id: "treehouse",
      name: "Treehouses",
      category: "unique",
      icon: "🌳",
      description: "Elevated homes in trees, boutique eco-style",
      emoji: "🏞️",
    },
    {
      id: "aframe",
      name: "A-Frames",
      category: "unique",
      icon: "⛺",
      description: "Triangular design, compact yet trendy",
      emoji: "🏞️",
    },
    {
      id: "yurt",
      name: "Yurts",
      category: "unique",
      icon: "⛺",
      description: "Circular tent-like structure for glamping",
      emoji: "🏞️",
    },
    {
      id: "tiny-house",
      name: "Tiny Houses",
      category: "unique",
      icon: "���",
      description: "Minimalist and mobile, often off-grid",
      emoji: "🏞️",
    },
    {
      id: "container",
      name: "Containers",
      category: "unique",
      icon: "��",
      description: "Built from shipping containers, modern",
      emoji: "🏞️",
    },
    {
      id: "dome",
      name: "Domes",
      category: "unique",
      icon: "🔮",
      description: "Geodesic architecture, eco-conscious",
      emoji: "🏞️",
    },

    // Desert & Remote Retreats
    {
      id: "earth-house",
      name: "Earth Houses",
      category: "desert",
      icon: "🏜️",
      description: "Built underground with natural materials",
      emoji: "🏜️",
    },
    {
      id: "adobe",
      name: "Adobe Homes",
      category: "desert",
      icon: "🧱",
      description: "Desert climates with traditional materials",
      emoji: "🏜️",
    },
    {
      id: "desert-villa",
      name: "Desert Villas",
      category: "desert",
      icon: "🏛️",
      description: "Open-plan with panoramic desert views",
      emoji: "🏜️",
    },
  ];

  const sampleProperties: Property[] = [
    // Deal Properties
    {
      id: "deal-1",
      name: "Ocean View Villa Seminyak",
      type: "villa",
      location: "Seminyak, Bali",
      distance: 2.5,
      price: 180,
      originalPrice: 250,
      rating: 4.8,
      reviews: 156,
      image: "/placeholder.svg",
      amenities: ["Private Pool", "Ocean View", "WiFi", "Kitchen"],
      isLiveStream: false,
      isDeal: true,
      discount: 28,
      host: "Made Sujana",
      beds: 3,
      baths: 2,
    },
    {
      id: "deal-2",
      name: "Cozy Mountain Cabin",
      type: "cabin",
      location: "Ubud, Bali",
      distance: 15.8,
      price: 85,
      originalPrice: 120,
      rating: 4.6,
      reviews: 234,
      image: "/placeholder.svg",
      amenities: ["Mountain View", "Fireplace", "Garden", "WiFi"],
      isLiveStream: false,
      isDeal: true,
      discount: 29,
      host: "Ubud Retreats",
      beds: 2,
      baths: 1,
    },
    {
      id: "deal-3",
      name: "Beachfront Bungalow",
      type: "bungalow",
      location: "Sanur, Bali",
      distance: 12.3,
      price: 125,
      originalPrice: 180,
      rating: 4.5,
      reviews: 92,
      image: "/placeholder.svg",
      amenities: ["Beach Access", "AC", "Mini Bar", "WiFi"],
      isLiveStream: false,
      isDeal: true,
      discount: 31,
      host: "Sanur Beach Resort",
      beds: 1,
      baths: 1,
    },

    // Live Stream Properties
    {
      id: "live-1",
      name: "Luxury Beachfront Penthouse",
      type: "penthouse",
      location: "Kuta, Bali",
      distance: 5.2,
      price: 320,
      rating: 4.9,
      reviews: 89,
      image: "/placeholder.svg",
      amenities: ["Beach Access", "Infinity Pool", "Gym", "Concierge"],
      isLiveStream: true,
      liveViewers: 47,
      isDeal: false,
      host: "Bali Luxury Stays",
      beds: 4,
      baths: 3,
    },
    {
      id: "live-2",
      name: "Traditional Balinese Cottage",
      type: "cottage",
      location: "Canggu, Bali",
      distance: 8.1,
      price: 140,
      rating: 4.7,
      reviews: 178,
      image: "/placeholder.svg",
      amenities: ["Rice Field View", "Traditional Decor", "Pool", "Kitchen"],
      isLiveStream: true,
      liveViewers: 23,
      isDeal: false,
      host: "Authentic Bali",
      beds: 2,
      baths: 2,
    },
    {
      id: "live-3",
      name: "Modern Loft Downtown",
      type: "loft",
      location: "Denpasar, Bali",
      distance: 1.2,
      price: 95,
      rating: 4.4,
      reviews: 67,
      image: "/placeholder.svg",
      amenities: ["City View", "Modern Design", "WiFi", "Workspace"],
      isLiveStream: true,
      liveViewers: 15,
      isDeal: false,
      host: "Urban Spaces",
      beds: 1,
      baths: 1,
    },

    // Regular Properties
    {
      id: "regular-1",
      name: "Peaceful Lakeside Retreat",
      type: "lake-house",
      location: "Bedugul, Bali",
      distance: 35.2,
      price: 110,
      rating: 4.6,
      reviews: 134,
      image: "/placeholder.svg",
      amenities: ["Lake View", "Boat Access", "Fireplace", "Garden"],
      isLiveStream: false,
      isDeal: false,
      host: "Mountain Lake Resort",
      beds: 2,
      baths: 2,
    },
    {
      id: "regular-2",
      name: "Eco-Friendly Treehouse",
      type: "treehouse",
      location: "Ubud, Bali",
      distance: 18.5,
      price: 165,
      rating: 4.8,
      reviews: 203,
      image: "/placeholder.svg",
      amenities: ["Tree Views", "Eco Design", "Solar Power", "Nature Sounds"],
      isLiveStream: false,
      isDeal: false,
      host: "Green Retreats",
      beds: 1,
      baths: 1,
    },
    {
      id: "regular-3",
      name: "Charming Farm Stay",
      type: "farmstay",
      location: "Jatiluwih, Bali",
      distance: 28.7,
      price: 75,
      rating: 4.3,
      reviews: 156,
      image: "/placeholder.svg",
      amenities: ["Farm Activities", "Organic Meals", "Rice Fields", "Animals"],
      isLiveStream: false,
      isDeal: false,
      host: "Bali Farm Experience",
      beds: 2,
      baths: 1,
    },
    {
      id: "regular-4",
      name: "Modern Tiny House",
      type: "tiny-house",
      location: "Tabanan, Bali",
      distance: 22.1,
      price: 65,
      rating: 4.2,
      reviews: 89,
      image: "/placeholder.svg",
      amenities: [
        "Compact Design",
        "Solar Power",
        "Kitchenette",
        "Outdoor Deck",
      ],
      isLiveStream: false,
      isDeal: false,
      host: "Tiny Living Bali",
      beds: 1,
      baths: 1,
    },
    {
      id: "regular-5",
      name: "Luxury Townhouse",
      type: "townhouse",
      location: "Nusa Dua, Bali",
      distance: 13.4,
      price: 220,
      rating: 4.7,
      reviews: 112,
      image: "/placeholder.svg",
      amenities: [
        "Golf Course View",
        "Private Terrace",
        "24/7 Security",
        "Pool Access",
      ],
      isLiveStream: false,
      isDeal: false,
      host: "Nusa Dua Residences",
      beds: 3,
      baths: 2,
    },
    {
      id: "regular-6",
      name: "Artistic Container Home",
      type: "container",
      location: "Pererenan, Bali",
      distance: 11.8,
      price: 95,
      rating: 4.5,
      reviews: 78,
      image: "/placeholder.svg",
      amenities: ["Unique Design", "Art Studio", "Garden", "WiFi"],
      isLiveStream: false,
      isDeal: false,
      host: "Container Living",
      beds: 1,
      baths: 1,
    },
    {
      id: "regular-7",
      name: "Geodesic Dome House",
      type: "dome",
      location: "Munduk, Bali",
      distance: 42.3,
      price: 135,
      rating: 4.6,
      reviews: 67,
      image: "/placeholder.svg",
      amenities: ["360° Views", "Eco Design", "Star Gazing", "Nature Trail"],
      isLiveStream: false,
      isDeal: false,
      host: "Dome Experiences",
      beds: 1,
      baths: 1,
    },
    {
      id: "regular-8",
      name: "Traditional Riad",
      type: "riad",
      location: "Mas, Bali",
      distance: 16.9,
      price: 155,
      rating: 4.8,
      reviews: 145,
      image: "/placeholder.svg",
      amenities: [
        "Courtyard",
        "Traditional Architecture",
        "Cultural Tours",
        "Spa",
      ],
      isLiveStream: false,
      isDeal: false,
      host: "Cultural Heritage Stays",
      beds: 2,
      baths: 2,
    },
    {
      id: "regular-9",
      name: "Cozy A-Frame Cabin",
      type: "aframe",
      location: "Munduk, Bali",
      distance: 39.7,
      price: 85,
      rating: 4.4,
      reviews: 93,
      image: "/placeholder.svg",
      amenities: [
        "Mountain Views",
        "Compact Design",
        "Fireplace",
        "Hiking Trails",
      ],
      isLiveStream: false,
      isDeal: false,
      host: "Mountain Cabins",
      beds: 1,
      baths: 1,
    },
    {
      id: "regular-10",
      name: "Waterfront Boathouse",
      type: "boathouse",
      location: "Amed, Bali",
      distance: 65.4,
      price: 175,
      rating: 4.9,
      reviews: 76,
      image: "/placeholder.svg",
      amenities: [
        "Direct Water Access",
        "Boat Included",
        "Snorkeling",
        "Sunset Views",
      ],
      isLiveStream: false,
      isDeal: false,
      host: "Seaside Adventures",
      beds: 2,
      baths: 1,
    },
  ];

  // Properties for different destinations
  const parisProperties: Property[] = [
    {
      id: "paris-1",
      name: "Luxury Penthouse Champs-Élys��es",
      type: "penthouse",
      location: "8th Arrondissement, Paris",
      distance: 0.5,
      price: 450,
      originalPrice: 600,
      rating: 4.9,
      reviews: 234,
      image: "/placeholder.svg",
      amenities: [
        "Eiffel Tower View",
        "Luxury Furnishing",
        "Concierge",
        "WiFi",
      ],
      isLiveStream: true,
      liveViewers: 89,
      isDeal: true,
      discount: 25,
      host: "Paris Luxury Stays",
      beds: 3,
      baths: 2,
    },
    {
      id: "paris-2",
      name: "Charming Montmartre Loft",
      type: "loft",
      location: "Montmartre, Paris",
      distance: 3.2,
      price: 180,
      rating: 4.6,
      reviews: 156,
      image: "/placeholder.svg",
      amenities: [
        "Artistic Quarter",
        "City Views",
        "Historic Building",
        "WiFi",
      ],
      isLiveStream: false,
      isDeal: false,
      host: "Bohemian Paris",
      beds: 2,
      baths: 1,
    },
  ];

  const tokyoProperties: Property[] = [
    {
      id: "tokyo-1",
      name: "Modern Shibuya Apartment",
      type: "luxury-condo",
      location: "Shibuya, Tokyo",
      distance: 1.1,
      price: 220,
      originalPrice: 300,
      rating: 4.7,
      reviews: 198,
      image: "/placeholder.svg",
      amenities: ["City Center", "Modern Design", "JR Access", "WiFi"],
      isLiveStream: true,
      liveViewers: 52,
      isDeal: true,
      discount: 27,
      host: "Tokyo Modern Living",
      beds: 2,
      baths: 1,
    },
    {
      id: "tokyo-2",
      name: "Traditional Ryokan Experience",
      type: "riad",
      location: "Asakusa, Tokyo",
      distance: 5.8,
      price: 160,
      rating: 4.8,
      reviews: 267,
      image: "/placeholder.svg",
      amenities: [
        "Traditional Design",
        "Tatami Rooms",
        "Tea Ceremony",
        "Garden",
      ],
      isLiveStream: false,
      isDeal: false,
      host: "Authentic Tokyo",
      beds: 1,
      baths: 1,
    },
  ];

  const newYorkProperties: Property[] = [
    {
      id: "ny-1",
      name: "Manhattan Skyline Penthouse",
      type: "penthouse",
      location: "Upper East Side, New York",
      distance: 2.3,
      price: 550,
      originalPrice: 750,
      rating: 4.9,
      reviews: 312,
      image: "/placeholder.svg",
      amenities: ["Central Park View", "24/7 Doorman", "Rooftop Access", "Gym"],
      isLiveStream: true,
      liveViewers: 124,
      isDeal: true,
      discount: 27,
      host: "NYC Elite Properties",
      beds: 4,
      baths: 3,
    },
    {
      id: "ny-2",
      name: "Brooklyn Industrial Loft",
      type: "loft",
      location: "DUMBO, Brooklyn",
      distance: 8.7,
      price: 280,
      rating: 4.5,
      reviews: 189,
      image: "/placeholder.svg",
      amenities: [
        "Manhattan Views",
        "Industrial Design",
        "High Ceilings",
        "WiFi",
      ],
      isLiveStream: false,
      isDeal: false,
      host: "Brooklyn Living",
      beds: 2,
      baths: 2,
    },
  ];

  const londonProperties: Property[] = [
    {
      id: "london-1",
      name: "Thames View Townhouse",
      type: "townhouse",
      location: "Westminster, London",
      distance: 1.5,
      price: 380,
      originalPrice: 480,
      rating: 4.8,
      reviews: 145,
      image: "/placeholder.svg",
      amenities: ["River Views", "Historic Building", "Garden", "WiFi"],
      isLiveStream: true,
      liveViewers: 67,
      isDeal: true,
      discount: 21,
      host: "London Heritage Stays",
      beds: 3,
      baths: 2,
    },
    {
      id: "london-2",
      name: "Cozy Camden Cottage",
      type: "cottage",
      location: "Camden, London",
      distance: 4.2,
      price: 150,
      rating: 4.4,
      reviews: 98,
      image: "/placeholder.svg",
      amenities: [
        "Market Access",
        "Cozy Interior",
        "Traditional Design",
        "WiFi",
      ],
      isLiveStream: false,
      isDeal: false,
      host: "London Local Stays",
      beds: 2,
      baths: 1,
    },
  ];

  useEffect(() => {
    const fallback = (msg: string) => {
      setLocationError(msg);
      setCurrentLocation("Location unavailable");
      setIsLoadingLocation(false);
      setProperties(sampleProperties);
    };

    // Must be in a secure context (https) and supported
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

    // Optional: check permissions API to avoid unwanted prompts in iframes
    // Not all browsers support this, so guard it
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
                  setProperties(
                    getPropertiesForLocation("Denpasar, Bali, Indonesia"),
                  );
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
        // continue to direct geolocation call below
      }
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        setCurrentLocation("Denpasar, Bali, Indonesia");
        setIsLoadingLocation(false);
        setProperties(getPropertiesForLocation("Denpasar, Bali, Indonesia"));
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

  const getPropertiesForLocation = (location: string): Property[] => {
    const locationLower = location.toLowerCase();

    if (locationLower.includes("bali")) {
      return sampleProperties;
    } else if (locationLower.includes("paris")) {
      return parisProperties;
    } else if (locationLower.includes("tokyo")) {
      return tokyoProperties;
    } else if (locationLower.includes("new york")) {
      return newYorkProperties;
    } else if (locationLower.includes("london")) {
      return londonProperties;
    } else {
      // Default to Bali properties if location not found
      return sampleProperties;
    }
  };

  const handleLocationSearch = (newLocation: string) => {
    setCurrentLocation(newLocation);
    const locationProperties = getPropertiesForLocation(newLocation);
    setProperties(locationProperties);
  };

  const handleLocationKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLocationSearch(currentLocation);
    }
  };

  const getFilteredProperties = () => {
    if (selectedCategory === "all") return properties;
    return properties.filter((property) => property.type === selectedCategory);
  };

  const getDealProperties = () => properties.filter((p) => p.isDeal);
  const getLiveStreamProperties = () =>
    properties.filter((p) => p.isLiveStream);
  const getRegularProperties = () =>
    properties.filter((p) => !p.isDeal && !p.isLiveStream);

  const getCategoryProperties = (category: string) => {
    return propertyTypes.filter((type) => type.category === category);
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
        {/* Property Type Categories */}
        <section className="mb-12">
          <div className="flex overflow-x-auto space-x-6 pb-4">
            {propertyTypes.map((type) => (
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

        {/* Amazing Deals Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              💰 Amazing Deals Near You
            </h2>
            <Badge className="bg-red-100 text-red-700">Limited Time</Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getDealProperties().map((property) => (
              <Card
                key={property.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <div className="aspect-video relative">
                    <img
                      src={property.image}
                      alt={property.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-red-500 text-white">
                        {property.discount}% OFF
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="bg-white/80 hover:bg-white/90"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-sm">{property.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{property.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mb-2">
                    {property.location} • {property.distance}km away
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    {property.beds} beds • {property.baths} baths
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-lg">
                          ${property.price}
                        </span>
                        {property.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${property.originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        per night
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

        {/* Live Stream Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              📹 Live Tours Available Now
            </h2>
            <Badge className="bg-red-500 text-white animate-pulse">LIVE</Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getLiveStreamProperties().map((property) => (
              <Card
                key={property.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <div className="aspect-video relative">
                    <img
                      src={property.image}
                      alt={property.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-red-500 text-white">
                        <Radio className="h-3 w-3 mr-1" />
                        LIVE • {property.liveViewers}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        className="bg-white/90 text-black hover:bg-white"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Join Live Tour
                      </Button>
                    </div>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-sm">{property.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{property.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mb-2">
                    {property.location} • {property.distance}km away
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    {property.beds} beds • {property.baths} baths
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="font-bold text-lg">
                        ${property.price}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">
                        per night
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      className="w-full bg-red-500 hover:bg-red-600"
                      size="sm"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Join Live Tour
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

        {/* All Other Properties */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">All Properties</h2>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getRegularProperties().map((property) => (
              <Card
                key={property.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <div className="aspect-video relative">
                    <img
                      src={property.image}
                      alt={property.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="bg-white/80 hover:bg-white/90"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-sm">{property.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{property.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mb-2">
                    {property.location} • {property.distance}km away
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    {property.beds} beds • {property.baths} baths
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="font-bold text-lg">
                        ${property.price}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">
                        per night
                      </span>
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
