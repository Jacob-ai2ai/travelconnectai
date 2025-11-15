import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Star, Edit2, Trash2 } from 'lucide-react';

interface Listing {
  id: string;
  type: string;
  title: string;
  location: string;
  price: number;
  rating: number;
}

export default function VendorMyListings() {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedType, setSelectedType] = useState('all');
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const signedIn = localStorage.getItem('isSignedIn') === 'true';
    if (!signedIn) {
      navigate('/');
      return;
    }
    setIsSignedIn(true);

    // Load listings from localStorage
    const savedListings = localStorage.getItem('listings');
    if (savedListings) {
      try {
        setListings(JSON.parse(savedListings));
      } catch (e) {
        console.error('Error loading listings:', e);
      }
    }
  }, [navigate]);

  const vendorTypeOptions = [
    { value: 'all', label: 'All Listings' },
    { value: 'stays', label: 'Stays' },
    { value: 'flights', label: 'Flights' },
    { value: 'experiences', label: 'Experiences' },
    { value: 'events', label: 'Events' },
    { value: 'essentials', label: 'Essentials' },
  ];

  const filteredListings = listings.filter(
    (l) => selectedType === 'all' || l.type === selectedType
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'stays':
        return 'bg-blue-100 text-blue-800';
      case 'flights':
        return 'bg-orange-100 text-orange-800';
      case 'experiences':
        return 'bg-purple-100 text-purple-800';
      case 'events':
        return 'bg-green-100 text-green-800';
      case 'essentials':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/vendor-dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Listings</h1>
              <p className="text-muted-foreground">
                Manage and organize all your service listings
              </p>
            </div>
            <Link to="/vendor/create-listing">
              <Button className="bg-travel-blue hover:bg-travel-blue/90">
                <Plus className="h-4 w-4 mr-2" />
                Create New Listing
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Filter by type:</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="border rounded-lg p-2 text-sm"
              >
                {vendorTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label} ({listings.filter((l) => opt.value === 'all' || l.type === opt.value).length})
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Listings Grid */}
        {filteredListings.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={`${getTypeColor(listing.type)} capitalize`}>
                      {listing.type}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium">{listing.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{listing.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{listing.location}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-travel-blue">
                      ${listing.price}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {listing.type === 'stays' ? 'per night' : listing.type === 'flights' ? 'per ticket' : 'per person'}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        // Store listing to edit
                        localStorage.setItem('editingListing', JSON.stringify(listing));
                        navigate('/vendor/create-listing');
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-red-600 hover:text-red-600"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this listing?')) {
                          const updated = listings.filter((l) => l.id !== listing.id);
                          setListings(updated);
                          localStorage.setItem('listings', JSON.stringify(updated));
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-4">No listings found for the selected type.</p>
              <Link to="/vendor/create-listing">
                <Button>Create Your First Listing</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Summary */}
        <div className="mt-8 grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-travel-blue">{listings.length}</p>
              <p className="text-sm text-muted-foreground">Total Listings</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-travel-blue">${listings.reduce((sum, l) => sum + l.price, 0)}</p>
              <p className="text-sm text-muted-foreground">Total Value</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-travel-blue">{(listings.reduce((sum, l) => sum + l.rating, 0) / listings.length).toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-travel-blue">
                {new Set(listings.map((l) => l.type)).size}
              </p>
              <p className="text-sm text-muted-foreground">Service Types</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
