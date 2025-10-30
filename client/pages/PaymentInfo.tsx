import React from "react";
import Card from "../components/ui/card";
import { CardContent } from "../components/ui/card";

export default function PaymentInfo() {
  return (
    <div className="min-h-screen p-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent>
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2">Payment information</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Manage your saved payment methods and billing details here.
              </p>
              <div className="space-y-4">
                <div className="p-4 border rounded bg-muted">No saved cards yet.</div>
                <button className="px-3 py-2 rounded bg-sky-600 text-white">Add payment method</button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
