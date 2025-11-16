/**
 * Inventory Manager - Tracks listings, bookings, occupancy, and detection of gaps
 * Based on industry best practices for travel platform analytics
 */

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface Booking {
  id: string;
  listingId: string;
  startDate: string;
  endDate: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  cancelledAt?: string;
  customerId: string;
}

export interface ListingInventory {
  listingId: string;
  listingTitle: string;
  listingType: 'stays' | 'flights' | 'experiences' | 'events' | 'essentials';
  capacity?: number; // For stays, experiences, events
  totalSeats?: number; // For flights
  bookings: Booking[];
  occupancyRate: number; // 0-100%
  vacancyPeriods: DateRange[]; // Periods with no bookings
  recentCancellations: number; // Cancellations in last 30 days
  lastScannedAt: string;
}

export interface InventoryGap {
  listingId: string;
  listingTitle: string;
  listingType: string;
  occupancyRate: number;
  vacancyDays: number;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  reason: string;
  recommendedDiscountRange: { min: number; max: number };
}

// Generate mock bookings for a listing
const generateMockBookings = (
  listingId: string,
  listingType: string,
  capacity: number,
  daysToSimulate: 90
): Booking[] => {
  const bookings: Booking[] = [];
  const today = new Date();

  // Industry benchmarks for occupancy rates
  const occupancyRates: Record<string, number> = {
    stays: 0.65, // 65% occupancy is healthy for stays
    flights: 0.72, // 72% load factor standard for airlines
    experiences: 0.55, // 55% for experiences (more seasonal)
    events: 0.78, // 78% for events (higher demand)
    essentials: 0.80, // 80% for travel services (consistent demand)
  };

  const targetOccupancy = occupancyRates[listingType] || 0.65;
  const bookingsCount = Math.ceil((daysToSimulate * targetOccupancy) / 10);

  // Create varied bookings
  for (let i = 0; i < bookingsCount; i++) {
    const startDayOffset = Math.floor(Math.random() * (daysToSimulate - 14));
    const duration = listingType === 'flights' ? 1 : Math.floor(Math.random() * 7) + 2;

    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() + startDayOffset);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + duration);

    // 8% cancellation rate (industry average)
    const isCancelled = Math.random() < 0.08;
    const cancelledAt = isCancelled
      ? new Date(startDate.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0]
      : undefined;

    const bookingStatus = isCancelled ? 'cancelled' : 'confirmed';

    bookings.push({
      id: `booking-${listingId}-${i}`,
      listingId,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      status: bookingStatus,
      cancelledAt,
      customerId: `customer-${Math.floor(Math.random() * 10000)}`,
    });
  }

  return bookings;
};

// Calculate occupancy and detect gaps
const analyzeOccupancy = (
  bookings: Booking[],
  daysToAnalyze: number = 90
): { occupancyRate: number; vacancyPeriods: DateRange[]; recentCancellations: number } => {
  const today = new Date();
  const analysisStart = new Date(today);
  const analysisEnd = new Date(today);
  analysisEnd.setDate(analysisEnd.getDate() + daysToAnalyze);

  // Count confirmed bookings
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');
  const bookedDays = new Set<string>();

  confirmedBookings.forEach((booking) => {
    let currentDate = new Date(booking.startDate);
    while (currentDate < new Date(booking.endDate)) {
      bookedDays.add(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  // Calculate occupancy rate
  const totalDays = daysToAnalyze;
  const occupancyRate = (bookedDays.size / totalDays) * 100;

  // Detect vacancy periods (consecutive unbooked days)
  const vacancyPeriods: DateRange[] = [];
  let vacancyStart: Date | null = null;

  for (let i = 0; i < daysToAnalyze; i++) {
    const currentDate = new Date(analysisStart);
    currentDate.setDate(currentDate.getDate() + i);
    const dateStr = currentDate.toISOString().split('T')[0];

    if (!bookedDays.has(dateStr)) {
      if (!vacancyStart) {
        vacancyStart = new Date(currentDate);
      }
    } else {
      if (vacancyStart) {
        vacancyPeriods.push({
          startDate: vacancyStart.toISOString().split('T')[0],
          endDate: currentDate.toISOString().split('T')[0],
        });
        vacancyStart = null;
      }
    }
  }

  // Recent cancellations (last 30 days)
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentCancellations = bookings.filter((b) => {
    const cancelDate = b.cancelledAt ? new Date(b.cancelledAt) : null;
    return b.status === 'cancelled' && cancelDate && cancelDate > thirtyDaysAgo;
  }).length;

  return {
    occupancyRate: Math.round(occupancyRate),
    vacancyPeriods,
    recentCancellations,
  };
};

// Detect inventory gaps and urgency levels
export const detectInventoryGaps = (
  inventories: ListingInventory[]
): InventoryGap[] => {
  const gaps: InventoryGap[] = [];

  inventories.forEach((inventory) => {
    let urgency: 'critical' | 'high' | 'medium' | 'low' = 'low';
    let reason = '';
    let recommendedDiscountMin = 10;
    let recommendedDiscountMax = 15;

    const occupancyThresholds: Record<string, { critical: number; high: number; medium: number }> = {
      stays: { critical: 40, high: 50, medium: 60 },
      flights: { critical: 50, high: 60, medium: 70 },
      experiences: { critical: 35, high: 45, medium: 55 },
      events: { critical: 60, high: 70, medium: 80 },
      essentials: { critical: 30, high: 40, medium: 60 },
    };

    const thresholds = occupancyThresholds[inventory.listingType] || {
      critical: 40,
      high: 50,
      medium: 60,
    };

    const vacancyDays = inventory.vacancyPeriods.reduce((total, period) => {
      const start = new Date(period.startDate);
      const end = new Date(period.endDate);
      return total + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    }, 0);

    // Determine urgency
    if (inventory.occupancyRate <= thresholds.critical || inventory.recentCancellations > 2) {
      urgency = 'critical';
      recommendedDiscountMin = 20;
      recommendedDiscountMax = 35;
      reason = `Critical: ${inventory.occupancyRate}% occupancy${inventory.recentCancellations > 0 ? ` + ${inventory.recentCancellations} recent cancellations` : ''}`;
    } else if (inventory.occupancyRate <= thresholds.high) {
      urgency = 'high';
      recommendedDiscountMin = 15;
      recommendedDiscountMax = 25;
      reason = `High: ${inventory.occupancyRate}% occupancy, ${vacancyDays} vacancy days`;
    } else if (inventory.occupancyRate <= thresholds.medium) {
      urgency = 'medium';
      recommendedDiscountMin = 10;
      recommendedDiscountMax = 20;
      reason = `Medium: Seasonal vacancy detected`;
    } else {
      urgency = 'low';
      recommendedDiscountMin = 5;
      recommendedDiscountMax = 10;
      reason = `Low: Healthy occupancy rate`;
    }

    // Only include if there's a gap worth promoting
    if (urgency !== 'low') {
      gaps.push({
        listingId: inventory.listingId,
        listingTitle: inventory.listingTitle,
        listingType: inventory.listingType,
        occupancyRate: inventory.occupancyRate,
        vacancyDays,
        urgency,
        reason,
        recommendedDiscountRange: {
          min: recommendedDiscountMin,
          max: recommendedDiscountMax,
        },
      });
    }
  });

  // Sort by urgency and occupancy rate
  return gaps.sort((a, b) => {
    const urgencyOrder: Record<string, number> = {
      critical: 0,
      high: 1,
      medium: 2,
      low: 3,
    };
    if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    }
    return a.occupancyRate - b.occupancyRate;
  });
};

// Generate mock inventory data for all listings
export const generateMockInventories = (listings: any[]): ListingInventory[] => {
  return listings.map((listing) => {
    const capacity = listing.type === 'stays' ? 4 : listing.type === 'flights' ? 180 : 20;
    const bookings = generateMockBookings(listing.id, listing.type, capacity, 90);
    const { occupancyRate, vacancyPeriods, recentCancellations } = analyzeOccupancy(bookings);

    return {
      listingId: listing.id,
      listingTitle: listing.title,
      listingType: listing.type,
      capacity,
      bookings,
      occupancyRate,
      vacancyPeriods,
      recentCancellations,
      lastScannedAt: new Date().toISOString(),
    };
  });
};

// Simulate daily scan
export const simulateDailyScan = (inventories: ListingInventory[]): InventoryGap[] => {
  return detectInventoryGaps(inventories);
};

// Format occupancy for display
export const formatOccupancy = (rate: number): string => {
  if (rate >= 80) return 'Excellent';
  if (rate >= 65) return 'Good';
  if (rate >= 50) return 'Fair';
  if (rate >= 35) return 'Poor';
  return 'Critical';
};

// Get urgency color
export const getUrgencyColor = (
  urgency: 'critical' | 'high' | 'medium' | 'low'
): string => {
  switch (urgency) {
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
