import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Music, ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Step = "details" | "media" | "pricing" | "verification" | "success";

export default function EventsOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("details");
  const [organizer, setOrganizer] = useState("");
  const [eventType, setEventType] = useState("");
  const [dates, setDates] = useState("");
  const [venue, setVenue] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [eventRole, setEventRole] = useState("");

  const eventRoleOptions = [
    { id: "event-organizer", label: "Event Organizer" },
    { id: "event-manager", label: "Event/Venue Manager" },
    { id: "promoter", label: "Promoter / Ticket Reseller" },
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
        return organizer && eventType && eventRole !== "";
      case "pricing":
        return ticketPrice !== "";
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

  const handleComplete = () => {
    console.log({
      organizer,
      eventType,
      dates,
      venue,
      ticketPrice,
      role: eventRole,
    });
    navigate("/vendor-selection");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Progress value={progress} className="h-2 mb-6" />

        {step === "details" && (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <h1 className="text-2xl font-semibold">
                    Event Organizer Details
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Tell us about the event
                  </p>
                </div>

                <div className="space-y-3">
                  <Label>Organizer</Label>
                  <Input
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Role</Label>
                  <select
                    className="w-full h-10 px-3 py-2 text-sm border rounded-md"
                    value={eventRole}
                    onChange={(e) => setEventRole(e.target.value)}
                  >
                    <option value="">Select role</option>
                    <option value="event-organizer">Event Organizer</option>
                    <option value="event-manager">Event/Venue Manager</option>
                    <option value="promoter">Promoter / Ticket Reseller</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <Label>Event Type</Label>
                  <Input
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Dates / Schedule</Label>
                  <Input
                    value={dates}
                    onChange={(e) => setDates(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Venue</Label>
                  <Input
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "media" && (
          <Card>
            <CardContent className="p-6">
              <Label>Media (poster, photos)</Label>
              <input type="file" accept="image/*" />
            </CardContent>
          </Card>
        )}

        {step === "pricing" && (
          <Card>
            <CardContent className="p-6">
              <Label>Ticket Price</Label>
              <Input
                type="number"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(e.target.value)}
              />
            </CardContent>
          </Card>
        )}

        {step === "verification" && (
          <Card>
            <CardContent className="p-6">
              <Label>Verification Documents</Label>
              <input type="file" accept=".pdf,.jpg,.png" />
            </CardContent>
          </Card>
        )}

        {step === "success" && (
          <Card>
            <CardContent className="p-6 text-center">
              <Music className="mx-auto mb-4 h-8 w-8 text-teal-600" />
              <h3 className="text-xl font-semibold">Event Submitted</h3>
              <p className="text-sm text-muted-foreground">
                Your event will be reviewed shortly.
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
