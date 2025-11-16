import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, MapPin, Calendar, Users, Share2, Edit2, Trash2, Plus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'ongoing' | 'completed' | 'scheduled' | 'pending';
  bookings: number;
  image?: string;
  description?: string;
  budget?: number;
}

interface Booking {
  id: string;
  title: string;
  type: string;
  price: number;
  date: string;
}

export default function TravelerTripDetail() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!tripId) return;

    // Load trip from localStorage
    const savedTrips = localStorage.getItem('travelerTrips');
    if (savedTrips) {
      try {
        const trips: Trip[] = JSON.parse(savedTrips);
        const found = trips.find((t) => t.id === tripId);
        if (found) {
          setTrip(found);
        }
      } catch (e) {
        console.error('Error loading trip:', e);
      }
    }

    // Load trip bookings from localStorage
    const savedTripBookings = localStorage.getItem(`tripBookings_${tripId}`);
    if (savedTripBookings) {
      try {
        setBookings(JSON.parse(savedTripBookings));
      } catch (e) {
        console.error('Error loading trip bookings:', e);
      }
    }
  }, [tripId]);

  if (!trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <Alert variant="destructive">
            <AlertDescription>Trip not found</AlertDescription>
          </Alert>
          <Link to="/traveler/trips">
            <Button variant="ghost" className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Trips
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/traveler/trips">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Trips
            </Button>
          </Link>

          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{trip.name}</h1>
                <Badge className={`${getStatusColor(trip.status)} capitalize`}>
                  {trip.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{trip.destination}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{trip.bookings} bookings</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setEditing(!editing)}>
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="travelers">Travelers</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Trip Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Destination</label>
                    <p className="mt-1 text-lg">{trip.destination}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Duration</label>
                    <p className="mt-1 text-lg">{calculateDuration(trip.startDate, trip.endDate)} days</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Start Date</label>
                    <p className="mt-1 text-lg">{new Date(trip.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">End Date</label>
                    <p className="mt-1 text-lg">{new Date(trip.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <p className="mt-1 text-muted-foreground">{trip.description || 'No description added'}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Itinerary Tab */}
          <TabsContent value="itinerary" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Daily Itinerary</CardTitle>
                  <CardDescription>Plan your daily activities and attractions</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Activity
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from({ length: calculateDuration(trip.startDate, trip.endDate) }).map((_, i) => (
                    <Card key={i} className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">
                            Day {i + 1} - {new Date(new Date(trip.startDate).getTime() + i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">No activities planned yet</p>
                        </div>
                        <Button variant="outline" size="sm">Add Activity</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Trip Bookings</CardTitle>
                  <CardDescription>{trip.bookings} bookings included in this trip</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Booking
                </Button>
              </CardHeader>
              <CardContent>
                {bookings.length > 0 ? (
                  <div className="space-y-3">
                    {bookings.map((booking) => (
                      <Card key={booking.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{booking.title}</h4>
                            <p className="text-sm text-muted-foreground">{booking.type} • {booking.date}</p>
                          </div>
                          <p className="font-bold text-travel-blue">${booking.price}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-6">No bookings yet for this trip</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Budget Tab */}
          <TabsContent value="budget" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget & Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Total Budget</p>
                    <p className="text-3xl font-bold text-travel-blue">${trip.budget || 0}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Total Bookings Cost</p>
                    <p className="text-3xl font-bold text-travel-blue">
                      ${bookings.reduce((sum, b) => sum + b.price, 0)}
                    </p>
                  </div>
                  <Button className="w-full" variant="outline">
                    Set Budget
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Travelers Tab */}
          <TabsContent value="travelers" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Travelers</CardTitle>
                  <CardDescription>Invite friends to join this trip</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Invite Traveler
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No travelers invited yet</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="mt-8 flex gap-3">
          <Button variant="outline">Download Itinerary</Button>
          <Button variant="outline">Share Trip</Button>
          <Button variant="destructive" className="ml-auto">Delete Trip</Button>
        </div>
      </div>
    </div>
  );
}
