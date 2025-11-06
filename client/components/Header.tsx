import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plane, Compass, Bell, MessageSquare, Briefcase, Users, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationsDialog from "@/components/NotificationsDialog";
import MessagesDialog from "@/components/MessagesDialog";
import InviteFriendsDialog from "@/components/InviteFriendsDialog";

export default function Header() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  const isSignedIn = typeof window !== 'undefined' && localStorage.getItem('isSignedIn') === 'true';
  const rawUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const parsedUser = rawUser ? JSON.parse(rawUser) : null;
  const rawName = parsedUser?.username || parsedUser?.email || parsedUser?.id || '';
  const displayName = parsedUser?.username || (typeof rawName === 'string' && rawName.includes('@') ? rawName.split('@')[0] : rawName) || 'You';
  const initials = (displayName || 'You').toString().split(/\s+/).map((s:any)=>s[0]).slice(0,2).join('').toUpperCase();

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

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/discover" className="p-2 rounded-md hover:bg-gray-100" title="Discover">
              <Compass className="h-5 w-5 text-foreground/80" />
            </Link>
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

            <Link to="/vendors">
              <Button>Become a Travel Vendor</Button>
            </Link>
          </nav>
        </div>
      </header>

      <NotificationsDialog open={notificationsOpen} onOpenChange={setNotificationsOpen} />
      <MessagesDialog open={messagesOpen} onOpenChange={setMessagesOpen} />
      <InviteFriendsDialog open={inviteOpen} onOpenChange={setInviteOpen} onInviteComplete={()=>{}} />
    </>
  );
}
