import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Plane, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Step = "details" | "media" | "pricing" | "verification" | "success";

export default function FlightsOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("details");
  const [airline, setAirline] = useState("");
  const [iata, setIata] = useState("");
  const [hubs, setHubs] = useState("");
  const [fleetSize, setFleetSize] = useState("");
  const [flightRole, setFlightRole] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [basePrice, setBasePrice] = useState("");

  const flightRoleOptions = [
    { id: "airline-partner", label: "Airline Partner" },
    { id: "ota-partner", label: "OTA Partner (Reseller)" },
  ];
  const steps: Step[] = [
    "details",
    "media",
    "pricing",
    "verification",
    "success",
  ];
  const idx = steps.indexOf(step);
  const progress = ((idx + 1) / steps.length) * 100;

  const canProceed = () => {
    switch (step) {
      case "details":
        return airline && iata && flightRole !== "";
      case "media":
        return true;
      case "pricing":
        return basePrice !== "";
      case "verification":
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    const i = steps.indexOf(step);
    if (i < steps.length - 1) setStep(steps[i + 1]);
  };
  const handleBack = () => {
    const i = steps.indexOf(step);
    if (i > 0) setStep(steps[i - 1]);
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    setPhotos((prev) => [...prev, ...Array.from(files)]);
  };

  const handleComplete = () => {
    // placeholder: submit payload to backend
    console.log({
      airline,
      iata,
      hubs,
      fleetSize,
      role: flightRole,
      basePrice,
    });
    navigate("/onboarding");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6">
          <Progress value={progress} className="h-2 bg-slate-100" />
        </div>

        {step === "details" && (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <h1 className="text-2xl font-semibold">Airline Details</h1>
                  <p className="text-sm text-muted-foreground">
                    Provide basic airline information
                  </p>
                </div>

                <div className="space-y-3">
                  <Label>Airline Name</Label>
                  <Input
                    value={airline}
                    onChange={(e) => setAirline(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Role</Label>
                  <select
                    className="w-full h-10 px-3 py-2 text-sm border rounded-md"
                    value={flightRole}
                    onChange={(e) => setFlightRole(e.target.value)}
                  >
                    <option value="">Select role</option>
                    <option value="airline-partner">Airline Partner</option>
                    <option value="ota-partner">OTA Partner (Reseller)</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <Label>IATA Code</Label>
                  <Input
                    value={iata}
                    onChange={(e) => setIata(e.target.value)}
                    maxLength={3}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Hubs (comma separated)</Label>
                  <Input
                    value={hubs}
                    onChange={(e) => setHubs(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Fleet Size</Label>
                  <Input
                    type="number"
                    value={fleetSize}
                    onChange={(e) => setFleetSize(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "media" && (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <h2 className="text-lg font-medium">Media</h2>
                <p className="text-sm text-muted-foreground">
                  Add logos, fleet images or route maps
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
                <div className="mt-2 text-sm text-teal-600">
                  {photos.length} file(s) selected
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "pricing" && (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <h2 className="text-lg font-medium">Pricing & Routes</h2>
                <Label>Base Fare Example</Label>
                <Input
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  You can configure detailed fares later.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "verification" && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium">Verification</h2>
              <p className="text-sm text-muted-foreground">
                Upload regulatory documents and business license.
              </p>
              <input type="file" accept=".pdf,.jpg,.png" />
            </CardContent>
          </Card>
        )}

        {step === "success" && (
          <Card>
            <CardContent className="p-6 text-center">
              <Plane className="mx-auto mb-4 h-8 w-8 text-teal-600" />
              <h3 className="text-xl font-semibold">All set!</h3>
              <p className="text-sm text-muted-foreground">
                Your airline listing is submitted for review.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between items-center mt-6">
          <Button variant="outline" onClick={handleBack} disabled={idx === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          {step !== "success" ? (
            <Button onClick={handleNext} disabled={!canProceed()}>
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleComplete}>Finish</Button>
          )}
        </div>
      </div>
    </div>
  );
}
