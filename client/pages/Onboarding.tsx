import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import {
  User,
  Building2,
  Store,
  Mountain,
  Waves,
  MapPin,
  Heart,
  Camera,
  Utensils,
  Music,
  Briefcase,
  Users,
  Backpack,
  Star,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Globe,
} from "lucide-react";

type OnboardingStep =
  | "role"
  | "themes"
  | "destinations"
  | "travelerType"
  | "complete";

interface UserProfile {
  role: string;
  themes: string[];
  destinations: string[];
  travelerType: string;
  additionalInfo: {
    budget?: string;
    groupSize?: string;
    travelFrequency?: string;
  };
}

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("role");
  const [profile, setProfile] = useState<UserProfile>({
    role: "",
    themes: [],
    destinations: [],
    travelerType: "",
    additionalInfo: {},
  });

  const steps = ["role", "themes", "destinations", "travelerType", "complete"];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const roles = [
    {
      id: "traveler",
      title: "Traveler",
      description: "I want to plan and book trips",
      icon: User,
      color: "travel-blue",
    },
    {
      id: "admin",
      title: "Admin",
      description: "I manage platform operations",
      icon: Briefcase,
      color: "travel-purple",
    },
    {
      id: "travel-vendor",
      title: "Travel Vendor",
      description:
        "I provide travel services (airlines, stays, experiences, events, products)",
      icon: Store,
      color: "travel-orange",
    },
  ];

  const travelThemes = [
    {
      id: "adventure",
      title: "Adventure & Sports",
      icon: Mountain,
      description: "Hiking, skiing, extreme sports",
    },
    {
      id: "beach",
      title: "Beach & Relaxation",
      icon: Waves,
      description: "Beaches, spas, resorts",
    },
    {
      id: "culture",
      title: "Culture & History",
      icon: MapPin,
      description: "Museums, heritage sites",
    },
    {
      id: "romance",
      title: "Romance & Honeymoon",
      icon: Heart,
      description: "Romantic getaways",
    },
    {
      id: "photography",
      title: "Photography",
      icon: Camera,
      description: "Instagram-worthy spots",
    },
    {
      id: "food",
      title: "Food & Wine",
      icon: Utensils,
      description: "Culinary experiences",
    },
    {
      id: "nightlife",
      title: "Nightlife & Entertainment",
      icon: Music,
      description: "Clubs, bars, concerts",
    },
    {
      id: "business",
      title: "Business Travel",
      icon: Briefcase,
      description: "Work trips, conferences",
    },
    {
      id: "family",
      title: "Family Fun",
      icon: Users,
      description: "Kid-friendly activities",
    },
    {
      id: "backpacking",
      title: "Backpacking & Budget",
      icon: Backpack,
      description: "Budget travel, hostels",
    },
    {
      id: "luxury",
      title: "Luxury Travel",
      icon: Star,
      description: "Premium experiences",
    },
    {
      id: "wellness",
      title: "Wellness & Spa",
      icon: Sparkles,
      description: "Health, meditation, yoga",
    },
  ];

  const popularDestinations = [
    "Bali, Indonesia",
    "Paris, France",
    "Tokyo, Japan",
    "New York, USA",
    "London, UK",
    "Dubai, UAE",
    "Bangkok, Thailand",
    "Rome, Italy",
    "Barcelona, Spain",
    "Amsterdam, Netherlands",
    "Sydney, Australia",
    "Singapore",
    "Istanbul, Turkey",
    "Prague, Czech Republic",
    "Santorini, Greece",
    "Maldives",
    "Iceland",
    "Swiss Alps",
    "Mumbai, India",
    "Rio de Janeiro, Brazil",
    "Cairo, Egypt",
    "Morocco",
  ];

  const travelerTypes = [
    {
      id: "solo",
      title: "Solo Traveler",
      description: "I prefer traveling alone",
      icon: User,
    },
    {
      id: "couple",
      title: "Couple",
      description: "I travel with my partner",
      icon: Heart,
    },
    {
      id: "family",
      title: "Family with Kids",
      description: "I travel with children",
      icon: Users,
    },
    {
      id: "friends",
      title: "Group of Friends",
      description: "I travel with friends",
      icon: Users,
    },
    {
      id: "business",
      title: "Business Traveler",
      description: "I travel for work",
      icon: Briefcase,
    },
  ];

  const handleNext = () => {
    const stepIndex = steps.indexOf(currentStep);
    if (stepIndex < steps.length - 1) {
      setCurrentStep(steps[stepIndex + 1] as OnboardingStep);
    }
  };

  const handleBack = () => {
    const stepIndex = steps.indexOf(currentStep);
    if (stepIndex > 0) {
      setCurrentStep(steps[stepIndex - 1] as OnboardingStep);
    }
  };

  const handleRoleSelect = (roleId: string) => {
    setProfile({ ...profile, role: roleId });

    // Redirect travel vendors and admins to their specific flows
    if (roleId === "admin") {
      navigate("/admin");
      return;
    }

    if (roleId === "travel-vendor") {
      // Send vendors to a vendor categories page where they can choose their vendor type
      navigate("/vendors");
      return;
    }
  };

  const handleThemeToggle = (themeId: string) => {
    const newThemes = profile.themes.includes(themeId)
      ? profile.themes.filter((t) => t !== themeId)
      : [...profile.themes, themeId];
    setProfile({ ...profile, themes: newThemes });
  };

  const handleDestinationToggle = (destination: string) => {
    const newDestinations = profile.destinations.includes(destination)
      ? profile.destinations.filter((d) => d !== destination)
      : [...profile.destinations, destination];
    setProfile({ ...profile, destinations: newDestinations });
  };

  const handleTravelerTypeSelect = (typeId: string) => {
    setProfile({ ...profile, travelerType: typeId });
  };

  const handleComplete = () => {
    console.log("Onboarding completed with profile:", profile);
    // TODO: Save profile to backend
    navigate("/ai-planner");
  };

  const canProceed = () => {
    switch (currentStep) {
      case "role":
        return profile.role !== "";
      case "themes":
        return profile.themes.length >= 3;
      case "destinations":
        return profile.destinations.length >= 1;
      case "travelerType":
        return profile.travelerType !== "";
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-travel-blue to-travel-purple rounded-lg flex items-center justify-center">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-travel-blue to-travel-purple bg-clip-text text-transparent">
                Travel Connect
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Step {currentStepIndex + 1} of {steps.length}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step 1: Role Selection */}
        {currentStep === "role" && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">
                Welcome to Travel Connect!
              </h1>
              <p className="text-muted-foreground">
                Let's get you set up. What brings you here?
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {roles.map((role) => {
                const Icon = role.icon;
                const isSelected = profile.role === role.id;

                return (
                  <Card
                    key={role.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      isSelected
                        ? `border-${role.color} ring-2 ring-${role.color}/20`
                        : ""
                    }`}
                    onClick={() => handleRoleSelect(role.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-16 h-16 bg-${role.color}/10 rounded-xl flex items-center justify-center mx-auto mb-4`}
                      >
                        <Icon className={`h-8 w-8 text-${role.color}`} />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {role.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {role.description}
                      </p>
                      {isSelected && (
                        <div className="mt-4">
                          <CheckCircle
                            className={`h-6 w-6 text-${role.color} mx-auto`}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Travel Themes */}
        {currentStep === "themes" && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">
                What kind of trips do you love?
              </h1>
              <p className="text-muted-foreground">
                Choose at least 3 themes that interest you. This helps us
                personalize your experience.
              </p>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {travelThemes.map((theme) => {
                const Icon = theme.icon;
                const isSelected = profile.themes.includes(theme.id);

                return (
                  <Card
                    key={theme.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      isSelected
                        ? "border-travel-blue ring-2 ring-travel-blue/20 bg-travel-blue/5"
                        : ""
                    }`}
                    onClick={() => handleThemeToggle(theme.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-travel-blue/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Icon className="h-6 w-6 text-travel-blue" />
                      </div>
                      <h4 className="font-semibold mb-1 text-sm">
                        {theme.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {theme.description}
                      </p>
                      {isSelected && (
                        <div className="mt-2">
                          <CheckCircle className="h-4 w-4 text-travel-blue mx-auto" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="text-center">
              <Badge variant="secondary" className="text-sm">
                {profile.themes.length} of 3+ themes selected
              </Badge>
            </div>
          </div>
        )}

        {/* Step 3: Destinations */}
        {currentStep === "destinations" && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">
                Where would you like to go?
              </h1>
              <p className="text-muted-foreground">
                Select destinations that are on your bucket list or places you'd
                like to visit.
              </p>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
              {popularDestinations.map((destination) => {
                const isSelected = profile.destinations.includes(destination);

                return (
                  <Card
                    key={destination}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      isSelected
                        ? "border-travel-green ring-2 ring-travel-green/20 bg-travel-green/5"
                        : ""
                    }`}
                    onClick={() => handleDestinationToggle(destination)}
                  >
                    <CardContent className="p-3 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <MapPin className="h-4 w-4 text-travel-green" />
                        <span className="text-sm font-medium">
                          {destination}
                        </span>
                        {isSelected && (
                          <CheckCircle className="h-4 w-4 text-travel-green" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="text-center">
              <Badge variant="secondary" className="text-sm">
                {profile.destinations.length} destinations selected
              </Badge>
            </div>

            <div className="max-w-md mx-auto">
              <Label htmlFor="custom-destination">
                Add your own destination
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="custom-destination"
                  placeholder="Enter a city or country"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      const value = (e.target as HTMLInputElement).value.trim();
                      if (value && !profile.destinations.includes(value)) {
                        handleDestinationToggle(value);
                        (e.target as HTMLInputElement).value = "";
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Traveler Type */}
        {currentStep === "travelerType" && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">
                How do you usually travel?
              </h1>
              <p className="text-muted-foreground">
                This helps us suggest the right accommodations and activities
                for you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {travelerTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = profile.travelerType === type.id;

                return (
                  <Card
                    key={type.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      isSelected
                        ? "border-travel-purple ring-2 ring-travel-purple/20 bg-travel-purple/5"
                        : ""
                    }`}
                    onClick={() => handleTravelerTypeSelect(type.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-travel-purple/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-8 w-8 text-travel-purple" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        {type.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {type.description}
                      </p>
                      {isSelected && (
                        <div className="mt-4">
                          <CheckCircle className="h-6 w-6 text-travel-purple mx-auto" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5: Complete */}
        {currentStep === "complete" && (
          <div className="space-y-6 text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-travel-blue to-travel-purple rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="h-12 w-12 text-white" />
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-4">You're all set!</h1>
              <p className="text-lg text-muted-foreground mb-6">
                Welcome to Travel Connect! Our AI is now personalizing your
                experience based on your preferences.
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-6 text-left">
              <h3 className="font-semibold mb-4">Your Profile Summary:</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Role:</strong>{" "}
                  {roles.find((r) => r.id === profile.role)?.title}
                </div>
                <div>
                  <strong>Travel Themes:</strong> {profile.themes.length}{" "}
                  selected
                </div>
                <div>
                  <strong>Destinations:</strong> {profile.destinations.length}{" "}
                  selected
                </div>
                <div>
                  <strong>Travel Style:</strong>{" "}
                  {
                    travelerTypes.find((t) => t.id === profile.travelerType)
                      ?.title
                  }
                </div>
              </div>
            </div>

            <Button
              onClick={handleComplete}
              size="lg"
              className="bg-gradient-to-r from-travel-blue to-travel-purple hover:from-travel-blue/90 hover:to-travel-purple/90"
            >
              Start Planning with AI
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Navigation */}
        {currentStep !== "complete" && (
          <div className="flex justify-between items-center mt-12">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === "role"}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-travel-blue hover:bg-travel-blue/90"
            >
              {currentStep === "travelerType" ? "Complete Setup" : "Continue"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
