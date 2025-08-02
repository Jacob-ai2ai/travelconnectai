import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Upload,
  MapPin,
  Home,
  DollarSign,
  Calendar,
  Users,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Video,
  Tag,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface PropertyListing {
  title: string;
  description: string;
  location: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  propertyType: string;
  hasDiscount: boolean;
  discountPercentage: number;
  originalPrice: number;
  hasLiveStream: boolean;
  liveStreamSchedule: string;
}

interface AutoCategorization {
  detectedPropertyType: string;
  detectedLocation: string;
  suggestedCategory: string;
  dealCategory: boolean;
  liveStreamEligible: boolean;
  confidence: number;
  reasoning: string[];
}

export default function ListProperty() {
  const navigate = useNavigate();
  const [property, setProperty] = useState<PropertyListing>({
    title: "",
    description: "",
    location: "",
    address: "",
    price: 0,
    bedrooms: 1,
    bathrooms: 1,
    amenities: [],
    images: [],
    propertyType: "",
    hasDiscount: false,
    discountPercentage: 0,
    originalPrice: 0,
    hasLiveStream: false,
    liveStreamSchedule: "",
  });

  const [categorization, setCategorization] =
    useState<AutoCategorization | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const amenityOptions = [
    "WiFi",
    "Pool",
    "Gym",
    "Parking",
    "Kitchen",
    "AC",
    "Heating",
    "Balcony",
    "Garden",
    "Fireplace",
    "Hot Tub",
    "Beach Access",
    "Mountain View",
    "City View",
    "Pet Friendly",
    "24/7 Security",
  ];

  const propertyTypes = [
    {
      id: "cabin",
      name: "Cabins",
      keywords: ["cabin", "log", "rustic", "forest", "mountain"],
    },
    {
      id: "cottage",
      name: "Cottages",
      keywords: ["cottage", "countryside", "charming", "lakeside"],
    },
    {
      id: "villa",
      name: "Villas",
      keywords: ["villa", "luxury", "private", "pool", "garden"],
    },
    {
      id: "penthouse",
      name: "Penthouses",
      keywords: ["penthouse", "top floor", "city view", "luxury"],
    },
    {
      id: "loft",
      name: "Lofts",
      keywords: ["loft", "industrial", "open plan", "urban"],
    },
    {
      id: "bungalow",
      name: "Bungalows",
      keywords: ["bungalow", "tropical", "single story"],
    },
    {
      id: "treehouse",
      name: "Treehouses",
      keywords: ["treehouse", "tree", "elevated", "nature"],
    },
    {
      id: "tiny-house",
      name: "Tiny Houses",
      keywords: ["tiny", "small", "compact", "minimalist"],
    },
  ];

  const analyzeProperty = async () => {
    setIsAnalyzing(true);

    // Simulate AI analysis delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const analysis = performAutoCategorization(property);
    setCategorization(analysis);
    setIsAnalyzing(false);
  };

  const performAutoCategorization = (
    prop: PropertyListing,
  ): AutoCategorization => {
    const reasoning: string[] = [];
    let confidence = 85;

    // Detect property type
    const description = (prop.title + " " + prop.description).toLowerCase();
    let detectedType = "villa"; // default

    for (const type of propertyTypes) {
      if (type.keywords.some((keyword) => description.includes(keyword))) {
        detectedType = type.id;
        reasoning.push(`Detected "${type.name}" from keywords in description`);
        break;
      }
    }

    // Detect location category
    const location = prop.location.toLowerCase();
    let locationCategory = "urban";
    if (location.includes("beach") || location.includes("coastal")) {
      locationCategory = "coastal";
      reasoning.push("Coastal location detected from address");
    } else if (location.includes("mountain") || location.includes("forest")) {
      locationCategory = "nature";
      reasoning.push("Nature/mountain location detected");
    } else if (location.includes("city") || location.includes("downtown")) {
      locationCategory = "urban";
      reasoning.push("Urban location detected");
    }

    // Determine deal eligibility
    const isDeal = prop.hasDiscount && prop.discountPercentage > 15;
    if (isDeal) {
      reasoning.push(
        `${prop.discountPercentage}% discount qualifies for deals section`,
      );
    }

    // Determine live stream eligibility
    const isLiveEligible =
      prop.hasLiveStream ||
      prop.price > 200 ||
      detectedType === "penthouse" ||
      detectedType === "villa";
    if (isLiveEligible) {
      reasoning.push(
        "Property qualifies for live streaming based on type and price",
      );
    }

    // Suggest overall category
    let suggestedCategory = "regular";
    if (isDeal) suggestedCategory = "deals";
    else if (isLiveEligible) suggestedCategory = "live-tours";

    return {
      detectedPropertyType: detectedType,
      detectedLocation: locationCategory,
      suggestedCategory,
      dealCategory: isDeal,
      liveStreamEligible: isLiveEligible,
      confidence,
      reasoning,
    };
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate property submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In a real app, this would save to database with the categorization
    console.log("Property submitted with categorization:", {
      property,
      categorization,
    });

    setIsSubmitting(false);

    // Show success and redirect
    alert(
      "Property listed successfully! It has been automatically categorized and will appear in the appropriate section.",
    );
    navigate("/stays");
  };

  const toggleAmenity = (amenity: string) => {
    setProperty((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/stays"
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Stays</span>
              </Link>
              <div className="h-6 w-px bg-border"></div>
              <div className="flex items-center space-x-2">
                <Home className="h-6 w-6 text-travel-orange" />
                <span className="text-xl font-bold bg-gradient-to-r from-travel-orange to-travel-blue bg-clip-text text-transparent">
                  List Your Property
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              List Your Property on Traveltheworld.ai
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Our AI will automatically categorize your property based on
              location, type, and features
            </p>
            <Badge className="bg-travel-orange/10 text-travel-orange border-travel-orange/20">
              🤖 AI-Powered Auto-Categorization
            </Badge>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Property Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Home className="h-5 w-5 mr-2" />
                    Property Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Property Title
                    </label>
                    <Input
                      placeholder="e.g., Luxury Beachfront Villa with Pool"
                      value={property.title}
                      onChange={(e) =>
                        setProperty((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Description
                    </label>
                    <Textarea
                      placeholder="Describe your property, its features, and what makes it special..."
                      value={property.description}
                      onChange={(e) =>
                        setProperty((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Location
                      </label>
                      <Input
                        placeholder="e.g., Seminyak, Bali"
                        value={property.location}
                        onChange={(e) =>
                          setProperty((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Full Address
                      </label>
                      <Input
                        placeholder="Street address"
                        value={property.address}
                        onChange={(e) =>
                          setProperty((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Price per night ($)
                      </label>
                      <Input
                        type="number"
                        value={property.price}
                        onChange={(e) =>
                          setProperty((prev) => ({
                            ...prev,
                            price: parseInt(e.target.value) || 0,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Bedrooms
                      </label>
                      <Input
                        type="number"
                        min="1"
                        value={property.bedrooms}
                        onChange={(e) =>
                          setProperty((prev) => ({
                            ...prev,
                            bedrooms: parseInt(e.target.value) || 1,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Bathrooms
                      </label>
                      <Input
                        type="number"
                        min="1"
                        value={property.bathrooms}
                        onChange={(e) =>
                          setProperty((prev) => ({
                            ...prev,
                            bathrooms: parseInt(e.target.value) || 1,
                          }))
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {amenityOptions.map((amenity) => (
                      <Button
                        key={amenity}
                        variant={
                          property.amenities.includes(amenity)
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => toggleAmenity(amenity)}
                        className="justify-start"
                      >
                        {amenity}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pricing & Promotions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Tag className="h-5 w-5 mr-2" />
                    Pricing & Promotions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="hasDiscount"
                      checked={property.hasDiscount}
                      onChange={(e) =>
                        setProperty((prev) => ({
                          ...prev,
                          hasDiscount: e.target.checked,
                        }))
                      }
                    />
                    <label
                      htmlFor="hasDiscount"
                      className="text-sm font-medium"
                    >
                      Offer promotional discount
                    </label>
                  </div>

                  {property.hasDiscount && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Original Price ($)
                        </label>
                        <Input
                          type="number"
                          value={property.originalPrice}
                          onChange={(e) =>
                            setProperty((prev) => ({
                              ...prev,
                              originalPrice: parseInt(e.target.value) || 0,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Discount (%)
                        </label>
                        <Input
                          type="number"
                          min="1"
                          max="50"
                          value={property.discountPercentage}
                          onChange={(e) =>
                            setProperty((prev) => ({
                              ...prev,
                              discountPercentage: parseInt(e.target.value) || 0,
                            }))
                          }
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Live Streaming */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Video className="h-5 w-5 mr-2" />
                    Live Streaming Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="hasLiveStream"
                      checked={property.hasLiveStream}
                      onChange={(e) =>
                        setProperty((prev) => ({
                          ...prev,
                          hasLiveStream: e.target.checked,
                        }))
                      }
                    />
                    <label
                      htmlFor="hasLiveStream"
                      className="text-sm font-medium"
                    >
                      Offer live virtual tours
                    </label>
                  </div>

                  {property.hasLiveStream && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Available for live tours
                      </label>
                      <Input
                        placeholder="e.g., Daily 10 AM - 6 PM"
                        value={property.liveStreamSchedule}
                        onChange={(e) =>
                          setProperty((prev) => ({
                            ...prev,
                            liveStreamSchedule: e.target.value,
                          }))
                        }
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* AI Analysis Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2" />
                    AI Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={analyzeProperty}
                    disabled={
                      !property.title || !property.location || isAnalyzing
                    }
                    className="w-full mb-4"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Analyze Property
                      </>
                    )}
                  </Button>

                  {categorization && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="font-medium">Analysis Complete</span>
                        <Badge variant="secondary">
                          {categorization.confidence}% confident
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm">Property Type</h4>
                          <p className="text-sm text-muted-foreground capitalize">
                            {categorization.detectedPropertyType}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium text-sm">
                            Location Category
                          </h4>
                          <p className="text-sm text-muted-foreground capitalize">
                            {categorization.detectedLocation}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium text-sm">
                            Will appear in
                          </h4>
                          <Badge
                            className={
                              categorization.suggestedCategory === "deals"
                                ? "bg-red-100 text-red-700"
                                : categorization.suggestedCategory ===
                                    "live-tours"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-700"
                            }
                          >
                            {categorization.suggestedCategory === "deals" &&
                              "💰 Amazing Deals"}
                            {categorization.suggestedCategory ===
                              "live-tours" && "📹 Live Tours"}
                            {categorization.suggestedCategory === "regular" &&
                              "🏠 All Properties"}
                          </Badge>
                        </div>

                        <div>
                          <h4 className="font-medium text-sm mb-2">
                            AI Reasoning
                          </h4>
                          <div className="space-y-1">
                            {categorization.reasoning.map((reason, index) => (
                              <p
                                key={index}
                                className="text-xs text-muted-foreground"
                              >
                                • {reason}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {categorization && (
                <Card>
                  <CardHeader>
                    <CardTitle>Ready to Submit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your property has been analyzed and will be automatically
                      categorized for optimal visibility.
                    </p>
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full bg-travel-orange hover:bg-travel-orange/90"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        "List My Property"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
