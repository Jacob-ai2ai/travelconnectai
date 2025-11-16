import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Sparkles,
  TrendingUp,
  Calendar,
  AlertCircle,
  Check,
  Loader,
  ChevronRight,
} from 'lucide-react';
import { Promotion } from '@/types/promotions';
import { generateAIPromotion, analyzeInventoryForPromos } from '@/lib/aiPromotions';

interface AIPromotionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceType: string;
  onPromotionApprove: (promotion: Promotion) => void;
}

export default function AIPromotionDialog({
  open,
  onOpenChange,
  serviceType,
  onPromotionApprove,
}: AIPromotionDialogProps) {
  const [step, setStep] = useState<'generate' | 'review' | 'modify' | 'schedule'>('generate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPromotion, setGeneratedPromotion] = useState<Partial<Promotion> | null>(null);
  const [unsoldInventory, setUnsoldInventory] = useState(5);
  const [inventoryAnalysis, setInventoryAnalysis] = useState<any>(null);

  // Editable fields
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedDiscount, setEditedDiscount] = useState(0);
  const [editedStartDate, setEditedStartDate] = useState('');
  const [editedEndDate, setEditedEndDate] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleMode, setScheduleMode] = useState<'live' | 'schedule'>('live');

  const handleGeneratePromotion = async () => {
    setIsGenerating(true);
    try {
      // Analyze inventory
      const analysis = analyzeInventoryForPromos(serviceType, 10, 10 - unsoldInventory);
      setInventoryAnalysis(analysis);

      // Generate AI promotion
      const promotion = await generateAIPromotion(serviceType, unsoldInventory);
      setGeneratedPromotion(promotion);

      // Initialize editable fields
      setEditedName(promotion.name || '');
      setEditedDescription(promotion.description || '');
      setEditedDiscount(promotion.discountValue || 0);
      setEditedStartDate(promotion.startDate || '');
      setEditedEndDate(promotion.endDate || '');

      setStep('review');
    } catch (error) {
      console.error('Error generating promotion:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleModifyPromotion = () => {
    setStep('modify');
  };

  const handleSchedulePromotion = () => {
    setStep('schedule');
  };

  const handleApprovePromotion = () => {
    if (!generatedPromotion) return;

    // Create final promotion with modifications
    const finalPromotion: Promotion = {
      ...(generatedPromotion as Promotion),
      name: editedName,
      description: editedDescription,
      discountValue: editedDiscount,
      startDate: scheduleDate || editedStartDate,
      endDate: editedEndDate,
      status: scheduleDate ? 'scheduled' : 'active',
    };

    onPromotionApprove(finalPromotion);
    resetDialog();
  };

  const resetDialog = () => {
    setStep('generate');
    setGeneratedPromotion(null);
    setUnsoldInventory(5);
    setEditedName('');
    setEditedDescription('');
    setEditedDiscount(0);
    setEditedStartDate('');
    setEditedEndDate('');
    setScheduleDate('');
    onOpenChange(false);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-orange-500" />
            AI Promotion Generator
          </DialogTitle>
          <DialogDescription>
            Let AI analyze your inventory and create targeted promotions to boost sales
          </DialogDescription>
        </DialogHeader>

        {step === 'generate' && (
          <div className="space-y-6">
            {/* Inventory Input */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Unsold Inventory
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">
                    How many unsold {serviceType} listings do you have?
                  </label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={unsoldInventory}
                      onChange={(e) => setUnsoldInventory(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-24"
                    />
                    <span className="text-sm text-muted-foreground">listings</span>
                  </div>
                </div>

                {inventoryAnalysis && (
                  <Alert>
                    <AlertCircle className={`h-4 w-4 ${inventoryAnalysis.urgency === 'high' ? 'text-red-600' : inventoryAnalysis.urgency === 'medium' ? 'text-yellow-600' : 'text-green-600'}`} />
                    <AlertDescription>{inventoryAnalysis.recommendation}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Button
              onClick={handleGeneratePromotion}
              disabled={isGenerating}
              className="w-full bg-travel-blue hover:bg-travel-blue/90"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing trends and generating promotion...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate AI Promotion
                </>
              )}
            </Button>
          </div>
        )}

        {step === 'review' && generatedPromotion && (
          <div className="space-y-6">
            {/* AI Analysis */}
            {generatedPromotion.aiAnalysis && (
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-orange-500" />
                    AI Analysis & Recommendation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">Detected Trend:</p>
                    <p className="text-gray-600">{generatedPromotion.aiAnalysis.trend}</p>
                    <Badge className="mt-2 bg-orange-100 text-orange-800">
                      {generatedPromotion.aiAnalysis.trendPopularity}% popularity
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Peak Season:</p>
                    <p className="text-gray-600">{generatedPromotion.aiAnalysis.peakSeason}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">AI Reasoning:</p>
                    <p className="text-gray-600 italic">{generatedPromotion.aiAnalysis.reasoning}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Generated Promotion Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Generated Promotion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Promotion Name</label>
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    placeholder="Promotion name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Description</label>
                  <Textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    placeholder="Promotion description"
                    className="resize-none"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">Discount</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={editedDiscount}
                        onChange={(e) => setEditedDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                        className="flex-1"
                        min="0"
                        max={generatedPromotion.discountType === 'percentage' ? 100 : 10000}
                      />
                      <span className="text-sm font-medium">
                        {generatedPromotion.discountType === 'percentage' ? '%' : '$'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Start Date</label>
                    <Input
                      type="date"
                      value={editedStartDate.split('T')[0]}
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        setEditedStartDate(date.toISOString());
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">End Date</label>
                    <Input
                      type="date"
                      value={editedEndDate.split('T')[0]}
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        setEditedEndDate(date.toISOString());
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Applicable Listings</label>
                  <Input
                    type="number"
                    value={generatedPromotion.applicableListings || 0}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Auto-calculated based on inventory analysis
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep('generate')}
                className="flex-1"
              >
                Generate New
              </Button>
              <Button
                variant="outline"
                onClick={handleModifyPromotion}
                className="flex-1"
              >
                Edit Details
              </Button>
              <Button
                onClick={handleSchedulePromotion}
                className="flex-1 bg-travel-blue hover:bg-travel-blue/90"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 'modify' && (
          <div className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You can modify any aspect of the AI-generated promotion below. Make sure the
                details are accurate before approving.
              </AlertDescription>
            </Alert>

            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="dates">Dates & Discount</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Promotion Name</label>
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    placeholder="e.g., Summer Weekend Special"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Description</label>
                  <Textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    placeholder="Describe what makes this promotion special"
                    rows={5}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {editedDescription.length}/250 characters
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="dates" className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Discount Value</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={editedDiscount}
                      onChange={(e) => setEditedDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="flex-1"
                      min="0"
                      max={generatedPromotion?.discountType === 'percentage' ? 100 : 10000}
                    />
                    <span className="text-lg font-semibold">
                      {generatedPromotion?.discountType === 'percentage' ? '%' : '$'}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">Start Date</label>
                    <Input
                      type="date"
                      value={editedStartDate.split('T')[0]}
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        setEditedStartDate(date.toISOString());
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-2">End Date</label>
                    <Input
                      type="date"
                      value={editedEndDate.split('T')[0]}
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        setEditedEndDate(date.toISOString());
                      }}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('review')} className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleSchedulePromotion}
                className="flex-1 bg-travel-blue hover:bg-travel-blue/90"
              >
                Continue
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 'schedule' && (
          <div className="space-y-6">
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  Ready to Launch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-green-900">Promotion Summary:</p>
                  <div className="mt-2 space-y-2 text-sm text-green-800">
                    <p>
                      <strong>{editedName}</strong>
                    </p>
                    <p>{editedDiscount}% off {serviceType}</p>
                    <p>
                      {new Date(editedStartDate).toLocaleDateString()} to{' '}
                      {new Date(editedEndDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  id="live"
                  name="status"
                  checked={scheduleMode === 'live'}
                  onChange={() => setScheduleMode('live')}
                  className="w-4 h-4"
                />
                <label htmlFor="live" className="flex-1">
                  <p className="font-medium">Go Live Immediately</p>
                  <p className="text-sm text-muted-foreground">Promotion starts right away</p>
                </label>
              </div>

              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  id="schedule"
                  name="status"
                  checked={scheduleMode === 'schedule'}
                  onChange={() => {
                    setScheduleMode('schedule');
                    setScheduleDate(new Date(editedStartDate).toISOString().split('T')[0]);
                  }}
                  className="w-4 h-4"
                />
                <label htmlFor="schedule" className="flex-1">
                  <p className="font-medium">Schedule for Later</p>
                  <p className="text-sm text-muted-foreground">Choose when to activate</p>
                  {scheduleMode === 'schedule' && (
                    <Input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="mt-2"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  )}
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('modify')} className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleApprovePromotion}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4 mr-2" />
                Approve & Launch
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
