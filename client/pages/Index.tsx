import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import AuthModal from "@/components/AuthModal";
import {
  Plane,
  Home,
  Mountain,
  Calendar,
  Ticket,
  Wallet,
  Gift,
  Video,
  TrendingUp,
  MapPin,
  Sparkles,
  Bot,
  Clock,
  Shield,
  Users,
  Star,
} from "lucide-react";

export default function Index() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const services = [
    {
      icon: Home,
      title: "Vacation Rentals",
      description: "Beautiful properties worldwide with live virtual tours",
      color: "travel-blue",
    },
    {
      icon: Plane,
      title: "Flights & Transport",
      description: "Best deals on flights, trains, and local commute",
      color: "travel-orange",
    },
    {
      icon: Mountain,
      title: "Experiences",
      description: "Adventure sports, theme parks, food tours & camping",
      color: "travel-green",
    },
    {
      icon: Ticket,
      title: "Events",
      description: "Concerts, festivals, sports tickets & competitions",
      color: "travel-purple",
    },
    {
      icon: Gift,
      title: "Travel Essentials",
      description: "Accessories, gear, and everything you need",
      color: "travel-blue",
    },
  ];

  const features = [
    {
      icon: Video,
      title: "Live Streaming",
      description:
        "Request live demos and virtual property tours before booking",
    },
    {
      icon: TrendingUp,
      title: "AI Promo Builder",
      description:
        "Smart promotions based on your behavior and unsold inventory",
    },
    {
      icon: MapPin,
      title: "Traveler's Radar",
      description:
        "Discover nearby attractions within 50km of your destination",
    },
    {
      icon: Calendar,
      title: "Smart Calendar",
      description: "Prevents double bookings across all platforms",
    },
    {
      icon: Wallet,
      title: "Travel Wallet",
      description: "Digital wallet with rewards and instant booking",
    },
    {
      icon: Sparkles,
      title: "Rewards System",
      description: "Earn digital coins for bookings and referrals",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-travel-blue to-travel-purple rounded-lg flex items-center justify-center">
              <Plane className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-travel-blue to-travel-purple bg-clip-text text-transparent">
              Traveltheworld.ai
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/stays"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Stays
            </Link>
            <Link
              to="/flights"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Flights
            </Link>
            <Link
              to="/xperiences"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Xperiences
            </Link>
            <Link
              to="/events"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Events
            </Link>
            <Link
              to="/essentials"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Essentials
            </Link>
            <Button variant="outline" onClick={() => setIsAuthModalOpen(true)}>
              Sign In
            </Button>
            <Link to="/vendors">
              <Button>Become a Travel Vendor</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-6">
            🚀 Powered by AI Technology
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Plan Your Perfect Trip with{" "}
            <span className="bg-gradient-to-r from-travel-blue via-travel-purple to-travel-orange bg-clip-text text-transparent">
              AI-Powered
            </span>{" "}
            Booking
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            From vacation rentals to adventure experiences, book everything with
            live demos, smart deals, and complete AI-generated itineraries.
          </p>

          {/* AI vs Manual Booking Choice */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Card className="flex-1 max-w-md p-6 border-2 border-travel-blue/20 hover:border-travel-blue/50 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-travel-blue/10 rounded-lg flex items-center justify-center">
                  <Bot className="h-5 w-5 text-travel-blue" />
                </div>
                <h3 className="font-semibold">Book with AI</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Tell us your destination, dates, and travelers. We'll create
                complete itineraries with budget options.
              </p>
              <Link to="/ai-planner">
                <Button className="w-full bg-travel-blue hover:bg-travel-blue/90">
                  Start AI Planning
                </Button>
              </Link>
            </Card>

            <Card className="flex-1 max-w-md p-6 border-2 border-travel-orange/20 hover:border-travel-orange/50 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-travel-orange/10 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-travel-orange" />
                </div>
                <h3 className="font-semibold">Book Manually</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Browse and book each service individually with full control over
                your travel choices.
              </p>
              <Link to="/explore-services">
                <Button
                  variant="outline"
                  className="w-full border-travel-orange text-travel-orange hover:bg-travel-orange hover:text-white"
                >
                  Explore Services
                </Button>
              </Link>
            </Card>
          </div>

          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Secure Booking</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4" />
              <span>5-Star Rated</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need for Travel
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Book all aspects of your journey in one place with AI-powered
              recommendations and live previews.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card
                  key={index}
                  className="p-6 hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur"
                >
                  <CardContent className="p-0">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-${service.color}/10`}
                    >
                      <Icon className={`h-6 w-6 text-${service.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Advanced Features for Modern Travelers
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Cutting-edge technology to enhance your booking experience and
              travel planning.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-travel-blue/10 to-travel-purple/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-travel-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Travel Wallet & Rewards */}
      <section className="bg-gradient-to-r from-travel-blue/5 via-travel-purple/5 to-travel-orange/5 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Travel Wallet & Rewards
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Earn digital coins with every booking, referral, and achievement.
              Use your travel wallet for instant bookings and exclusive deals.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 border-0 bg-white/80 backdrop-blur">
                <div className="w-16 h-16 bg-travel-blue/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Wallet className="h-8 w-8 text-travel-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Digital Travel Wallet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Preload funds and book instantly. Track spending and get
                  exclusive wallet-only deals.
                </p>
                <Button variant="outline">Setup Wallet</Button>
              </Card>

              <Card className="p-8 border-0 bg-white/80 backdrop-blur">
                <div className="w-16 h-16 bg-travel-orange/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Gift className="h-8 w-8 text-travel-orange" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Rewards Program</h3>
                <p className="text-muted-foreground mb-4">
                  Earn coins for bookings, reviews, referrals. Redeem for travel
                  credits and upgrades.
                </p>
                <Button variant="outline">Join Rewards</Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of travelers using AI to plan better trips, save
            money, and discover amazing experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/ai-planner">
              <Button
                size="lg"
                className="bg-travel-blue hover:bg-travel-blue/90"
              >
                Start Planning with AI
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Browse Manually
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-travel-blue to-travel-purple rounded-lg flex items-center justify-center">
                <Plane className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-travel-blue to-travel-purple bg-clip-text text-transparent">
                Traveltheworld.ai
              </span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <Link
                to="/terms"
                className="hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="hover:text-foreground transition-colors"
              >
                Terms
              </Link>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="hover:text-foreground transition-colors"
              >
                Support
              </button>
              <Link
                to="/document-download"
                className="hover:text-foreground transition-colors"
              >
                SRS Document
              </Link>
              <Link
                to="/terms"
                className="hover:text-foreground transition-colors"
              >
                About
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2024 Traveltheworld.ai. All rights reserved. Powered by AI
            technology.
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab="signin"
      />
    </div>
  );
}
