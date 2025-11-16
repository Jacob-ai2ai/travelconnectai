import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BookingCalendar from "@/components/BookingCalendar";
import { generateMockInventories } from "@/lib/inventoryManager";
import { ArrowLeft } from "lucide-react";

export default function BookingCalendars() {
  const [inventories, setInventories] = useState<any[]>([]);

  useEffect(() => {
    // Load listings
    const listings = localStorage.getItem("listings");
    let listingsToUse = [];

    if (listings) {
      try {
        listingsToUse = JSON.parse(listings);
      } catch (e) {
        console.error("Error loading listings:", e);
      }
    }

    // If no listings, create demo listings
    if (listingsToUse.length === 0) {
      listingsToUse = [
        {
          id: "demo-1",
          type: "stays",
          title: "Beachfront Villa",
          location: "Bali",
          price: 150,
          rating: 4.8,
        },
        {
          id: "demo-2",
          type: "flights",
          title: "NYC to LA Flights",
          location: "USA",
          price: 299,
          rating: 4.5,
        },
        {
          id: "demo-3",
          type: "experiences",
          title: "Surfing Lessons",
          location: "Hawaii",
          price: 75,
          rating: 4.9,
        },
        {
          id: "demo-4",
          type: "events",
          title: "Music Festival",
          location: "Miami",
          price: 120,
          rating: 4.6,
        },
        {
          id: "demo-5",
          type: "essentials",
          title: "Travel Insurance",
          location: "Global",
          price: 45,
          rating: 4.7,
        },
      ];
    }

    // Generate mock inventories for calendar
    const mockInventories = generateMockInventories(listingsToUse);
    setInventories(mockInventories);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/vendor-dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <div>
            <h1 className="text-4xl font-bold mb-2">Booking Calendars</h1>
            <p className="text-muted-foreground text-lg">
              View your inventory status and booking information for all
              services
            </p>
          </div>
        </div>

        {/* Calendar Component */}
        <BookingCalendar inventories={inventories} />
      </div>
    </div>
  );
}
