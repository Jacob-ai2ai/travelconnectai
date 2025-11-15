import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  Plane,
  Sparkles,
  Music,
  Package,
  ArrowRight,
} from 'lucide-react';

interface VendorType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  onboardingPath: string;
}

export default function VendorTypeSelect() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromDashboard = searchParams.get('from') === 'dashboard';

  useEffect(() => {
    const isSignedIn = localStorage.getItem('isSignedIn') === 'true';
    if (!isSignedIn && !fromDashboard) {
      navigate('/');
    }
  }, [navigate, fromDashboard]);

  const vendorTypes: VendorType[] = [
    {
      id: 'stays',
      title: 'Accommodation Host',
      description: 'List hotels, homestays, vacation rentals, and other lodging services',
      icon: <Home className="h-8 w-8" />,
      onboardingPath: '/property-onboarding',
    },
    {
      id: 'flights',
      title: 'Flight & Transport',
      description: 'Offer flights, bus services, car rentals, and travel transportation',
      icon: <Plane className="h-8 w-8" />,
      onboardingPath: '/flights-onboarding',
    },
    {
      id: 'experiences',
      title: 'Experiences Provider',
      description: 'Create tours, activities, workshops, and unique experiences',
      icon: <Sparkles className="h-8 w-8" />,
      onboardingPath: '/experiences-onboarding',
    },
    {
      id: 'events',
      title: 'Events Organizer',
      description: 'List and manage conferences, concerts, festivals, and events',
      icon: <Music className="h-8 w-8" />,
      onboardingPath: '/events-onboarding',
    },
    {
      id: 'essentials',
      title: 'Travel Essentials',
      description: 'Offer travel insurance, visas, gear rentals, and other essentials',
      icon: <Package className="h-8 w-8" />,
      onboardingPath: '/products-onboarding',
    },
  ];

  const handleSelectType = (vendorType: VendorType) => {
    // Store vendor type in localStorage
    const user = localStorage.getItem('user');
    const userData = user ? JSON.parse(user) : {};
    userData.vendorType = vendorType.id;
    localStorage.setItem('user', JSON.stringify(userData));

    // Navigate to appropriate onboarding
    navigate(vendorType.onboardingPath);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">What's your business type?</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the type of service you want to offer. Don't worry, you can add more later from your dashboard.
          </p>
        </div>

        {/* Vendor Type Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {vendorTypes.map((vendorType) => (
            <Card
              key={vendorType.id}
              className="hover:shadow-xl transition-all hover:border-travel-blue cursor-pointer group"
              onClick={() => handleSelectType(vendorType)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="text-travel-blue group-hover:scale-110 transition-transform">
                    {vendorType.icon}
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {vendorType.id}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <CardTitle className="mb-2">{vendorType.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{vendorType.description}</p>
                </div>

                <Button
                  className="w-full group/btn"
                  onClick={() => handleSelectType(vendorType)}
                >
                  Choose {vendorType.title}
                  <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Not sure which one to choose?
          </p>
          <Button variant="outline">
            Learn More About Each Category
          </Button>
        </div>
      </div>
    </div>
  );
}
