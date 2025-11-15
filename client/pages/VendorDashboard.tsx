import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  ShoppingCart,
  Home,
  Zap,
  Users,
  Settings,
  LogOut,
  Plus,
  TrendingUp,
  Star,
  DollarSign,
} from 'lucide-react';

interface VendorInfo {
  name: string;
  type: string;
  location: string;
  rating: number;
  revenue: number;
  currency: string;
}

export default function VendorDashboard() {
  const navigate = useNavigate();
  const [vendorInfo, setVendorInfo] = useState<VendorInfo | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [selectedListingType, setSelectedListingType] = useState('all');

  useEffect(() => {
    const signedIn = localStorage.getItem('isSignedIn') === 'true';
    const user = localStorage.getItem('user');
    
    if (!signedIn) {
      navigate('/');
      return;
    }

    setIsSignedIn(true);
    
    if (user) {
      try {
        const userData = JSON.parse(user);
        setVendorInfo({
          name: userData.username || userData.email || 'Vendor',
          type: userData.vendorType || 'All Services',
          location: userData.location || 'Not specified',
          rating: 4.8,
          revenue: 15240,
          currency: 'USD',
        });
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isSignedIn');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleAddListing = () => {
    navigate('/vendor/create-listing');
  };

  const vendorTypeOptions = [
    { value: 'all', label: 'All Listings' },
    { value: 'stays', label: 'Stays' },
    { value: 'flights', label: 'Flights' },
    { value: 'experiences', label: 'Experiences' },
    { value: 'events', label: 'Events' },
    { value: 'essentials', label: 'Essentials' },
  ];

  const dummyListings = [
    { id: '1', type: 'stays', title: 'Luxurious Beach Villa in Bali', location: 'Bali, Indonesia', price: 250, rating: 4.8 },
    { id: '2', type: 'stays', title: 'Cozy Apartment in Paris', location: 'Paris, France', price: 180, rating: 4.6 },
    { id: '3', type: 'stays', title: 'Mountain Cabin with Mountain Views', location: 'Swiss Alps, Switzerland', price: 320, rating: 4.9 },
    { id: '4', type: 'flights', title: 'Round Trip: New York to London', location: 'NYC to LHR', price: 520, rating: 4.5 },
    { id: '5', type: 'flights', title: 'Business Class: Dubai to Singapore', location: 'DXB to SIN', price: 1200, rating: 4.7 },
    { id: '6', type: 'experiences', title: 'Guided Tour: Hidden Gems of Barcelona', location: 'Barcelona, Spain', price: 85, rating: 4.8 },
    { id: '7', type: 'experiences', title: 'Cooking Class: Italian Cuisine in Rome', location: 'Rome, Italy', price: 95, rating: 4.9 },
    { id: '8', type: 'experiences', title: 'Scuba Diving Adventure in Great Barrier Reef', location: 'Australia', price: 150, rating: 4.7 },
    { id: '9', type: 'events', title: 'Tech Conference 2024', location: 'San Francisco, USA', price: 299, rating: 4.6 },
    { id: '10', type: 'events', title: 'Music Festival Summer Vibes', location: 'Ibiza, Spain', price: 180, rating: 4.8 },
    { id: '11', type: 'essentials', title: 'Comprehensive Travel Insurance Premium', location: 'Worldwide', price: 45, rating: 4.7 },
    { id: '12', type: 'essentials', title: 'International Visa Assistance Service', location: 'Global', price: 199, rating: 4.6 },
  ];

  // Initialize dummy listings in localStorage if not already there
  useEffect(() => {
    const listings = localStorage.getItem('listings');
    if (!listings) {
      localStorage.setItem('listings', JSON.stringify(dummyListings));
    }
  }, []);

  const mockListings = {
    stays: 3,
    flights: 2,
    experiences: 3,
    events: 2,
    essentials: 2,
    all: 12,
  };

  const mockOrders = {
    pending: 24,
    completed: 156,
    cancelled: 8,
    total: 188,
  };

  if (!isSignedIn || !vendorInfo) {
    return null;
  }

  const getListingCount = (type: string) => {
    return mockListings[type as keyof typeof mockListings] || 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Title Card with Greeting */}
      <div className="bg-gradient-to-r from-travel-blue via-travel-purple to-travel-orange text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, {vendorInfo.name}! 👋</h1>
              <p className="text-blue-100 text-lg">You're doing great! Keep up the momentum.</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="bg-white/20 border-white/40 text-white hover:bg-white/30"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mt-8">
            {/* Vendor Name Card */}
            <Card className="bg-white/10 border-white/20">
              <CardContent className="pt-6">
                <p className="text-blue-100 text-sm mb-1">Vendor Name</p>
                <p className="text-2xl font-bold text-white">{vendorInfo.name}</p>
              </CardContent>
            </Card>

            {/* Vendor Type Card */}
            <Card className="bg-white/10 border-white/20">
              <CardContent className="pt-6">
                <p className="text-blue-100 text-sm mb-2">Services</p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-white/30 text-white border-white/50">
                    {vendorInfo.type}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Card */}
            <Card className="bg-white/10 border-white/20">
              <CardContent className="pt-6">
                <p className="text-blue-100 text-sm mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-white">
                  {vendorInfo.currency} {vendorInfo.revenue.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            {/* Rating Card */}
            <Card className="bg-white/10 border-white/20">
              <CardContent className="pt-6">
                <p className="text-blue-100 text-sm mb-1">Business Rating</p>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-300 fill-yellow-300" />
                  <span className="text-2xl font-bold text-white">{vendorInfo.rating}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Dashboard Cards */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-6">
              {/* All Orders Card */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-travel-blue" />
                    All Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Orders</span>
                      <span className="font-bold text-lg">{mockOrders.total}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Completed: {mockOrders.completed}</span>
                      <span className="text-yellow-600">Pending: {mockOrders.pending}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-red-600">Cancelled: {mockOrders.cancelled}</span>
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                      View All Orders
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* My Listings Card with Filter */}
              <Card className="hover:shadow-lg transition-shadow md:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Home className="h-5 w-5 text-travel-blue" />
                      My Listings
                    </CardTitle>
                    <select
                      value={selectedListingType}
                      onChange={(e) => setSelectedListingType(e.target.value)}
                      className="border rounded-lg p-1 text-sm"
                    >
                      {vendorTypeOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-3 max-h-96 overflow-y-auto">
                      {dummyListings
                        .filter((l) => selectedListingType === 'all' || l.type === selectedListingType)
                        .map((listing) => (
                          <div key={listing.id} className="p-3 border rounded-lg hover:bg-muted transition-colors">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <p className="font-semibold text-sm">{listing.title}</p>
                                <p className="text-xs text-muted-foreground">{listing.location}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-travel-blue">${listing.price}</p>
                                <div className="flex items-center justify-end gap-1 mt-1">
                                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                  <span className="text-xs font-medium">{listing.rating}</span>
                                </div>
                              </div>
                            </div>
                            <Badge variant="secondary" className="capitalize text-xs">
                              {listing.type}
                            </Badge>
                          </div>
                        ))}
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground mb-3">
                        Showing {dummyListings.filter((l) => selectedListingType === 'all' || l.type === selectedListingType).length} of {getListingCount(selectedListingType)} listings
                      </p>
                      <Button className="w-full" onClick={handleAddListing}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Listing
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Team/Friends Card */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-travel-blue" />
                    Team Members
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Manage your team and collaborators</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-muted rounded">
                      <span className="text-sm">Active Members: 3</span>
                      <Badge>Active</Badge>
                    </div>
                    <Button className="w-full" variant="outline">
                      Manage Team
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Live Stream Card */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-travel-orange" />
                    Create Live Stream
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Engage with customers in real-time</p>
                  <Button className="w-full" variant="outline">
                    Start Live Stream
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Promotion */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Create Promotion</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Create special offers to attract more customers
                </p>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  New Promotion
                </Button>
              </CardContent>
            </Card>

            {/* Payments & Transactions */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">This Month</span>
                    <span className="font-bold">$3,420</span>
                  </div>
                  <Button className="w-full" variant="outline">
                    View Transactions
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Analytics */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Track your performance metrics
                </p>
                <Button className="w-full" variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage your account settings
                </p>
                <Link to="/edit-profile">
                  <Button className="w-full" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
