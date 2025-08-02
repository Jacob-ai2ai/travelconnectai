import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  ArrowLeft
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
  const [currentLocation, setCurrentLocation] = useState<string>("Detecting location...");
  const [destination, setDestination] = useState("");
  const [walletBalance] = useState(1250.75);
  const [isSignedIn] = useState(true); // Simulate signed in user
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  const propertyTypes: PropertyType[] = [
    // Nature & Countryside Escapes
    { id: "cabin", name: "Cabin", category: "nature", icon: "🏕️", description: "Rustic and cozy, often in forests or mountains", emoji: "🌿" },
    { id: "cottage", name: "Cottage", category: "nature", icon: "🏡", description: "Charming, usually countryside or lakeside", emoji: "🌿" },
    { id: "chalet", name: "Chalet", category: "nature", icon: "🏔️", description: "Alpine-style home, typically near ski resorts", emoji: "🌿" },
    { id: "farmstay", name: "Farmstay", category: "nature", icon: "🚜", description: "On working farms; offers rural immersion", emoji: "🌿" },
    { id: "barn", name: "Barn Conversion", category: "nature", icon: "🏚️", description: "Modern homes built from old barns", emoji: "🌿" },
    
    // Coastal & Waterfront Homes
    { id: "beach-house", name: "Beach House", category: "coastal", icon: "🏖️", description: "Located right on or near the beach", emoji: "🌊" },
    { id: "lake-house", name: "Lake House", category: "coastal", icon: "🏞️", description: "Next to lakes for fishing and peaceful views", emoji: "🌊" },
    { id: "boathouse", name: "Boathouse", category: "coastal", icon: "🛥️", description: "House on water; may include dock space", emoji: "🌊" },
    { id: "coastal-villa", name: "Coastal Villa", category: "coastal", icon: "🏖️", description: "Luxurious Mediterranean-style by the sea", emoji: "🌊" },
    
    // Urban & Luxury Getaways
    { id: "penthouse", name: "Penthouse", category: "urban", icon: "🏙️", description: "Top-floor apartments with city views", emoji: "🏙️" },
    { id: "loft", name: "Loft", category: "urban", icon: "🏭", description: "Spacious urban apartment with industrial charm", emoji: "🏙️" },
    { id: "luxury-condo", name: "Luxury Condo", category: "urban", icon: "🏢", description: "High-end apartments in sought-after destinations", emoji: "🏙️" },
    { id: "townhouse", name: "Townhouse", category: "urban", icon: "🏘️", description: "Multi-level homes in cities or suburbs", emoji: "🏙️" },
    
    // Exotic & Experiential Stays
    { id: "villa", name: "Villa", category: "exotic", icon: "🏛️", description: "Private luxury home with pool/garden", emoji: "🏝️" },
    { id: "bungalow", name: "Bungalow", category: "exotic", icon: "🛖", description: "Single-story home, tropical or resort-style", emoji: "🏝️" },
    { id: "overwater", name: "Overwater Bungalow", category: "exotic", icon: "🏘️", description: "Built on stilts over water", emoji: "🏝️" },
    { id: "riad", name: "Riad", category: "exotic", icon: "🕌", description: "Traditional Moroccan home with courtyards", emoji: "🏝️" },
    
    // Unique & Alternative Stays
    { id: "treehouse", name: "Treehouse", category: "unique", icon: "🌳", description: "Elevated homes in trees, boutique eco-style", emoji: "🏞️" },
    { id: "aframe", name: "A-Frame Cabin", category: "unique", icon: "⛺", description: "Triangular design, compact yet trendy", emoji: "🏞️" },
    { id: "yurt", name: "Yurt", category: "unique", icon: "⛺", description: "Circular tent-like structure for glamping", emoji: "🏞️" },
    { id: "tiny-house", name: "Tiny House", category: "unique", icon: "🏠", description: "Minimalist and mobile, often off-grid", emoji: "🏞️" },
    { id: "container", name: "Container Home", category: "unique", icon: "📦", description: "Built from shipping containers, modern", emoji: "🏞️" },
    { id: "dome", name: "Dome Home", category: "unique", icon: "🔮", description: "Geodesic architecture, eco-conscious", emoji: "🏞️" },
    
    // Desert & Remote Retreats
    { id: "earth-house", name: "Earth House", category: "desert", icon: "🏜️", description: "Built underground with natural materials", emoji: "🏜️" },
    { id: "adobe", name: "Adobe Home", category: "desert", icon: "🧱", description: "Desert climates with traditional materials", emoji: "🏜️" },
    { id: "desert-villa", name: "Desert Villa", category: "desert", icon: "🏛️", description: "Open-plan with panoramic desert views", emoji: "🏜️" }
  ];

  const sampleProperties: Property[] = [
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
      baths: 2
    },
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
      baths: 3
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
      baths: 1
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
      baths: 2
    }
  ];

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Simulate reverse geocoding
          setCurrentLocation("Denpasar, Bali, Indonesia");
          setIsLoadingLocation(false);
          setProperties(sampleProperties);
        },
        (error) => {
          console.error("Error getting location:", error);
          setCurrentLocation("Location unavailable");
          setIsLoadingLocation(false);
          setProperties(sampleProperties);
        }
      );
    } else {
      setCurrentLocation("Geolocation not supported");
      setIsLoadingLocation(false);
      setProperties(sampleProperties);
    }
  }, []);

  const getFilteredProperties = () => {
    if (selectedCategory === "all") return properties;
    return properties.filter(property => property.type === selectedCategory);
  };

  const getDealProperties = () => properties.filter(p => p.isDeal);
  const getLiveStreamProperties = () => properties.filter(p => p.isLiveStream);
  const getRegularProperties = () => properties.filter(p => !p.isDeal && !p.isLiveStream);

  const getCategoryProperties = (category: string) => {
    return propertyTypes.filter(type => type.category === category);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          {/* Top Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
              <div className="h-6 w-px bg-border"></div>
              <div className="flex items-center space-x-2">
                <Home className="h-6 w-6 text-travel-blue" />
                <span className="text-xl font-bold bg-gradient-to-r from-travel-blue to-travel-purple bg-clip-text text-transparent">
                  Stays
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Current Location */}
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-travel-blue" />
                <span className="text-muted-foreground">
                  {isLoadingLocation ? "Detecting..." : currentLocation}
                </span>
              </div>
              
              {/* Travel Wallet */}
              {isSignedIn && (
                <div className="flex items-center space-x-2 bg-travel-blue/10 px-3 py-1 rounded-full">
                  <Wallet className="h-4 w-4 text-travel-blue" />
                  <span className="font-medium text-travel-blue">${walletBalance.toFixed(2)}</span>
                </div>
              )}
              
              {/* List Property Button */}
              <Button size="sm" className="bg-travel-orange hover:bg-travel-orange/90">
                <Plus className="h-4 w-4 mr-2" />
                List My Property
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search stays in ${currentLocation} or enter a destination...`}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="pl-10 pr-20"
              />
              <Button size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2">
                Search
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Property Type Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Browse by Property Type</h2>
          
          {/* Category Sections */}
          <div className="space-y-8">
            {/* Nature & Countryside */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="text-2xl mr-2">🌿</span>
                Nature & Countryside Escapes
              </h3>
              <div className="flex overflow-x-auto space-x-4 pb-4">
                {getCategoryProperties("nature").map((type) => (
                  <Card key={type.id} className="min-w-[200px] cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl mb-2">{type.icon}</div>
                      <h4 className="font-medium mb-1">{type.name}</h4>
                      <p className="text-xs text-muted-foreground">{type.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Coastal & Waterfront */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="text-2xl mr-2">🌊</span>
                Coastal & Waterfront Homes
              </h3>
              <div className="flex overflow-x-auto space-x-4 pb-4">
                {getCategoryProperties("coastal").map((type) => (
                  <Card key={type.id} className="min-w-[200px] cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl mb-2">{type.icon}</div>
                      <h4 className="font-medium mb-1">{type.name}</h4>
                      <p className="text-xs text-muted-foreground">{type.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Urban & Luxury */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="text-2xl mr-2">🏙️</span>
                Urban & Luxury Getaways
              </h3>
              <div className="flex overflow-x-auto space-x-4 pb-4">
                {getCategoryProperties("urban").map((type) => (
                  <Card key={type.id} className="min-w-[200px] cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl mb-2">{type.icon}</div>
                      <h4 className="font-medium mb-1">{type.name}</h4>
                      <p className="text-xs text-muted-foreground">{type.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Exotic & Experiential */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="text-2xl mr-2">🏝️</span>
                Exotic & Experiential Stays
              </h3>
              <div className="flex overflow-x-auto space-x-4 pb-4">
                {getCategoryProperties("exotic").map((type) => (
                  <Card key={type.id} className="min-w-[200px] cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl mb-2">{type.icon}</div>
                      <h4 className="font-medium mb-1">{type.name}</h4>
                      <p className="text-xs text-muted-foreground">{type.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Unique & Alternative */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="text-2xl mr-2">🏞️</span>
                Unique & Alternative Stays
              </h3>
              <div className="flex overflow-x-auto space-x-4 pb-4">
                {getCategoryProperties("unique").map((type) => (
                  <Card key={type.id} className="min-w-[200px] cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl mb-2">{type.icon}</div>
                      <h4 className="font-medium mb-1">{type.name}</h4>
                      <p className="text-xs text-muted-foreground">{type.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Desert & Remote */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="text-2xl mr-2">🏜️</span>
                Desert & Remote Retreats
              </h3>
              <div className="flex overflow-x-auto space-x-4 pb-4">
                {getCategoryProperties("desert").map((type) => (
                  <Card key={type.id} className="min-w-[200px] cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl mb-2">{type.icon}</div>
                      <h4 className="font-medium mb-1">{type.name}</h4>
                      <p className="text-xs text-muted-foreground">{type.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
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
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="aspect-video relative">
                    <img src={property.image} alt={property.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-red-500 text-white">
                        {property.discount}% OFF
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Button size="sm" variant="ghost" className="bg-white/80 hover:bg-white/90">
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
                  
                  <p className="text-xs text-muted-foreground mb-2">{property.location} • {property.distance}km away</p>
                  <p className="text-xs text-muted-foreground mb-3">{property.beds} beds • {property.baths} baths</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-lg">${property.price}</span>
                        {property.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${property.originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">per night</span>
                    </div>
                  </div>
                  
                  <Button className="w-full" size="sm">
                    Book Now
                  </Button>
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
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="aspect-video relative">
                    <img src={property.image} alt={property.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-red-500 text-white">
                        <Radio className="h-3 w-3 mr-1" />
                        LIVE • {property.liveViewers}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button size="sm" className="bg-white/90 text-black hover:bg-white">
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
                  
                  <p className="text-xs text-muted-foreground mb-2">{property.location} • {property.distance}km away</p>
                  <p className="text-xs text-muted-foreground mb-3">{property.beds} beds • {property.baths} baths</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="font-bold text-lg">${property.price}</span>
                      <span className="text-xs text-muted-foreground ml-1">per night</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button className="w-full bg-red-500 hover:bg-red-600" size="sm">
                      <Video className="h-4 w-4 mr-2" />
                      Join Live Tour
                    </Button>
                    <Button variant="outline" className="w-full" size="sm">
                      Book Property
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
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="aspect-video relative">
                    <img src={property.image} alt={property.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2">
                      <Button size="sm" variant="ghost" className="bg-white/80 hover:bg-white/90">
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
                  
                  <p className="text-xs text-muted-foreground mb-2">{property.location} • {property.distance}km away</p>
                  <p className="text-xs text-muted-foreground mb-3">{property.beds} beds • {property.baths} baths</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="font-bold text-lg">${property.price}</span>
                      <span className="text-xs text-muted-foreground ml-1">per night</span>
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
