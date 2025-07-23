import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Clock,
  Calendar,
  Star,
  DollarSign,
  Plane,
  Car,
  Home,
  Mountain,
  Utensils,
  ShoppingBag,
  Camera,
  Coffee,
  Fuel,
  Wifi,
  Phone,
  AlertCircle,
  Route,
  Play,
  Eye,
  Heart,
  Share2,
  Filter,
  Layers,
  Zap,
  Gift,
  Target,
  Timer,
  Users,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

interface RoutePoint {
  id: string;
  type:
    | "stay"
    | "experience"
    | "restaurant"
    | "rest_stop"
    | "fuel"
    | "attraction"
    | "service";
  name: string;
  coordinates: { lat: number; lng: number };
  day: number;
  time: string;
  duration?: string;
  price?: number;
  rating?: number;
  description: string;
  image: string;
  isIncluded: boolean;
  isRecommended: boolean;
  category?: string;
  amenities?: string[];
  offers?: {
    discount: number;
    originalPrice: number;
    validUntil: string;
  };
}

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  location: string;
  discount?: number;
  nearbyPoint: string;
  description: string;
  inStock: number;
}

export default function RouteMap() {
  const { planId } = useParams();
  const [selectedPoint, setSelectedPoint] = useState<RoutePoint | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showOffers, setShowOffers] = useState(true);
  const [filterType, setFilterType] = useState<string>("all");

  // Sample route data for Bali trip
  const routePoints: RoutePoint[] = [
    // Day 1
    {
      id: "airport-arrival",
      type: "service",
      name: "Ngurah Rai International Airport",
      coordinates: { lat: -8.7467, lng: 115.1671 },
      day: 1,
      time: "10:00 AM",
      description: "Arrival and airport pickup service",
      image: "/placeholder.svg",
      isIncluded: true,
      isRecommended: false,
      category: "Transfer",
    },
    {
      id: "lunch-jimbaran",
      type: "restaurant",
      name: "Jimbaran Seafood Market",
      coordinates: { lat: -8.7983, lng: 115.163 },
      day: 1,
      time: "12:30 PM",
      duration: "1.5 hours",
      price: 25,
      rating: 4.6,
      description: "Fresh seafood lunch by the beach",
      image: "/placeholder.svg",
      isIncluded: false,
      isRecommended: true,
      category: "Dining",
      offers: {
        discount: 20,
        originalPrice: 32,
        validUntil: "2024-03-20",
      },
    },
    {
      id: "resort-seminyak",
      type: "stay",
      name: "Royal Paradise Resort & Spa",
      coordinates: { lat: -8.6905, lng: 115.1671 },
      day: 1,
      time: "3:00 PM",
      description: "Check-in to luxury beachfront resort",
      image: "/placeholder.svg",
      isIncluded: true,
      isRecommended: false,
      category: "Accommodation",
      amenities: ["Pool", "Spa", "Beach Access", "Restaurant"],
    },
    // Day 2
    {
      id: "fuel-stop-1",
      type: "fuel",
      name: "Shell Gas Station",
      coordinates: { lat: -8.65, lng: 115.14 },
      day: 2,
      time: "7:00 AM",
      description: "Fuel stop before Ubud journey",
      image: "/placeholder.svg",
      isIncluded: false,
      isRecommended: true,
      category: "Rest Stop",
    },
    {
      id: "coffee-ubud",
      type: "rest_stop",
      name: "Luwak Coffee Plantation",
      coordinates: { lat: -8.55, lng: 115.18 },
      day: 2,
      time: "8:30 AM",
      duration: "45 minutes",
      price: 15,
      rating: 4.3,
      description: "Traditional coffee tasting experience",
      image: "/placeholder.svg",
      isIncluded: false,
      isRecommended: true,
      category: "Experience",
      offers: {
        discount: 30,
        originalPrice: 22,
        validUntil: "2024-03-21",
      },
    },
    {
      id: "rice-terraces",
      type: "attraction",
      name: "Tegallalang Rice Terraces",
      coordinates: { lat: -8.4333, lng: 115.2833 },
      day: 2,
      time: "10:00 AM",
      duration: "2 hours",
      price: 10,
      rating: 4.8,
      description: "Stunning terraced rice fields and photo opportunities",
      image: "/placeholder.svg",
      isIncluded: true,
      isRecommended: false,
      category: "Sightseeing",
    },
    {
      id: "lunch-ubud",
      type: "restaurant",
      name: "Bebek Bengil Dirty Duck",
      coordinates: { lat: -8.5, lng: 115.26 },
      day: 2,
      time: "1:00 PM",
      duration: "1 hour",
      price: 18,
      rating: 4.5,
      description: "Famous crispy duck restaurant in Ubud",
      image: "/placeholder.svg",
      isIncluded: false,
      isRecommended: true,
      category: "Dining",
    },
    {
      id: "cooking-class",
      type: "experience",
      name: "Balinese Cooking Class",
      coordinates: { lat: -8.5167, lng: 115.2667 },
      day: 2,
      time: "3:00 PM",
      duration: "4 hours",
      price: 65,
      rating: 4.9,
      description: "Learn traditional Balinese recipes in village setting",
      image: "/placeholder.svg",
      isIncluded: true,
      isRecommended: false,
      category: "Cultural Experience",
    },
    // Day 3
    {
      id: "mount-batur",
      type: "experience",
      name: "Mount Batur Sunrise Hike",
      coordinates: { lat: -8.2421, lng: 115.375 },
      day: 3,
      time: "3:30 AM",
      duration: "6 hours",
      price: 85,
      rating: 4.8,
      description: "Sunrise hike up active volcano with breakfast",
      image: "/placeholder.svg",
      isIncluded: true,
      isRecommended: false,
      category: "Adventure",
    },
    {
      id: "hot-springs",
      type: "attraction",
      name: "Toya Devasya Hot Springs",
      coordinates: { lat: -8.23, lng: 115.38 },
      day: 3,
      time: "11:00 AM",
      duration: "2 hours",
      price: 20,
      rating: 4.4,
      description: "Relax in natural hot springs with lake views",
      image: "/placeholder.svg",
      isIncluded: false,
      isRecommended: true,
      category: "Wellness",
      offers: {
        discount: 25,
        originalPrice: 27,
        validUntil: "2024-03-22",
      },
    },
  ];

  const products: Product[] = [
    {
      id: "sunscreen-1",
      name: "SPF 50+ Reef Safe Sunscreen",
      price: 25,
      originalPrice: 35,
      image: "/placeholder.svg",
      category: "Health & Beauty",
      location: "Available at Resort Gift Shop",
      discount: 29,
      nearbyPoint: "resort-seminyak",
      description: "Eco-friendly sunscreen perfect for beach activities",
      inStock: 15,
    },
    {
      id: "hiking-gear",
      name: "Waterproof Hiking Backpack",
      price: 45,
      originalPrice: 65,
      image: "/placeholder.svg",
      category: "Outdoor Gear",
      location: "Ubud Adventure Store",
      discount: 31,
      nearbyPoint: "rice-terraces",
      description: "Perfect for Mount Batur hiking adventure",
      inStock: 8,
    },
    {
      id: "camera-gear",
      name: "Portable Phone Tripod",
      price: 22,
      originalPrice: 30,
      image: "/placeholder.svg",
      category: "Electronics",
      location: "Tegallalang Souvenir Shop",
      discount: 27,
      nearbyPoint: "rice-terraces",
      description: "Perfect for rice terrace photography",
      inStock: 12,
    },
    {
      id: "coffee-beans",
      name: "Premium Luwak Coffee (250g)",
      price: 35,
      originalPrice: 50,
      image: "/placeholder.svg",
      category: "Food & Beverages",
      location: "Coffee Plantation Shop",
      discount: 30,
      nearbyPoint: "coffee-ubud",
      description: "Authentic Balinese coffee beans to take home",
      inStock: 20,
    },
  ];

  const getDayPoints = (day: number) => {
    return routePoints.filter((point) => point.day === day);
  };

  const getFilteredPoints = () => {
    if (filterType === "all") return routePoints;
    return routePoints.filter((point) => point.type === filterType);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "stay":
        return <Home className="h-4 w-4" />;
      case "experience":
        return <Mountain className="h-4 w-4" />;
      case "restaurant":
        return <Utensils className="h-4 w-4" />;
      case "rest_stop":
        return <Coffee className="h-4 w-4" />;
      case "fuel":
        return <Fuel className="h-4 w-4" />;
      case "attraction":
        return <Camera className="h-4 w-4" />;
      case "service":
        return <Car className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "stay":
        return "bg-travel-blue/10 text-travel-blue border-travel-blue/20";
      case "experience":
        return "bg-travel-green/10 text-travel-green border-travel-green/20";
      case "restaurant":
        return "bg-travel-orange/10 text-travel-orange border-travel-orange/20";
      case "rest_stop":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "fuel":
        return "bg-red-100 text-red-700 border-red-200";
      case "attraction":
        return "bg-travel-purple/10 text-travel-purple border-travel-purple/20";
      case "service":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to={`/trip-details/${planId}`}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Trip Details</span>
            </Link>
            <div className="h-6 w-px bg-border"></div>
            <div className="flex items-center space-x-2">
              <Route className="h-6 w-6 text-travel-blue" />
              <span className="text-xl font-bold bg-gradient-to-r from-travel-blue to-travel-purple bg-clip-text text-transparent">
                Route Map & Navigation
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowOffers(!showOffers)}
            >
              <Gift className="h-4 w-4 mr-2" />
              {showOffers ? "Hide" : "Show"} Offers
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share Route
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Trip Overview */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Badge className="bg-travel-blue/10 text-travel-blue border-travel-blue/20">
              📍 7-Day Bali Adventure Route
            </Badge>
            <Badge variant="secondary">25 Stops Planned</Badge>
            <Badge variant="secondary">3 Rest Areas</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Your Complete Journey Map
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Navigate your entire Bali adventure with included activities,
            recommended stops, and exclusive offers along the way.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Area */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Navigation className="h-5 w-5" />
                    <span>Interactive Route Map</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="text-sm border rounded px-2 py-1"
                    >
                      <option value="all">All Stops</option>
                      <option value="stay">Accommodations</option>
                      <option value="experience">Experiences</option>
                      <option value="restaurant">Restaurants</option>
                      <option value="rest_stop">Rest Stops</option>
                      <option value="attraction">Attractions</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 h-full">
                {/* Simulated Map View */}
                <div className="relative h-full bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 overflow-hidden">
                  {/* Map Background */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="w-full h-full bg-gradient-to-br from-blue-200 via-green-200 to-yellow-200"></div>
                  </div>

                  {/* Route Line */}
                  <svg className="absolute inset-0 w-full h-full">
                    <path
                      d="M 50 500 Q 150 400 200 350 Q 300 300 400 280 Q 500 260 600 250 Q 700 240 750 200"
                      stroke="#2563eb"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="5,5"
                      className="animate-pulse"
                    />
                  </svg>

                  {/* Map Points */}
                  {getFilteredPoints().map((point, index) => (
                    <div
                      key={point.id}
                      className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
                        selectedPoint?.id === point.id ? "z-20" : "z-10"
                      }`}
                      style={{
                        left: `${((index * 12 + 20) % 80) + 10}%`,
                        top: `${((index * 8 + 30) % 60) + 20}%`,
                      }}
                      onClick={() => setSelectedPoint(point)}
                    >
                      <div
                        className={`relative group ${
                          selectedPoint?.id === point.id
                            ? "scale-125"
                            : "hover:scale-110"
                        } transition-transform`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 ${
                            point.isIncluded
                              ? "bg-travel-blue text-white border-travel-blue"
                              : "bg-white text-travel-blue border-travel-blue"
                          }`}
                        >
                          {getTypeIcon(point.type)}
                        </div>

                        {point.offers && showOffers && (
                          <div className="absolute -top-2 -right-2">
                            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                %
                              </span>
                            </div>
                          </div>
                        )}

                        {point.isRecommended && (
                          <div className="absolute -bottom-1 -right-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          </div>
                        )}

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                            {point.name}
                            <div className="text-xs text-gray-300">
                              Day {point.day} • {point.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-lg p-3 space-y-2">
                    <div className="text-sm font-semibold">Legend</div>
                    <div className="flex items-center space-x-2 text-xs">
                      <div className="w-3 h-3 bg-travel-blue rounded-full"></div>
                      <span>Included</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <div className="w-3 h-3 bg-white border-2 border-travel-blue rounded-full"></div>
                      <span>Recommended</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>Highly Rated</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Point Details */}
            {selectedPoint && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    {selectedPoint.name}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge
                      className={getTypeColor(selectedPoint.type)}
                      variant="outline"
                    >
                      {getTypeIcon(selectedPoint.type)}
                      <span className="ml-1 capitalize">
                        {selectedPoint.type.replace("_", " ")}
                      </span>
                    </Badge>
                    {selectedPoint.isIncluded && (
                      <Badge className="bg-green-100 text-green-700">
                        Included
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="aspect-video relative rounded-lg overflow-hidden">
                    <img
                      src={selectedPoint.image}
                      alt={selectedPoint.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {selectedPoint.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Day:</span>
                      <div className="font-medium">Day {selectedPoint.day}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Time:</span>
                      <div className="font-medium">{selectedPoint.time}</div>
                    </div>
                    {selectedPoint.duration && (
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <div className="font-medium">
                          {selectedPoint.duration}
                        </div>
                      </div>
                    )}
                    {selectedPoint.price && (
                      <div>
                        <span className="text-muted-foreground">Price:</span>
                        <div className="font-medium">
                          ${selectedPoint.price}
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedPoint.offers && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <Zap className="h-4 w-4 text-red-600" />
                        <span className="font-semibold text-red-700">
                          Special Offer!
                        </span>
                      </div>
                      <div className="text-sm text-red-600">
                        {selectedPoint.offers.discount}% off - Save $
                        {selectedPoint.offers.originalPrice -
                          (selectedPoint.price || 0)}
                      </div>
                      <div className="text-xs text-red-500">
                        Valid until {selectedPoint.offers.validUntil}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      {selectedPoint.isIncluded
                        ? "View Details"
                        : "Add to Trip"}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Navigation className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Product Offers Along Route */}
            {showOffers && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Offers Along Route
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {products.slice(0, 3).map((product) => (
                    <div key={product.id} className="border rounded-lg p-3">
                      <div className="flex space-x-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">
                            {product.name}
                          </h4>
                          <p className="text-xs text-muted-foreground mb-1">
                            {product.location}
                          </p>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm">
                              ${product.price}
                            </span>
                            {product.originalPrice && (
                              <span className="text-xs text-muted-foreground line-through">
                                ${product.originalPrice}
                              </span>
                            )}
                            {product.discount && (
                              <Badge className="bg-red-100 text-red-700 text-xs">
                                {product.discount}% OFF
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="w-full mt-2"
                        variant="outline"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    View All Offers
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Day-by-Day Timeline */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Day-by-Day Journey Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="1" className="w-full">
                <TabsList className="grid w-full grid-cols-7">
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <TabsTrigger key={day} value={day.toString()}>
                      Day {day}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <TabsContent
                    key={day}
                    value={day.toString()}
                    className="mt-6"
                  >
                    <div className="space-y-4">
                      {getDayPoints(day).length > 0 ? (
                        getDayPoints(day).map((point, index) => (
                          <div
                            key={point.id}
                            className="flex items-start space-x-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                          >
                            <div className="flex-shrink-0">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  point.isIncluded
                                    ? "bg-travel-blue text-white"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {getTypeIcon(point.type)}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold">{point.name}</h4>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-muted-foreground">
                                    {point.time}
                                  </span>
                                  {point.offers && (
                                    <Badge className="bg-red-100 text-red-700">
                                      {point.offers.discount}% OFF
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {point.description}
                              </p>
                              <div className="flex items-center space-x-4 text-sm">
                                {point.duration && (
                                  <div className="flex items-center space-x-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{point.duration}</span>
                                  </div>
                                )}
                                {point.price && (
                                  <div className="flex items-center space-x-1">
                                    <DollarSign className="h-4 w-4" />
                                    <span>${point.price}</span>
                                  </div>
                                )}
                                {point.rating && (
                                  <div className="flex items-center space-x-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span>{point.rating}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedPoint(point)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No activities planned for Day {day}</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Controls */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
          <Card className="px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button
                size="lg"
                className="bg-travel-blue hover:bg-travel-blue/90"
              >
                <Navigation className="h-5 w-5 mr-2" />
                Start Navigation
              </Button>
              <Button variant="outline" size="lg">
                <Phone className="h-5 w-5 mr-2" />
                Emergency Contact
              </Button>
              <Button variant="outline" size="lg">
                <Wifi className="h-5 w-5 mr-2" />
                Offline Maps
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
