import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, MapPin, Calendar } from 'lucide-react';

interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'ongoing' | 'completed' | 'scheduled' | 'pending';
  bookings: number;
  image?: string;
}

export default function TravelerTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    const savedTrips = localStorage.getItem('travelerTrips');
    if (savedTrips) {
      try {
        setTrips(JSON.parse(savedTrips));
      } catch (e) {
        console.error('Error loading trips:', e);
        initializeDemoData();
      }
    } else {
      initializeDemoData();
    }
  }, []);

  const initializeDemoData = () => {
    const demoTrips: Trip[] = [
      {
        id: '1',
        name: 'Bali Adventure',
        destination: 'Bali, Indonesia',
        startDate: '2024-12-20',
        endDate: '2024-12-27',
        status: 'scheduled',
        bookings: 3,
      },
      {
        id: '2',
        name: 'Tokyo Winter',
        destination: 'Tokyo, Japan',
        startDate: '2024-12-15',
        endDate: '2024-12-18',
        status: 'scheduled',
        bookings: 2,
      },
      {
        id: '3',
        name: 'European Grand Tour',
        destination: 'Paris, London, Rome',
        startDate: '2024-10-01',
        endDate: '2024-10-21',
        status: 'completed',
        bookings: 8,
      },
      {
        id: '4',
        name: 'Summer Beach Getaway',
        destination: 'Maldives',
        startDate: '2025-06-15',
        endDate: '2025-06-22',
        status: 'planning',
        bookings: 1,
      },
      {
        id: '5',
        name: 'Mountain Trek',
        destination: 'Swiss Alps',
        startDate: '2025-03-10',
        endDate: '2025-03-15',
        status: 'pending',
        bookings: 2,
      },
    ];
    setTrips(demoTrips);
    localStorage.setItem('travelerTrips', JSON.stringify(demoTrips));
  };

  const getFilteredTrips = () => {
    if (selectedStatus === 'all') return trips;
    return trips.filter((trip) => trip.status === selectedStatus);
  };

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

  const getDestinationEmoji = (destination: string) => {
    if (destination.includes('Bali')) return '🏝️';
    if (destination.includes('Tokyo')) return '🗼';
    if (destination.includes('Paris')) return '🗽';
    if (destination.includes('London')) return '🇬🇧';
    if (destination.includes('Rome')) return '🏛️';
    if (destination.includes('Maldives')) return '🌴';
    if (destination.includes('Alps')) return '⛷️';
    return '✈️';
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} (${duration} days)`;
  };

  const filteredTrips = getFilteredTrips();

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
              <h1 className="text-3xl font-bold mb-2">My Trips & Itineraries</h1>
              <p className="text-muted-foreground">
                Plan and track your travel itineraries
              </p>
            </div>
            <Link to="/ai-planner">
              <Button className="bg-travel-blue hover:bg-travel-blue/90">
                <Plus className="h-4 w-4 mr-2" />
                Plan a Trip
              </Button>
            </Link>
          </div>
        </div>

        {/* Status Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div>
              <label className="text-sm font-medium block mb-2">Filter by Status:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full md:w-64 border rounded-lg p-2 text-sm"
              >
                <option value="all">All Trips</option>
                <option value="planning">Planning</option>
                <option value="pending">Pending</option>
                <option value="scheduled">Scheduled</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Trips Grid - Tiles with destination and date */}
        {filteredTrips.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <Link
                key={trip.id}
                to={`/traveler/trip/${trip.id}`}
                className="hover:no-underline"
              >
                <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  {/* Image area with destination emoji */}
                  <div className="aspect-video bg-gradient-to-br from-travel-blue/20 to-travel-purple/20 flex items-center justify-center relative overflow-hidden">
                    <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                      {getDestinationEmoji(trip.destination)}
                    </span>
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={`${getStatusColor(trip.status)} capitalize text-xs`}>
                        {trip.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-travel-blue transition-colors">
                      {trip.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* Destination */}
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <p className="text-sm font-medium">{trip.destination}</p>
                    </div>

                    {/* Date Range */}
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">
                        {formatDateRange(trip.startDate, trip.endDate)}
                      </p>
                    </div>

                    {/* Bookings count */}
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground mb-2">
                        {trip.bookings} {trip.bookings === 1 ? 'booking' : 'bookings'}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 pt-2 border-t">
                      <Button variant="outline" size="sm" className="flex-1">
                        View Itinerary
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-4">No trips found for the selected status.</p>
              <Link to="/ai-planner">
                <Button>Start Planning</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Summary Stats */}
        {filteredTrips.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-travel-blue">{filteredTrips.length}</p>
                <p className="text-sm text-muted-foreground">Total Trips</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-travel-blue">
                  {filteredTrips.reduce((sum, t) => sum + t.bookings, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-travel-blue">
                  {filteredTrips.filter((t) => t.status === 'scheduled' || t.status === 'planning').length}
                </p>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-travel-blue">
                  {filteredTrips.filter((t) => t.status === 'completed').length}
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
