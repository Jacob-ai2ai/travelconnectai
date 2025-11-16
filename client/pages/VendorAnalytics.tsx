import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, TrendingUp, Eye, Heart, MessageSquare, Download } from 'lucide-react';

export default function VendorAnalytics() {
  const [dateRange] = useState('thisMonth');

  const analytics = {
    totalViews: 12450,
    totalBookings: 24,
    conversionRate: 0.192,
    averageRating: 4.7,
    totalReviews: 156,
    topListing: 'Luxurious Beach Villa in Bali',
    topListingViews: 3240,
    listingPerformance: [
      {
        id: '1',
        title: 'Luxurious Beach Villa in Bali',
        views: 3240,
        clicks: 820,
        bookings: 8,
        revenue: 2000,
      },
      {
        id: '2',
        title: 'Cozy Apartment in Paris',
        views: 2150,
        clicks: 540,
        bookings: 6,
        revenue: 1620,
      },
      {
        id: '3',
        title: 'Mountain Cabin with Mountain Views',
        views: 3100,
        clicks: 780,
        bookings: 7,
        revenue: 2240,
      },
      {
        id: '4',
        title: 'Round Trip: New York to London',
        views: 2050,
        clicks: 410,
        bookings: 3,
        revenue: 1560,
      },
    ],
  };

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
          <h1 className="text-3xl font-bold">Analytics</h1>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Views</p>
                  <p className="text-3xl font-bold text-travel-blue">{analytics.totalViews.toLocaleString()}</p>
                </div>
                <Eye className="h-8 w-8 text-travel-blue/20" />
              </div>
              <p className="text-xs text-green-600 mt-2">↑ 12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Conversion Rate</p>
                  <p className="text-3xl font-bold text-travel-blue">{(analytics.conversionRate * 100).toFixed(1)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-travel-blue/20" />
              </div>
              <p className="text-xs text-green-600 mt-2">↑ 2.3% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg. Rating</p>
                  <p className="text-3xl font-bold text-travel-blue">{analytics.averageRating}</p>
                </div>
                <Heart className="h-8 w-8 text-travel-blue/20" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">{analytics.totalReviews} reviews</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Total Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-travel-blue mb-2">{analytics.totalBookings}</p>
              <p className="text-muted-foreground">Bookings this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Top Performing Listing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold mb-1">{analytics.topListing}</p>
              <p className="text-sm text-muted-foreground">{analytics.topListingViews.toLocaleString()} views</p>
            </CardContent>
          </Card>
        </div>

        {/* Listing Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Listing Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">Listing</th>
                    <th className="text-center py-2 px-2">Views</th>
                    <th className="text-center py-2 px-2">Clicks</th>
                    <th className="text-center py-2 px-2">Bookings</th>
                    <th className="text-right py-2 px-2">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.listingPerformance.map((listing) => (
                    <tr key={listing.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-2 font-medium">{listing.title}</td>
                      <td className="py-3 px-2 text-center">{listing.views.toLocaleString()}</td>
                      <td className="py-3 px-2 text-center">{listing.clicks.toLocaleString()}</td>
                      <td className="py-3 px-2 text-center">
                        <Badge className="bg-green-100 text-green-800">{listing.bookings}</Badge>
                      </td>
                      <td className="py-3 px-2 text-right font-semibold text-travel-blue">
                        ${listing.revenue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
