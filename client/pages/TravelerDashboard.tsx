import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Heart, 
  Users, 
  Video, 
  CreditCard, 
  AlertCircle, 
  MapPin, 
  Star,
  Edit2,
  Trash2,
  Plus,
  Plane,
  ArrowLeft
} from 'lucide-react';

interface Booking {
  id: string;
  title: string;
  type: 'stays' | 'flights' | 'experiences' | 'events';
  location: string;
  price: number;
  checkIn?: string;
  checkOut?: string;
  flightDate?: string;
  eventDate?: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  rating?: number;
}

interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'ongoing' | 'completed';
  bookings: Booking[];
}

interface Favorite {
  id: string;
  title: string;
  type: string;
  location: string;
  image?: string;
  rating: number;
}

interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: 'active' | 'offline';
  mutualFriends?: number;
}

interface LiveStream {
  id: string;
  title: string;
  host: string;
  viewers: number;
  isLive: boolean;
  thumbnail?: string;
}

interface Complaint {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved';
  date: string;
}

export default function TravelerDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Load user
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Load bookings
    const savedBookings = localStorage.getItem('travelerBookings');
    if (savedBookings) {
      try {
        setBookings(JSON.parse(savedBookings));
      } catch (e) {
        console.error('Error loading bookings:', e);
        initializeDemoData();
      }
    } else {
      initializeDemoData();
    }

    // Load trips
    const savedTrips = localStorage.getItem('travelerTrips');
    if (savedTrips) {
      try {
        setTrips(JSON.parse(savedTrips));
      } catch (e) {
        console.error('Error loading trips:', e);
      }
    }

    // Load favorites
    const savedFavorites = localStorage.getItem('travelerFavorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error('Error loading favorites:', e);
      }
    }

    // Load friends
    const savedFriends = localStorage.getItem('travelerFriends');
    if (savedFriends) {
      try {
        setFriends(JSON.parse(savedFriends));
      } catch (e) {
        console.error('Error loading friends:', e);
      }
    } else {
      setFriends(generateSampleFriends());
    }

    // Load live streams
    const savedLiveStreams = localStorage.getItem('travelerLiveStreams');
    if (savedLiveStreams) {
      try {
        setLiveStreams(JSON.parse(savedLiveStreams));
      } catch (e) {
        console.error('Error loading live streams:', e);
      }
    } else {
      setLiveStreams(generateSampleLiveStreams());
    }

    // Load complaints
    const savedComplaints = localStorage.getItem('travelerComplaints');
    if (savedComplaints) {
      try {
        setComplaints(JSON.parse(savedComplaints));
      } catch (e) {
        console.error('Error loading complaints:', e);
      }
    }
  }, []);

  const initializeDemoData = () => {
    const demoBookings: Booking[] = [
      {
        id: '1',
        title: 'Luxury Beach Resort',
        type: 'stays',
        location: 'Bali, Indonesia',
        price: 250,
        checkIn: '2024-12-20',
        checkOut: '2024-12-27',
        status: 'confirmed',
      },
      {
        id: '2',
        title: 'Flight to Tokyo',
        type: 'flights',
        location: 'New York to Tokyo',
        price: 850,
        flightDate: '2024-12-15',
        status: 'confirmed',
      },
      {
        id: '3',
        title: 'Mountain Hiking Experience',
        type: 'experiences',
        location: 'Swiss Alps',
        price: 150,
        eventDate: '2024-12-18',
        status: 'pending',
      },
    ];
    setBookings(demoBookings);
    localStorage.setItem('travelerBookings', JSON.stringify(demoBookings));
  };

  const generateSampleFriends = (): Friend[] => [
    { id: '1', name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=10', status: 'active', mutualFriends: 5 },
    { id: '2', name: 'Michael', avatar: 'https://i.pravatar.cc/150?img=11', status: 'offline', mutualFriends: 3 },
    { id: '3', name: 'Emma', avatar: 'https://i.pravatar.cc/150?img=12', status: 'active', mutualFriends: 8 },
    { id: '4', name: 'James', avatar: 'https://i.pravatar.cc/150?img=13', status: 'offline', mutualFriends: 2 },
    { id: '5', name: 'Lisa', avatar: 'https://i.pravatar.cc/150?img=14', status: 'active', mutualFriends: 6 },
  ];

  const generateSampleLiveStreams = (): LiveStream[] => [
    {
      id: '1',
      title: 'Paris City Tour',
      host: 'Travel Guide Alex',
      viewers: 324,
      isLive: true,
    },
    {
      id: '2',
      title: 'Cooking in Thailand',
      host: 'Chef Maria',
      viewers: 512,
      isLive: true,
    },
    {
      id: '3',
      title: 'Desert Adventure Highlights',
      host: 'Adventure John',
      viewers: 0,
      isLive: false,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/profile">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
          </Link>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Traveler Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.username || 'Traveler'}! Manage your bookings, trips, and more.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-travel-blue">{bookings.length}</p>
                <p className="text-sm text-muted-foreground">Active Bookings</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-travel-blue">{trips.length}</p>
                <p className="text-sm text-muted-foreground">Trips</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-travel-blue">{favorites.length}</p>
                <p className="text-sm text-muted-foreground">Favorites</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-travel-blue">{friends.length}</p>
                <p className="text-sm text-muted-foreground">Friends</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Bookings</span>
            </TabsTrigger>
            <TabsTrigger value="trips" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Trips</span>
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Favorites</span>
            </TabsTrigger>
            <TabsTrigger value="friends" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Friends</span>
            </TabsTrigger>
            <TabsTrigger value="livestream" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              <span className="hidden sm:inline">Live</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Payments</span>
            </TabsTrigger>
            <TabsTrigger value="complaints" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Issues</span>
            </TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>My Bookings</CardTitle>
                  <CardDescription>View and manage your reservations</CardDescription>
                </div>
                <Link to="/stays">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Booking
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {bookings.length > 0 ? (
                  <div className="grid gap-4">
                    {bookings.map((booking) => (
                      <Card key={booking.id} className="overflow-hidden">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">{booking.title}</h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                <MapPin className="h-4 w-4" />
                                {booking.location}
                              </p>
                            </div>
                            <Badge className={`${getStatusColor(booking.status)} capitalize`}>
                              {booking.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Type</p>
                              <p className="font-medium capitalize">{booking.type}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Price</p>
                              <p className="font-medium">${booking.price}</p>
                            </div>
                            {booking.checkIn && (
                              <div>
                                <p className="text-muted-foreground">Dates</p>
                                <p className="font-medium">{booking.checkIn} - {booking.checkOut}</p>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 mt-4 pt-4 border-t">
                            <Button variant="outline" size="sm" className="flex-1">
                              View Details
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              Modify
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No bookings yet</p>
                    <Link to="/stays">
                      <Button>Start Booking</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trips Tab */}
          <TabsContent value="trips" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>My Trips & Itineraries</CardTitle>
                  <CardDescription>Plan and track your travel itineraries</CardDescription>
                </div>
                <Link to="/ai-planner">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Plan a Trip
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {trips.length > 0 ? (
                  <div className="grid gap-4">
                    {trips.map((trip) => (
                      <Card key={trip.id} className="overflow-hidden">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">{trip.name}</h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                <MapPin className="h-4 w-4" />
                                {trip.destination}
                              </p>
                            </div>
                            <Badge className={`${getStatusColor(trip.status)}`}>
                              {trip.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mb-4">
                            {trip.startDate} to {trip.endDate} ({trip.bookings.length} bookings)
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              View Itinerary
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              Edit
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No trips planned yet</p>
                    <Link to="/ai-planner">
                      <Button>Start Planning</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Favorites & Wishlist</CardTitle>
                <CardDescription>Your saved places and experiences</CardDescription>
              </CardHeader>
              <CardContent>
                {favorites.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {favorites.map((fav) => (
                      <Card key={fav.id} className="overflow-hidden">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">{fav.title}</h4>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {fav.location}
                              </p>
                            </div>
                            <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                          </div>
                          <div className="flex items-center gap-1 mt-2">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-medium">{fav.rating}</span>
                          </div>
                          <Button variant="outline" size="sm" className="w-full mt-3">
                            View
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No favorites yet. Start exploring!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Friends Tab */}
          <TabsContent value="friends" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Friends</CardTitle>
                  <CardDescription>Connect with other travelers</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Friend
                </Button>
              </CardHeader>
              <CardContent>
                {friends.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {friends.map((friend) => (
                      <Card key={friend.id} className="overflow-hidden">
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            <img
                              src={friend.avatar}
                              alt={friend.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">{friend.name}</h4>
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    friend.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                                  }`}
                                />
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {friend.mutualFriends} mutual friends
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button variant="outline" size="sm" className="flex-1">
                              Message
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              View Profile
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No friends yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Streams Tab */}
          <TabsContent value="livestream" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Streams</CardTitle>
                <CardDescription>Join travel guides and other travelers in live streams</CardDescription>
              </CardHeader>
              <CardContent>
                {liveStreams.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {liveStreams.map((stream) => (
                      <Card key={stream.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                        <CardContent className="pt-4">
                          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-3">
                            <Video className="h-12 w-12 text-muted-foreground" />
                            {stream.isLive && (
                              <div className="absolute top-2 right-2">
                                <Badge className="bg-red-500">LIVE</Badge>
                              </div>
                            )}
                          </div>
                          <h4 className="font-semibold mb-1">{stream.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">Hosted by {stream.host}</p>
                          {stream.isLive && (
                            <p className="text-sm font-medium text-green-600 mb-2">{stream.viewers} watching</p>
                          )}
                          <Button className="w-full">
                            {stream.isLive ? 'Join Now' : 'Watch Replay'}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No live streams available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Banking & Payments</CardTitle>
                <CardDescription>Manage your payment methods and billing information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="border-2">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <CreditCard className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                        <h3 className="font-semibold mb-2">Payment Methods</h3>
                        <p className="text-sm text-muted-foreground mb-4">Add and manage your payment cards</p>
                        <Button variant="outline" className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Payment Method
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-2">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Plane className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                        <h3 className="font-semibold mb-2">Wallet & Rewards</h3>
                        <p className="text-sm text-muted-foreground mb-4">Track your balance and points</p>
                        <Button variant="outline" className="w-full">
                          View Wallet
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <Link to="/my/payment-info">
                  <Button variant="outline" className="w-full">
                    Billing Information
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Complaints Tab */}
          <TabsContent value="complaints" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Complaints & Support</CardTitle>
                  <CardDescription>Report issues and track your support requests</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  File Complaint
                </Button>
              </CardHeader>
              <CardContent>
                {complaints.length > 0 ? (
                  <div className="space-y-3">
                    {complaints.map((complaint) => (
                      <Card key={complaint.id} className="overflow-hidden">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">{complaint.subject}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{complaint.description}</p>
                            </div>
                            <Badge className={`${getStatusColor(complaint.status)} capitalize`}>
                              {complaint.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Filed on {new Date(complaint.date).toLocaleDateString()}
                          </p>
                          <Button variant="outline" size="sm" className="mt-3">
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No complaints filed</p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      File a Complaint
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
