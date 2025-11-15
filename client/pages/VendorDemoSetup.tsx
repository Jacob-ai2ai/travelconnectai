import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VendorDemoSetup() {
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize vendor profile
    const userData = {
      id: 'demo-vendor-001',
      username: 'Demo Vendor',
      email: 'vendor@example.com',
      role: 'vendor',
      vendorType: 'all-services',
      location: 'Global',
      bio: 'Offering multiple travel services worldwide',
    };

    // Create dummy listings
    const dummyListings = [
      { id: '1', type: 'stays', title: 'Luxurious Beach Villa in Bali', location: 'Bali, Indonesia', price: 250, rating: 4.8 },
      { id: '2', type: 'stays', title: 'Cozy Apartment in Paris', location: 'Paris, France', price: 180, rating: 4.6 },
      { id: '3', type: 'stays', title: 'Mountain Cabin with Mountain Views', location: 'Swiss Alps, Switzerland', price: 320, rating: 4.9 },
      { id: '4', type: 'flights', title: 'Round Trip: New York to London', location: 'NYC to LHR', price: 520, rating: 4.5 },
      { id: '5', type: 'flights', title: 'Business Class: Dubai to Singapore', location: 'DXB to SIN', price: 1200, rating: 4.7 },
      { id: '6', type: 'experiences', title: 'Guided Tour: Hidden Gems of Barcelona', location: 'Barcelona, Spain', price: 85, rating: 4.8 },
      { id: '7', type: 'experiences', title: 'Cooking Class: Italian Cuisine in Rome', location: 'Rome, Italy', price: 95, rating: 4.9 },
      { id: '8', type: 'experiences', title: 'Scuba Diving Adventure in Great Barrier Reef', location: 'Australia', price: 150, rating: 4.7 },
      { id: '9', type: 'events', title: 'Tech Conference 2024', location: 'San Francisco, USA', price: 299, rating: 4.6 },
      { id: '10', type: 'events', title: 'Music Festival Summer Vibes', location: 'Ibiza, Spain', price: 180, rating: 4.8 },
      { id: '11', type: 'essentials', title: 'Comprehensive Travel Insurance Premium', location: 'Worldwide', price: 45, rating: 4.7 },
      { id: '12', type: 'essentials', title: 'International Visa Assistance Service', location: 'Global', price: 199, rating: 4.6 },
    ];

    // Set vendor as signed in
    localStorage.setItem('isSignedIn', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('listings', JSON.stringify(dummyListings));

    // Redirect to vendor dashboard
    navigate('/vendor-dashboard');
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg text-muted-foreground">Setting up vendor profile...</p>
    </div>
  );
}
