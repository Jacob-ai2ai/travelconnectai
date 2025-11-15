import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Plus, Trash2, Star, MapPin, DollarSign, Image as ImageIcon, Users, Zap, Gift, Calendar, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Listing {
  id: string;
  type: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  description?: string;
  images?: string[];
}

interface Promotion {
  id: string;
  name: string;
  discount: number;
  validUntil: string;
}

interface Deal {
  id: string;
  name: string;
  description: string;
  discount: number;
}

interface LiveStream {
  id: string;
  title: string;
  status: 'scheduled' | 'live' | 'ended';
  scheduledAt?: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: 'co-worker' | 'property-manager';
  email: string;
}

export default function VendorListingDetail() {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  // Form states
  const [editingListing, setEditingListing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    // Load listing from localStorage
    const savedListings = localStorage.getItem('listings');
    if (savedListings && listingId) {
      try {
        const listings: Listing[] = JSON.parse(savedListings);
        const found = listings.find((l) => l.id === listingId);
        if (found) {
          setListing(found);
          setEditTitle(found.title);
          setEditPrice(String(found.price));
          setEditDescription(found.description || '');
        }
      } catch (e) {
        console.error('Error loading listing:', e);
      }
    }

    // Load related data from localStorage
    const savedPromotions = localStorage.getItem(`promotions_${listingId}`);
    if (savedPromotions) {
      try {
        setPromotions(JSON.parse(savedPromotions));
      } catch (e) {
        console.error('Error loading promotions:', e);
      }
    }

    const savedDeals = localStorage.getItem(`deals_${listingId}`);
    if (savedDeals) {
      try {
        setDeals(JSON.parse(savedDeals));
      } catch (e) {
        console.error('Error loading deals:', e);
      }
    }

    const savedLiveStreams = localStorage.getItem(`livestreams_${listingId}`);
    if (savedLiveStreams) {
      try {
        setLiveStreams(JSON.parse(savedLiveStreams));
      } catch (e) {
        console.error('Error loading live streams:', e);
      }
    }

    const savedTeamMembers = localStorage.getItem(`team_${listingId}`);
    if (savedTeamMembers) {
      try {
        setTeamMembers(JSON.parse(savedTeamMembers));
      } catch (e) {
        console.error('Error loading team members:', e);
      }
    }
  }, [listingId]);

  if (!listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Listing not found</AlertDescription>
          </Alert>
          <Link to="/vendor/my-listings">
            <Button variant="ghost" className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Listings
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSaveListingDetails = () => {
    const savedListings = localStorage.getItem('listings');
    if (savedListings) {
      try {
        const listings: Listing[] = JSON.parse(savedListings);
        const updated = listings.map((l) =>
          l.id === listing.id
            ? { ...l, title: editTitle, price: parseFloat(editPrice), description: editDescription }
            : l
        );
        localStorage.setItem('listings', JSON.stringify(updated));
        setListing({ ...listing, title: editTitle, price: parseFloat(editPrice), description: editDescription });
        setEditingListing(false);
      } catch (e) {
        console.error('Error saving listing:', e);
      }
    }
  };

  const handleAddPromotion = () => {
    const newPromotion: Promotion = {
      id: Date.now().toString(),
      name: 'New Promotion',
      discount: 10,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
    const updated = [...promotions, newPromotion];
    setPromotions(updated);
    localStorage.setItem(`promotions_${listing.id}`, JSON.stringify(updated));
  };

  const handleDeletePromotion = (id: string) => {
    const updated = promotions.filter((p) => p.id !== id);
    setPromotions(updated);
    localStorage.setItem(`promotions_${listing.id}`, JSON.stringify(updated));
  };

  const handleAddDeal = () => {
    const newDeal: Deal = {
      id: Date.now().toString(),
      name: 'New Deal',
      description: 'Deal description',
      discount: 15,
    };
    const updated = [...deals, newDeal];
    setDeals(updated);
    localStorage.setItem(`deals_${listing.id}`, JSON.stringify(updated));
  };

  const handleDeleteDeal = (id: string) => {
    const updated = deals.filter((d) => d.id !== id);
    setDeals(updated);
    localStorage.setItem(`deals_${listing.id}`, JSON.stringify(updated));
  };

  const handleCreateLiveStream = () => {
    const newLiveStream: LiveStream = {
      id: Date.now().toString(),
      title: 'New Live Stream',
      status: 'scheduled',
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
    const updated = [...liveStreams, newLiveStream];
    setLiveStreams(updated);
    localStorage.setItem(`livestreams_${listing.id}`, JSON.stringify(updated));
  };

  const handleDeleteLiveStream = (id: string) => {
    const updated = liveStreams.filter((l) => l.id !== id);
    setLiveStreams(updated);
    localStorage.setItem(`livestreams_${listing.id}`, JSON.stringify(updated));
  };

  const handleAddTeamMember = () => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: 'New Team Member',
      role: 'co-worker',
      email: 'member@example.com',
    };
    const updated = [...teamMembers, newMember];
    setTeamMembers(updated);
    localStorage.setItem(`team_${listing.id}`, JSON.stringify(updated));
  };

  const handleDeleteTeamMember = (id: string) => {
    const updated = teamMembers.filter((m) => m.id !== id);
    setTeamMembers(updated);
    localStorage.setItem(`team_${listing.id}`, JSON.stringify(updated));
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/vendor/my-listings">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Listings
            </Button>
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{listing.title}</h1>
                <Badge className={`${getTypeColor(listing.type)} capitalize`}>{listing.type}</Badge>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{listing.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>${listing.price}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span>{listing.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="promotions">Promotions</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
            <TabsTrigger value="livestream">Live Stream</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Listing Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!editingListing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <p className="mt-1">{listing.title}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <p className="mt-1 text-muted-foreground">{listing.description || 'No description added'}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Location</label>
                        <p className="mt-1">{listing.location}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Price</label>
                        <p className="mt-1">${listing.price}</p>
                      </div>
                    </div>
                    <Button onClick={() => setEditingListing(true)}>Edit Details</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="mt-1 w-full min-h-24 p-2 border rounded-lg"
                        placeholder="Enter listing description"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Price</label>
                      <Input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveListingDetails}>Save Changes</Button>
                      <Button variant="outline" onClick={() => setEditingListing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Images Tab */}
          <TabsContent value="images" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Listing Images
                </CardTitle>
                <CardDescription>Add or remove images for your listing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">Click to upload images or drag and drop</p>
                    <Button className="mt-4">Upload Images</Button>
                  </div>
                  {listing.images && listing.images.length > 0 ? (
                    <div className="grid grid-cols-4 gap-4">
                      {listing.images.map((image, index) => (
                        <div key={index} className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                          <img src={image} alt={`Listing image ${index + 1}`} className="w-full h-full object-cover" />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              const updated = listing.images!.filter((_, i) => i !== index);
                              setListing({ ...listing, images: updated });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No images uploaded yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Promotions Tab */}
          <TabsContent value="promotions" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Promotions
                  </CardTitle>
                  <CardDescription>Create and manage special offers</CardDescription>
                </div>
                <Button onClick={handleAddPromotion}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Promotion
                </Button>
              </CardHeader>
              <CardContent>
                {promotions.length > 0 ? (
                  <div className="space-y-3">
                    {promotions.map((promo) => (
                      <div key={promo.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{promo.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {promo.discount}% discount until {promo.validUntil}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePromotion(promo.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No promotions yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Deals Tab */}
          <TabsContent value="deals" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    Deals
                  </CardTitle>
                  <CardDescription>Create special deals for your listing</CardDescription>
                </div>
                <Button onClick={handleAddDeal}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Deal
                </Button>
              </CardHeader>
              <CardContent>
                {deals.length > 0 ? (
                  <div className="space-y-3">
                    {deals.map((deal) => (
                      <div key={deal.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{deal.name}</p>
                          <p className="text-sm text-muted-foreground">{deal.description}</p>
                          <p className="text-sm font-semibold text-travel-blue mt-1">{deal.discount}% off</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDeal(deal.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No deals yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Stream Tab */}
          <TabsContent value="livestream" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Live Streams
                  </CardTitle>
                  <CardDescription>Schedule and manage live streams for your listing</CardDescription>
                </div>
                <Button onClick={handleCreateLiveStream}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Live Stream
                </Button>
              </CardHeader>
              <CardContent>
                {liveStreams.length > 0 ? (
                  <div className="space-y-3">
                    {liveStreams.map((stream) => (
                      <div key={stream.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{stream.title}</p>
                          <p className="text-sm text-muted-foreground capitalize">{stream.status}</p>
                          {stream.scheduledAt && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Scheduled: {new Date(stream.scheduledAt).toLocaleString()}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteLiveStream(stream.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No live streams scheduled</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Team Members
                  </CardTitle>
                  <CardDescription>Assign co-workers and property managers</CardDescription>
                </div>
                <Button onClick={handleAddTeamMember}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
              </CardHeader>
              <CardContent>
                {teamMembers.length > 0 ? (
                  <div className="space-y-3">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                          <Badge className="mt-2 capitalize">{member.role}</Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTeamMember(member.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No team members assigned</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
