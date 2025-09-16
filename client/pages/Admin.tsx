import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function Admin() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Administrative tools and platform management.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">User Management</h3>
              <p className="text-sm text-muted-foreground mb-4">Manage users, roles, and permissions.</p>
              <Link to="/">
                <Button>Go to Home</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Platform Settings</h3>
              <p className="text-sm text-muted-foreground mb-4">Site configuration, feature flags, and integrations.</p>
              <Button variant="outline">Open Settings</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
