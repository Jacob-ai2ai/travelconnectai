import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Plane,
  Home,
  Mountain,
  Utensils,
  Car,
  Clock,
  Star,
  ArrowLeft,
  Edit3,
} from "lucide-react";
import { Link } from "react-router-dom";

interface TourPlan {
  id: string;
  title: string;
  duration: string;
  price: number;
  priceType: string;
  rating: number;
  highlights: string[];
  itinerary: {
    day: number;
    activities: string[];
    accommodation: string;
    meals: string[];
  }[];
  includes: string[];
  category: "budget" | "standard" | "luxury";
}

export default function AIPlanner() {
  const [prompt, setPrompt] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [tourPlans, setTourPlans] = useState<TourPlan[]>([]);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Sample tour plans data
  const sampleTourPlans: TourPlan[] = [
    {
      id: "budget-bali",
      title: "Budget Bali Adventure",
      duration: "7 Days, 6 Nights",
      price: 899,
      priceType: "per person",
      rating: 4.2,
      highlights: [
        "Ubud Rice Terraces",
        "Temple Visits",
        "Local Markets",
        "Beach Time",
      ],
      category: "budget",
      itinerary: [
        {
          day: 1,
          activities: [
            "Arrival in Denpasar",
            "Transfer to Ubud",
            "Welcome dinner",
          ],
          accommodation: "Budget Guesthouse in Ubud",
          meals: ["Dinner"],
        },
        {
          day: 2,
          activities: [
            "Tegallalang Rice Terraces",
            "Sacred Monkey Forest",
            "Traditional Market",
          ],
          accommodation: "Budget Guesthouse in Ubud",
          meals: ["Breakfast", "Lunch", "Dinner"],
        },
        {
          day: 3,
          activities: ["Temple hopping", "Cooking class", "Cultural show"],
          accommodation: "Budget Guesthouse in Ubud",
          meals: ["Breakfast", "Lunch", "Dinner"],
        },
      ],
      includes: [
        "Accommodation",
        "Daily breakfast",
        "Airport transfers",
        "Local guide",
        "Entrance fees",
      ],
    },
    {
      id: "standard-bali",
      title: "Classic Bali Experience",
      duration: "7 Days, 6 Nights",
      price: 1599,
      priceType: "per person",
      rating: 4.6,
      highlights: [
        "Luxury Resort Stay",
        "Private Tours",
        "Spa Treatments",
        "Fine Dining",
      ],
      category: "standard",
      itinerary: [
        {
          day: 1,
          activities: [
            "VIP airport pickup",
            "Resort check-in",
            "Sunset dinner",
          ],
          accommodation: "4-Star Resort in Seminyak",
          meals: ["Welcome drink", "Dinner"],
        },
        {
          day: 2,
          activities: [
            "Private Ubud tour",
            "Rice terrace walk",
            "Spa treatment",
          ],
          accommodation: "4-Star Resort in Seminyak",
          meals: ["Breakfast", "Lunch", "Dinner"],
        },
        {
          day: 3,
          activities: ["Water sports", "Beach club", "Sunset viewing"],
          accommodation: "4-Star Resort in Seminyak",
          meals: ["Breakfast", "Lunch", "Dinner"],
        },
      ],
      includes: [
        "4-star accommodation",
        "All meals",
        "Private transfers",
        "Spa session",
        "Activities",
      ],
    },
    {
      id: "luxury-bali",
      title: "Ultimate Bali Luxury",
      duration: "7 Days, 6 Nights",
      price: 3299,
      priceType: "per person",
      rating: 4.9,
      highlights: [
        "5-Star Villas",
        "Private Butler",
        "Helicopter Tours",
        "Michelin Dining",
      ],
      category: "luxury",
      itinerary: [
        {
          day: 1,
          activities: [
            "Private jet arrival",
            "Villa check-in",
            "Private chef dinner",
          ],
          accommodation: "5-Star Private Villa",
          meals: ["Champagne welcome", "Gourmet dinner"],
        },
        {
          day: 2,
          activities: [
            "Helicopter island tour",
            "Private yacht",
            "Spa treatment",
          ],
          accommodation: "5-Star Private Villa",
          meals: ["Breakfast", "Lunch", "Fine dining"],
        },
        {
          day: 3,
          activities: [
            "Private temple tour",
            "Cooking with celebrity chef",
            "Cultural performance",
          ],
          accommodation: "5-Star Private Villa",
          meals: ["Breakfast", "Lunch", "Michelin dinner"],
        },
      ],
      includes: [
        "Luxury villa",
        "Private butler",
        "All transfers",
        "All activities",
        "Fine dining",
      ],
    },
  ];

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      setSpeechSupported(true);
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setPrompt((prev) => prev + " " + finalTranscript);
        }
      };

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === "not-allowed") {
          alert(
            "Microphone access is required for voice input. Please allow microphone access and try again.",
          );
        }
      };
    } else {
      setSpeechSupported(false);
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        setIsListening(false);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error("Error stopping speech recognition:", error);
        setIsListening(false);
      }
    }
  };

  const generateItinerary = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setTourPlans(sampleTourPlans);
    setIsGenerating(false);
    setShowResults(true);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "budget":
        return "bg-travel-green/10 text-travel-green border-travel-green/20";
      case "standard":
        return "bg-travel-blue/10 text-travel-blue border-travel-blue/20";
      case "luxury":
        return "bg-travel-purple/10 text-travel-purple border-travel-purple/20";
      default:
        return "bg-muted";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "budget":
        return "💰";
      case "standard":
        return "⭐";
      case "luxury":
        return "👑";
      default:
        return "🌟";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <div className="w-8 h-8 bg-gradient-to-br from-travel-blue to-travel-purple rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-travel-blue to-travel-purple bg-clip-text text-transparent">
              AI Trip Planner
            </span>
          </div>
        </div>
      </header>

      {!showResults ? (
        /* Input Section */
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <Badge variant="secondary" className="mb-4">
                🤖 Powered by Advanced AI
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Tell us your{" "}
                <span className="bg-gradient-to-r from-travel-blue via-travel-purple to-travel-orange bg-clip-text text-transparent">
                  Dream Trip
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Just describe where you want to go, when, and with whom. Our AI
                will create personalized itineraries with multiple options and
                budgets.
              </p>
            </div>

            {/* Prompt Input */}
            <Card className="max-w-3xl mx-auto p-8 border-2 border-travel-blue/20">
              <div className="space-y-6">
                <div className="text-left">
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Describe your ideal trip (Type or speak):
                  </label>
                  <div className="relative">
                    <Textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="I want to go to Bali, Indonesia with my partner for 7 days from March 15th to March 22nd. We love adventure activities, cultural experiences, and romantic dinners. Our budget is around $2000 per person."
                      className="min-h-[120px] pr-12 text-base leading-relaxed"
                    />
                    <Button
                      size="sm"
                      variant={isListening ? "destructive" : "outline"}
                      className="absolute bottom-3 right-3"
                      onClick={isListening ? stopListening : startListening}
                      disabled={!speechSupported}
                      title={
                        speechSupported
                          ? isListening
                            ? "Stop listening"
                            : "Start voice input"
                          : "Voice input not supported in this browser"
                      }
                    >
                      {isListening ? (
                        <MicOff className="h-4 w-4" />
                      ) : (
                        <Mic className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {isListening && (
                    <div className="mt-2 flex items-center space-x-2 text-sm text-travel-blue">
                      <div className="w-2 h-2 bg-travel-blue rounded-full animate-pulse"></div>
                      <span>
                        🎤 Listening... Speak now (click stop when done)
                      </span>
                    </div>
                  )}
                  {!speechSupported && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      ℹ️ Voice input requires a modern browser. Please type your
                      request instead.
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={generateItinerary}
                    disabled={!prompt.trim() || isGenerating}
                    size="lg"
                    className="flex-1 bg-travel-blue hover:bg-travel-blue/90"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Generating Your Perfect Trip...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Create My Itinerary
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground">
                  💡 <strong>Pro tip:</strong> Be specific about your interests,
                  budget, and travel style for better recommendations!
                </div>
              </div>
            </Card>

            {/* Sample Prompts */}
            <div className="mt-12">
              <h3 className="text-lg font-semibold mb-4">
                Need inspiration? Try these:
              </h3>
              <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {[
                  "Planning a family trip to Japan for 10 days with 2 kids, love theme parks and cultural sites",
                  "Romantic honeymoon in Maldives for 5 days, luxury resorts and water activities",
                  "Adventure trip to New Zealand for 14 days, hiking, bungee jumping, and scenic drives",
                  "Cultural exploration of Morocco for 8 days, traditional markets, desert, and historical sites",
                ].map((example, index) => (
                  <Card
                    key={index}
                    className="p-4 cursor-pointer hover:shadow-md transition-shadow border-travel-orange/20 hover:border-travel-orange/40"
                    onClick={() => setPrompt(example)}
                  >
                    <p className="text-sm text-left">{example}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* Results Section */
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Results Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Your Personalized Trip Options
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                We've created multiple itineraries based on your preferences.
                Choose the one that fits your style and budget.
              </p>
              <Button
                variant="outline"
                onClick={() => setShowResults(false)}
                className="mb-6"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Modify Request
              </Button>
            </div>

            {/* Tour Plans Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {tourPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className="overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        className={`${getCategoryColor(plan.category)} border`}
                      >
                        {getCategoryIcon(plan.category)}{" "}
                        {plan.category.charAt(0).toUpperCase() +
                          plan.category.slice(1)}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {plan.rating}
                        </span>
                      </div>
                    </div>
                    <CardTitle className="text-xl mb-2">{plan.title}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{plan.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>
                          ${plan.price} {plan.priceType}
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Highlights */}
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        Highlights
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {plan.highlights.map((highlight, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Sample Itinerary */}
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Sample Itinerary
                      </h4>
                      <div className="space-y-2">
                        {plan.itinerary.slice(0, 3).map((day) => (
                          <div key={day.day} className="text-sm">
                            <div className="font-medium">Day {day.day}</div>
                            <div className="text-muted-foreground">
                              {day.activities.slice(0, 2).join(", ")}
                              {day.activities.length > 2 && "..."}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Includes */}
                    <div>
                      <h4 className="font-semibold mb-2">Includes</h4>
                      <div className="space-y-1">
                        {plan.includes.slice(0, 3).map((item, index) => (
                          <div
                            key={index}
                            className="text-sm text-muted-foreground flex items-center"
                          >
                            <div className="w-1.5 h-1.5 bg-travel-green rounded-full mr-2"></div>
                            {item}
                          </div>
                        ))}
                        {plan.includes.length > 3 && (
                          <div className="text-sm text-muted-foreground">
                            +{plan.includes.length - 3} more items
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 space-y-2">
                      <Button className="w-full bg-travel-blue hover:bg-travel-blue/90">
                        Select This Plan
                      </Button>
                      <Link to={`/trip-details/${plan.id}`}>
                        <Button variant="outline" className="w-full">
                          View Full Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional Options */}
            <div className="mt-12 text-center">
              <h3 className="text-xl font-semibold mb-4">
                Want Something Different?
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" onClick={() => setShowResults(false)}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Modify Your Request
                </Button>
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Talk to Travel Expert
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
