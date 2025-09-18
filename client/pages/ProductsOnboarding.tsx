import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Store, ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Step = "details" | "media" | "pricing" | "verification" | "success";

export default function ProductsOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("details");
  const [productName, setProductName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [productRoles, setProductRoles] = useState<string[]>([]);

  const productRoleOptions = [
    { id: 'merchant', label: 'Merchant (B2C)' },
  ];
  const steps: Step[] = ["details", "media", "pricing", "verification", "success"];
  const idx = steps.indexOf(step);
  const progress = ((idx + 1) / steps.length) * 100;

  const canProceed = () => {
    switch (step) {
      case "details":
        return productName && sku && productRoles.length > 0;
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

  const handleComplete = () => {
    console.log({ productName, sku, category, price, stock, roles: productRoles });
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
                  <h1 className="text-2xl font-semibold">Product Details</h1>
                  <p className="text-sm text-muted-foreground">Add your product information</p>
                </div>

                <div className="space-y-3">
                  <Label>Product Name</Label>
                  <Input value={productName} onChange={(e) => setProductName(e.target.value)} />
                </div>

                <div className="space-y-3">
                  <Label>Your Role(s)</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {productRoleOptions.map(r => (
                      <label key={r.id} className="inline-flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={productRoles.includes(r.id)}
                          onChange={() => setProductRoles(prev => prev.includes(r.id) ? prev.filter(x => x !== r.id) : [...prev, r.id])}
                        />
                        <span className="text-sm">{r.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>SKU</Label>
                    <Input value={sku} onChange={(e) => setSku(e.target.value)} />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Input value={category} onChange={(e) => setCategory(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Stock Quantity</Label>
                  <Input value={stock} onChange={(e) => setStock(e.target.value)} type="number" />
                </div>

              </div>
            </CardContent>
          </Card>
        )}

        {step === "media" && (
          <Card>
            <CardContent className="p-6">
              <Label>Product Images</Label>
              <input type="file" accept="image/*" multiple />
            </CardContent>
          </Card>
        )}

        {step === "pricing" && (
          <Card>
            <CardContent className="p-6">
              <Label>Price</Label>
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
              <Store className="mx-auto mb-4 h-8 w-8 text-teal-600" />
              <h3 className="text-xl font-semibold">Product Submitted</h3>
              <p className="text-sm text-muted-foreground">Your product will be reviewed shortly.</p>
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
