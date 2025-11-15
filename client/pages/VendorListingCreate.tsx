import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus } from 'lucide-react';

interface ListingFormData {
  title: string;
  description: string;
  price: string;
  location: string;
  capacity?: string;
  duration?: string;
}

export default function VendorListingCreate() {
  const navigate = useNavigate();
  const [listingType, setListingType] = useState('');
  const [formData, setFormData] = useState<ListingFormData>({
    title: '',
    description: '',
    price: '',
    location: '',
  });
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const signedIn = localStorage.getItem('isSignedIn') === 'true';
    if (!signedIn) {
      navigate('/');
      return;
    }
    setIsSignedIn(true);
  }, [navigate]);

  const listingTypeOptions = [
    { value: 'stays', label: 'Accommodation (Stays)' },
    { value: 'flights', label: 'Flights & Transport' },
    { value: 'experiences', label: 'Experiences' },
    { value: 'events', label: 'Events' },
    { value: 'essentials', label: 'Travel Essentials' },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectType = (type: string) => {
    setListingType(type);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!listingType) {
      alert('Please select a listing type');
      return;
    }
    if (!formData.title || !formData.description || !formData.price) {
      alert('Please fill in all required fields');
      return;
    }

    // Store listing data
    const listings = localStorage.getItem('listings');
    const listingsData = listings ? JSON.parse(listings) : [];
    const newListing = {
      id: Math.random().toString(36).substr(2, 9),
      type: listingType,
      ...formData,
      createdAt: new Date().toISOString(),
    };
    listingsData.push(newListing);
    localStorage.setItem('listings', JSON.stringify(listingsData));

    alert('Listing created successfully!');
    navigate('/vendor-dashboard');
  };

  const getPlaceholders = (type: string) => {
    switch (type) {
      case 'stays':
        return {
          title: 'e.g., Cozy 2-Bedroom Apartment in Paris',
          description:
            'Describe your property, amenities, house rules, and what guests can expect...',
          location: 'e.g., Paris, France',
          capacity: 'Maximum number of guests',
        };
      case 'flights':
        return {
          title: 'e.g., Daily Flight Service: New York to London',
          description: 'Flight details, schedule, amenities, and special offers...',
          location: 'Route',
          duration: 'Flight duration',
        };
      case 'experiences':
        return {
          title: 'e.g., Guided City Tour: Hidden Gems of Barcelona',
          description: 'Experience itinerary, what to expect, what to bring...',
          location: 'e.g., Barcelona, Spain',
          duration: 'Duration in hours',
        };
      case 'events':
        return {
          title: 'e.g., Annual Tech Conference 2024',
          description: 'Event details, schedule, speakers, and registration info...',
          location: 'e.g., Convention Center Address',
          duration: 'Event dates',
        };
      case 'essentials':
        return {
          title: 'e.g., Travel Insurance Package',
          description: 'Coverage details, terms, conditions, and benefits...',
          location: 'Available regions',
          duration: 'Coverage period',
        };
      default:
        return {};
    }
  };

  const placeholders = getPlaceholders(listingType);

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/vendor-dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <h1 className="text-3xl font-bold mb-2">Create New Listing</h1>
          <p className="text-muted-foreground">
            Add a new service to your vendor account
          </p>
        </div>

        {/* Step 1: Select Listing Type */}
        {!listingType && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Step 1: Select Listing Type</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                What type of service would you like to list?
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {listingTypeOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant="outline"
                    className="h-24 text-left justify-start"
                    onClick={() => handleSelectType(option.value)}
                  >
                    <Plus className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span>{option.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Fill Listing Details */}
        {listingType && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Step 2: Listing Details</CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    {listingTypeOptions.find((o) => o.value === listingType)?.label}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setListingType('')}
                  className="text-sm"
                >
                  Change Type
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Listing Title *
                  </label>
                  <Input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder={
                      placeholders.title || 'Enter listing title'
                    }
                    className="w-full"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Be clear and descriptive
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description *
                  </label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder={
                      placeholders.description || 'Describe your listing in detail'
                    }
                    className="w-full min-h-32"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Include all important details that travelers need to know
                  </p>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Location / Area
                  </label>
                  <Input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder={placeholders.location || 'Enter location'}
                    className="w-full"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price *
                  </label>
                  <div className="flex gap-2">
                    <select className="w-24 border rounded-lg p-2">
                      <option>USD</option>
                      <option>EUR</option>
                      <option>GBP</option>
                      <option>INR</option>
                    </select>
                    <Input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="flex-1"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {listingType === 'stays'
                      ? 'Price per night'
                      : listingType === 'flights'
                      ? 'Price per ticket'
                      : listingType === 'experiences'
                      ? 'Price per person'
                      : 'Price'}
                  </p>
                </div>

                {/* Conditional Fields */}
                {(listingType === 'stays' || listingType === 'experiences' || listingType === 'events') && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {listingType === 'stays'
                        ? 'Capacity (Guests)'
                        : listingType === 'experiences'
                        ? 'Duration (Hours)'
                        : 'Event Date'}
                    </label>
                    <Input
                      type={listingType === 'events' ? 'date' : 'number'}
                      name={
                        listingType === 'stays'
                          ? 'capacity'
                          : 'duration'
                      }
                      onChange={handleInputChange}
                      placeholder={
                        placeholders[
                          (listingType === 'stays' ? 'capacity' : 'duration') as keyof typeof placeholders
                        ] as string
                      }
                      className="w-full"
                    />
                  </div>
                )}

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/vendor-dashboard')}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Create Listing
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
