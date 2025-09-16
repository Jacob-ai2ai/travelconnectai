import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Search,
  Wallet,
  Home,
  Plane,
  Mountain,
  Ticket,
  ShoppingBag,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

interface ServiceHeaderProps {
  currentLocation: string;
  walletBalance: number;
  isSignedIn?: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function ServiceHeader({
  currentLocation,
  walletBalance,
  isSignedIn = true,
  searchQuery,
  onSearchChange,
}: ServiceHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    const pathname = location.pathname;
    if (pathname === "/stays") return "stays";
    if (pathname === "/flights") return "flights";
    if (pathname === "/xperiences") return "xperiences";
    if (pathname === "/events") return "events";
    if (pathname === "/essentials") return "essentials";
    if (pathname === "/explore-services") return "all";
    return "all";
  };

  const activeTab = getActiveTab();

  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 flex-1">
            <Link
              to="/"
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <div className="h-6 w-px bg-border"></div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={`Search in ${currentLocation}...`}
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
            </div>

            {/* Travel Wallet */}
            {isSignedIn && (
              <div className="flex items-center space-x-2 bg-travel-blue/10 px-3 py-1 rounded-full">
                <Wallet className="h-4 w-4 text-travel-blue" />
                <span className="font-medium text-travel-blue">
                  ${walletBalance.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Become a Merchant Button */}
          <div className="flex items-center">
            <Link to="/vendors">
              <Button
                variant="outline"
                className="bg-travel-orange/10 border-travel-orange text-travel-orange hover:bg-travel-orange hover:text-white"
              >
                Become a Travel Vendor
              </Button>
            </Link>
          </div>
        </div>

        {/* Service Tabs */}
        <div className="flex items-center justify-center space-x-1 bg-muted p-1 rounded-lg">
          <Button
            variant={activeTab === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => navigate("/explore-services")}
            className="flex items-center space-x-2"
          >
            <Search className="h-4 w-4" />
            <span>All</span>
          </Button>

          <Button
            variant={activeTab === "stays" ? "default" : "ghost"}
            size="sm"
            onClick={() => navigate("/stays")}
            className="flex items-center space-x-2"
          >
            <Home className="h-4 w-4" />
            <span>Stays</span>
          </Button>

          <Button
            variant={activeTab === "flights" ? "default" : "ghost"}
            size="sm"
            onClick={() => navigate("/flights")}
            className="flex items-center space-x-2"
          >
            <Plane className="h-4 w-4" />
            <span>Flights</span>
          </Button>

          <Button
            variant={activeTab === "xperiences" ? "default" : "ghost"}
            size="sm"
            onClick={() => navigate("/xperiences")}
            className="flex items-center space-x-2"
          >
            <Mountain className="h-4 w-4" />
            <span>Xperiences</span>
          </Button>

          <Button
            variant={activeTab === "events" ? "default" : "ghost"}
            size="sm"
            onClick={() => navigate("/events")}
            className="flex items-center space-x-2"
          >
            <Ticket className="h-4 w-4" />
            <span>Events</span>
          </Button>

          <Button
            variant={activeTab === "essentials" ? "default" : "ghost"}
            size="sm"
            onClick={() => navigate("/essentials")}
            className="flex items-center space-x-2"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Essentials</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
