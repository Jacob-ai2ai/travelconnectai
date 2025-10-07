import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SAMPLE_PRODUCTS = [
  { id: 'prod-1', name: 'Premium Travel Backpack', description: 'Waterproof 40L travel backpack with multiple compartments and laptop sleeve.', price: 89, image: '/placeholder.svg', inStock: 12 },
  { id: 'prod-2', name: 'Underwater Camera', description: '4K waterproof action camera perfect for underwater adventures.', price: 159, image: '/placeholder.svg', inStock: 8 },
  { id: 'prod-3', name: 'Travel First Aid Kit', description: 'Comprehensive medical kit for international travel with essential medications.', price: 35, image: '/placeholder.svg', inStock: 25 },
];

export default function ProductDetails() {
  const { productId } = useParams();
  const p = SAMPLE_PRODUCTS.find((x) => x.id === productId) || SAMPLE_PRODUCTS[0];

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto">
        <Link to="/trip-details/budget-bali" className="text-sm text-muted-foreground">Back to trip</Link>
        <h1 className="text-3xl font-bold my-4">{p.name}</h1>

        <div className="grid md:grid-cols-3 gap-6">
          <main className="md:col-span-2">
            <Card>
              <div className="h-64 overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <CardContent>
                <p className="mb-4 text-muted-foreground">{p.description}</p>
                <div className="mb-4">Availability: <strong>{p.inStock} in stock</strong></div>
                <div className="mb-4">Price: <strong>${p.price}</strong></div>
                <div className="flex space-x-3">
                  <Button onClick={() => alert('Added to itinerary (simulated)')}>Add to itinerary</Button>
                  <Button variant="outline">Contact Seller</Button>
                </div>
              </CardContent>
            </Card>
          </main>

          <aside className="md:col-span-1">
            <Card>
              <CardContent>
                <div className="font-semibold">Purchase</div>
                <div className="text-2xl font-bold my-3">${p.price}</div>
                <Button className="w-full">Buy Now</Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
