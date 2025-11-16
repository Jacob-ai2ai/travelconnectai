import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, MapPin, Star, ArrowUpDown } from 'lucide-react';

interface FavoriteItem {
  id: string;
  title: string;
  type: 'property' | 'experience' | 'itinerary' | 'essential' | 'event' | 'video' | 'picture';
  location?: string;
  price?: number;
  rating?: number;
  image?: string;
  likedAt: string;
  description?: string;
}

export default function TravelerFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [selectedType, setSelectedType] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const savedFavorites = localStorage.getItem('travelerFavorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error('Error loading favorites:', e);
        initializeDemoData();
      }
    } else {
      initializeDemoData();
    }
  }, []);

  const initializeDemoData = () => {
    const demoFavorites: FavoriteItem[] = [
      {
        id: '1',
        title: 'Luxury Beach Villa in Bali',
        type: 'property',
        location: 'Seminyak, Bali',
        price: 250,
        rating: 4.8,
        likedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        title: 'Sunrise Mount Batur Hike',
        type: 'experience',
        location: 'Mount Batur, Bali',
        price: 65,
        rating: 4.8,
        likedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        title: 'European Grand Tour 2024',
        type: 'itinerary',
        location: 'Paris, London, Rome',
        likedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '4',
        title: 'Travel Insurance Pro',
        type: 'essential',
        price: 45,
        likedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '5',
        title: 'Ed Sheeran Concert',
        type: 'event',
        location: 'London, UK',
        price: 120,
        likedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '6',
        title: 'Travel Vlog - Southeast Asia',
        type: 'video',
        likedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '7',
        title: 'Sunset at Kuta Beach',
        type: 'picture',
        location: 'Bali, Indonesia',
        likedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '8',
        title: 'Cozy Apartment in Paris',
        type: 'property',
        location: 'Paris, France',
        price: 150,
        rating: 4.9,
        likedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    setFavorites(demoFavorites);
    localStorage.setItem('travelerFavorites', JSON.stringify(demoFavorites));
  };

  const getFilteredAndSortedFavorites = () => {
    let filtered = favorites;

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter((fav) => fav.type === selectedType);
    }

    // Date range filter
    if (startDate) {
      const start = new Date(startDate).getTime();
      filtered = filtered.filter((fav) => new Date(fav.likedAt).getTime() >= start);
    }

    if (endDate) {
      const end = new Date(endDate).getTime();
      filtered = filtered.filter((fav) => new Date(fav.likedAt).getTime() <= end);
    }

    // Sorting
    filtered.sort((a, b) => {
      const aDate = new Date(a.likedAt).getTime();
      const bDate = new Date(b.likedAt).getTime();

      if (sortOrder === 'newest') {
        return bDate - aDate;
      } else {
        return aDate - bDate;
      }
    });

    return filtered;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'property':
        return 'bg-blue-100 text-blue-800';
      case 'experience':
        return 'bg-purple-100 text-purple-800';
      case 'itinerary':
        return 'bg-green-100 text-green-800';
      case 'essential':
        return 'bg-orange-100 text-orange-800';
      case 'event':
        return 'bg-pink-100 text-pink-800';
      case 'video':
        return 'bg-red-100 text-red-800';
      case 'picture':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'property':
        return '🏨';
      case 'experience':
        return '🎯';
      case 'itinerary':
        return '✈️';
      case 'essential':
        return '🛍️';
      case 'event':
        return '🎭';
      case 'video':
        return '🎥';
      case 'picture':
        return '📸';
      default:
        return '📌';
    }
  };

  const filteredFavorites = getFilteredAndSortedFavorites();

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
            <h1 className="text-3xl font-bold mb-2">Favorites & Wishlist</h1>
            <p className="text-muted-foreground">
              Your saved places, experiences, and items you love
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filters & Sorting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Item Type Filter */}
              <div>
                <label className="text-sm font-medium block mb-2">Item Type:</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full border rounded-lg p-2 text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="property">Properties</option>
                  <option value="experience">Experiences</option>
                  <option value="itinerary">Itineraries</option>
                  <option value="essential">Essentials</option>
                  <option value="event">Events</option>
                  <option value="video">Videos</option>
                  <option value="picture">Pictures</option>
                </select>
              </div>

              {/* Start Date Filter */}
              <div>
                <label className="text-sm font-medium block mb-2">From Date:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border rounded-lg p-2 text-sm"
                />
              </div>

              {/* End Date Filter */}
              <div>
                <label className="text-sm font-medium block mb-2">To Date:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border rounded-lg p-2 text-sm"
                />
              </div>

              {/* Sort Order */}
              <div>
                <label className="text-sm font-medium block mb-2">Sort By:</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full border rounded-lg p-2 text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setStartDate('');
                    setEndDate('');
                    setSelectedType('all');
                    setSortOrder('newest');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Favorites Grid */}
        {filteredFavorites.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFavorites.map((favorite) => (
              <Card
                key={favorite.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              >
                {/* Image/Icon Area */}
                <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative">
                  <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                    {getTypeIcon(favorite.type)}
                  </span>
                  <button
                    className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-red-50"
                    onClick={(e) => {
                      e.preventDefault();
                      const updated = favorites.filter((f) => f.id !== favorite.id);
                      setFavorites(updated);
                      localStorage.setItem('travelerFavorites', JSON.stringify(updated));
                    }}
                  >
                    <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                  </button>
                </div>

                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={`${getTypeColor(favorite.type)} text-xs capitalize`}>
                      {favorite.type}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-travel-blue transition-colors">
                    {favorite.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Location */}
                  {favorite.location && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{favorite.location}</p>
                    </div>
                  )}

                  {/* Rating */}
                  {favorite.rating && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-medium ml-1">{favorite.rating}</span>
                      </div>
                    </div>
                  )}

                  {/* Price */}
                  {favorite.price && (
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="text-lg font-bold text-travel-blue">${favorite.price}</p>
                    </div>
                  )}

                  {/* Liked Date */}
                  <div className="pt-2 border-t text-xs text-muted-foreground">
                    Liked on {new Date(favorite.likedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>

                  {/* Action Button */}
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No favorites found for the selected filters.</p>
              <Link to="/explore-services">
                <Button>Explore Services</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Summary Stats */}
        {filteredFavorites.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-travel-blue">{filteredFavorites.length}</p>
                <p className="text-sm text-muted-foreground">Total Favorites</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-travel-blue">
                  ${filteredFavorites.filter((f) => f.price).reduce((sum, f) => sum + (f.price || 0), 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Value</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-travel-blue">
                  {new Set(filteredFavorites.map((f) => f.type)).size}
                </p>
                <p className="text-sm text-muted-foreground">Item Types</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-travel-blue">
                  {(
                    filteredFavorites.filter((f) => f.rating).reduce((sum, f) => sum + (f.rating || 0), 0) /
                    filteredFavorites.filter((f) => f.rating).length
                  ).toFixed(1)}
                </p>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
