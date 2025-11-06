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
  Bell,
  MessageSquare,
  Briefcase,
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

  const [activeTab, setActiveTab] = useState('ai-planner');
  const [promptText, setPromptText] = useState('');

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
            <button title="Notifications" className="p-2 rounded-md hover:bg-gray-100">
              <Bell className="h-5 w-5 text-foreground/80" />
            </button>
            <button title="Messages" className="p-2 rounded-md hover:bg-gray-100">
              <MessageSquare className="h-5 w-5 text-foreground/80" />
            </button>
            <Link to="/trips" className="p-2 rounded-md hover:bg-gray-100">
              <Briefcase className="h-5 w-5 text-foreground/80" />
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
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-6 order-2 lg:order-1 text-center">
              <Badge variant="secondary" className="mb-4 opacity-95 transform -translate-y-0">
                🚀 Powered by AI Technology
              </Badge>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mt-[-1px] text-center">
                Tell us where you want to go next.
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-center mt-6">
                From curated vacation homes to thrilling experiences — get smart
                AI itineraries, live previews, and one-click booking.
              </p>


              <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground justify-center lg:justify-start">
                <div className="flex items-center gap-2"><Shield className="h-4 w-4"/><span>Secure Booking</span></div>
                <div className="flex items-center gap-2"><Clock className="h-4 w-4"/><span>24/7 Support</span></div>
                <div className="flex items-center gap-2"><Star className="h-4 w-4"/><span>Top-rated</span></div>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="relative">
                <div className="aspect-[16/10] sm:aspect-[4/3] rounded-3xl bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/60 dark:to-gray-700/40 shadow-2xl backdrop-blur-lg overflow-hidden p-6">
                  {/* colorful floating visuals */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute w-2/3 h-2/3 rounded-2xl glow-travel-blue opacity-90 animate-float" />
                    <div className="absolute w-1/2 h-1/2 rounded-2xl glow-travel-orange opacity-80 transform translate-x-8 -translate-y-6 animate-float" style={{ animationDelay: '0.8s' }} />
                    <div className="absolute w-1/3 h-1/3 rounded-2xl glow-travel-purple opacity-80 transform -translate-x-6 translate-y-8 animate-float" style={{ animationDelay: '1.6s' }} />
                  </div>

                  <div className="relative z-10 flex items-center h-full">
                    <div className="w-full">
                      <div className="bg-white rounded-2xl p-4 shadow-lg">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {['ai-planner','stays','flights','experiences','events','essentials'].map((t)=>(
                            <button key={t} onClick={() => setActiveTab(t)} className={`px-3 py-1 rounded-md text-sm ${activeTab===t ? 'bg-gradient-to-r from-travel-blue to-travel-purple text-white' : 'text-muted-foreground bg-transparent border border-transparent hover:border-gray-200'}`}>
                              {t === 'ai-planner' ? 'AI planner' : t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                          ))}
                        </div>
                        <div className="flex flex-col gap-3">
                          <textarea value={promptText} onChange={(e) => setPromptText(e.target.value)} placeholder={'Try: "Plan a 5-day family trip to Kyoto with food highlights and cultural experiences"'} rows={5} className="w-full resize-none bg-gray-50 border border-transparent focus:border-travel-blue focus:ring-2 focus:ring-travel-blue/20 rounded-2xl p-4 shadow-inner text-sm placeholder:text-muted-foreground" />
                          <div className="flex items-center gap-3">
                            <Link to="/ai-planner"><Button className="bg-gradient-to-r from-travel-blue to-travel-purple text-white">Start Planning</Button></Link>
                            <Link to="/explore-services"><Button variant="ghost" className="border border-gray-200 hover:bg-gray-50">Browse Services</Button></Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pointer-events-none absolute -bottom-8 left-8 opacity-80 blur-2xl">
                  <svg width="360" height="160" viewBox="0 0 600 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-100">
                    <defs>
                      <linearGradient id="g1" x1="0" x2="1">
                        <stop offset="0%" stopColor="#34d399" stopOpacity="0.28" />
                        <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.26" />
                        <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.28" />
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

      {/* Services Section (redesigned cards) */}
      <section id="services" className="bg-muted/20 py-16">
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"></div>
        </div>
      </section>

      {/* Features Section (modern icons with subtle motion) */}
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

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group bg-white/60 dark:bg-gray-800/50 backdrop-blur rounded-2xl p-6 text-center hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                  <div className="mx-auto mb-4 w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-br from-travel-blue/10 to-travel-purple/10 group-hover:scale-105 transition-transform duration-300">
                    <Icon className="h-8 w-8 text-travel-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
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
