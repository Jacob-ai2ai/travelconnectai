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
  Mountain,
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
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

interface XperienceType {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface Experience {
  id: string;
  title: string;
  provider: string;
  location: string;
  duration: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  groupSize: number;
  difficulty: string;
  includes: string[];
  isLiveDemo: boolean;
  liveViewers?: number;
  isDeal: boolean;
  nextAvailable: string;
}

export default function Xperiences() {
  const [currentLocation, setCurrentLocation] = useState<string>(
    "Detecting location...",
  );
  const [walletBalance] = useState(1250.75);
  const [isSignedIn] = useState(true);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  const experienceTypes: XperienceType[] = [
    {
      id: "adventure",
      name: "Adventure",
      icon: "🏔️",
      description: "Thrilling outdoor activities",
    },
    {
      id: "cultural",
      name: "Cultural",
      icon: "🏛️",
      description: "Local traditions and heritage",
    },
    {
      id: "food",
      name: "Food Tours",
      icon: "🍜",
      description: "Culinary experiences",
    },
    {
      id: "water",
      name: "Water Sports",
      icon: "🏄",
      description: "Ocean and lake activities",
    },
    {
      id: "wellness",
      name: "Wellness",
      icon: "🧘",
      description: "Spa and mindfulness",
    },
    {
      id: "wildlife",
      name: "Wildlife",
      icon: "🦁",
      description: "Animal encounters",
    },
    {
      id: "extreme",
      name: "Extreme Sports",
      icon: "🪂",
      description: "Adrenaline activities",
    },
    {
      id: "romantic",
      name: "Romantic",
      icon: "💕",
      description: "Couples experiences",
    },
    {
      id: "family",
      name: "Family Fun",
      icon: "👨‍👩‍👧‍👦",
      description: "Kid-friendly activities",
    },
    {
      id: "nightlife",
      name: "Nightlife",
      icon: "🌃",
      description: "Evening entertainment",
    },
    {
      id: "photography",
      name: "Photography",
      icon: "📸",
      description: "Picture-perfect tours",
    },
    {
      id: "learning",
      name: "Learning",
      icon: "🎨",
      description: "Educational workshops",
    },
  ];

  const sampleExperiences: Experience[] = [
    // Deal Experiences
    {
      id: "deal-1",
      title: "Sunrise Mount Batur Volcano Hike",
      provider: "Bali Adventure Tours",
      location: "Mount Batur, Bali",
      duration: "6 hours",
      price: 65,
      originalPrice: 95,
      discount: 32,
      rating: 4.8,
      reviews: 1234,
      image: "/placeholder.svg",
      category: "Adventure",
      groupSize: 12,
      difficulty: "Moderate",
      includes: ["Hotel pickup", "Guide", "Breakfast", "Equipment"],
      isLiveDemo: false,
      isDeal: true,
      nextAvailable: "Tomorrow 3:30 AM",
    },
    {
      id: "deal-2",
      title: "Traditional Balinese Cooking Class",
      provider: "Authentic Bali Experiences",
      location: "Ubud, Bali",
      duration: "4 hours",
      price: 45,
      originalPrice: 70,
      discount: 36,
      rating: 4.9,
      reviews: 567,
      image: "/placeholder.svg",
      category: "Cultural",
      groupSize: 8,
      difficulty: "Easy",
      includes: ["Market tour", "Cooking lesson", "Lunch", "Recipes"],
      isLiveDemo: false,
      isDeal: true,
      nextAvailable: "Today 9:00 AM",
    },

    // Live Demo Experiences
    {
      id: "live-1",
      title: "White Water Rafting Adventure",
      provider: "Rapids Bali",
      location: "Ayung River, Bali",
      duration: "5 hours",
      price: 85,
      rating: 4.7,
      reviews: 892,
      image: "/placeholder.svg",
      category: "Adventure",
      groupSize: 16,
      difficulty: "Moderate",
      includes: ["Safety briefing", "Equipment", "Lunch", "Photos"],
      isLiveDemo: true,
      liveViewers: 156,
      isDeal: false,
      nextAvailable: "Today 8:00 AM",
    },
    {
      id: "live-2",
      title: "Bali Temple Hopping & Cultural Tour",
      provider: "Heritage Bali Tours",
      location: "Central Bali",
      duration: "8 hours",
      price: 75,
      rating: 4.6,
      reviews: 445,
      image: "/placeholder.svg",
      category: "Cultural",
      groupSize: 10,
      difficulty: "Easy",
      includes: ["Private guide", "Temple entries", "Lunch", "Transport"],
      isLiveDemo: true,
      liveViewers: 89,
      isDeal: false,
      nextAvailable: "Tomorrow 7:00 AM",
    },

    // Regular Experiences
    {
      id: "regular-1",
      title: "Snorkeling at Menjangan Island",
      provider: "Blue Water Sports",
      location: "West Bali National Park",
      duration: "10 hours",
      price: 125,
      rating: 4.5,
      reviews: 678,
      image: "/placeholder.svg",
      category: "Water Sports",
      groupSize: 20,
      difficulty: "Easy",
      includes: ["Boat transfer", "Equipment", "Lunch", "Guide"],
      isLiveDemo: false,
      isDeal: false,
      nextAvailable: "Dec 25, 6:00 AM",
    },
    {
      id: "regular-2",
      title: "Traditional Spa & Wellness Package",
      provider: "Serenity Spa Bali",
      location: "Seminyak, Bali",
      duration: "3 hours",
      price: 95,
      rating: 4.7,
      reviews: 234,
      image: "/placeholder.svg",
      category: "Wellness",
      groupSize: 2,
      difficulty: "Relaxing",
      includes: ["Massage", "Facial", "Refreshments", "Consultation"],
      isLiveDemo: false,
      isDeal: false,
      nextAvailable: "Today 2:00 PM",
    },
  ];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation("Denpasar, Bali, Indonesia");
          setIsLoadingLocation(false);
          setExperiences(sampleExperiences);
        },
        (error) => {
          console.error("Error getting location:", error);
          setCurrentLocation("Location unavailable");
          setIsLoadingLocation(false);
          setExperiences(sampleExperiences);
        },
      );
    } else {
      setCurrentLocation("Geolocation not supported");
      setIsLoadingLocation(false);
      setExperiences(sampleExperiences);
    }
  }, []);

  const getDealExperiences = () => experiences.filter((e) => e.isDeal);
  const getLiveDemoExperiences = () => experiences.filter((e) => e.isLiveDemo);
  const getRegularExperiences = () =>
    experiences.filter((e) => !e.isDeal && !e.isLiveDemo);

  const handleLocationSearch = (newLocation: string) => {
    setCurrentLocation(newLocation);
  };

  const handleLocationKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLocationSearch(currentLocation);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-700";
      case "moderate":
        return "bg-yellow-100 text-yellow-700";
      case "hard":
        return "bg-red-100 text-red-700";
      case "relaxing":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
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
        {/* Experience Type Categories */}
        <section className="mb-12">
          <div className="flex overflow-x-auto space-x-6 pb-4">
            {experienceTypes.map((type) => (
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

        {/* Amazing Experience Deals */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              💰 Amazing Experience Deals
            </h2>
            <Badge className="bg-red-100 text-red-700">Limited Time</Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getDealExperiences().map((experience) => (
              <Card
                key={experience.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <div className="aspect-video relative">
                    <img
                      src={experience.image}
                      alt={experience.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-red-500 text-white">
                        {experience.discount}% OFF
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
                    <Badge variant="outline">{experience.category}</Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{experience.rating}</span>
                    </div>
                  </div>

                  <h3 className="font-bold mb-2 text-sm">{experience.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {experience.location} • {experience.provider}
                  </p>

                  <div className="flex items-center space-x-4 mb-3 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{experience.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>Max {experience.groupSize}</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <Badge
                      className={getDifficultyColor(experience.difficulty)}
                      variant="secondary"
                    >
                      {experience.difficulty}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-lg">
                          ${experience.price}
                        </span>
                        {experience.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${experience.originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        per person
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Next: {experience.nextAvailable}
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

        {/* Live Demo Experiences */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              📹 Live Experience Demos
            </h2>
            <Badge className="bg-red-500 text-white animate-pulse">LIVE</Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getLiveDemoExperiences().map((experience) => (
              <Card
                key={experience.id}
                className="overflow-hidden hover:shadow-lg transition-shadow border-2 border-red-200"
              >
                <div className="relative">
                  <div className="aspect-video relative">
                    <img
                      src={experience.image}
                      alt={experience.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-red-500 text-white">
                        <Radio className="h-3 w-3 mr-1" />
                        LIVE • {experience.liveViewers}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        className="bg-white/90 text-black hover:bg-white"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Join Live Demo
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

                  <h3 className="font-bold mb-2 text-sm">{experience.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {experience.location} • {experience.provider}
                  </p>

                  <div className="flex items-center space-x-4 mb-3 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{experience.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>Max {experience.groupSize}</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <Badge
                      className={getDifficultyColor(experience.difficulty)}
                      variant="secondary"
                    >
                      {experience.difficulty}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="font-bold text-lg">
                        ${experience.price}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">
                        per person
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Next: {experience.nextAvailable}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      className="w-full bg-red-500 hover:bg-red-600"
                      size="sm"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Join Live Demo
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

        {/* All Experiences */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">All Experiences</h2>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getRegularExperiences().map((experience) => (
              <Card
                key={experience.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <div className="aspect-video relative">
                    <img
                      src={experience.image}
                      alt={experience.title}
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
                    <Badge variant="outline">{experience.category}</Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{experience.rating}</span>
                    </div>
                  </div>

                  <h3 className="font-bold mb-2 text-sm">{experience.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {experience.location}
                  </p>

                  <div className="flex items-center space-x-4 mb-3 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{experience.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>Max {experience.groupSize}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="font-bold text-lg">
                        ${experience.price}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">
                        per person
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
