import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ServiceHeader from "@/components/ServiceHeader";
import {
  Star,
  DollarSign,
  Clock,
  Users,
  Plane,
  Home,
  Mountain,
  Ticket,
  ShoppingBag,
  Calendar,
  Eye,
  Heart,
  ArrowRight,
  TrendingUp,
  Zap,
  Video,
  Radio,
} from "lucide-react";
import { Link } from "react-router-dom";

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  route: string;
  featured: any[];
}

interface FeaturedItem {
  id: string;
  title: string;
  location: string;
  price: number;
  originalPrice?: number;
  rating: number;
  image: string;
  category: string;
  isLive?: boolean;
  liveViewers?: number;
  discount?: number;
  type: "stay" | "flight" | "experience" | "event" | "product";
}

export default function ExploreServices() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLocation, setCurrentLocation] = useState("Denpasar, Bali");
  const [walletBalance] = useState(1250.75);
  const [isSignedIn] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const featuredDeals: FeaturedItem[] = [
    {
      id: "stay-1",
      title: "Ocean View Villa Seminyak",
      location: "Seminyak, Bali",
      price: 180,
      originalPrice: 250,
      rating: 4.8,
      image: "/placeholder.svg",
      category: "Villa",
      discount: 28,
      type: "stay",
    },
    {
      id: "flight-1",
      title: "Singapore Airlines to Singapore",
      location: "DPS → SIN",
      price: 280,
      originalPrice: 400,
      rating: 4.9,
      image: "/placeholder.svg",
      category: "Business Class",
      discount: 30,
      type: "flight",
    },
    {
      id: "experience-1",
      title: "Sunrise Mount Batur Hike",
      location: "Mount Batur, Bali",
      price: 65,
      originalPrice: 95,
      rating: 4.8,
      image: "/placeholder.svg",
      category: "Adventure",
      discount: 32,
      type: "experience",
    },
    {
      id: "event-1",
      title: "Ed Sheeran Live in Bali",
      location: "GWK Cultural Park",
      price: 120,
      rating: 4.9,
      image: "/placeholder.svg",
      category: "Concert",
      isLive: true,
      liveViewers: 15600,
      type: "event",
    },
    {
      id: "product-1",
      title: "4K Travel Action Camera",
      location: "Free Shipping Worldwide",
      price: 199,
      rating: 4.6,
      image: "/placeholder.svg",
      category: "Electronics",
      isLive: true,
      liveViewers: 234,
      type: "product",
    },
  ];

  const serviceCategories: ServiceCategory[] = [
    {
      id: "stays",
      name: "Vacation Stays",
      description:
        "Find your perfect accommodation from luxury villas to cozy cabins",
      icon: Home,
      color: "travel-blue",
      route: "/stays",
      featured: featuredDeals.filter((item) => item.type === "stay"),
    },
    {
      id: "flights",
      name: "Flights & Transport",
      description: "Book flights, trains, and local transport with best deals",
      icon: Plane,
      color: "travel-blue",
      route: "/flights",
      featured: featuredDeals.filter((item) => item.type === "flight"),
    },
    {
      id: "experiences",
      name: "Experiences & Adventures",
      description:
        "Discover unique activities, tours, and cultural experiences",
      icon: Mountain,
      color: "travel-green",
      route: "/xperiences",
      featured: featuredDeals.filter((item) => item.type === "experience"),
    },
    {
      id: "events",
      name: "Events & Entertainment",
      description:
        "Book tickets for concerts, festivals, sports and cultural events",
      icon: Ticket,
      color: "travel-purple",
      route: "/events",
      featured: featuredDeals.filter((item) => item.type === "event"),
    },
    {
      id: "essentials",
      name: "Travel Essentials",
      description: "Get all your travel gear, accessories and necessities",
      icon: ShoppingBag,
      color: "travel-orange",
      route: "/essentials",
      featured: featuredDeals.filter((item) => item.type === "product"),
    },
  ];

  const getFilteredDeals = () => {
    if (selectedFilter === "all") return featuredDeals;
    return featuredDeals.filter((deal) => deal.type === selectedFilter);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "stay":
        return <Home className="h-4 w-4" />;
      case "flight":
        return <Plane className="h-4 w-4" />;
      case "experience":
        return <Mountain className="h-4 w-4" />;
      case "event":
        return <Ticket className="h-4 w-4" />;
      case "product":
        return <ShoppingBag className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "stay":
        return "text-travel-blue";
      case "flight":
        return "text-travel-blue";
      case "experience":
        return "text-travel-green";
      case "event":
        return "text-travel-purple";
      case "product":
        return "text-travel-orange";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <ServiceHeader
        currentLocation={currentLocation}
        walletBalance={walletBalance}
        isSignedIn={isSignedIn}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Featured Deals Across All Services */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              Featured Deals Across All Services
            </h2>
            <div className="flex items-center space-x-2">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="text-sm border rounded px-3 py-1"
              >
                <option value="all">All Services</option>
                <option value="stay">Stays</option>
                <option value="flight">Flights</option>
                <option value="experience">Experiences</option>
                <option value="event">Events</option>
                <option value="product">Products</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {getFilteredDeals().map((deal) => (
              <Card
                key={deal.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <div className="aspect-video relative">
                    <img
                      src={deal.image}
                      alt={deal.title}
                      className="w-full h-full object-cover"
                    />
                    {deal.discount && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-red-500 text-white">
                          {deal.discount}% OFF
                        </Badge>
                      </div>
                    )}
                    {deal.isLive && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-red-500 text-white">
                          <Radio className="h-3 w-3 mr-1" />
                          LIVE • {deal.liveViewers?.toLocaleString()}
                        </Badge>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="secondary" className="text-xs">
                        <span className={getTypeColor(deal.type)}>
                          {getTypeIcon(deal.type)}
                        </span>
                        <span className="ml-1 capitalize">{deal.type}</span>
                      </Badge>
                    </div>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {deal.category}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{deal.rating}</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-sm mb-1">{deal.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {deal.location}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold">${deal.price}</span>
                        {deal.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            ${deal.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {deal.isLive ? (
                      <Button
                        className="w-full bg-red-500 hover:bg-red-600"
                        size="sm"
                      >
                        <Video className="h-3 w-3 mr-2" />
                        Join Live
                      </Button>
                    ) : (
                      <Button className="w-full" size="sm">
                        {deal.type === "stay" && "Book Stay"}
                        {deal.type === "flight" && "Book Flight"}
                        {deal.type === "experience" && "Book Experience"}
                        {deal.type === "event" && "Buy Ticket"}
                        {deal.type === "product" && "Add to Cart"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Popular Destinations */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Popular Destinations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "Bali", image: "/placeholder.svg", deals: 125 },
              { name: "Tokyo", image: "/placeholder.svg", deals: 89 },
              { name: "Paris", image: "/placeholder.svg", deals: 156 },
              { name: "New York", image: "/placeholder.svg", deals: 134 },
              { name: "London", image: "/placeholder.svg", deals: 98 },
              { name: "Dubai", image: "/placeholder.svg", deals: 76 },
            ].map((destination) => (
              <Card
                key={destination.name}
                className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="aspect-square relative">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-3">
                    <h3 className="text-white font-bold">{destination.name}</h3>
                    <p className="text-white/80 text-xs">
                      {destination.deals} deals
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-travel-blue/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-travel-blue" />
                </div>
                <div>
                  <h3 className="font-bold">Best Deals</h3>
                  <p className="text-sm text-muted-foreground">
                    Find the hottest deals across all services
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                  <Video className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <h3 className="font-bold">Live Experiences</h3>
                  <p className="text-sm text-muted-foreground">
                    Join live tours and demonstrations
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-travel-green/10 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-travel-green" />
                </div>
                <div>
                  <h3 className="font-bold">Last Minute</h3>
                  <p className="text-sm text-muted-foreground">
                    Book urgent travel needs quickly
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-12 bg-gradient-to-r from-travel-blue/5 to-travel-purple/5 rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Let our AI help you plan the perfect trip with personalized
            recommendations and complete itineraries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/ai-planner">
              <Button
                size="lg"
                className="bg-travel-blue hover:bg-travel-blue/90"
              >
                Try AI Trip Planner
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Contact Travel Expert
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
