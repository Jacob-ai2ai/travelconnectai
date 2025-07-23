import { useState } from "react";
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
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

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
  const [selectedTab, setSelectedTab] = useState("accommodations");
  const [selectedAccommodation, setSelectedAccommodation] = useState<
    string | null
  >(null);

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
      price: 85,
      rating: 4.8,
      description:
        "Witness breathtaking sunrise from the active volcano peak with professional guide.",
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
      price: 65,
      rating: 4.9,
      description:
        "Learn authentic Balinese recipes in a traditional village setting.",
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
      price: 45,
      rating: 4.6,
      description:
        "Thrilling rafting experience through tropical rainforest and rice terraces.",
      image: "/placeholder.svg",
      isLiveDemo: false,
      highlights: ["Safety Briefing", "Equipment Included", "Lunch", "Photos"],
    },
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
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
            <Link to={`/route-map/${planId}`}>
              <Button variant="outline" size="sm">
                <Route className="h-4 w-4 mr-2" />
                Route Map
              </Button>
            </Link>
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger
              value="accommodations"
              className="flex items-center space-x-2"
            >
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
            <TabsTrigger
              value="services"
              className="flex items-center space-x-2"
            >
              <Award className="h-4 w-4" />
              <span>Services</span>
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="flex items-center space-x-2"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Products</span>
            </TabsTrigger>
          </TabsList>

          {/* Accommodations Tab */}
          <TabsContent value="accommodations" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Your Accommodations</h2>
                <Badge variant="secondary">2 Properties Selected</Badge>
              </div>

              <div className="grid gap-6">
                {accommodations.map((accommodation) => (
                  <Card key={accommodation.id} className="overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-0">
                      {/* Images and Video Section */}
                      <div className="relative">
                        <div className="aspect-video relative bg-muted">
                          <img
                            src={accommodation.images[0]}
                            alt={accommodation.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <Button
                              size="lg"
                              className="bg-white/90 text-black hover:bg-white"
                            >
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

                        {/* Thumbnail Gallery */}
                        <div className="flex space-x-2 p-4">
                          {accommodation.images
                            .slice(1, 4)
                            .map((image, index) => (
                              <div
                                key={index}
                                className="w-16 h-16 rounded-lg overflow-hidden"
                              >
                                <img
                                  src={image}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-xs font-medium">
                            +12 more
                          </div>
                        </div>
                      </div>

                      {/* Details Section */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold mb-1">
                              {accommodation.name}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">
                                {accommodation.type}
                              </Badge>
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">
                                  {accommodation.rating}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">
                              ${accommodation.price}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              per night
                            </div>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-4">
                          {accommodation.description}
                        </p>

                        {/* Amenities */}
                        <div className="mb-4">
                          <h4 className="font-semibold mb-2">Amenities</h4>
                          <div className="flex flex-wrap gap-2">
                            {accommodation.amenities.map((amenity, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Nearby Attractions */}
                        <div className="mb-6">
                          <h4 className="font-semibold mb-2 flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            Nearby Attractions
                          </h4>
                          <div className="space-y-1">
                            {accommodation.nearbyAttractions.map(
                              (attraction, index) => (
                                <div
                                  key={index}
                                  className="text-sm text-muted-foreground"
                                >
                                  • {attraction}
                                </div>
                              ),
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3">
                          <Button
                            onClick={() => requestLiveStream(accommodation.id)}
                            className="flex-1 bg-travel-blue hover:bg-travel-blue/90"
                          >
                            <Video className="h-4 w-4 mr-2" />
                            Request Live Tour
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Experiences Tab */}
          <TabsContent value="experiences" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Experiences & Events</h2>
                <Badge variant="secondary">
                  {experiences.length} Activities
                </Badge>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {experiences.map((experience) => (
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
                            {experience.isLiveDemo
                              ? "Join Live Demo"
                              : "Watch Preview"}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{experience.category}</Badge>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{experience.rating}</span>
                        </div>
                      </div>

                      <h3 className="font-bold mb-2">{experience.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {experience.description}
                      </p>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{experience.duration}</span>
                        </div>
                        <div className="text-lg font-bold">
                          ${experience.price}
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        {experience.highlights
                          .slice(0, 2)
                          .map((highlight, index) => (
                            <div
                              key={index}
                              className="text-xs text-muted-foreground flex items-center"
                            >
                              <div className="w-1.5 h-1.5 bg-travel-green rounded-full mr-2"></div>
                              {highlight}
                            </div>
                          ))}
                      </div>

                      <Button className="w-full" size="sm">
                        {experience.isLiveDemo
                          ? "Join Live Demo"
                          : "Book Experience"}
                      </Button>
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

                      <div className="flex items-center space-x-2 mb-3">
                        <div className="text-lg font-bold">
                          ${product.price}
                        </div>
                        {product.originalPrice && (
                          <div className="text-sm text-muted-foreground line-through">
                            ${product.originalPrice}
                          </div>
                        )}
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
            <div className="flex items-center space-x-4">
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
