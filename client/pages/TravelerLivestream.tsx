import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Users, MapPin, Star } from 'lucide-react';

interface LiveStream {
  id: string;
  title: string;
  description: string;
  guide: string;
  location: string;
  status: 'live' | 'upcoming' | 'ended';
  viewers?: number;
  rating?: number;
  scheduledAt?: string;
  category: string;
}

export default function TravelerLivestream() {
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const savedStreams = localStorage.getItem('travelerLiveStreams');
    if (savedStreams) {
      try {
        setLiveStreams(JSON.parse(savedStreams));
      } catch (e) {
        console.error('Error loading live streams:', e);
        initializeDemoData();
      }
    } else {
      initializeDemoData();
    }
  }, []);

  const initializeDemoData = () => {
    const demoStreams: LiveStream[] = [
      {
        id: '1',
        title: 'Hidden Gems of Tokyo',
        description: 'Explore the lesser-known attractions of Tokyo with a local guide',
        guide: 'Yuki Tanaka',
        location: 'Tokyo, Japan',
        status: 'live',
        viewers: 2450,
        rating: 4.8,
        category: 'City Tour',
      },
      {
        id: '2',
        title: 'Sunrise in the Maldives',
        description: 'Experience the beautiful sunrise over the Indian Ocean',
        guide: 'Ahmed Hassan',
        location: 'Maldives',
        status: 'upcoming',
        scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        rating: 4.9,
        category: 'Nature',
      },
      {
        id: '3',
        title: 'Street Food Tour - Bangkok',
        description: 'Discover the best street food in Bangkok with a culinary expert',
        guide: 'Somchai Pattaya',
        location: 'Bangkok, Thailand',
        status: 'live',
        viewers: 1850,
        rating: 4.7,
        category: 'Food',
      },
      {
        id: '4',
        title: 'Hiking the Swiss Alps',
        description: 'A guided hike through the stunning Swiss Alps',
        guide: 'Clara Mueller',
        location: 'Swiss Alps',
        status: 'upcoming',
        scheduledAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        rating: 4.9,
        category: 'Adventure',
      },
      {
        id: '5',
        title: 'Art & Culture in Paris',
        description: 'Discover the artistic heritage of Paris',
        guide: 'Marie Dubois',
        location: 'Paris, France',
        status: 'ended',
        rating: 4.6,
        category: 'Culture',
      },
    ];
    setLiveStreams(demoStreams);
    localStorage.setItem('travelerLiveStreams', JSON.stringify(demoStreams));
  };

  const getFilteredStreams = () => {
    if (statusFilter === 'all') return liveStreams;
    return liveStreams.filter((s) => s.status === statusFilter);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-red-100 text-red-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'ended':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredStreams = getFilteredStreams();
  const liveCount = liveStreams.filter((s) => s.status === 'live').length;
  const upcomingCount = liveStreams.filter((s) => s.status === 'upcoming').length;

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

          <div>
            <h1 className="text-3xl font-bold mb-2">Live Streams</h1>
            <p className="text-muted-foreground">
              Watch travel guides and live experiences from around the world
            </p>
          </div>
        </div>

        {/* Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div>
              <label className="text-sm font-medium block mb-2">Filter by Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full md:w-64 border rounded-lg p-2 text-sm"
              >
                <option value="all">All Streams ({liveStreams.length})</option>
                <option value="live">Live Now ({liveCount})</option>
                <option value="upcoming">Upcoming ({upcomingCount})</option>
                <option value="ended">Ended ({liveStreams.filter((s) => s.status === 'ended').length})</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Live Streams Grid */}
        {filteredStreams.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStreams.map((stream) => (
              <Card key={stream.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                {/* Thumbnail area */}
                <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative">
                  <Play className="h-12 w-12 text-muted-foreground" />
                  {stream.status === 'live' && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-red-500 text-white animate-pulse">
                        🔴 LIVE
                      </Badge>
                    </div>
                  )}
                </div>

                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={`${getStatusColor(stream.status)} capitalize text-xs`}>
                      {stream.status === 'live' ? 'Live Now' : stream.status === 'upcoming' ? 'Upcoming' : 'Ended'}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{stream.title}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">{stream.description}</p>

                  {/* Guide info */}
                  <div className="text-sm">
                    <p className="text-muted-foreground">Guide</p>
                    <p className="font-medium">{stream.guide}</p>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{stream.location}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm">
                    {stream.viewers && (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{stream.viewers.toLocaleString()}</span>
                      </div>
                    )}
                    {stream.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-muted-foreground">{stream.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Scheduled date if upcoming */}
                  {stream.scheduledAt && stream.status === 'upcoming' && (
                    <div className="text-xs text-muted-foreground pt-2 border-t">
                      Starts {new Date(stream.scheduledAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  )}

                  {/* Action Button */}
                  <Button
                    className={`w-full ${stream.status === 'live' ? 'bg-red-500 hover:bg-red-600' : 'bg-travel-blue hover:bg-travel-blue/90'}`}
                  >
                    {stream.status === 'live' ? 'Join Now' : stream.status === 'upcoming' ? 'Set Reminder' : 'Watch Replay'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-4">No live streams found.</p>
              <p className="text-sm text-muted-foreground">Check back soon for new streams!</p>
            </CardContent>
          </Card>
        )}

        {/* Summary Stats */}
        {filteredStreams.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-red-600">{liveCount}</p>
                <p className="text-sm text-muted-foreground">Live Now</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-travel-blue">{upcomingCount}</p>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-travel-blue">{liveStreams.length}</p>
                <p className="text-sm text-muted-foreground">Total Streams</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
