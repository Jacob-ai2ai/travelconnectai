import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Star, Zap } from "lucide-react";

export default function FlightDetails() {
  const { flightId } = useParams();
  const navigate = useNavigate();

  // simple mock for the current flight; in real app fetch by id
  const flight = {
    id: flightId,
    airline: "Air Bali",
    flightNumber: "AB123",
    from: "DPS",
    to: "CGK",
    departure: "2025-05-10T08:30",
    arrival: "2025-05-10T10:45",
    duration: "2h 15m",
    price: 120,
    originalPrice: 180,
    discount: 33,
    rating: 4.6,
    aircraft: "Boeing 737",
    class: "Economy",
  };

  // alternatives mock
  const alternatives = [
    { id: `${flight.id}-alt-1`, airline: "Garuda Indonesia", flightNumber: "GA235", departureTime: "08:30", arrivalTime: "10:45", price: 120, originalPrice: 180, discount: 33, rating: 4.6 },
    { id: `${flight.id}-alt-2`, airline: "Singapore Airlines", flightNumber: "SQ942", departureTime: "14:20", arrivalTime: "17:05", price: 280, originalPrice: 400, discount: 30, rating: 4.9 },
  ];

  const [itineraryFlights, setItineraryFlights] = useState<string[]>([]);
  const [people, setPeople] = useState(1);
  const [travelClass, setTravelClass] = useState(flight.class);
  const [travelDate, setTravelDate] = useState(flight.departure.split("T")[0]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("itineraryFlights");
      const parsed = raw ? JSON.parse(raw) : [];
      setItineraryFlights(parsed);

      const detailsRaw = localStorage.getItem("itineraryDetails");
      const details = detailsRaw ? JSON.parse(detailsRaw) : {};
      if (details[flight.id]) {
        setPeople(details[flight.id].people ?? 1);
        setTravelClass(details[flight.id].class ?? flight.class);
        setTravelDate(details[flight.id].date ?? travelDate);
      }
    } catch (e) {
      setItineraryFlights([]);
    }
  }, []);

  const saveItineraryFlights = (arr: string[]) => {
    setItineraryFlights(arr);
    localStorage.setItem("itineraryFlights", JSON.stringify(arr));
  };

  const saveDetails = () => {
    const raw = localStorage.getItem("itineraryDetails");
    const details = raw ? JSON.parse(raw) : {};
    details[flight.id] = { people, class: travelClass, date: travelDate };
    localStorage.setItem("itineraryDetails", JSON.stringify(details));
  };

  const addToItinerary = (id: string) => {
    const next = Array.from(new Set([...itineraryFlights, id]));
    saveItineraryFlights(next);
    saveDetails();
  };
  const removeFromItinerary = (id: string) => {
    const next = itineraryFlights.filter((i) => i !== id);
    saveItineraryFlights(next);
  };

  const isIncluded = itineraryFlights.includes(flight.id as string);

  return (
    <div className="min-h-screen p-6">
      <Card>
        <CardHeader>
          <CardTitle>Flight details — {flight.id}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-12 gap-4 items-start">
              <div className="col-span-3 text-center">
                <div className="text-2xl font-bold">{new Date(flight.departure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                <div className="text-sm text-muted-foreground">{flight.from}</div>
              </div>

              <div className="col-span-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-lg">{flight.airline} • {flight.flightNumber}</div>
                    <div className="text-sm text-muted-foreground">{flight.aircraft} • {flight.class} • Direct</div>
                  </div>

                  <div className="text-right">
                    <Badge className="bg-red-500 text-white">{flight.discount}% OFF</Badge>
                    <div className="flex items-center justify-end mt-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-sm">{flight.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{flight.duration}</span>
                  </div>
                  <div className="px-2 py-1 border rounded text-xs">{flight.class}</div>
                  <div className="text-xs">3 amenities</div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Passengers</label>
                    <div className="mt-2 flex items-center">
                      <button className="px-2 py-1 border rounded" onClick={() => setPeople(Math.max(1, people - 1))}>-</button>
                      <div className="px-3">{people}</div>
                      <button className="px-2 py-1 border rounded" onClick={() => setPeople(people + 1)}>+</button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground">Class</label>
                    <select value={travelClass} onChange={(e) => setTravelClass(e.target.value)} className="mt-2 border rounded px-2 py-1 w-full text-sm">
                      <option>Economy</option>
                      <option>Premium Economy</option>
                      <option>Business</option>
                      <option>First</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground">Date</label>
                    <input type="date" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} className="mt-2 border rounded px-2 py-1 w-full text-sm" />
                  </div>
                </div>

                <div className="mt-4 flex items-center space-x-3">
                  <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
                  {isIncluded ? (
                    <>
                      <Button variant="destructive" onClick={() => removeFromItinerary(flight.id as string)}>Remove from itinerary</Button>
                      <Button onClick={() => saveDetails()}>Save changes</Button>
                    </>
                  ) : (
                    <Button onClick={() => addToItinerary(flight.id as string)}>Add to itinerary</Button>
                  )}
                </div>
              </div>

              <div className="col-span-3 flex flex-col items-end justify-center">
                <div className="text-2xl font-bold">${flight.price}</div>
                <div className="text-xs text-muted-foreground">per person</div>
                <div className="mt-3">
                  <Link to={`/replace-options/${flight.id}`}>
                    <Button size="sm" variant="ghost" className="p-1 h-8 w-8">
                      <Zap className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Other options for this route */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Other options on this route</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {alternatives.map((opt) => (
                  <Card key={opt.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-sm font-medium">{opt.airline}</div>
                      <div>
                        <div className="font-semibold">{opt.flightNumber} • {opt.airline}</div>
                        <div className="text-sm text-muted-foreground">{opt.departureTime} • {opt.arrivalTime} • {opt.price}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <div className="text-lg font-bold">${opt.price}</div>
                        {opt.originalPrice && <div className="text-sm text-muted-foreground line-through">${opt.originalPrice}</div>}
                      </div>

                      <div className="mt-2 flex items-center space-x-2">
                        {itineraryFlights.includes(opt.id) ? (
                          <Button size="sm" variant="outline" onClick={() => removeFromItinerary(opt.id)}>Remove</Button>
                        ) : (
                          <Button size="sm" onClick={() => addToItinerary(opt.id)}>Add</Button>
                        )}

                        <Link to={`/flight/${opt.id}`}>
                          <Button size="sm" variant="ghost">View</Button>
                        </Link>
                      </div>
                    </div>

                  </Card>
                ))}
              </div>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}
