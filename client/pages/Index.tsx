import React, { useState, useEffect } from 'react';
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const auth = params.get("auth");
    if (auth) {
      setIsAuthModalOpen(true);
    }
  }, [location.search]);

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
            {(() => {
              const isSignedIn = typeof window !== 'undefined' && localStorage.getItem('isSignedIn') === 'true';
              const rawUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
              const parsedUser = rawUser ? JSON.parse(rawUser) : null;
              // Prefer explicit username; otherwise use local-part of email or id
              const rawName = parsedUser?.username || parsedUser?.email || parsedUser?.id || '';
              const displayName = parsedUser?.username || (typeof rawName === 'string' && rawName.includes('@') ? rawName.split('@')[0] : rawName) || 'You';
              const initials = (displayName || 'You').toString().split(/\s+/).map(s=>s[0]).slice(0,2).join('').toUpperCase();
              return isSignedIn ? (
                <button onClick={() => window.location.assign('/profile')} className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-gray-100">
                  <div className="w-8 h-8 rounded-full bg-travel-blue text-white flex items-center justify-center text-sm font-semibold">{initials}</div>
                  <div className="text-sm font-medium">{displayName}</div>
                </button>
              ) : (
                <Button variant="outline" onClick={() => setIsAuthModalOpen(true)}>
                  Sign In
                </Button>
              )
            })()}
            <Link to="/vendors">
              <Button>Become a Travel Vendor</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section: Apple-inspired */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-6 order-2 lg:order-1 text-center lg:text-left">
              <Badge variant="secondary" className="mb-2 opacity-90 transform -translate-y-1">
                🚀 Powered by AI Technology
              </Badge>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                Plan Your Perfect Trip with
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-travel-blue via-travel-purple to-travel-orange">AI-Powered Booking</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                From curated vacation homes to thrilling experiences — get smart
                AI itineraries, live previews, and one-click booking.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                <Link to="/ai-planner">
                  <Button size="lg" className="bg-gradient-to-r from-travel-blue to-travel-purple shadow-lg hover:scale-[1.02] transform transition will-change-transform">
                    Start AI Planning
                  </Button>
                </Link>
                <Link to="/explore-services">
                  <Button size="lg" variant="ghost" className="border border-gray-200 hover:bg-gray-50">Browse Services</Button>
                </Link>
              </div>

              <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground justify-center lg:justify-start">
                <div className="flex items-center gap-2"><Shield className="h-4 w-4"/><span>Secure Booking</span></div>
                <div className="flex items-center gap-2"><Clock className="h-4 w-4"/><span>24/7 Support</span></div>
                <div className="flex items-center gap-2"><Star className="h-4 w-4"/><span>Top-rated</span></div>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="relative">
                <div className="aspect-[16/10] rounded-3xl bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/60 dark:to-gray-700/40 shadow-2xl backdrop-blur-lg overflow-hidden p-6">
                  {/* floating visual */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3/4 h-3/4 bg-gradient-to-tr from-travel-blue/10 to-travel-purple/10 rounded-2xl animate-float" />
                  </div>

                  <div className="relative z-10 flex items-center justify-between h-full">
                    <div className="w-1/2">
                      <div className="text-sm text-muted-foreground mb-2">Featured</div>
                      <h3 className="text-xl font-semibold">Goa Villas — Ocean View</h3>
                      <p className="text-sm text-muted-foreground mt-2">4 guests • 2 beds • Private pool</p>
                      <div className="mt-4 flex items-center gap-3">
                        <Button size="sm" className="bg-travel-blue">Book Now</Button>
                        <Button size="sm" variant="outline">Preview</Button>
                      </div>
                    </div>
                    <div className="w-1/2 flex items-center justify-end">
                      <div className="w-44 h-28 bg-gray-100 rounded-lg shadow-inner" />
                    </div>
                  </div>
                </div>

                <div className="pointer-events-none absolute -bottom-8 left-8 opacity-60 blur-xl">
                  <svg width="260" height="120" viewBox="0 0 600 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-70">
                    <defs>
                      <linearGradient id="g1" x1="0" x2="1">
                        <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.25" />
                      </linearGradient>
                    </defs>
                    <path d="M0 80 C150 0 450 160 600 60 L600 260 L0 260 Z" fill="url(#g1)" />
                  </svg>
                </div>
              </div>
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
        defaultTab={
          new URLSearchParams(location.search).get("auth") === "signup"
            ? "signup"
            : "signin"
        }
      />
    </div>
  );
}
