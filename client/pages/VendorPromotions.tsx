import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Trash2, Edit2, Sparkles, TrendingUp, Calendar, Grid3x3, List, Zap } from 'lucide-react';
import { Promotion } from '@/types/promotions';
import AIPromotionDialog from '@/components/AIPromotionDialog';

export default function VendorPromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'tile' | 'list'>('tile');
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [selectedServiceForAI, setSelectedServiceForAI] = useState('stays');

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
  }, []);

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
            <div className="flex items-center gap-2">
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
              <Button
                variant="outline"
                onClick={() => openAIDialog(serviceFilter !== 'all' ? serviceFilter : 'stays')}
                className="gap-2 text-orange-600 border-orange-200 hover:bg-orange-50"
              >
                <Zap className="h-4 w-4" />
                AI Promotion
              </Button>
              <Button className="bg-travel-blue hover:bg-travel-blue/90">
                <Plus className="h-4 w-4 mr-2" />
                New Promotion
              </Button>
            </div>
          </div>
        </div>

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

        {/* Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Service Type Filter */}
              <div>
                <label className="text-sm font-medium block mb-2">Filter by Service Type:</label>
                <select
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                  className="w-full border rounded-lg p-2 text-sm"
                >
                  <option value="all">All Services ({promotions.length})</option>
                  <option value="stays">Stays ({promotions.filter((p) => p.serviceType === 'stays').length})</option>
                  <option value="flights">Flights ({promotions.filter((p) => p.serviceType === 'flights').length})</option>
                  <option value="experiences">Experiences ({promotions.filter((p) => p.serviceType === 'experiences').length})</option>
                  <option value="events">Events ({promotions.filter((p) => p.serviceType === 'events').length})</option>
                  <option value="essentials">Essentials ({promotions.filter((p) => p.serviceType === 'essentials').length})</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-sm font-medium block mb-2">Filter by Status:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full border rounded-lg p-2 text-sm"
                >
                  <option value="all">All Statuses ({promotions.length})</option>
                  <option value="active">Active ({promotions.filter((p) => p.status === 'active').length})</option>
                  <option value="scheduled">Scheduled ({promotions.filter((p) => p.status === 'scheduled').length})</option>
                  <option value="draft">Draft ({promotions.filter((p) => p.status === 'draft').length})</option>
                  <option value="expired">Expired ({promotions.filter((p) => p.status === 'expired').length})</option>
                </select>
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

        {/* Summary Stats */}
        {filteredPromotions.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
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
                <p className="text-3xl font-bold text-travel-blue">
                  ${promotions.reduce((sum, p) => sum + (p.discountType === 'fixed' ? p.discountValue * p.usageCount : 0), 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Est. Discounts</p>
              </CardContent>
            </Card>
          </div>
        )}

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
