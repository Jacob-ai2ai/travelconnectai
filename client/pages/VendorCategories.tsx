import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plane,
  Home,
  ShoppingBag,
  Ticket,
  Mountain,
  Layers,
} from "lucide-react";

export default function VendorCategories() {
  const categories = [
    {
      id: "airlines",
      title: "Airlines",
      description: "Offer flight inventory and services",
      icon: Plane,
      to: "/flights",
    },
    {
      id: "stays",
      title: "Stays",
      description: "List hotels, vacation rentals and accommodations",
      icon: Home,
      to: "/property-onboarding",
    },
    {
      id: "experiences",
      title: "Experiences",
      description: "Offer tours, activities and guided experiences",
      icon: Mountain,
      to: "/xperiences",
    },
    {
      id: "events",
      title: "Events",
      description: "Sell tickets and manage event listings",
      icon: Ticket,
      to: "/events",
    },
    {
      id: "products",
      title: "Products & Essentials",
      description: "Sell travel products, gear and essentials",
      icon: ShoppingBag,
      to: "/essentials",
    },
    {
      id: "services",
      title: "Other Services",
      description: "Transport, transfers, rentals and more",
      icon: Layers,
      to: "/explore-services",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, Travel Vendor</h1>
          <p className="text-muted-foreground">
            Choose your vendor category to continue onboarding and list your
            services.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Card key={cat.id} className="cursor-pointer hover:shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-travel-orange/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-travel-orange" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{cat.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {cat.description}
                  </p>
                  <Link to={cat.to}>
                    <Button className="w-full">Go to {cat.title}</Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            If your vendor type isn't listed, choose "Other Services" and we'll
            guide you through a custom onboarding flow.
          </p>
        </div>
      </div>
    </div>
  );
}
