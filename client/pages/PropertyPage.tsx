import React from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Heart, Share2, Play, Video, MapPin } from "lucide-react";

interface Property {
  id: string;
  name: string;
  pricePerNight: number;
  images: string[];
  description: string;
  amenities: string[];
  services: string[];
  videos: { id: string; title: string; url: string; isLive: boolean; viewers?: number }[];
}

const SAMPLE_PROPERTIES: Property[] = [
  {
    id: "villa-1",
    name: "Sobha Heartland II Villas",
    pricePerNight: 116,
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
    ],
    description:
      "Proudly presenting a brand-new spacious villa apartment with exclusive access to the building swimming pool and gym. This apartment is perfect for solo travellers, couples on a holiday and even business travellers.",
    amenities: ["4 Bedrooms", "3 Bathrooms", "Indoor Parking", "WiFi", "Pool"],
    services: ["Airport Transfer", "Daily Housekeeping", "In-villa Spa"],
    videos: [
      { id: "v1", title: "Walkthrough", url: "/placeholder.svg", isLive: false },
      { id: "v2", title: "Hosted Live Tour", url: "/placeholder.svg", isLive: true, viewers: 23 },
    ],
  },
];

export default function PropertyPage() {
  const { propertyId } = useParams();
  const property =
    SAMPLE_PROPERTIES.find((p) => p.id === propertyId) || SAMPLE_PROPERTIES[0];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left: Gallery and description */}
          <div className="md:col-span-2">
            <Card className="overflow-hidden mb-6">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 row-span-2">
                  <img
                    src={property.images[0]}
                    alt={property.name}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                </div>
                {property.images.slice(1, 5).map((src, idx) => (
                  <div key={idx} className="h-44 overflow-hidden rounded-lg">
                    <img src={src} alt="thumb" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">{property.name}</h2>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">{property.description}</p>

                <h4 className="font-semibold mb-2">Amenities</h4>
                <div className="flex flex-wrap gap-2 mb-6">
                  {property.amenities.map((a) => (
                    <Badge key={a} variant="secondary" className="text-xs">
                      {a}
                    </Badge>
                  ))}
                </div>

                <h4 className="font-semibold mb-2">Services & Experiences Nearby</h4>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {property.services.map((s) => (
                    <Card key={s}>
                      <CardContent>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-semibold">{s}</div>
                            <div className="text-sm text-muted-foreground">Available on request</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">From</div>
                            <div className="font-bold">$25</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <h4 className="font-semibold mb-2">Pre-recorded Videos & Live Streams</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  {property.videos.map((v) => (
                    <Card key={v.id} className="overflow-hidden">
                      <div className="relative">
                        <img src={v.url} alt={v.title} className="w-full h-40 object-cover" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Button size="sm" className="bg-white/90 text-black">
                            <Play className="h-4 w-4 mr-2" />
                            {v.isLive ? `LIVE • ${v.viewers}` : "Watch"}
                          </Button>
                        </div>
                      </div>
                      <CardContent>
                        <div className="font-medium">{v.title}</div>
                        <div className="text-xs text-muted-foreground">{v.isLive ? "Live stream" : "Pre-recorded"}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>

            {/* Nearby properties / suggestions could go here */}
          </div>

          {/* Right: Booking panel */}
          <aside className="sticky top-24">
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{property.name}</h3>
                  <div className="text-sm text-muted-foreground">Self check in • Unlock superhost • Great location</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">${property.pricePerNight}</div>
                  <div className="text-sm text-muted-foreground">per night</div>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium">Check In</label>
                <div className="mt-1">
                  <input type="date" className="w-full border rounded px-3 py-2" />
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium">Check Out</label>
                <div className="mt-1">
                  <input type="date" className="w-full border rounded px-3 py-2" />
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium">Guests</label>
                <div className="mt-1">
                  <select className="w-full border rounded px-3 py-2">
                    <option>1 Guest</option>
                    <option>2 Guests</option>
                    <option>3 Guests</option>
                    <option>4 Guests</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-muted-foreground">Cancellation Policies</div>
                <div className="mt-2 text-sm">Non-Refundable - ${property.pricePerNight} Total</div>
              </div>

              <div className="mb-4">
                <div className="text-lg font-bold">Total Before Taxes:</div>
                <div className="text-2xl font-bold">${property.pricePerNight}</div>
              </div>

              <Button className="w-full bg-black text-white">Reserve</Button>

              <div className="mt-3 text-xs text-muted-foreground">Only 6 hours left to book. The host will stop accepting bookings for your dates soon.</div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
