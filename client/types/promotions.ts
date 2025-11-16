import { AIAnalysis } from '@/lib/aiPromotions';

export interface Promotion {
  id: string;
  name: string;
  description: string;
  serviceType: 'all' | 'stays' | 'flights' | 'experiences' | 'events' | 'essentials';
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'scheduled' | 'expired' | 'draft';
  applicableListings: number;
  usageCount: number;
  aiGenerated?: boolean;
  aiAnalysis?: AIAnalysis;
}

export interface PromotionForm {
  name: string;
  description: string;
  serviceType: 'all' | 'stays' | 'flights' | 'experiences' | 'events' | 'essentials';
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  applicableListings: number;
}
