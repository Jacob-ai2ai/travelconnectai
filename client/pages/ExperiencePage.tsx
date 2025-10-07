import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SAMPLE_EXPERIENCES = [
  { id: 'exp-1', name: 'Sunrise Mount Batur Hiking', description: 'Witness breathtaking sunrise from the active volcano peak with professional guide.', duration: '6 hours', price: 85, image: '/placeholder.svg' },
  { id: 'exp-2', name: 'Traditional Balinese Cooking Class', description: 'Learn authentic Balinese recipes in a traditional village setting.', duration: '4 hours', price: 65, image: '/placeholder.svg' },
  { id: 'exp-3', name: 'White Water Rafting Adventure', description: 'Thrilling rafting experience through rainforest and rice terraces.', duration: '5 hours', price: 45, image: '/placeholder.svg' },
];

export default function ExperiencePage() {
  const { experienceId } = useParams();
  const exp = SAMPLE_EXPERIENCES.find((e) => e.id === experienceId) || SAMPLE_EXPERIENCES[0];

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto">
        <Link to="/trip-details/budget-bali" className="text-sm text-muted-foreground">Back to trip</Link>
        <h1 className="text-3xl font-bold my-4">{exp.name}</h1>

        <div className="grid md:grid-cols-3 gap-6">
          <main className="md:col-span-2">
            <Card>
              <div className="h-64 overflow-hidden">
                <img src={exp.image} alt={exp.name} className="w-full h-full object-cover" />
              </div>
              <CardContent>
                <p className="mb-4 text-muted-foreground">{exp.description}</p>
                <div className="mb-4">Duration: <strong>{exp.duration}</strong></div>
                <div className="mb-4">Price: <strong>${exp.price}</strong></div>
                <div className="flex space-x-3">
                  <Button onClick={() => alert('Added to itinerary (simulated)')}>Add to itinerary</Button>
                  <Button variant="outline">Contact Provider</Button>
                </div>
              </CardContent>
            </Card>
          </main>

          <aside className="md:col-span-1">
            <Card>
              <CardContent>
                <div className="font-semibold">Booking</div>
                <div className="text-2xl font-bold my-3">${exp.price}</div>
                <Button className="w-full">Book Experience</Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
