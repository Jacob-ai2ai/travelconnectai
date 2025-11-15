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

  const mockListings = {
    stays: 12,
    flights: 8,
    experiences: 15,
    events: 5,
    essentials: 20,
    all: 60,
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
        <div className="grid lg:grid-cols-3 gap-6">
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
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-travel-blue" />
                    My Listings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Filter by Type</label>
                      <select
                        value={selectedListingType}
                        onChange={(e) => setSelectedListingType(e.target.value)}
                        className="w-full border rounded-lg p-2 text-sm"
                      >
                        {vendorTypeOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="text-center py-4 bg-muted rounded-lg">
                      <p className="text-3xl font-bold text-travel-blue">
                        {getListingCount(selectedListingType)}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Listings</p>
                    </div>
                    <Button className="w-full" onClick={handleAddListing}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Listing
                    </Button>
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
          <div className="space-y-6">
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
