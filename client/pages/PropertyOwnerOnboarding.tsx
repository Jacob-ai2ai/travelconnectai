import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Building2, 
  Home, 
  Hotel, 
  Building, 
  Castle, 
  TreePine, 
  Plus,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Star,
  Wifi,
  Car,
  Waves,
  Dog,
  ChefHat,
  Snowflake,
  Heart,
  Utensils,
  Plane,
  Briefcase,
  Accessibility,
  Baby,
  Shirt,
  Upload,
  Camera,
  Video,
  DollarSign,
  CreditCard,
  Shield,
  FileText,
  CheckCircle,
  Sparkles,
  Eye
} from "lucide-react";

type OnboardingStep = "account" | "property-type" | "details" | "amenities" | "media" | "pricing" | "verification" | "success";

interface PropertyOwnerProfile {
  // Account info
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  
  // Property info
  propertyType: string;
  propertyName: string;
  location: string;
  starRating: string;
  numberOfRooms: string;
  
  // Amenities
  amenities: string[];
  
  // Media
  photos: File[];
  videos: File[];
  virtualTourLink: string;
  
  // Pricing
  basePrice: string;
  seasonalPricing: string;
  cancellationPolicy: string;
  paymentMethods: string[];
  
  // Verification
  idProof: File | null;
  bankAccount: string;
}

export default function PropertyOwnerOnboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("account");
  const [profile, setProfile] = useState<PropertyOwnerProfile>({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    propertyType: "",
    propertyName: "",
    location: "",
    starRating: "",
    numberOfRooms: "",
    amenities: [],
    photos: [],
    videos: [],
    virtualTourLink: "",
    basePrice: "",
    seasonalPricing: "",
    cancellationPolicy: "",
    paymentMethods: [],
    idProof: null,
    bankAccount: "",
  });

  const steps: OnboardingStep[] = ["account", "property-type", "details", "amenities", "media", "pricing", "verification", "success"];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const propertyTypes = [
    { id: "hotel", title: "Hotel / Resort", icon: Hotel, description: "Full-service accommodation" },
    { id: "homestay", title: "Homestay", icon: Home, description: "Family-run accommodation" },
    { id: "hostel", title: "Hostel", icon: Building2, description: "Budget-friendly shared spaces" },
    { id: "villa", title: "Villa / Apartment", icon: Building, description: "Private rental properties" },
    { id: "guesthouse", title: "Guesthouse", icon: Castle, description: "Small intimate properties" },
    { id: "farmstay", title: "Farm Stay", icon: TreePine, description: "Rural farm experiences" },
    { id: "others", title: "Others", icon: Plus, description: "Unique property types" },
  ];

  const amenitiesList = [
    { id: "wifi", title: "Free Wi-Fi", icon: Wifi },
    { id: "parking", title: "Parking", icon: Car },
    { id: "pool", title: "Swimming Pool", icon: Waves },
    { id: "pets", title: "Pet-friendly", icon: Dog },
    { id: "kitchen", title: "Kitchen", icon: ChefHat },
    { id: "ac", title: "Air Conditioning", icon: Snowflake },
    { id: "spa", title: "Spa / Wellness", icon: Heart },
    { id: "restaurant", title: "Restaurant / Bar", icon: Utensils },
    { id: "airport", title: "Airport Pickup", icon: Plane },
    { id: "business", title: "Business Facilities", icon: Briefcase },
    { id: "accessibility", title: "Accessibility", icon: Accessibility },
    { id: "child", title: "Child-friendly", icon: Baby },
    { id: "laundry", title: "Laundry", icon: Shirt },
  ];

  const paymentMethodsList = [
    { id: "cards", title: "Credit/Debit Cards" },
    { id: "upi", title: "UPI" },
    { id: "paypal", title: "PayPal" },
    { id: "bank", title: "Bank Transfer" },
  ];

  const handleNext = () => {
    const stepIndex = steps.indexOf(currentStep);
    if (stepIndex < steps.length - 1) {
      setCurrentStep(steps[stepIndex + 1]);
    }
  };

  const handleBack = () => {
    const stepIndex = steps.indexOf(currentStep);
    if (stepIndex > 0) {
      setCurrentStep(steps[stepIndex - 1]);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Social login with ${provider}`);
    // TODO: Implement social login
    handleNext();
  };

  const handleAccountSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.password !== profile.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    if (!profile.agreeToTerms) {
      alert("Please agree to the terms and privacy policy!");
      return;
    }
    handleNext();
  };

  const handlePropertyTypeSelect = (typeId: string) => {
    setProfile({ ...profile, propertyType: typeId });
  };

  const handleAmenityToggle = (amenityId: string) => {
    const newAmenities = profile.amenities.includes(amenityId)
      ? profile.amenities.filter(a => a !== amenityId)
      : [...profile.amenities, amenityId];
    setProfile({ ...profile, amenities: newAmenities });
  };

  const handlePaymentMethodToggle = (methodId: string) => {
    const newMethods = profile.paymentMethods.includes(methodId)
      ? profile.paymentMethods.filter(m => m !== methodId)
      : [...profile.paymentMethods, methodId];
    setProfile({ ...profile, paymentMethods: newMethods });
  };

  const handleFileUpload = (files: FileList | null, type: 'photos' | 'videos' | 'id') => {
    if (!files) return;
    
    if (type === 'photos') {
      setProfile({ ...profile, photos: [...profile.photos, ...Array.from(files)] });
    } else if (type === 'videos') {
      setProfile({ ...profile, videos: [...profile.videos, ...Array.from(files)] });
    } else if (type === 'id' && files[0]) {
      setProfile({ ...profile, idProof: files[0] });
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case "account":
        return profile.email && profile.password && profile.confirmPassword && profile.agreeToTerms;
      case "property-type":
        return profile.propertyType !== "";
      case "details":
        return profile.propertyName && profile.location && profile.starRating && profile.numberOfRooms;
      case "amenities":
        return true; // Optional step
      case "media":
        return profile.photos.length > 0;
      case "pricing":
        return profile.basePrice && profile.cancellationPolicy && profile.paymentMethods.length > 0;
      case "verification":
        return profile.idProof && profile.bankAccount;
      default:
        return true;
    }
  };

  const handleComplete = () => {
    console.log("Property owner onboarding completed:", profile);
    // TODO: Submit to backend
    navigate("/property-dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent">
                Travel Connect
              </span>
            </div>
            {currentStep !== "success" && (
              <div className="text-sm text-muted-foreground">
                Step {currentStepIndex + 1} of {steps.length}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Bar */}
        {currentStep !== "success" && (
          <div className="mb-8">
            <Progress value={progress} className="h-2 bg-teal-100" />
            <div className="flex justify-between mt-2 text-xs text-teal-600">
              <span>Account</span>
              <span>Property</span>
              <span>Details</span>
              <span>Amenities</span>
              <span>Media</span>
              <span>Pricing</span>
              <span>Verify</span>
              <span>Done</span>
            </div>
          </div>
        )}

        {/* Step 1: Property Type Selection */}
        {currentStep === "property-type" && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2 text-gray-900">Welcome! Let's set up your property on Travel Connect</h1>
              <p className="text-muted-foreground">What type of property are you listing?</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {propertyTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = profile.propertyType === type.id;

                return (
                  <Card
                    key={type.id}
                    className={`cursor-pointer transition-all hover:shadow-lg border-0 bg-white/80 backdrop-blur ${
                      isSelected ? "ring-2 ring-teal-500 bg-teal-50/80" : "hover:bg-teal-50/50"
                    }`}
                    onClick={() => handlePropertyTypeSelect(type.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                        isSelected ? "bg-teal-100" : "bg-gray-100"
                      }`}>
                        <Icon className={`h-8 w-8 ${isSelected ? "text-teal-600" : "text-gray-600"}`} />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{type.title}</h3>
                      <p className="text-muted-foreground text-sm">{type.description}</p>
                      {isSelected && (
                        <div className="mt-4">
                          <CheckCircle className="h-6 w-6 text-teal-600 mx-auto" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 0: Account Setup */}
        {currentStep === "account" && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2 text-gray-900">Create your Travel Connect Account</h1>
              <p className="text-muted-foreground">Join as a property owner and start welcoming guests</p>
            </div>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardContent className="p-8">
                {/* Social Login Options */}
                <div className="space-y-3 mb-6">
                  <div className="text-center text-sm text-muted-foreground mb-4">
                    Quick Signup
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 border-teal-200 hover:bg-teal-50"
                      onClick={() => handleSocialLogin("google")}
                    >
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 border-teal-200 hover:bg-teal-50"
                      onClick={() => handleSocialLogin("facebook")}
                    >
                      <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 border-teal-200 hover:bg-teal-50"
                      onClick={() => handleSocialLogin("apple")}
                    >
                      <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                      Apple
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 border-teal-200 hover:bg-teal-50"
                      onClick={() => handleSocialLogin("meta")}
                    >
                      <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Meta
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-teal-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-muted-foreground">
                        Or continue with email
                      </span>
                    </div>
                  </div>
                </div>

                {/* Manual Signup Form */}
                <form onSubmit={handleAccountSetup} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="border-teal-200 focus:border-teal-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="border-teal-200 focus:border-teal-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create password"
                        value={profile.password}
                        onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                        className="border-teal-200 focus:border-teal-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password *</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm password"
                        value={profile.confirmPassword}
                        onChange={(e) => setProfile({ ...profile, confirmPassword: e.target.value })}
                        className="border-teal-200 focus:border-teal-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={profile.agreeToTerms}
                      onCheckedChange={(checked) => 
                        setProfile({ ...profile, agreeToTerms: checked as boolean })
                      }
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to{" "}
                      <a href="/terms" className="text-teal-600 hover:underline">
                        Terms & Privacy Policy
                      </a>
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 h-12"
                    disabled={!canProceed()}
                  >
                    Create Account
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/")}
                      className="text-teal-600 hover:underline"
                    >
                      Sign in
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Property Details */}
        {currentStep === "details" && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2 text-gray-900">Property Details</h1>
              <p className="text-muted-foreground">Tell us more about your property</p>
            </div>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="property-name">Property Name *</Label>
                    <Input
                      id="property-name"
                      placeholder="Enter your property name"
                      value={profile.propertyName}
                      onChange={(e) => setProfile({ ...profile, propertyName: e.target.value })}
                      className="border-teal-200 focus:border-teal-500"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <div className="relative">
                      <Input
                        id="location"
                        placeholder="Enter property address"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        className="border-teal-200 focus:border-teal-500 pl-10"
                      />
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-teal-500" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Google Maps integration coming soon
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="property-type-edit">Property Type *</Label>
                    <select
                      id="property-type-edit"
                      value={profile.propertyType}
                      onChange={(e) => setProfile({ ...profile, propertyType: e.target.value })}
                      className="w-full h-10 px-3 py-2 text-sm border border-teal-200 rounded-md focus:border-teal-500 focus:outline-none"
                    >
                      <option value="">Select property type</option>
                      {propertyTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="star-rating">Star Rating *</Label>
                    <select
                      id="star-rating"
                      value={profile.starRating}
                      onChange={(e) => setProfile({ ...profile, starRating: e.target.value })}
                      className="w-full h-10 px-3 py-2 text-sm border border-teal-200 rounded-md focus:border-teal-500 focus:outline-none"
                    >
                      <option value="">Select rating</option>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <option key={rating} value={rating}>
                          {rating} Star{rating > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="rooms">Number of Rooms/Units *</Label>
                    <Input
                      id="rooms"
                      type="number"
                      placeholder="Enter number of rooms"
                      value={profile.numberOfRooms}
                      onChange={(e) => setProfile({ ...profile, numberOfRooms: e.target.value })}
                      className="border-teal-200 focus:border-teal-500"
                      min="1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Amenities & Features */}
        {currentStep === "amenities" && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2 text-gray-900">Amenities & Features</h1>
              <p className="text-muted-foreground">What amenities does your property offer?</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {amenitiesList.map((amenity) => {
                const Icon = amenity.icon;
                const isSelected = profile.amenities.includes(amenity.id);

                return (
                  <Card
                    key={amenity.id}
                    className={`cursor-pointer transition-all hover:shadow-lg border-0 bg-white/80 backdrop-blur ${
                      isSelected ? "ring-2 ring-teal-500 bg-teal-50/80" : "hover:bg-teal-50/50"
                    }`}
                    onClick={() => handleAmenityToggle(amenity.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 ${
                        isSelected ? "bg-teal-100" : "bg-gray-100"
                      }`}>
                        <Icon className={`h-6 w-6 ${isSelected ? "text-teal-600" : "text-gray-600"}`} />
                      </div>
                      <h4 className="font-medium text-sm">{amenity.title}</h4>
                      {isSelected && (
                        <div className="mt-2">
                          <CheckCircle className="h-4 w-4 text-teal-600 mx-auto" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="text-center">
              <Badge variant="secondary" className="text-sm">
                {profile.amenities.length} amenities selected
              </Badge>
            </div>
          </div>
        )}

        {/* Step 4: Upload Property Media */}
        {currentStep === "media" && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2 text-gray-900">Upload Property Media</h1>
              <p className="text-muted-foreground">Showcase your property with high-quality photos and videos</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Photos Upload */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="h-5 w-5 mr-2 text-teal-600" />
                    Upload Photos *
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-teal-300 rounded-lg p-8 text-center hover:bg-teal-50/50 transition-colors">
                    <Upload className="h-12 w-12 text-teal-400 mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Drag and drop photos here, or click to select
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files, 'photos')}
                      className="hidden"
                      id="photos-upload"
                    />
                    <label htmlFor="photos-upload">
                      <Button variant="outline" className="border-teal-200 text-teal-600 hover:bg-teal-50" asChild>
                        <span>Select Photos</span>
                      </Button>
                    </label>
                  </div>
                  {profile.photos.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-teal-600 font-medium">
                        {profile.photos.length} photo(s) uploaded
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Videos Upload */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Video className="h-5 w-5 mr-2 text-teal-600" />
                    Upload Videos (Optional)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors">
                    <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload property tour videos
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="video/*"
                      onChange={(e) => handleFileUpload(e.target.files, 'videos')}
                      className="hidden"
                      id="videos-upload"
                    />
                    <label htmlFor="videos-upload">
                      <Button variant="outline" asChild>
                        <span>Select Videos</span>
                      </Button>
                    </label>
                  </div>
                  {profile.videos.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 font-medium">
                        {profile.videos.length} video(s) uploaded
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Virtual Tour Link */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-teal-600" />
                  Virtual Tour Link (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="virtual-tour">360° Virtual Tour URL</Label>
                  <Input
                    id="virtual-tour"
                    type="url"
                    placeholder="https://your-virtual-tour-link.com"
                    value={profile.virtualTourLink}
                    onChange={(e) => setProfile({ ...profile, virtualTourLink: e.target.value })}
                    className="border-teal-200 focus:border-teal-500"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tip */}
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <div className="flex items-center">
                <Sparkles className="h-5 w-5 text-teal-600 mr-2" />
                <p className="text-teal-800 font-medium">
                  High-quality images attract 3x more bookings!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Pricing & Policies */}
        {currentStep === "pricing" && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2 text-gray-900">Pricing & Policies</h1>
              <p className="text-muted-foreground">Set your rates and policies</p>
            </div>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="base-price">Base Price per Night *</Label>
                    <div className="relative">
                      <Input
                        id="base-price"
                        type="number"
                        placeholder="Enter base price"
                        value={profile.basePrice}
                        onChange={(e) => setProfile({ ...profile, basePrice: e.target.value })}
                        className="border-teal-200 focus:border-teal-500 pl-10"
                        min="0"
                      />
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-teal-500" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seasonal-pricing">Seasonal Pricing (Optional)</Label>
                    <Input
                      id="seasonal-pricing"
                      placeholder="Peak season rates"
                      value={profile.seasonalPricing}
                      onChange={(e) => setProfile({ ...profile, seasonalPricing: e.target.value })}
                      className="border-teal-200 focus:border-teal-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cancellation-policy">Cancellation Policy *</Label>
                    <select
                      id="cancellation-policy"
                      value={profile.cancellationPolicy}
                      onChange={(e) => setProfile({ ...profile, cancellationPolicy: e.target.value })}
                      className="w-full h-10 px-3 py-2 text-sm border border-teal-200 rounded-md focus:border-teal-500 focus:outline-none"
                    >
                      <option value="">Select policy</option>
                      <option value="flexible">Flexible - Free cancellation 24h before</option>
                      <option value="moderate">Moderate - Free cancellation 5 days before</option>
                      <option value="strict">Strict - 50% refund up to 1 week before</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Payment Methods Accepted *</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {paymentMethodsList.map((method) => (
                        <div key={method.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={method.id}
                            checked={profile.paymentMethods.includes(method.id)}
                            onCheckedChange={() => handlePaymentMethodToggle(method.id)}
                          />
                          <Label htmlFor={method.id} className="text-sm">{method.title}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 6: Verification & Publishing */}
        {currentStep === "verification" && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2 text-gray-900">Verification & Publishing</h1>
              <p className="text-muted-foreground">Final step to get your property verified</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* ID Proof Upload */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-teal-600" />
                    Upload ID Proof / Business License *
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-teal-300 rounded-lg p-6 text-center hover:bg-teal-50/50 transition-colors">
                    <FileText className="h-10 w-10 text-teal-400 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-3">
                      Upload government ID or business license
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(e.target.files, 'id')}
                      className="hidden"
                      id="id-upload"
                    />
                    <label htmlFor="id-upload">
                      <Button variant="outline" className="border-teal-200 text-teal-600 hover:bg-teal-50" asChild>
                        <span>Select Document</span>
                      </Button>
                    </label>
                  </div>
                  {profile.idProof && (
                    <div className="mt-3">
                      <p className="text-sm text-teal-600 font-medium">
                        ✓ Document uploaded: {profile.idProof.name}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Bank Account Setup */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-teal-600" />
                    Bank Account / Payment Setup *
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bank-account">Bank Account Number</Label>
                      <Input
                        id="bank-account"
                        placeholder="Enter bank account number"
                        value={profile.bankAccount}
                        onChange={(e) => setProfile({ ...profile, bankAccount: e.target.value })}
                        className="border-teal-200 focus:border-teal-500"
                      />
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-blue-800 text-xs">
                        💡 You can also connect Stripe, PayPal, or other payment processors later from your dashboard.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-amber-800 font-medium mb-1">Verification Process</p>
                  <p className="text-amber-700 text-sm">
                    Our team will review your property details and documentation within 24-48 hours.
                    You'll receive an email notification once your property is approved and live on the platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Success Screen */}
        {currentStep === "success" && (
          <div className="text-center space-y-6 max-w-2xl mx-auto">
            <div className="relative">
              {/* Confetti Animation Placeholder */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="animate-bounce delay-100">
                  <Sparkles className="h-6 w-6 text-yellow-400 absolute top-4 left-1/4" />
                </div>
                <div className="animate-bounce delay-200">
                  <Sparkles className="h-4 w-4 text-blue-400 absolute top-8 right-1/4" />
                </div>
                <div className="animate-bounce delay-300">
                  <Sparkles className="h-5 w-5 text-green-400 absolute top-12 left-1/3" />
                </div>
                <div className="animate-bounce delay-500">
                  <Sparkles className="h-4 w-4 text-pink-400 absolute top-6 right-1/3" />
                </div>
              </div>

              <div className="w-32 h-32 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-16 w-16 text-white" />
              </div>
            </div>

            <div>
              <h1 className="text-4xl font-bold mb-4 text-gray-900">Congratulations! 🎉</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Your property has been submitted! Our team will review and publish it soon.
              </p>
            </div>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur p-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">What happens next?</h3>
                <div className="text-left space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-teal-600 text-xs font-bold">1</span>
                    </div>
                    <p className="text-sm">Our team reviews your property (24-48 hours)</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-teal-600 text-xs font-bold">2</span>
                    </div>
                    <p className="text-sm">Property goes live on Travel Connect</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-teal-600 text-xs font-bold">3</span>
                    </div>
                    <p className="text-sm">Start receiving bookings from travelers!</p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <Button
                onClick={handleComplete}
                size="lg"
                className="bg-teal-600 hover:bg-teal-700 h-12 px-8"
              >
                Manage My Property
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <div>
                <button
                  onClick={() => setCurrentStep("property-type")}
                  className="text-teal-600 hover:underline text-sm"
                >
                  Add Another Property
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        {currentStep !== "success" && currentStep !== "account" && (
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              className="border-teal-200 text-teal-600 hover:bg-teal-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {currentStep === "verification" ? "Submit for Verification" : "Continue"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
