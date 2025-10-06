import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FlightDetails() {
  const { flightId } = useParams();
  const navigate = useNavigate();

  // In a real app you'd fetch flight details by id. Here we show a placeholder.
  return (
    <div className="min-h-screen p-6">
      <Card>
        <CardHeader>
          <CardTitle>Flight details — {flightId}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">Detailed flight information would be shown here, including times, aircraft, amenities, baggage rules, and fare conditions.</div>

            <div className="border rounded-lg p-4">
              <div className="font-medium">Example itinerary</div>
              <div className="text-sm text-muted-foreground mt-2">Departure: Denpasar (DPS) — 08:30</div>
              <div className="text-sm text-muted-foreground">Arrival: Jakarta (CGK) — 10:45</div>
              <div className="text-sm text-muted-foreground">Duration: 2h 15m • Direct</div>
            </div>

            <div className="flex items-center space-x-2">
              <Button onClick={() => navigate(-1)} variant="outline">Back</Button>
              <Button onClick={() => navigate(-1)}>Add to itinerary</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
