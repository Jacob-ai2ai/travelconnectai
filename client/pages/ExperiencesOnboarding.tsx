import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Star, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Step = "details" | "media" | "pricing" | "verification" | "success";

export default function ExperiencesOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("details");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [capacity, setCapacity] = useState("");
  const [experienceType, setExperienceType] = useState("");
  const [otherExperience, setOtherExperience] = useState("");
  const [price, setPrice] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const steps: Step[] = ["details", "media", "pricing", "verification", "success"];
  const idx = steps.indexOf(step);
  const progress = ((idx + 1) / steps.length) * 100;

  const canProceed = () => {
    switch (step) {
      case "details":
        return title && location;
      case "pricing":
        return price !== "";
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
    setPhotos(prev => [...prev, ...Array.from(files)]);
  };

  const handleComplete = () => {
    console.log({ title, location, duration, capacity, price });
    navigate("/vendors");
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
                  <h1 className="text-2xl font-semibold">Experience Details</h1>
                  <p className="text-sm text-muted-foreground">Describe your experience</p>
                </div>

                <div className="space-y-3">
                  <Label>Title</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div className="space-y-3">
                  <Label>Location</Label>
                  <Input value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>

                <div className="space-y-3">
                  <Label>Experience Type</Label>
                  <select
                    className="w-full h-10 px-3 py-2 text-sm border rounded-md"
                    value={experienceType}
                    onChange={(e) => setExperienceType(e.target.value)}
                  >
                    <option value="">Select type</option>
                    <option value="snorkeling">Snorkeling</option>
                    <option value="surfing">Surfing</option>
                    <option value="skiing">Skiing</option>
                    <option value="hiking">Hiking</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {experienceType === "other" && (
                  <div className="space-y-3">
                    <Label>Other experience</Label>
                    <Input value={otherExperience} onChange={(e) => setOtherExperience(e.target.value)} />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Duration (hrs)</Label>
                    <Input value={duration} onChange={(e) => setDuration(e.target.value)} />
                  </div>
                  <div>
                    <Label>Capacity</Label>
                    <Input value={capacity} onChange={(e) => setCapacity(e.target.value)} />
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        )}

        {step === "media" && (
          <Card>
            <CardContent className="p-6">
              <Label>Photos</Label>
              <input type="file" accept="image/*" multiple onChange={(e) => handleFileUpload(e.target.files)} />
              <div className="text-sm text-teal-600 mt-2">{photos.length} file(s) selected</div>
            </CardContent>
          </Card>
        )}

        {step === "pricing" && (
          <Card>
            <CardContent className="p-6">
              <Label>Price per person</Label>
              <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
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
              <Star className="mx-auto mb-4 h-8 w-8 text-amber-500" />
              <h3 className="text-xl font-semibold">Listing Submitted</h3>
              <p className="text-sm text-muted-foreground">Your experience will be reviewed shortly.</p>
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
