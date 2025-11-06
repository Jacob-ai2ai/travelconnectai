import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Users, Hash, FileText } from "lucide-react";

export default function Discover() {
  const tabs = [
    { id: 'reels', title: 'Reels', icon: Play },
    { id: 'spaces', title: 'Travel Spaces', icon: Users },
    { id: 'itineraries', title: 'Itineraries', icon: FileText },
    { id: 'friends', title: 'Friends', icon: Hash },
  ];

  const [active, setActive] = useState('reels');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Discover</h1>
            <div className="text-sm text-muted-foreground">Find reels, join travel spaces, explore itineraries and see what friends are sharing.</div>
          </div>

          <div className="border-b">
            <nav className="flex space-x-2 -mb-px">
              {tabs.map(t => {
                const Icon = t.icon as any;
                const activeCls = active === t.id ? 'border-b-2 border-travel-blue text-travel-blue' : 'text-muted-foreground';
                return (
                  <button key={t.id} onClick={() => setActive(t.id)} className={`px-4 py-2 ${activeCls} rounded-t-md`}> 
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span>{t.title}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-4">
            {active === 'reels' && (
              <div>
                <h2 className="font-semibold mb-2">Trending Reels</h2>
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="p-3 bg-gray-50 rounded-md">Sunset in Santorini — @AvaTravel</div>
                  <div className="p-3 bg-gray-50 rounded-md">Street Food Tokyo — @FoodNomad</div>
                  <div className="p-3 bg-gray-50 rounded-md">Hiking Patagonia — @TrailBlazer</div>
                </div>
              </div>
            )}

            {active === 'spaces' && (
              <div>
                <h2 className="font-semibold mb-2">Live & Upcoming Travel Spaces</h2>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-md flex items-center justify-between">
                    <div>
                      <div className="font-medium">Backpacking SE Asia — Hosted by @WanderWithMe</div>
                      <div className="text-sm text-muted-foreground">Starts in 1h — 120 people</div>
                    </div>
                    <div>
                      <Button onClick={() => alert('Joining space')}>Join</Button>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-md flex items-center justify-between">
                    <div>
                      <div className="font-medium">Luxury Stays — Hosted by @CoastalHomes</div>
                      <div className="text-sm text-muted-foreground">Live now — 430 people</div>
                    </div>
                    <div>
                      <Button onClick={() => alert('Joining space')}>Join</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {active === 'itineraries' && (
              <div>
                <h2 className="font-semibold mb-2">Community Itineraries</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-md">5-day Kyoto family food & culture — @Mika</div>
                  <div className="p-3 bg-gray-50 rounded-md">7-day Iceland road trip — @GlobeTrek</div>
                </div>
              </div>
            )}

            {active === 'friends' && (
              <div>
                <h2 className="font-semibold mb-2">Friends</h2>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded-md flex items-center justify-between">
                    <div>
                      <div className="font-medium">Maya shared a Reel</div>
                      <div className="text-sm text-muted-foreground">2 hours ago</div>
                    </div>
                    <div>
                      <Link to="/messages"><Button variant="ghost">Message</Button></Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
