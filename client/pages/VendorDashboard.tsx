import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import {
  ShoppingCart,
  Home,
  Zap,
  Users,
  Settings,
  BarChart3,
  DollarSign,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface VendorInfo {
  name: string;
  type: string;
  location: string;
  rating: number;
  revenue: number;
  currency: string;
}

interface DashboardTile {
  id: string;
  title: string;
  description: string;
  icon: any;
  route?: string;
  action?: () => void;
  count?: number;
  color: string;
}

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

const mockOrders = {
  pending: 24,
  completed: 156,
  cancelled: 8,
  total: 188,
};

export default function VendorDashboard() {
  const navigate = useNavigate();
  const [vendorInfo, setVendorInfo] = useState<VendorInfo | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [listingCount, setListingCount] = useState(0);

  useEffect(() => {
    const signedIn = localStorage.getItem('isSignedIn') === 'true';
    const user = localStorage.getItem('user');

    setIsSignedIn(signedIn || true);

    if (user) {
      try {
        const userData = JSON.parse(user);
        setVendorInfo({
          name: userData.username || userData.email || 'Demo Vendor',
          type: userData.vendorType || 'All Services',
          location: userData.location || 'Global',
          rating: 4.8,
          revenue: 52840,
          currency: 'USD',
        });
      } catch (e) {
        console.error('Error parsing user:', e);
        setVendorInfo({
          name: 'Demo Vendor',
          type: 'All Services',
          location: 'Global',
          rating: 4.8,
          revenue: 52840,
          currency: 'USD',
        });
      }
    } else {
      setVendorInfo({
        name: 'Demo Vendor',
        type: 'All Services',
        location: 'Global',
        rating: 4.8,
        revenue: 52840,
        currency: 'USD',
      });
    }

    // Load listings
    const listings = localStorage.getItem('listings');
    if (listings) {
      try {
        const parsedListings = JSON.parse(listings);
        setListingCount(parsedListings.length);
      } catch (e) {
        setListingCount(dummyListings.length);
      }
    } else {
      localStorage.setItem('listings', JSON.stringify(dummyListings));
      setListingCount(dummyListings.length);
    }
  }, []);

  const tiles: DashboardTile[] = [
    {
      id: 'listings',
      title: 'My Listings',
      description: 'Manage and organize your services',
      icon: Home,
      route: '/vendor/my-listings',
      count: listingCount,
      color: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'orders',
      title: 'All Orders',
      description: 'Track orders and customer requests',
      icon: ShoppingCart,
      route: '/vendor/orders',
      count: mockOrders.total,
      color: 'bg-green-100 text-green-800',
    },
    {
      id: 'team',
      title: 'Team Members',
      description: 'Manage your team and collaborators',
      icon: Users,
      route: '/vendor/team',
      count: 3,
      color: 'bg-purple-100 text-purple-800',
    },
    {
      id: 'livestream',
      title: 'Create Live Stream',
      description: 'Engage with customers in real-time',
      icon: Zap,
      route: '/vendor/livestream',
      color: 'bg-orange-100 text-orange-800',
    },
    {
      id: 'promotions',
      title: 'Create Promotions',
      description: 'Attract more customers with offers',
      icon: Sparkles,
      route: '/vendor/promotions',
      color: 'bg-pink-100 text-pink-800',
    },
    {
      id: 'payments',
      title: 'Payments & Revenue',
      description: 'View your earnings and transactions',
      icon: DollarSign,
      route: '/vendor/payments',
      color: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Track your performance metrics',
      icon: BarChart3,
      route: '/vendor/analytics',
      color: 'bg-indigo-100 text-indigo-800',
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Manage your account preferences',
      icon: Settings,
      route: '/edit-profile',
      color: 'bg-gray-100 text-gray-800',
    },
  ];

  if (!isSignedIn || !vendorInfo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Vendor Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Welcome back, {vendorInfo.name}! Manage your travel services and grow your business.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mb-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-travel-blue">{listingCount}</p>
              <p className="text-sm text-muted-foreground">Total Listings</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-travel-blue">{mockOrders.total}</p>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-travel-blue">${vendorInfo.revenue.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-travel-blue">{vendorInfo.rating}</p>
              <p className="text-sm text-muted-foreground">Business Rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Tiles */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tiles.map((tile) => {
            const Icon = tile.icon;
            const tileComponent = (
              <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6">
                  {/* Icon with background */}
                  <div className={`w-16 h-16 rounded-lg mb-4 flex items-center justify-center ${tile.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="h-8 w-8" />
                  </div>

                  {/* Title and description */}
                  <h3 className="text-lg font-bold mb-1 group-hover:text-travel-blue transition-colors">
                    {tile.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {tile.description}
                  </p>

                  {/* Count badge if exists */}
                  {tile.count !== undefined && tile.count > 0 && (
                    <div className="inline-block px-3 py-1 bg-muted rounded-full text-sm font-semibold text-travel-blue mb-4">
                      {tile.count} {tile.count === 1 ? 'item' : 'items'}
                    </div>
                  )}

                  {/* Arrow indicator */}
                  <div className="flex items-center text-travel-blue font-semibold text-sm group-hover:translate-x-1 transition-transform">
                    Explore
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </div>
                </CardContent>
              </Card>
            );

            return tile.route ? (
              <Link
                key={tile.id}
                to={tile.route}
                className="hover:no-underline"
              >
                {tileComponent}
              </Link>
            ) : (
              <div key={tile.id} onClick={tile.action}>
                {tileComponent}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
