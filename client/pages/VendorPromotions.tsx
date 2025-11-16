import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, Trash2, Edit2, Sparkles, TrendingUp, Calendar, Grid3x3, List, Zap, AlertCircle, Activity } from 'lucide-react';
import { Promotion } from '@/types/promotions';
import AIPromotionDialog from '@/components/AIPromotionDialog';
import PendingAIApprovalsSection from '@/components/PendingAIApprovalsSection';
import {
  generateMockInventories,
  detectInventoryGaps,
  ListingInventory,
  InventoryGap,
  formatOccupancy,
  getUrgencyColor,
} from '@/lib/inventoryManager';
import {
  getNotificationPreferences,
  saveNotificationPreferences,
  toggleDailyScan,
  addPendingPromotion,
  PendingAIPromotion,
} from '@/lib/notificationManager';
import { generateAIPromotion } from '@/lib/aiPromotions';

export default function VendorPromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'tile' | 'list'>('tile');
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [selectedServiceForAI, setSelectedServiceForAI] = useState('stays');
  const [activeTab, setActiveTab] = useState('all-promotions');

  // Inventory and auto-scan
  const [inventories, setInventories] = useState<ListingInventory[]>([]);
  const [inventoryGaps, setInventoryGaps] = useState<InventoryGap[]>([]);
  const [dailyScanEnabled, setDailyScanEnabled] = useState(false);
  const [scanInProgress, setScanInProgress] = useState(false);

  useEffect(() => {
    const savedPromotions = localStorage.getItem('vendorPromotions');
    if (savedPromotions) {
      try {
        setPromotions(JSON.parse(savedPromotions));
      } catch (e) {
        console.error('Error loading promotions:', e);
        initializeDemoData();
      }
    } else {
      initializeDemoData();
    }

    // Load daily scan preference
    const prefs = getNotificationPreferences();
    setDailyScanEnabled(prefs.dailyScanEnabled);

    // Initialize inventory
    initializeInventory();
  }, []);

  const initializeInventory = () => {
    // Load listings
    const savedListings = localStorage.getItem('listings');
    let listings = [];
    if (savedListings) {
      try {
        listings = JSON.parse(savedListings);
      } catch (e) {
        console.error('Error loading listings:', e);
      }
    }

    // If no listings, create demo listings
    if (listings.length === 0) {
      listings = [
        { id: 'demo-1', type: 'stays', title: 'Beachfront Villa', location: 'Bali', price: 150, rating: 4.8 },
        { id: 'demo-2', type: 'flights', title: 'NYC to LA Flights', location: 'USA', price: 299, rating: 4.5 },
        { id: 'demo-3', type: 'experiences', title: 'Surfing Lessons', location: 'Hawaii', price: 75, rating: 4.9 },
        { id: 'demo-4', type: 'events', title: 'Music Festival', location: 'Miami', price: 120, rating: 4.6 },
        { id: 'demo-5', type: 'essentials', title: 'Travel Insurance', location: 'Global', price: 45, rating: 4.7 },
      ];
    }

    // Generate mock inventories with booking data
    const mockInventories = generateMockInventories(listings);
    setInventories(mockInventories);

    // Detect gaps
    const gaps = detectInventoryGaps(mockInventories);
    setInventoryGaps(gaps);
  };

  const performInventoryScan = async () => {
    setScanInProgress(true);
    try {
      // Simulate scan delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const gaps = detectInventoryGaps(inventories);
      setInventoryGaps(gaps);

      // Generate pending promotions for critical/high urgency gaps
      const criticalOrHighGaps = gaps.filter((g) => g.urgency === 'critical' || g.urgency === 'high');

      for (const gap of criticalOrHighGaps.slice(0, 3)) {
        const aiPromotion = await generateAIPromotion(
          gap.listingType,
          Math.max(1, 10 - Math.round(gap.occupancyRate))
        );

        const pending: PendingAIPromotion = {
          id: `pending-${Date.now()}-${gap.listingId}`,
          promotionId: aiPromotion.id || `ai-${Date.now()}`,
          promotion: aiPromotion as Promotion,
          listingId: gap.listingId,
          listingTitle: gap.listingTitle,
          listingType: gap.listingType,
          generatedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
          occupancyGap: 100 - gap.occupancyRate,
          urgency: gap.urgency,
        };

        addPendingPromotion(pending);
      }
    } catch (error) {
      console.error('Inventory scan error:', error);
    } finally {
      setScanInProgress(false);
    }
  };

  const handleDailyScanToggle = (enabled: boolean) => {
    setDailyScanEnabled(enabled);
    toggleDailyScan(enabled);
  };

  const initializeDemoData = () => {
    const demoPromotions: Promotion[] = [
      {
        id: '1',
        name: 'Summer Sale 2024',
        description: '25% discount on all stays',
        serviceType: 'stays',
        discountType: 'percentage',
        discountValue: 25,
        startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        applicableListings: 3,
        usageCount: 45,
      },
      {
        id: '2',
        name: 'Early Bird Discount',
        description: 'Book 30 days in advance and save $50',
        serviceType: 'flights',
        discountType: 'fixed',
        discountValue: 50,
        startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        applicableListings: 5,
        usageCount: 28,
      },
      {
        id: '3',
        name: 'Welcome New Users',
        description: '15% off for first-time customers',
        serviceType: 'experiences',
        discountType: 'percentage',
        discountValue: 15,
        startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'scheduled',
        applicableListings: 2,
        usageCount: 0,
      },
      {
        id: '4',
        name: 'Winter Special',
        description: '20% discount - Expired',
        serviceType: 'events',
        discountType: 'percentage',
        discountValue: 20,
        startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'expired',
        applicableListings: 4,
        usageCount: 89,
      },
      {
        id: 'ai-1',
        name: 'Remote Work Retreats',
        description: 'Perfect for remote workers. Book a stay and get 12% off coworking spaces.',
        serviceType: 'stays',
        discountType: 'percentage',
        discountValue: 12,
        startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'scheduled',
        applicableListings: 2,
        usageCount: 0,
        aiGenerated: true,
        aiAnalysis: {
          trend: 'Remote Work Retreats',
          trendPopularity: 92,
          peakSeason: 'Year-round',
          reasoning:
            'HIGH inventory pressure detected. The "Remote Work Retreats" trend is gaining momentum with 92% popularity among travelers. This balanced promotion balances conversion rate with margin preservation.',
        },
      },
      {
        id: 'ai-2',
        name: 'Local Authentic Experiences Special',
        description: 'Discover authentic local experiences. 18% off curated activities.',
        serviceType: 'experiences',
        discountType: 'percentage',
        discountValue: 18,
        startDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 38 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'draft',
        applicableListings: 3,
        usageCount: 0,
        aiGenerated: true,
        aiAnalysis: {
          trend: 'Local Authentic Experiences',
          trendPopularity: 90,
          peakSeason: 'Year-round with peaks on weekends',
          reasoning:
            'MODERATE inventory pressure detected. The "Local Authentic Experiences" trend is gaining momentum with 90% popularity among travelers. This strategic offer positions you competitively in a crowded market.',
        },
      },
    ];
    setPromotions(demoPromotions);
    localStorage.setItem('vendorPromotions', JSON.stringify(demoPromotions));
  };

  const getFilteredPromotions = () => {
    return promotions.filter((p) => {
      const statusMatch = statusFilter === 'all' || p.status === statusFilter;
      const serviceMatch = serviceFilter === 'all' || p.serviceType === serviceFilter;
      return statusMatch && serviceMatch;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeletePromotion = (id: string) => {
    const updated = promotions.filter((p) => p.id !== id);
    setPromotions(updated);
    localStorage.setItem('vendorPromotions', JSON.stringify(updated));
  };

  const handleAIPromotionApprove = (promotion: Promotion) => {
    const updated = [...promotions, promotion];
    setPromotions(updated);
    localStorage.setItem('vendorPromotions', JSON.stringify(updated));
    setShowAIDialog(false);
  };

  const openAIDialog = (serviceType: string) => {
    setSelectedServiceForAI(serviceType);
    setShowAIDialog(true);
  };

  const handlePendingPromotionApproved = (pending: PendingAIPromotion) => {
    const updated = [...promotions, pending.promotion];
    setPromotions(updated);
    localStorage.setItem('vendorPromotions', JSON.stringify(updated));
  };

  const filteredPromotions = getFilteredPromotions();
  const activeCount = promotions.filter((p) => p.status === 'active').length;
  const totalUsage = promotions.reduce((sum, p) => sum + p.usageCount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted py-8">
      <div className="container mx-auto px-4 max-w-6xl">
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
              <h1 className="text-3xl font-bold mb-2">Create Promotions</h1>
              <p className="text-muted-foreground">
                Attract more customers with special offers and discounts
              </p>
            </div>
            <Button className="bg-travel-blue hover:bg-travel-blue/90">
              <Plus className="h-4 w-4 mr-2" />
              New Promotion
            </Button>
          </div>
        </div>

        {/* Total Promotions Stats - Moved to Top */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-travel-blue">{promotions.length}</p>
              <p className="text-sm text-muted-foreground">Total Promotions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-green-600">{activeCount}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-travel-blue">{totalUsage}</p>
              <p className="text-sm text-muted-foreground">Total Usage</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-orange-600">{inventoryGaps.length}</p>
              <p className="text-sm text-muted-foreground">Inventory Gaps</p>
            </CardContent>
          </Card>
        </div>



        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="all-promotions">
              All Promotions
            </TabsTrigger>
            <TabsTrigger value="inventory-gaps" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Inventory Gaps
            </TabsTrigger>
            <TabsTrigger value="ai-promo-builder" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              AI Promo Builder
            </TabsTrigger>
          </TabsList>

          {/* All Promotions Tab */}
          <TabsContent value="all-promotions" className="space-y-6">
            {/* Filter */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Service Type Filter */}
                  <select
                    value={serviceFilter}
                    onChange={(e) => setServiceFilter(e.target.value)}
                    className="flex-1 min-w-[200px] border rounded-lg p-2 text-sm"
                  >
                    <option value="all">All Services ({promotions.length})</option>
                    <option value="stays">Stays ({promotions.filter((p) => p.serviceType === 'stays').length})</option>
                    <option value="flights">Flights ({promotions.filter((p) => p.serviceType === 'flights').length})</option>
                    <option value="experiences">Experiences ({promotions.filter((p) => p.serviceType === 'experiences').length})</option>
                    <option value="events">Events ({promotions.filter((p) => p.serviceType === 'events').length})</option>
                    <option value="essentials">Essentials ({promotions.filter((p) => p.serviceType === 'essentials').length})</option>
                  </select>

                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="flex-1 min-w-[200px] border rounded-lg p-2 text-sm"
                  >
                    <option value="all">All Statuses ({promotions.length})</option>
                    <option value="active">Active ({promotions.filter((p) => p.status === 'active').length})</option>
                    <option value="scheduled">Scheduled ({promotions.filter((p) => p.status === 'scheduled').length})</option>
                    <option value="draft">Draft ({promotions.filter((p) => p.status === 'draft').length})</option>
                    <option value="expired">Expired ({promotions.filter((p) => p.status === 'expired').length})</option>
                  </select>

                  {/* View Mode Buttons */}
                  <div className="flex items-center gap-2 ml-auto">
                    <Button
                      variant={viewMode === 'tile' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('tile')}
                      className="gap-2"
                    >
                      <Grid3x3 className="h-4 w-4" />
                      Tile
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="gap-2"
                    >
                      <List className="h-4 w-4" />
                      List
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Promotions View */}
            {filteredPromotions.length > 0 ? (
              viewMode === 'tile' ? (
                // Tile View
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredPromotions.map((promotion) => (
                    <Card key={promotion.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={`${getStatusColor(promotion.status)} capitalize text-xs`}>
                              {promotion.status}
                            </Badge>
                            <Badge className="bg-gray-100 text-gray-800 text-xs capitalize">
                              {promotion.serviceType}
                            </Badge>
                            {promotion.aiGenerated && (
                              <Badge className="bg-orange-100 text-orange-800 text-xs flex items-center gap-1">
                                <Sparkles className="h-3 w-3" />
                                AI Generated
                              </Badge>
                            )}
                          </div>
                        </div>
                        <CardTitle className="text-lg line-clamp-2 flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-orange-500" />
                          {promotion.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{promotion.description}</p>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Discount Info */}
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-2xl font-bold text-travel-blue">
                            {promotion.discountType === 'percentage'
                              ? `${promotion.discountValue}%`
                              : `$${promotion.discountValue}`}
                            <span className="text-sm font-normal text-muted-foreground ml-2">
                              {promotion.discountType === 'percentage' ? 'off' : 'discount'}
                            </span>
                          </p>
                        </div>

                        {/* Date Range */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(promotion.startDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}{' '}
                            -{' '}
                            {new Date(promotion.endDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="p-2 bg-muted rounded">
                            <p className="text-muted-foreground text-xs">Applicable Listings</p>
                            <p className="font-semibold">{promotion.applicableListings}</p>
                          </div>
                          <div className="p-2 bg-muted rounded">
                            <p className="text-muted-foreground text-xs">Usage Count</p>
                            <p className="font-semibold">{promotion.usageCount}</p>
                          </div>
                        </div>

                        {/* AI Analysis (if available) */}
                        {promotion.aiAnalysis && (
                          <div className="p-3 bg-orange-50 rounded-lg border border-orange-100 text-sm space-y-1">
                            <p className="font-medium text-orange-900">AI Insight:</p>
                            <p className="text-orange-800 text-xs">{promotion.aiAnalysis.reasoning}</p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-2 border-t">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit2 className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-red-600 hover:text-red-600"
                            onClick={() => handleDeletePromotion(promotion.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                // List View
                <div className="space-y-3">
                  {filteredPromotions.map((promotion) => (
                    <Card key={promotion.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-4">
                          {/* Left side - Promo details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="font-semibold">{promotion.name}</h3>
                              <Badge className={`${getStatusColor(promotion.status)} capitalize text-xs`}>
                                {promotion.status}
                              </Badge>
                              <Badge className="bg-gray-100 text-gray-800 text-xs capitalize">
                                {promotion.serviceType}
                              </Badge>
                              {promotion.aiGenerated && (
                                <Badge className="bg-orange-100 text-orange-800 text-xs flex items-center gap-1">
                                  <Sparkles className="h-3 w-3" />
                                  AI
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{promotion.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>
                                {new Date(promotion.startDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })}{' '}
                                -{' '}
                                {new Date(promotion.endDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                              <span>Used {promotion.usageCount} times</span>
                            </div>
                          </div>

                          {/* Right side - Discount & Actions */}
                          <div className="flex items-center gap-4 flex-shrink-0">
                            <div className="text-right">
                              <p className="text-lg font-bold text-travel-blue">
                                {promotion.discountType === 'percentage'
                                  ? `${promotion.discountValue}%`
                                  : `$${promotion.discountValue}`}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {promotion.applicableListings} listing{promotion.applicableListings !== 1 ? 's' : ''}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-600"
                                onClick={() => handleDeletePromotion(promotion.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Sparkles className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">No promotions found.</p>
                  <Button className="bg-travel-blue hover:bg-travel-blue/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Promotion
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Inventory Gaps Tab */}
          <TabsContent value="inventory-gaps" className="space-y-6">
            {/* Daily Auto-Scan Section */}
            <Card className="mb-6 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <Activity className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-purple-900 mb-1">Daily Inventory Scan</h3>
                      <p className="text-sm text-purple-800 mb-3">
                        Enable AI to automatically scan your inventory daily for gaps and vacancies. AI will generate promotions and notify you for approval.
                      </p>
                      <p className="text-xs text-purple-700">
                        {dailyScanEnabled ? '✓ Auto-scan enabled • Runs daily at 9:00 AM' : 'Disabled'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Switch
                      checked={dailyScanEnabled}
                      onCheckedChange={handleDailyScanToggle}
                      className="data-[state=checked]:bg-purple-600"
                    />
                    <Button
                      size="sm"
                      onClick={performInventoryScan}
                      disabled={scanInProgress}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {scanInProgress ? 'Scanning...' : 'Scan Now'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Inventory Gaps Section */}
            {inventoryGaps.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    Inventory Gaps Detected ({inventoryGaps.length})
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    These gaps represent opportunities to create promotions and fill vacant inventory slots.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {inventoryGaps.map((gap) => (
                      <div
                        key={gap.listingId}
                        className={`p-4 border-2 rounded-lg ${getUrgencyColor(gap.urgency)}`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-sm">{gap.listingTitle}</p>
                            <p className="text-xs opacity-75 capitalize">{gap.listingType}</p>
                          </div>
                          <Badge className={`capitalize text-xs ${getUrgencyColor(gap.urgency)}`}>
                            {gap.urgency}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                          <div>
                            <p className="opacity-75">Occupancy</p>
                            <p className="font-semibold text-sm">{gap.occupancyRate}%</p>
                          </div>
                          <div>
                            <p className="opacity-75">Vacancy Days</p>
                            <p className="font-semibold text-sm">{gap.vacancyDays}</p>
                          </div>
                          <div>
                            <p className="opacity-75">Recommended</p>
                            <p className="font-semibold text-sm">
                              {gap.recommendedDiscountRange.min}-{gap.recommendedDiscountRange.max}%
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mb-3">{gap.reason}</p>
                        <Button
                          size="sm"
                          className="w-full bg-travel-blue hover:bg-travel-blue/90"
                          onClick={() => openAIDialog(gap.listingType)}
                        >
                          <Zap className="h-4 w-4 mr-1" />
                          Create Promo
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <AlertCircle className="h-16 w-16 mx-auto mb-4 text-green-400" />
                  <p className="text-muted-foreground mb-2 text-lg font-semibold">No Inventory Gaps</p>
                  <p className="text-muted-foreground">Your inventory is performing well! All listings have healthy occupancy rates.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* AI Promo Builder Tab */}
          <TabsContent value="ai-promo-builder" className="space-y-6">
            {/* AI Insights Section */}
            <Card className="mb-6 bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Sparkles className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-orange-900 mb-2">AI-Powered Promotion Tips</h3>
                    <p className="text-sm text-orange-800 mb-4">
                      Let our AI analyze your inventory and current travel trends to generate targeted promotions that help move unsold inventory quickly.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => openAIDialog('stays')}
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        <Zap className="h-4 w-4 mr-1" />
                        Try AI Generator
                      </Button>
                      <Button size="sm" variant="outline" className="border-orange-300">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* AI Promotion Dialog */}
        <AIPromotionDialog
          open={showAIDialog}
          onOpenChange={setShowAIDialog}
          serviceType={selectedServiceForAI}
          onPromotionApprove={handleAIPromotionApprove}
        />
      </div>
    </div>
  );
}
