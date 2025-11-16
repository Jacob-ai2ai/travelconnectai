import { Promotion } from '@/types/promotions';

interface TravelerData {
  bookingFrequency: number;
  averageSpend: number;
  preferredCategories: string[];
  seasonalTrends: string[];
}

interface TravelTrend {
  category: string;
  trend: string;
  popularity: number;
  recommendedDiscount: number;
}

interface BuyingBehavior {
  peakSeason: string;
  averageLead: number;
  priceElasticity: number;
}

// Mock travel trend data
const travelTrends: TravelTrend[] = [
  {
    category: 'stays',
    trend: 'Sustainable Travel',
    popularity: 85,
    recommendedDiscount: 15,
  },
  {
    category: 'stays',
    trend: 'Remote Work Retreats',
    popularity: 92,
    recommendedDiscount: 12,
  },
  {
    category: 'flights',
    trend: 'Flexible Booking',
    popularity: 78,
    recommendedDiscount: 10,
  },
  {
    category: 'flights',
    trend: 'Budget Airlines',
    popularity: 88,
    recommendedDiscount: 15,
  },
  {
    category: 'experiences',
    trend: 'Local Authentic Experiences',
    popularity: 90,
    recommendedDiscount: 18,
  },
  {
    category: 'experiences',
    trend: 'Adventure Tourism',
    popularity: 82,
    recommendedDiscount: 20,
  },
  {
    category: 'events',
    trend: 'Music and Cultural Festivals',
    popularity: 75,
    recommendedDiscount: 25,
  },
  {
    category: 'events',
    trend: 'Wellness Retreats',
    popularity: 88,
    recommendedDiscount: 16,
  },
  {
    category: 'essentials',
    trend: 'Travel Insurance',
    popularity: 80,
    recommendedDiscount: 12,
  },
  {
    category: 'essentials',
    trend: 'Local Transportation Passes',
    popularity: 85,
    recommendedDiscount: 14,
  },
];

// Mock traveler buying behavior
const buyingBehaviors: Record<string, BuyingBehavior> = {
  stays: {
    peakSeason: 'Summer and December holidays',
    averageLead: 30,
    priceElasticity: 0.8,
  },
  flights: {
    peakSeason: 'Summer, holidays, spring break',
    averageLead: 45,
    priceElasticity: 1.2,
  },
  experiences: {
    peakSeason: 'Year-round with peaks on weekends',
    averageLead: 7,
    priceElasticity: 0.6,
  },
  events: {
    peakSeason: 'Summer and December',
    averageLead: 60,
    priceElasticity: 1.5,
  },
  essentials: {
    peakSeason: 'Year-round',
    averageLead: 1,
    priceElasticity: 0.5,
  },
};

// Generate personalized promotion suggestions based on AI analysis
export const generateAIPromotion = async (
  serviceType: string,
  unsoldInventoryCount: number,
  seasonality: string = 'current'
): Promise<Partial<Promotion>> => {
  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const relevantTrends = travelTrends.filter((t) => t.category === serviceType);
  const selectedTrend = relevantTrends[Math.floor(Math.random() * relevantTrends.length)];
  const behavior = buyingBehaviors[serviceType] || buyingBehaviors.stays;

  // Calculate discount based on inventory and trends
  let discountValue = selectedTrend?.recommendedDiscount || 15;

  // Increase discount if inventory is high (unsold)
  if (unsoldInventoryCount > 10) {
    discountValue += 5;
  } else if (unsoldInventoryCount > 5) {
    discountValue += 3;
  }

  // Generate promotion details
  const promotionName = generatePromotionName(serviceType, selectedTrend?.trend);
  const description = generatePromotionDescription(
    serviceType,
    selectedTrend?.trend,
    discountValue,
    behavior
  );

  // Calculate date range (3-4 weeks out)
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 5);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 30);

  return {
    id: `ai-${Date.now()}`,
    name: promotionName,
    description: description,
    serviceType: serviceType as any,
    discountType: 'percentage',
    discountValue: discountValue,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    status: 'scheduled',
    applicableListings: Math.max(1, Math.ceil(unsoldInventoryCount * 0.7)),
    usageCount: 0,
    aiGenerated: true,
    aiAnalysis: {
      trend: selectedTrend?.trend || 'High Demand Category',
      trendPopularity: selectedTrend?.popularity || 80,
      peakSeason: behavior.peakSeason,
      reasoning: generateAIReasoning(serviceType, unsoldInventoryCount, selectedTrend),
    },
  };
};

// Generate multiple promotion suggestions
export const generateMultiplePromotions = async (
  serviceType: string,
  unsoldInventoryCount: number,
  count: number = 3
): Promise<Partial<Promotion>[]> => {
  const promotions: Partial<Promotion>[] = [];

  // Simulate sequential AI analysis
  for (let i = 0; i < count; i++) {
    // Add slight delay between generations
    await new Promise((resolve) => setTimeout(resolve, 500));
    const promotion = await generateAIPromotion(serviceType, unsoldInventoryCount);
    promotions.push(promotion);
  }

  return promotions;
};

// Analyze inventory and recommend promotions
export const analyzeInventoryForPromos = (
  serviceType: string,
  totalListings: number,
  bookedListings: number
): { unsoldCount: number; urgency: 'low' | 'medium' | 'high'; recommendation: string } => {
  const unsoldCount = totalListings - bookedListings;
  const unsoldPercentage = (unsoldCount / totalListings) * 100;

  let urgency: 'low' | 'medium' | 'high' = 'low';
  let recommendation = '';

  if (unsoldPercentage >= 50) {
    urgency = 'high';
    recommendation = `You have ${unsoldCount} unsold ${serviceType} listings. Consider aggressive discounting to move inventory quickly.`;
  } else if (unsoldPercentage >= 30) {
    urgency = 'medium';
    recommendation = `${unsoldPercentage.toFixed(1)}% of your ${serviceType} listings are unsold. Strategic promotions could help increase bookings.`;
  } else {
    urgency = 'low';
    recommendation = `Your ${serviceType} inventory is relatively well-booked. Light promotional offers could attract new customers.`;
  }

  return { unsoldCount, urgency, recommendation };
};

// Helper function to generate promotion name
const generatePromotionName = (serviceType: string, trend?: string): string => {
  const names: Record<string, string[]> = {
    stays: [
      'Summer Getaway Deal',
      'Work-From-Paradise Promo',
      'Eco-Friendly Stay Discount',
      'Weekend Escape Special',
      'Extended Stay Bonus',
    ],
    flights: [
      'Flexible Booking Bonanza',
      'Early Bird Flight Deal',
      'Budget Traveler Special',
      'Last-Minute Flight Saver',
      'Miles Multiplier Promo',
    ],
    experiences: [
      'Authentic Adventure Special',
      'Local Explorer Discount',
      'Experience Bundle Deal',
      'Weekend Activity Special',
      'Group Experience Promo',
    ],
    events: [
      'Festival Season Special',
      'Music & Culture Promo',
      'Wellness Retreat Deal',
      'Early Bird Event Discount',
      'Group Event Package',
    ],
    essentials: [
      'Travel Protection Package',
      'Local Pass Combo Deal',
      'Insurance Plus Promo',
      'Essential Services Bundle',
      'Complete Travel Setup Deal',
    ],
  };

  const serviceNames = names[serviceType] || names.stays;
  return serviceNames[Math.floor(Math.random() * serviceNames.length)];
};

// Helper function to generate promotion description
const generatePromotionDescription = (
  serviceType: string,
  trend: string | undefined,
  discount: number,
  behavior: BuyingBehavior
): string => {
  const descriptions: Record<string, string[]> = {
    stays: [
      `Join the sustainable travel movement. Get ${discount}% off eco-friendly accommodations.`,
      `Perfect for remote workers. Book a stay and get ${discount}% off coworking spaces.`,
      `Extend your stay and save! ${discount}% discount on stays longer than 7 days.`,
      `Experience luxury at local prices. ${discount}% off boutique accommodations.`,
    ],
    flights: [
      `Book with flexibility. Get ${discount}% off flights with changeable dates.`,
      `Plan ahead and save ${discount}% on your next flight.`,
      `Budget-friendly flying just got better. ${discount}% off select routes.`,
      `Last-minute deals available. Up to ${discount}% off immediate departures.`,
    ],
    experiences: [
      `Discover authentic local experiences. ${discount}% off curated activities.`,
      `Adventure awaits! ${discount}% off adventure tours and extreme sports.`,
      `Weekend plans made easy. ${discount}% off weekend experiences.`,
      `Group specials: ${discount}% off when you book 4+ people.`,
    ],
    events: [
      `Don't miss out! ${discount}% early bird discount on festival tickets.`,
      `Wellness is wealth. ${discount}% off wellness retreats and workshops.`,
      `Live entertainment special. ${discount}% off concert and cultural events.`,
      `Group packages available. ${discount}% off group event bookings.`,
    ],
    essentials: [
      `Travel worry-free. ${discount}% off comprehensive travel insurance.`,
      `Explore locally. ${discount}% off transportation and local service passes.`,
      `Complete your travel setup. ${discount}% off essential travel services bundle.`,
      `Save on necessities. ${discount}% off all essential travel items.`,
    ],
  };

  const serviceDescriptions = descriptions[serviceType] || descriptions.stays;
  return serviceDescriptions[Math.floor(Math.random() * serviceDescriptions.length)];
};

// Helper function to generate AI reasoning
const generateAIReasoning = (
  serviceType: string,
  unsoldInventoryCount: number,
  trend: TravelTrend | undefined
): string => {
  const urgency =
    unsoldInventoryCount > 10
      ? 'HIGH inventory pressure detected. '
      : unsoldInventoryCount > 5
        ? 'MODERATE inventory pressure detected. '
        : 'Competitive market pressure detected. ';

  const trendAnalysis = trend
    ? `The "${trend.trend}" trend is gaining momentum with ${trend.popularity}% popularity among travelers. `
    : 'Market analysis shows strong demand in your category. ';

  const recommendation =
    unsoldInventoryCount > 10
      ? `This aggressive promotion should quickly convert unsold inventory.`
      : unsoldInventoryCount > 5
        ? `This balanced promotion balances conversion rate with margin preservation.`
        : `This strategic offer positions you competitively in a crowded market.`;

  return `${urgency}${trendAnalysis}${recommendation}`;
};

// Fetch mock traveler data for AI analysis
export const getMockTravelerData = (): TravelerData => {
  return {
    bookingFrequency: Math.floor(Math.random() * 5) + 1,
    averageSpend: Math.floor(Math.random() * 2000) + 500,
    preferredCategories: ['stays', 'experiences', 'events'].slice(
      0,
      Math.floor(Math.random() * 3) + 1
    ),
    seasonalTrends: ['summer', 'holidays', 'weekends'],
  };
};

// Export types for use in components
export interface AIAnalysis {
  trend: string;
  trendPopularity: number;
  peakSeason: string;
  reasoning: string;
}
