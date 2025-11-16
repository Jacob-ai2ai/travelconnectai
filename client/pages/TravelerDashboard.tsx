import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Heart, Users, Video, CreditCard, AlertCircle, MapPin, ArrowRight, Home, Plane, Mountain, Ticket, ShoppingBag } from 'lucide-react';

interface DashboardTile {
  id: string;
  title: string;
  description: string;
  icon: any;
  route: string;
  count?: number;
  color: string;
}

export default function TravelerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [bookingCount, setBookingCount] = useState(0);
  const [tripCount, setTripCount] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [friendCount, setFriendCount] = useState(0);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const savedBookings = localStorage.getItem('travelerBookings');
    if (savedBookings) {
      try {
        const bookings = JSON.parse(savedBookings);
        setBookingCount(bookings.length);
      } catch (e) {
        console.error('Error loading bookings:', e);
      }
    }

    const savedTrips = localStorage.getItem('travelerTrips');
    if (savedTrips) {
      try {
        const trips = JSON.parse(savedTrips);
        setTripCount(trips.length);
      } catch (e) {
        console.error('Error loading trips:', e);
      }
    }

    const savedFavorites = localStorage.getItem('travelerFavorites');
    if (savedFavorites) {
      try {
        const favorites = JSON.parse(savedFavorites);
        setFavoriteCount(favorites.length);
      } catch (e) {
        console.error('Error loading favorites:', e);
      }
    }

    const savedFriends = localStorage.getItem('travelerFriends');
    if (savedFriends) {
      try {
        const friends = JSON.parse(savedFriends);
        setFriendCount(friends.length);
      } catch (e) {
        console.error('Error loading friends:', e);
      }
    }
  }, []);

  const tiles: DashboardTile[] = [
    {
      id: 'bookings',
      title: 'My Bookings',
      description: 'View and manage your reservations',
      icon: Calendar,
      route: '/traveler/bookings',
      count: bookingCount,
      color: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'trips',
      title: 'My Trips & Itineraries',
      description: 'Plan and track your travel itineraries',
      icon: MapPin,
      route: '/traveler/trips',
      count: tripCount,
      color: 'bg-green-100 text-green-800',
    },
    {
      id: 'favorites',
      title: 'Favorites & Wishlist',
      description: 'Your saved places and experiences',
      icon: Heart,
      route: '/traveler/favorites',
      count: favoriteCount,
      color: 'bg-red-100 text-red-800',
    },
    {
      id: 'friends',
      title: 'Friends',
      description: 'Connect with other travelers',
      icon: Users,
      route: '/traveler/friends',
      count: friendCount,
      color: 'bg-purple-100 text-purple-800',
    },
    {
      id: 'livestream',
      title: 'Join Live Streams',
      description: 'Watch travel guides and live experiences',
      icon: Video,
      route: '/traveler/livestream',
      color: 'bg-red-100 text-red-800',
    },
    {
      id: 'payments',
      title: 'Banking & Payments',
      description: 'Manage payment methods and wallet',
      icon: CreditCard,
      route: '/traveler/payments',
      color: 'bg-indigo-100 text-indigo-800',
    },
    {
      id: 'complaints',
      title: 'Complaints & Support',
      description: 'Report issues and track requests',
      icon: AlertCircle,
      route: '/traveler/complaints',
      color: 'bg-orange-100 text-orange-800',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Traveler Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Welcome back, {user?.username || 'Traveler'}! Manage your travel experiences.
          </p>
        </div>

        {/* Dashboard Tiles */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <Link
                key={tile.id}
                to={tile.route}
                className="hover:no-underline"
              >
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
              </Link>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-travel-blue">{bookingCount}</p>
              <p className="text-sm text-muted-foreground">Active Bookings</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-travel-blue">{tripCount}</p>
              <p className="text-sm text-muted-foreground">Trips</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-travel-blue">{favoriteCount}</p>
              <p className="text-sm text-muted-foreground">Favorites</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-travel-blue">{friendCount}</p>
              <p className="text-sm text-muted-foreground">Friends</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
