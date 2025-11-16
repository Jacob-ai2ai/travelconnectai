import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, MapPin, Star } from 'lucide-react';

interface Booking {
  id: string;
  title: string;
  type: 'stays' | 'flights' | 'experiences' | 'events' | 'essentials';
  location: string;
  price: number;
  checkIn?: string;
  checkOut?: string;
  flightDate?: string;
  eventDate?: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'scheduled';
  rating?: number;
}

export default function TravelerBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedService, setSelectedService] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
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
      {
        id: '4',
        title: 'Concert Tickets - Ed Sheeran',
        type: 'events',
        location: 'London, UK',
        price: 120,
        eventDate: '2025-01-15',
        status: 'scheduled',
      },
      {
        id: '5',
        title: 'Travel Insurance Package',
        type: 'essentials',
        location: 'Worldwide Coverage',
        price: 45,
        status: 'completed',
      },
    ];
    setBookings(demoBookings);
    localStorage.setItem('travelerBookings', JSON.stringify(demoBookings));
  };

  const getFilteredBookings = () => {
    return bookings.filter((booking) => {
      const serviceMatch = selectedService === 'all' || booking.type === selectedService;
      const statusMatch = selectedStatus === 'all' || booking.status === selectedStatus;
      return serviceMatch && statusMatch;
    });
  };

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
      case 'scheduled':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'stays':
        return '🏨';
      case 'flights':
        return '✈️';
      case 'experiences':
        return '🎯';
      case 'events':
        return '🎭';
      case 'essentials':
        return '🛍️';
      default:
        return '📌';
    }
  };

  const filteredBookings = getFilteredBookings();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/traveler-dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
              <p className="text-muted-foreground">
                View and manage your reservations
              </p>
            </div>
            <Link to="/stays">
              <Button className="bg-travel-blue hover:bg-travel-blue/90">
                <Plus className="h-4 w-4 mr-2" />
                New Booking
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Service Filter */}
              <div>
                <label className="text-sm font-medium block mb-2">Filter by Service Type:</label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full border rounded-lg p-2 text-sm"
                >
                  <option value="all">All Services</option>
                  <option value="stays">Stays</option>
                  <option value="flights">Flights</option>
                  <option value="experiences">Experiences</option>
                  <option value="events">Events</option>
                  <option value="essentials">Essentials</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-sm font-medium block mb-2">Filter by Status:</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full border rounded-lg p-2 text-sm"
                >
                  <option value="all">All Bookings</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings Grid */}
        {filteredBookings.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-2xl">{getServiceIcon(booking.type)}</div>
                    <Badge className={`${getStatusColor(booking.status)} capitalize`}>
                      {booking.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{booking.title}</CardTitle>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-4 w-4" />
                    {booking.location}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Type</p>
                      <p className="font-medium capitalize">{booking.type}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Price</p>
                      <p className="font-bold text-travel-blue">${booking.price}</p>
                    </div>
                  </div>

                  {booking.checkIn && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground mb-1">Dates</p>
                      <p className="text-sm font-medium">
                        {booking.checkIn} → {booking.checkOut}
                      </p>
                    </div>
                  )}

                  {booking.flightDate && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground mb-1">Flight Date</p>
                      <p className="text-sm font-medium">{booking.flightDate}</p>
                    </div>
                  )}

                  {booking.eventDate && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground mb-1">Event Date</p>
                      <p className="text-sm font-medium">{booking.eventDate}</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 border-t">
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
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-4">No bookings found for the selected filters.</p>
              <Link to="/stays">
                <Button>Start Booking</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Summary */}
        {filteredBookings.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-travel-blue">{filteredBookings.length}</p>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-travel-blue">
                  ${filteredBookings.reduce((sum, b) => sum + b.price, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Spent</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-travel-blue">
                  {filteredBookings.filter((b) => b.status === 'confirmed' || b.status === 'scheduled').length}
                </p>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
