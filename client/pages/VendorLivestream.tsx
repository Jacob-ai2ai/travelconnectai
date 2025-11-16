import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Radio, Users, Eye, Calendar } from 'lucide-react';

export default function VendorLivestream() {
  const [liveStreams] = useState([
    {
      id: '1',
      title: 'Live Showcase - Luxury Villa Tour',
      status: 'live' as const,
      viewers: 245,
      likes: 89,
      comments: 42,
      startedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      title: 'Q&A with Guests - Next Week',
      status: 'scheduled' as const,
      scheduledFor: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      title: 'Tour Highlights - Paris Apartment',
      status: 'ended' as const,
      totalViewers: 1250,
      totalLikes: 456,
      totalComments: 128,
      endedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link to="/vendor-dashboard">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Create Live Stream</h1>
            <p className="text-muted-foreground">Engage with customers in real-time</p>
          </div>
          <Button className="bg-red-500 hover:bg-red-600">
            <Radio className="h-4 w-4 mr-2" />
            Start Live Stream
          </Button>
        </div>

        <div className="space-y-6">
          {liveStreams.map((stream) => (
            <Card key={stream.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{stream.title}</h3>
                      <Badge
                        className={
                          stream.status === 'live'
                            ? 'bg-red-500 text-white animate-pulse'
                            : stream.status === 'scheduled'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }
                      >
                        {stream.status === 'live' ? '🔴 LIVE' : stream.status === 'scheduled' ? 'Scheduled' : 'Ended'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {stream.status === 'live' && (
                  <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-muted rounded-lg text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Live Viewers</p>
                      <p className="font-semibold text-travel-blue flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {stream.viewers}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Likes</p>
                      <p className="font-semibold text-travel-blue">❤ {stream.likes}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Comments</p>
                      <p className="font-semibold text-travel-blue">💬 {stream.comments}</p>
                    </div>
                  </div>
                )}

                {stream.status === 'scheduled' && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-blue-800">
                      Scheduled for {new Date(stream.scheduledFor!).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                )}

                {stream.status === 'ended' && (
                  <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-muted rounded-lg text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Total Viewers</p>
                      <p className="font-semibold text-travel-blue">{stream.totalViewers}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Likes</p>
                      <p className="font-semibold text-travel-blue">❤ {stream.totalLikes}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Comments</p>
                      <p className="font-semibold text-travel-blue">💬 {stream.totalComments}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm" className="flex-1">
                    {stream.status === 'live' ? 'Go Live' : 'View Details'}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-red-600">1</p>
              <p className="text-sm text-muted-foreground">Live Now</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-travel-blue">1</p>
              <p className="text-sm text-muted-foreground">Scheduled</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-gray-600">1</p>
              <p className="text-sm text-muted-foreground">Past Streams</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
