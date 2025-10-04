import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ReplaceOptions() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Simple mock replacement options. In a real app this would query available alternatives.
  const options = [
    { id: `${id}-alt-1`, name: `Alternative for ${id} - Option A` },
    { id: `${id}-alt-2`, name: `Alternative for ${id} - Option B` },
    { id: `${id}-alt-3`, name: `Alternative for ${id} - Option C` },
  ];

  return (
    <div className="min-h-screen p-6">
      <Card>
        <CardHeader>
          <CardTitle>Replace item: {id}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Select an alternative to replace the current item in your itinerary.</p>

            <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4">
              {options.map((opt) => (
                <div key={opt.id} className="border rounded-lg p-4">
                  <div className="font-medium">{opt.name}</div>
                  <div className="text-sm text-muted-foreground mt-2">Price, timing and other details would appear here.</div>
                  <div className="mt-4 flex items-center space-x-2">
                    <Button size="sm" onClick={() => navigate(-1)}>Cancel</Button>
                    <Button size="sm" onClick={() => {
                      // In a real app we'd call a replace API / update state then navigate back
                      navigate(-1);
                    }}>
                      Replace
                    </Button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}
