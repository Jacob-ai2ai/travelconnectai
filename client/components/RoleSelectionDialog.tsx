import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plane, Briefcase } from 'lucide-react';

interface RoleSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RoleSelectionDialog({
  open,
  onOpenChange,
}: RoleSelectionDialogProps) {
  const navigate = useNavigate();

  const handleTraveler = () => {
    const user = localStorage.getItem('user');
    const userData = user ? JSON.parse(user) : {};
    userData.role = 'traveler';
    localStorage.setItem('user', JSON.stringify(userData));
    onOpenChange(false);
    navigate('/');
  };

  const handleVendor = () => {
    const user = localStorage.getItem('user');
    const userData = user ? JSON.parse(user) : {};
    userData.role = 'vendor';
    localStorage.setItem('user', JSON.stringify(userData));
    onOpenChange(false);
    navigate('/vendor/select-type');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome to TravelTheWorld!</DialogTitle>
          <DialogDescription className="text-base mt-2">
            Are you traveling or looking to offer services? Let's get you set up.
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 py-8">
          {/* Traveler Option */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow hover:border-travel-blue"
            onClick={handleTraveler}
          >
            <CardContent className="pt-6 text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-blue-100 rounded-full">
                  <Plane className="h-8 w-8 text-travel-blue" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Continue as Traveler</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Explore destinations, book accommodations, plan trips, and discover amazing experiences.
                </p>
              </div>
              <Button
                className="w-full"
                onClick={handleTraveler}
              >
                Explore as Traveler
              </Button>
            </CardContent>
          </Card>

          {/* Vendor Option */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow hover:border-travel-orange"
            onClick={handleVendor}
          >
            <CardContent className="pt-6 text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-orange-100 rounded-full">
                  <Briefcase className="h-8 w-8 text-travel-orange" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Become a Vendor</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  List your services, reach travelers worldwide, grow your business, and earn more.
                </p>
              </div>
              <Button
                className="w-full bg-travel-orange hover:bg-travel-orange/90"
                onClick={handleVendor}
              >
                Start as Vendor
              </Button>
            </CardContent>
          </Card>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          You can always switch between traveler and vendor modes from your profile.
        </p>
      </DialogContent>
    </Dialog>
  );
}
