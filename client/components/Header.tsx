import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plane, Compass, Bell, MessageSquare, Briefcase, Users, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NotificationsDialog from "@/components/NotificationsDialog";
import MessagesDialog from "@/components/MessagesDialog";
import InviteFriendsDialog from "@/components/InviteFriendsDialog";
import { useLocation } from "react-router-dom";

export default function Header() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  // Location/currency state (restore home header behavior)
  const [locationCity, setLocationCity] = useState('');
  const [locationFlag, setLocationFlag] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [locationSearch, setLocationSearch] = useState('');

  const location = useLocation();

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      let city = '';
      if (tz.includes('/')) city = tz.split('/').pop()?.replace('_',' ') || '';

      const tzToCountry: Record<string,string> = {
        'Asia/Kolkata': 'IN', 'Asia/Calcutta': 'IN', 'Asia/Tokyo': 'JP', 'Europe/London': 'GB', 'America/New_York': 'US', 'America/Los_Angeles': 'US', 'Europe/Paris': 'FR', 'Europe/Berlin': 'DE', 'Asia/Singapore': 'SG'
      };

      const lang = navigator.language || 'en-US';
      const regionMatch = lang.match(/-([A-Z]{2})$/i);
      let country = regionMatch ? regionMatch[1].toUpperCase() : '';
      if (!country && tz && tzToCountry[tz]) country = tzToCountry[tz];
      if (!country) { const tzPart = tz.split('/')[0]; if (tzPart && tzPart.length === 2) country = tzPart.toUpperCase(); }
      if (city.toLowerCase() === 'calcutta') city = 'Kolkata';
      const countryToCurrency: Record<string,string> = { US: 'USD', GB: 'GBP', IN: 'INR', CA: 'CAD', AU: 'AUD', DE: 'EUR', FR: 'EUR', ES: 'EUR', IT: 'EUR', NL: 'EUR', JP: 'JPY', CN: 'CNY', SG: 'SGD', AE: 'AED' };
      const cc = country || 'US';
      setCurrency(countryToCurrency[cc] || 'USD');
      setLocationCity(city || (cc === 'US' ? 'United States' : cc));
      const flag = cc.toUpperCase().replace(/./g, (char:any) => String.fromCodePoint(127397 + char.charCodeAt(0))).replace(/undefined/g,'');
      setLocationFlag(flag);
      setLocationSearch('');
    } catch (e) {
      console.warn(e);
    }
  }, [location.pathname]);

  const isSignedIn = typeof window !== 'undefined' && localStorage.getItem('isSignedIn') === 'true';
  const rawUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const parsedUser = rawUser ? JSON.parse(rawUser) : null;
  const rawName = parsedUser?.username || parsedUser?.email || parsedUser?.id || '';
  const displayName = parsedUser?.username || (typeof rawName === 'string' && rawName.includes('@') ? rawName.split('@')[0] : rawName) || 'You';
  const initials = (displayName || 'You').toString().split(/\s+/).map((s:any)=>s[0]).slice(0,2).join('').toUpperCase();
  const userRole = parsedUser?.role || 'traveler';
  const isVendor = userRole === 'vendor';

  return (
    <>
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-90">
            <div className="w-8 h-8 bg-gradient-to-br from-travel-blue to-travel-purple rounded-lg flex items-center justify-center">
              <Plane className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-travel-blue to-travel-purple bg-clip-text text-transparent">
              Traveltheworld.ai
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-4">
            <div className="flex items-center gap-3">
              <Link to="/discover" className="p-2 rounded-md hover:bg-gray-100" title="Discover">
                <Compass className="h-5 w-5 text-foreground/80" />
              </Link>

              {/* Location + currency shown in header (home behavior) */}
              <div className="flex items-center gap-2 bg-white border rounded-md px-2 py-1">
                <div className="text-lg">{locationFlag}</div>
                <select value={currency} onChange={(e)=>setCurrency(e.target.value)} className="text-sm bg-transparent border-none focus:ring-0">
                  {['USD','EUR','GBP','INR','AUD','CAD','JPY','SGD','AED'].map(c=> (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <Input value={locationSearch} onChange={(e)=>setLocationSearch(e.target.value)} placeholder={locationCity || 'Search city'} className="w-44 bg-transparent border-0 p-0" />
              </div>
            </div>

            <button title="Notifications" onClick={() => setNotificationsOpen(true)} className="p-2 rounded-md hover:bg-gray-100">
              <Bell className="h-5 w-5 text-foreground/80" />
            </button>
            <button title="Messages" onClick={() => setMessagesOpen(true)} className="p-2 rounded-md hover:bg-gray-100">
              <MessageSquare className="h-5 w-5 text-foreground/80" />
            </button>
            <Link to="/trips" className="p-2 rounded-md hover:bg-gray-100">
              <Briefcase className="h-5 w-5 text-foreground/80" />
            </Link>

            {isSignedIn ? (
              <button onClick={() => window.location.assign('/profile')} className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-gray-100">
                <div className="w-8 h-8 rounded-full bg-travel-blue text-white flex items-center justify-center text-sm font-semibold">{initials}</div>
                <div className="text-sm font-medium">{displayName}</div>
              </button>
            ) : (
              <Link to="/?auth=signin"><Button variant="outline">Sign In</Button></Link>
            )}

            {isVendor ? (
              <Link to="/vendor-dashboard">
                <Button className="bg-travel-orange hover:bg-travel-orange/90">
                  Vendor Dashboard
                </Button>
              </Link>
            ) : (
              <Link to={isSignedIn ? '/vendor/select-type' : '/?auth=signup'}>
                <Button>{isSignedIn ? 'Become a Travel Vendor' : 'Join as Vendor'}</Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      <NotificationsDialog open={notificationsOpen} onOpenChange={setNotificationsOpen} />
      <MessagesDialog open={messagesOpen} onOpenChange={setMessagesOpen} />
      <InviteFriendsDialog open={inviteOpen} onOpenChange={setInviteOpen} onInviteComplete={()=>{}} />
    </>
  );
}
