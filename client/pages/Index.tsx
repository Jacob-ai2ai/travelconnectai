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
  Mic,
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
  const [micActive, setMicActive] = useState(false);

  const [staysDestination, setStaysDestination] = useState('');
  const [staysCheckIn, setStaysCheckIn] = useState('');
  const [staysCheckOut, setStaysCheckOut] = useState('');
  const [staysGuests, setStaysGuests] = useState(2);

  // Location/search in header
  const [locationCity, setLocationCity] = useState('');
  const [locationFlag, setLocationFlag] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [locationSearch, setLocationSearch] = useState('');

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      let city = '';
      if (tz.includes('/')) {
        city = tz.split('/').pop()?.replace('_', ' ') || '';
      }

      // small mapping from common timezones to country codes for better accuracy
      const tzToCountry: Record<string,string> = {
        'Asia/Kolkata': 'IN',
        'Asia/Calcutta': 'IN',
        'Asia/Tokyo': 'JP',
        'Europe/London': 'GB',
        'America/New_York': 'US',
        'America/Los_Angeles': 'US',
        'Europe/Paris': 'FR',
        'Europe/Berlin': 'DE',
        'Asia/Singapore': 'SG',
      };

      const lang = navigator.language || 'en-US';
      const regionMatch = lang.match(/-([A-Z]{2})$/i);
      let country = regionMatch ? regionMatch[1].toUpperCase() : '';

      // prefer explicit timezone mapping when available
      if (!country && tz && tzToCountry[tz]) {
        country = tzToCountry[tz];
      }

      // As a last fallback, try to infer by timezone prefix (not reliable but okay)
      if (!country) {
        const tzPart = tz.split('/')[0];
        if (tzPart && tzPart.length === 2) country = tzPart.toUpperCase();
      }

      // Normalize some city names (Calcutta -> Kolkata)
      if (city.toLowerCase() === 'calcutta') city = 'Kolkata';

      const countryToCurrency: Record<string,string> = {
        US: 'USD', GB: 'GBP', IN: 'INR', CA: 'CAD', AU: 'AUD', DE: 'EUR', FR: 'EUR', ES: 'EUR', IT: 'EUR', NL: 'EUR', JP: 'JPY', CN: 'CNY', SG: 'SGD', AE: 'AED'
      };

      const cc = country || 'US';
      setCurrency(countryToCurrency[cc] || 'USD');
      setLocationCity(city || (cc === 'US' ? 'United States' : cc));

      // country code to flag emoji
      const flag = cc.toUpperCase().replace(/./g, (char:any) => String.fromCodePoint(127397 + char.charCodeAt(0))).replace(/undefined/g,'');
      setLocationFlag(flag);
      // do not prefill the search input to avoid duplicate display
      setLocationSearch('');
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const [locationCoords, setLocationCoords] = useState<{lat:number,lon:number} | null>(null);

  const requestLocation = () => {
    if (!('geolocation' in navigator)) return;
    try {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setLocationCoords({ lat, lon });
          // Keep detected city from timezone if available; we could reverse-geocode here using an API if desired.
          localStorage.setItem('locationAsked','true');
        },
        (err) => {
          console.warn('Location not available', err);
          localStorage.setItem('locationAsked','true');
        },
        { enableHighAccuracy: false, timeout: 10000 }
      );
    } catch (e) {
      console.warn(e);
      localStorage.setItem('locationAsked','true');
    }
  };

  // Ask for location the first time the user opens the app
  useEffect(() => {
    try {
      const asked = localStorage.getItem('locationAsked');
      if (!asked) {
        // trigger permission prompt
        requestLocation();
      }

      // install prompt events: request location when install flow is triggered or completed
      const onBeforeInstall = (e: any) => {
        try {
          // some browsers allow showing the native install prompt only on user gesture; we still request location when the prompt is available
          requestLocation();
        } catch (err) {
          console.warn(err);
        }
      };
      const onAppInstalled = () => {
        requestLocation();
      };

      window.addEventListener('beforeinstallprompt', onBeforeInstall as EventListener);
      window.addEventListener('appinstalled', onAppInstalled as EventListener);

      return () => {
        window.removeEventListener('beforeinstallprompt', onBeforeInstall as EventListener);
        window.removeEventListener('appinstalled', onAppInstalled as EventListener);
      };
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const buildStaysUrl = () => {
    return `/stays?destination=${encodeURIComponent(staysDestination)}&checkIn=${staysCheckIn}&checkOut=${staysCheckOut}&guests=${staysGuests}`;
  };

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

          {/* Location search */}
          <div className="flex-1 mx-6 hidden md:flex justify-center">
            <div className="w-full max-w-md">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <span id="flag" className="text-xl">{locationFlag}</span>
                  <select value={currency} onChange={(e)=>setCurrency(e.target.value)} className="text-xs bg-transparent border-none focus:ring-0 ml-1">
                    {['USD','EUR','GBP','INR','AUD','CAD','JPY','SGD','AED'].map(c=> (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <input onChange={(e)=>setLocationSearch(e.target.value)} value={locationSearch} placeholder={locationCity || 'Search city'} className="w-full pl-28 pr-4 py-2 rounded-lg border bg-white/90" />
              </div>
            </div>
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
      <section className="container mx-auto px-4 relative overflow-hidden min-h-screen flex items-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-col items-center">

            <div className="w-full">
              <div className="relative">
                  <div className="relative z-10 flex items-center justify-center h-full">
                    <div className="w-full max-w-xl mx-auto">

                      <div className="text-center mb-3">
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-white drop-shadow-md">
                          Plan Your Perfect Trip with
                          <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-travel-blue via-travel-purple to-travel-orange">AI-Powered Booking</span>
                        </h1>
                        <p className="text-lg text-white mt-4">Tell us where you're going next — we'll handle the rest.</p>
                      </div>

                      <div className="bg-white rounded-2xl p-3 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex flex-nowrap gap-2 overflow-x-auto">
                            {['ai-planner','stays','flights','experiences','events','essentials'].map((t)=>(
                              <button key={t} onClick={() => setActiveTab(t)} className={`px-3 py-1 rounded-md text-base whitespace-nowrap ${activeTab===t ? 'bg-gradient-to-r from-travel-blue to-travel-purple text-white' : 'text-foreground bg-transparent border border-transparent hover:border-gray-200'}`}>
                                {t === 'ai-planner' ? 'AI Planner' : t.charAt(0).toUpperCase() + t.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col gap-3">
                          {activeTab === 'stays' ? (
                              <div className="grid grid-cols-1 gap-3">
                              <div className="flex gap-3">
                                <input value={staysDestination} onChange={(e)=>setStaysDestination(e.target.value)} placeholder="Destination (city or area)" className="flex-1 border rounded-lg p-2" />
                                <input type="number" min={1} value={staysGuests} onChange={(e)=>setStaysGuests(Number(e.target.value))} className="w-28 border rounded-lg p-2" />
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <input type="date" value={staysCheckIn} onChange={(e)=>setStaysCheckIn(e.target.value)} className="border rounded-lg p-2" />
                                <input type="date" value={staysCheckOut} onChange={(e)=>setStaysCheckOut(e.target.value)} className="border rounded-lg p-2" />
                              </div>

                              <div className="flex flex-col md:flex-row gap-3">
                                <Link to={buildStaysUrl()} className="w-full md:flex-1"><Button className="w-full bg-gradient-to-r from-travel-blue to-travel-purple text-white">Search Stays</Button></Link>
                                <Link to="/explore-services" className="w-full md:flex-1"><Button variant="ghost" className="w-full border border-gray-200 hover:bg-gray-50">Browse Services</Button></Link>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="relative">
                                <textarea value={promptText} onChange={(e) => setPromptText(e.target.value)} placeholder={'Try: "Plan a 5-day family trip to Kyoto with food highlights and cultural experiences"'} rows={3} className="w-full resize-none bg-gray-50 border border-transparent focus:border-travel-blue focus:ring-2 focus:ring-travel-blue/20 rounded-2xl p-3 shadow-inner text-sm placeholder:text-muted-foreground" />
                                <div className="absolute right-3 bottom-3 flex items-center gap-2">
                                  <button title="Voice input" onClick={() => setMicActive(!micActive)} className={`p-2 rounded-md ${micActive ? 'bg-gradient-to-r from-travel-blue to-travel-purple text-white' : 'hover:bg-gray-100'}`}>
                                    <Mic className="h-4 w-4" />
                                  </button>
                                  <button title="Invite friends" onClick={async ()=>{try{ if (navigator.share) { await navigator.share({ title: document.title, url: window.location.href }); } else { await navigator.clipboard.writeText(window.location.href); } }catch(e){}}} className="p-2 rounded-md hover:bg-gray-100">
                                    <Users className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                              <div className="flex flex-col md:flex-row gap-3 mt-2">
                                <Link to="/ai-planner" className="w-full md:flex-1"><Button className="w-full bg-gradient-to-r from-travel-blue to-travel-purple text-white">Start Planning</Button></Link>
                                <Link to="/explore-services" className="w-full md:flex-1"><Button variant="ghost" className="w-full border border-gray-200 hover:bg-gray-50">Browse Services</Button></Link>
                              </div>
                            </>
                          )}
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              const to = service.title.includes('Vacation') ? '/stays' : service.title.includes('Flights') ? '/flights' : service.title.includes('Experiences') ? '/xperiences' : service.title.includes('Events') ? '/events' : '/essentials';
              return (
                <Link to={to} key={index} className="group block rounded-2xl overflow-hidden p-6 bg-white/70 dark:bg-gray-800/60 backdrop-blur border border-gray-100 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-lg flex items-center justify-center bg-${service.color}/10 flex-shrink-0 relative`}>
                      <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full" style={{ background: `radial-gradient(circle at 30% 30%, hsl(var(--${service.color}) / 0.35), transparent 40%)` }} />
                      <Icon className={`h-7 w-7 text-${service.color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{service.title}</h3>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-sm text-travel-blue font-medium">Explore</div>
                    <div className="text-sm text-muted-foreground">Learn more →</div>
                  </div>
                </Link>
              );
            })}
          </div>
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
