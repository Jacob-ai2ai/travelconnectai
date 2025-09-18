import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Users,
  Briefcase,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type Step = "details" | "team" | "permissions" | "verification" | "success";

export default function TravelAgentOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("details");

  // Details
  const [agencyName, setAgencyName] = useState("");
  const [subRole, setSubRole] = useState("");
  const [licenseId, setLicenseId] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [website, setWebsite] = useState("");

  // Team
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [newMember, setNewMember] = useState("");

  // Permissions
  const [canBookFlights, setCanBookFlights] = useState(true);
  const [canBookStays, setCanBookStays] = useState(true);
  const [canCreateItineraries, setCanCreateItineraries] = useState(true);

  const steps: Step[] = [
    "details",
    "team",
    "permissions",
    "verification",
    "success",
  ];
  const idx = steps.indexOf(step);
  const progress = ((idx + 1) / steps.length) * 100;

  const subRoleOptions = [
    { id: "agency", label: "Agency" },
    { id: "agent", label: "Travel Agent" },
    { id: "ota", label: "OTA / Reseller" },
  ];

  const canProceed = () => {
    switch (step) {
      case "details":
        return agencyName !== "" && subRole !== "" && contactEmail !== "";
      case "team":
        return true;
      case "permissions":
        return true;
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

  const addTeamMember = () => {
    const v = newMember.trim();
    if (!v) return;
    setTeamMembers((p) => [...p, v]);
    setNewMember("");
  };

  const removeTeamMember = (index: number) => {
    setTeamMembers((p) => p.filter((_, i) => i !== index));
  };

  const handleComplete = () => {
    const payload = {
      agencyName,
      subRole,
      licenseId,
      contactEmail,
      website,
      teamMembers,
      permissions: { canBookFlights, canBookStays, canCreateItineraries },
    };

    // TODO: submit payload to backend (not implemented)
    console.log("Travel agent onboarding payload:", payload);

    setStep("success");
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
                  <h1 className="text-2xl font-semibold">Agency Details</h1>
                  <p className="text-sm text-muted-foreground">
                    Tell us about your agency or travel business.
                  </p>
                </div>

                <div className="space-y-3">
                  <Label>Agency / Company Name</Label>
                  <Input
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Sub-role</Label>
                  <select
                    value={subRole}
                    onChange={(e) => setSubRole(e.target.value)}
                    className="w-full h-10 px-3 py-2 text-sm border rounded-md"
                  >
                    <option value="">Select role</option>
                    {subRoleOptions.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Business / License ID</Label>
                    <Input
                      value={licenseId}
                      onChange={(e) => setLicenseId(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Contact Email</Label>
                    <Input
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      type="email"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Website (optional)</Label>
                  <Input
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "team" && (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <h1 className="text-2xl font-semibold">Team Members</h1>
                  <p className="text-sm text-muted-foreground">
                    Add team members who will manage bookings and itineraries.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="name or email"
                    value={newMember}
                    onChange={(e) => setNewMember(e.target.value)}
                  />
                  <Button onClick={addTeamMember}>Add</Button>
                </div>

                <div className="space-y-2">
                  {teamMembers.map((m, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between border rounded-md p-2"
                    >
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <div>{m}</div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => removeTeamMember(i)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "permissions" && (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <h1 className="text-2xl font-semibold">Permissions</h1>
                  <p className="text-sm text-muted-foreground">
                    What can your account do on behalf of travelers?
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="inline-flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={canBookFlights}
                      onChange={(e) => setCanBookFlights(e.target.checked)}
                    />
                    <span>Book Flights</span>
                  </label>
                </div>
                <div className="space-y-3">
                  <label className="inline-flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={canBookStays}
                      onChange={(e) => setCanBookStays(e.target.checked)}
                    />
                    <span>Book Stays</span>
                  </label>
                </div>
                <div className="space-y-3">
                  <label className="inline-flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={canCreateItineraries}
                      onChange={(e) =>
                        setCanCreateItineraries(e.target.checked)
                      }
                    />
                    <span>Create & Share Itineraries</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "verification" && (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <h1 className="text-2xl font-semibold">Verification</h1>
                  <p className="text-sm text-muted-foreground">
                    Upload documents to verify your business.
                  </p>
                </div>

                <div>
                  <Label>Business Registration / License (PDF)</Label>
                  <input type="file" accept=".pdf,.jpg,.png" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "success" && (
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="mx-auto mb-4 h-8 w-8 text-teal-600" />
              <h3 className="text-xl font-semibold">All set!</h3>
              <p className="text-sm text-muted-foreground">
                Your travel agent account is created and pending verification.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between items-center mt-6">
          <Button variant="outline" onClick={handleBack} disabled={idx === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          {step !== "success" ? (
            <Button
              onClick={step === "verification" ? handleComplete : handleNext}
              disabled={!canProceed()}
            >
              {step === "verification" ? "Submit" : "Continue"}{" "}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={() => navigate("/onboarding")}>Finish</Button>
          )}
        </div>
      </div>
    </div>
  );
}
