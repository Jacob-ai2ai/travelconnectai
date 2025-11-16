import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Sparkles,
  AlertCircle,
  Check,
  X,
  TrendingDown,
  Calendar,
  Clock,
  Zap,
} from 'lucide-react';
import {
  getPendingPromotions,
  approvePendingPromotion,
  PendingAIPromotion,
} from '@/lib/notificationManager';
import { getUrgencyColor } from '@/lib/inventoryManager';

interface PendingAIApprovalsSectionProps {
  onPromotionApproved?: (promotion: PendingAIPromotion) => void;
}

export default function PendingAIApprovalsSection({
  onPromotionApproved,
}: PendingAIApprovalsSectionProps) {
  const [pendingPromotions, setPendingPromotions] = useState<PendingAIPromotion[]>([]);
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const pending = getPendingPromotions().filter((p) => p.status === 'pending');
    setPendingPromotions(pending);
  }, []);

  const handleApprove = (promotion: PendingAIPromotion) => {
    approvePendingPromotion(promotion.promotionId, true);
    setApprovedIds((prev) => new Set([...prev, promotion.promotionId]));

    // Remove from pending list
    const updated = pendingPromotions.filter((p) => p.promotionId !== promotion.promotionId);
    setPendingPromotions(updated);

    if (onPromotionApproved) {
      onPromotionApproved(promotion);
    }
  };

  const handleReject = (promotion: PendingAIPromotion) => {
    approvePendingPromotion(promotion.promotionId, false);
    
    // Remove from pending list
    const updated = pendingPromotions.filter((p) => p.promotionId !== promotion.promotionId);
    setPendingPromotions(updated);
  };

  if (pendingPromotions.length === 0) {
    return null;
  }

  const criticalCount = pendingPromotions.filter((p) => p.urgency === 'critical').length;
  const highCount = pendingPromotions.filter((p) => p.urgency === 'high').length;

  return (
    <div className="space-y-4">
      {/* Summary Alert */}
      <Alert className="border-orange-200 bg-orange-50">
        <Sparkles className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-900">
          <strong>AI Scan Results:</strong> {pendingPromotions.length} inventory gaps detected
          {criticalCount > 0 && (
            <>
              {' '}
              - <span className="text-red-600 font-semibold">{criticalCount} Critical</span>
            </>
          )}
          {highCount > 0 && (
            <>
              {' '}
              - <span className="text-orange-600 font-semibold">{highCount} High Priority</span>
            </>
          )}
        </AlertDescription>
      </Alert>

      {/* Pending Approvals List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-600" />
            Pending AI Approvals
          </CardTitle>
          <CardDescription>
            Review and approve AI-generated promotions for your listings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pendingPromotions.map((pending) => (
            <div
              key={pending.promotionId}
              className={`p-4 border-2 rounded-lg transition-all ${getUrgencyColor(pending.urgency)}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-lg">{pending.promotion.name}</h4>
                    <Badge className={`capitalize text-xs py-0.5 px-2 ${getUrgencyColor(pending.urgency)}`}>
                      {pending.urgency}
                    </Badge>
                  </div>
                  <p className="text-sm opacity-90">{pending.listingTitle}</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-2xl">
                    {pending.promotion.discountValue}
                    {pending.promotion.discountType === 'percentage' ? '%' : '$'}
                  </div>
                  <p className="text-xs opacity-75 capitalize">
                    {pending.promotion.discountType}
                  </p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 pb-3 border-t border-current border-opacity-20">
                <div className="text-sm">
                  <p className="opacity-75 flex items-center gap-1">
                    <TrendingDown className="h-3 w-3" />
                    Occupancy
                  </p>
                  <p className="font-semibold">{pending.occupancyGap}%</p>
                </div>
                <div className="text-sm">
                  <p className="opacity-75">Description</p>
                  <p className="text-xs line-clamp-2">{pending.promotion.description}</p>
                </div>
                <div className="text-sm">
                  <p className="opacity-75 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Duration
                  </p>
                  <p className="text-xs">
                    {new Date(pending.promotion.startDate).toLocaleDateString()} -{' '}
                    {new Date(pending.promotion.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-sm">
                  <p className="opacity-75 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Expires
                  </p>
                  <p className="text-xs">
                    {new Date(pending.expiresAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* AI Insights */}
              {pending.promotion.aiAnalysis && (
                <div className="p-3 bg-white bg-opacity-40 rounded mb-3 text-sm">
                  <p className="font-medium opacity-90 mb-1">AI Insight:</p>
                  <p className="text-xs opacity-85 italic">
                    {pending.promotion.aiAnalysis.reasoning}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => handleApprove(pending)}
                  disabled={approvedIds.has(pending.promotionId)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve & Launch
                </Button>
                <Button
                  onClick={() => handleReject(pending)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
