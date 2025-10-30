import React from "react";
import { Card, CardContent } from "../components/ui/card";

export default function Wallet() {
  return (
    <div className="min-h-screen p-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent>
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2">Wallet & Rewards</h2>
              <p className="text-sm text-muted-foreground mb-4">
                View your wallet balance, transaction history and available rewards.
              </p>
              <div className="space-y-4">
                <div className="p-4 border rounded bg-muted">Current balance: <span className="font-medium">$0.00</span></div>
                <button className="px-3 py-2 rounded bg-sky-600 text-white">Top up wallet</button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
