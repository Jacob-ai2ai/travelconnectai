import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Home, Plane, MapPin, Ticket, Shopping, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Promotion, PromotionForm } from '@/types/promotions';

interface PromotionFormBuilderProps {
  serviceType: 'stays' | 'flights' | 'experiences' | 'events' | 'essentials';
  onSubmit: (promotion: PromotionForm) => void;
  isLoading?: boolean;
}

interface ServiceConfig {
  icon: React.ReactNode;
  title: string;
  description: string;
  discountSuggestions: { type: 'percentage' | 'fixed'; value: number; label: string }[];
  examplePromos: { name: string; description: string; discount: number }[];
  guidelines: string[];
  applicableListingsHint: string;
}

const serviceConfigs: Record<string, ServiceConfig> = {
  stays: {
    icon: <Home className="h-5 w-5" />,
    title: 'Accommodation Promotions',
    description: 'Create special offers for your property listings',
    discountSuggestions: [
      { type: 'percentage', value: 15, label: '15% Off Stays' },
      { type: 'percentage', value: 20, label: '20% Off Stays' },
      { type: 'fixed', value: 50, label: '$50 Off per Night' },
      { type: 'fixed', value: 100, label: '$100 Off Total' },
    ],
    examplePromos: [
      {
        name: 'Weekend Escape',
        description: 'Special rates for Friday to Sunday stays',
        discount: 15,
      },
      {
        name: 'Extended Stay Discount',
        description: '20% off stays of 7+ nights',
        discount: 20,
      },
      {
        name: 'Early Bird Special',
        description: 'Book 30 days in advance',
        discount: 25,
      },
    ],
    guidelines: [
      'Consider seasonal demand when setting dates',
      'Longer minimum stay requirements increase occupancy',
      'Weekend rates typically higher than weekday',
      'Highlight amenities in description',
    ],
    applicableListingsHint: 'How many of your properties are available for this promotion?',
  },
  flights: {
    icon: <Plane className="h-5 w-5" />,
    title: 'Flight Promotions',
    description: 'Create special offers for your flight listings',
    discountSuggestions: [
      { type: 'percentage', value: 10, label: '10% Off Fares' },
      { type: 'fixed', value: 25, label: '$25 Off per Ticket' },
      { type: 'fixed', value: 100, label: '$100 Off per Route' },
      { type: 'percentage', value: 15, label: '15% Off Round-Trip' },
    ],
    examplePromos: [
      {
        name: 'Early Booking Discount',
        description: 'Book 45+ days in advance',
        discount: 15,
      },
      {
        name: 'Mid-Week Special',
        description: 'Fly Tuesday-Thursday for less',
        discount: 20,
      },
      {
        name: 'Student Discounts',
        description: 'Special rates for students with valid ID',
        discount: 12,
      },
    ],
    guidelines: [
      'Early bookings drive better conversion',
      'Highlight flexibility in cancellation',
      'Seasonal pricing impacts effectiveness',
      'Bundle with hotels for higher value perception',
    ],
    applicableListingsHint: 'How many flight routes does this apply to?',
  },
  experiences: {
    icon: <MapPin className="h-5 w-5" />,
    title: 'Experience Promotions',
    description: 'Create special offers for your experience listings',
    discountSuggestions: [
      { type: 'percentage', value: 15, label: '15% Off Experiences' },
      { type: 'percentage', value: 20, label: '20% Off Experiences' },
      { type: 'fixed', value: 20, label: '$20 Off per Person' },
      { type: 'fixed', value: 50, label: 'Free Upgrade Option' },
    ],
    examplePromos: [
      {
        name: 'Group Adventure Discount',
        description: '20% off for groups of 4+',
        discount: 20,
      },
      {
        name: 'Last-Minute Deals',
        description: 'Book within 48 hours',
        discount: 25,
      },
      {
        name: 'Bundle & Save',
        description: '15% off when booking 2+ experiences',
        discount: 15,
      },
    ],
    guidelines: [
      'Highlight unique/authentic aspects',
      'Group discounts drive higher bookings',
      'Seasonal activities need timing awareness',
      'Include clear cancellation policies',
    ],
    applicableListingsHint: 'How many of your experiences are included?',
  },
  events: {
    icon: <Ticket className="h-5 w-5" />,
    title: 'Event Promotions',
    description: 'Create special offers for your event listings',
    discountSuggestions: [
      { type: 'percentage', value: 20, label: '20% Early Bird' },
      { type: 'percentage', value: 25, label: '25% Group Discount' },
      { type: 'fixed', value: 15, label: '$15 Off per Ticket' },
      { type: 'fixed', value: 50, label: '$50 Off VIP Upgrade' },
    ],
    examplePromos: [
      {
        name: 'Early Bird Special',
        description: 'First 100 tickets get 25% off',
        discount: 25,
      },
      {
        name: 'Group Packages',
        description: '20% off for 10+ attendees',
        discount: 20,
      },
      {
        name: 'Member Exclusive',
        description: 'Special rates for members',
        discount: 30,
      },
    ],
    guidelines: [
      'Early bird discounts drive initial sales',
      'Group discounts incentivize bulk bookings',
      'VIP/Premium tier upsells add revenue',
      'Limited capacity creates urgency',
    ],
    applicableListingsHint: 'How many events are covered by this promotion?',
  },
  essentials: {
    icon: <Shopping className="h-5 w-5" />,
    title: 'Essential Services Promotions',
    description: 'Create special offers for travel essentials',
    discountSuggestions: [
      { type: 'percentage', value: 10, label: '10% Off Services' },
      { type: 'percentage', value: 15, label: '15% Off Bundle' },
      { type: 'fixed', value: 10, label: '$10 Off Purchase' },
      { type: 'fixed', value: 25, label: 'Free Upgrade' },
    ],
    examplePromos: [
      {
        name: 'Travel Bundle',
        description: 'Insurance + transfer + visa = 20% off',
        discount: 20,
      },
      {
        name: 'Local Pass Bundle',
        description: 'Transport + attractions combo',
        discount: 15,
      },
      {
        name: 'First-Time Traveler Deal',
        description: 'Complete travel essentials package',
        discount: 25,
      },
    ],
    guidelines: [
      'Bundle complementary services',
      'Emphasize peace of mind/convenience',
      'Educational content builds trust',
      'Highlight time savings',
    ],
    applicableListingsHint: 'How many service types are included?',
  },
};

export default function PromotionFormBuilder({
  serviceType,
  onSubmit,
  isLoading = false,
}: PromotionFormBuilderProps) {
  const config = serviceConfigs[serviceType];
  const [formData, setFormData] = useState<PromotionForm>({
    name: '',
    description: '',
    serviceType: serviceType,
    discountType: 'percentage',
    discountValue: 15,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    applicableListings: 1,
  });

  const handleInputChange = (field: keyof PromotionForm, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const applyTemplate = (template: { name: string; description: string; discount: number }) => {
    setFormData((prev) => ({
      ...prev,
      name: template.name,
      description: template.description,
      discountValue: template.discount,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="space-y-6">
      {/* Service Header */}
      <Card className="border-none bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-lg">{config.icon}</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{config.title}</h2>
              <p className="text-gray-600 mt-1">{config.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {config.examplePromos.map((promo, idx) => (
              <button
                key={idx}
                onClick={() => applyTemplate(promo)}
                className="p-3 border rounded-lg hover:bg-blue-50 transition-colors text-left"
              >
                <p className="font-medium text-sm text-gray-900">{promo.name}</p>
                <p className="text-xs text-gray-600 mt-1">{promo.description}</p>
                <Badge className="mt-2 bg-blue-100 text-blue-800">
                  {promo.discount}% off
                </Badge>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Guidelines */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Best Practices:</strong>
          <ul className="list-disc list-inside mt-2 space-y-1">
            {config.guidelines.map((guide, idx) => (
              <li key={idx} className="text-sm">
                {guide}
              </li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Promotion Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">Promotion Name</label>
              <Input
                type="text"
                placeholder="e.g., Summer Weekend Special"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Description</label>
              <Textarea
                placeholder="Describe the promotion and its benefits..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                required
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.description.length}/250 characters
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Discount & Dates */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Offer & Dates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">Discount Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.discountType === 'percentage'}
                    onChange={() => handleInputChange('discountType', 'percentage')}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Percentage (%)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.discountType === 'fixed'}
                    onChange={() => handleInputChange('discountType', 'fixed')}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Fixed Amount ($)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Suggested Discounts</label>
              <div className="grid grid-cols-2 gap-2">
                {config.discountSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      handleInputChange('discountType', suggestion.type);
                      handleInputChange('discountValue', suggestion.value);
                    }}
                    className={`p-2 border rounded text-sm font-medium transition-colors ${formData.discountValue === suggestion.value && formData.discountType === suggestion.type ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'}`}
                  >
                    {suggestion.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-2">Start Date</label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">End Date</label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">
                {config.applicableListingsHint}
              </label>
              <Input
                type="number"
                min="1"
                value={formData.applicableListings}
                onChange={(e) => handleInputChange('applicableListings', parseInt(e.target.value))}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full bg-travel-blue hover:bg-travel-blue/90" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Promotion'}
        </Button>
      </form>
    </div>
  );
}
