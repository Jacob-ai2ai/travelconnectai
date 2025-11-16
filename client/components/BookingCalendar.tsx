import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface Booking {
  id: string;
  listingId: string;
  startDate: string;
  endDate: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  cancelledAt?: string;
  customerId: string;
}

interface ServiceInventory {
  listingId: string;
  listingTitle: string;
  listingType: string;
  bookings: Booking[];
  occupancyRate: number;
  capacity?: number;
  lastScannedAt: string;
}

interface DateStatus {
  date: string;
  status: 'sold-out' | 'vacant' | 'dead' | 'reserved' | 'promo' | 'no-inventory' | 'completed';
  revenue: number;
  promoApplied?: string;
  bookingCount: number;
  capacity: number;
}

const BookingCalendar: React.FC<{ inventories: ServiceInventory[] }> = ({ inventories }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedService, setSelectedService] = useState(inventories[0]?.listingId || '');

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMonthYear = (date: Date): string => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const calculateDateStatus = (dateStr: string, bookings: Booking[], capacity: number = 4): DateStatus => {
    const confirmedBookings = bookings.filter((b) => {
      if (b.status !== 'confirmed') return false;
      const bookingStart = new Date(b.startDate);
      const bookingEnd = new Date(b.endDate);
      const currentDate = new Date(dateStr);
      return currentDate >= bookingStart && currentDate < bookingEnd;
    });

    const completedBookings = bookings.filter((b) => {
      if (b.status !== 'completed') return false;
      const bookingStart = new Date(b.startDate);
      const bookingEnd = new Date(b.endDate);
      const currentDate = new Date(dateStr);
      return currentDate >= bookingStart && currentDate < bookingEnd;
    });

    const bookedCount = confirmedBookings.length + completedBookings.length;
    const currentDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let status: DateStatus['status'] = 'vacant';
    let revenue = 0;

    // Determine status
    if (completedBookings.length > 0) {
      status = 'completed';
      revenue = completedBookings.length * 100; // Mock revenue
    } else if (bookedCount >= capacity) {
      status = 'sold-out';
      revenue = bookedCount * 100;
    } else if (bookedCount > 0) {
      status = 'reserved';
      revenue = bookedCount * 100;
    } else if (currentDate < today) {
      status = 'dead'; // Dates in the past with no bookings
    } else {
      status = 'vacant';
    }

    // Simulate promo status (mock data - approximately 15% of dates have promos)
    const hasPromo = Math.random() < 0.15 && status !== 'sold-out';
    if (hasPromo && status === 'vacant') {
      status = 'promo';
      revenue = 80;
    }

    return {
      date: dateStr,
      status,
      revenue,
      bookingCount: bookedCount,
      capacity,
      promoApplied: hasPromo ? '15% OFF' : undefined,
    };
  };

  const generateCalendarDays = (
    service: ServiceInventory | undefined
  ): Array<{ dateStr: string; dateStatus: DateStatus | null; isCurrentMonth: boolean } | null> => {
    if (!service) return [];

    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days: Array<{ dateStr: string; dateStatus: DateStatus | null; isCurrentMonth: boolean } | null> = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateStr = date.toISOString().split('T')[0];
      const dateStatus = calculateDateStatus(dateStr, service.bookings, service.capacity || 4);
      days.push({ dateStr, dateStatus, isCurrentMonth: true });
    }

    return days;
  };

  const currentService = useMemo(
    () => inventories.find((inv) => inv.listingId === selectedService),
    [selectedService, inventories]
  );

  const calendarDays = useMemo(() => generateCalendarDays(currentService), [currentService, currentMonth]);

  const getStatusColor = (status: DateStatus['status']): string => {
    switch (status) {
      case 'sold-out':
        return 'bg-red-100 border-red-300 text-red-900';
      case 'vacant':
        return 'bg-green-50 border-green-200 text-green-900';
      case 'dead':
        return 'bg-gray-100 border-gray-200 text-gray-600';
      case 'reserved':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900';
      case 'promo':
        return 'bg-purple-100 border-purple-300 text-purple-900';
      case 'completed':
        return 'bg-blue-100 border-blue-300 text-blue-900';
      case 'no-inventory':
        return 'bg-gray-50 border-gray-100 text-gray-400';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const getStatusLabel = (status: DateStatus['status']): string => {
    const labels: Record<DateStatus['status'], string> = {
      'sold-out': 'Sold Out',
      vacant: 'Vacant',
      dead: 'Dead',
      reserved: 'Reserved',
      promo: 'Promo',
      completed: 'Completed',
      'no-inventory': 'No Inventory',
    };
    return labels[status];
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getMonthStats = (): { totalRevenue: number; soldOut: number; vacant: number; reserved: number } => {
    let totalRevenue = 0;
    let soldOut = 0;
    let vacant = 0;
    let reserved = 0;

    calendarDays.forEach((day) => {
      if (day && day.dateStatus) {
        totalRevenue += day.dateStatus.revenue;
        if (day.dateStatus.status === 'sold-out') soldOut++;
        else if (day.dateStatus.status === 'vacant') vacant++;
        else if (day.dateStatus.status === 'reserved') reserved++;
      }
    });

    return { totalRevenue, soldOut, vacant, reserved };
  };

  const stats = getMonthStats();

  if (!currentService || inventories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Booking Calendars
          </CardTitle>
          <CardDescription>View your inventory and booking status for each service</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">No services listed yet. Create your first listing to see booking calendars.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Booking Calendars
        </CardTitle>
        <CardDescription>View your inventory and booking status for each service</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Service Selection */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Select Service</label>
          <div className="flex flex-wrap gap-2">
            {inventories.map((inv) => (
              <button
                key={inv.listingId}
                onClick={() => setSelectedService(inv.listingId)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedService === inv.listingId
                    ? 'bg-travel-blue text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {inv.listingTitle}
              </button>
            ))}
          </div>
        </div>

        {currentService && (
          <>
            {/* Month Navigation and Stats */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <h3 className="text-lg font-bold min-w-[200px] text-center">{getMonthYear(currentMonth)}</h3>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="flex gap-4 text-sm">
                  <div className="text-center">
                    <p className="font-bold text-lg text-green-600">{stats.vacant}</p>
                    <p className="text-gray-600">Vacant</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-lg text-yellow-600">{stats.reserved}</p>
                    <p className="text-gray-600">Reserved</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-lg text-red-600">{stats.soldOut}</p>
                    <p className="text-gray-600">Sold Out</p>
                  </div>
                  <div className="text-center pl-4 border-l border-gray-200">
                    <p className="font-bold text-lg text-travel-blue">${stats.totalRevenue.toLocaleString()}</p>
                    <p className="text-gray-600">Revenue</p>
                  </div>
                </div>
              </div>

              {/* Service Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Service Type</p>
                    <p className="font-semibold capitalize">{currentService.listingType}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Occupancy Rate</p>
                    <p className="font-semibold">{currentService.occupancyRate}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Capacity</p>
                    <p className="font-semibold">{currentService.capacity} units/day</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Bookings</p>
                    <p className="font-semibold">{currentService.bookings.filter((b) => b.status === 'confirmed').length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="border rounded-lg overflow-hidden">
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 bg-gray-100 border-b">
                {weekDays.map((day) => (
                  <div key={day} className="p-3 text-center font-semibold text-gray-700 text-sm">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-0 border-collapse">
                {calendarDays.map((day, idx) => (
                  <div
                    key={idx}
                    className={`aspect-square border border-gray-200 p-2 ${
                      day && day.dateStatus ? getStatusColor(day.dateStatus.status) : 'bg-gray-50'
                    } hover:shadow-md transition-all duration-200 cursor-pointer relative group`}
                  >
                    {day && day.dateStatus ? (
                      <>
                        <div className="text-right text-xs font-semibold mb-1">
                          {new Date(day.dateStatus.date).getDate()}
                        </div>
                        <div className="flex flex-col gap-1 text-xs">
                          <Badge
                            variant="outline"
                            className={`w-full text-center justify-center text-[10px] py-0 ${
                              day.dateStatus.status === 'sold-out'
                                ? 'bg-red-200 text-red-800 border-red-300'
                                : day.dateStatus.status === 'vacant'
                                  ? 'bg-green-200 text-green-800 border-green-300'
                                  : day.dateStatus.status === 'dead'
                                    ? 'bg-gray-200 text-gray-800 border-gray-300'
                                    : day.dateStatus.status === 'reserved'
                                      ? 'bg-yellow-200 text-yellow-800 border-yellow-300'
                                      : day.dateStatus.status === 'promo'
                                        ? 'bg-purple-200 text-purple-800 border-purple-300'
                                        : 'bg-blue-200 text-blue-800 border-blue-300'
                            }`}
                          >
                            {getStatusLabel(day.dateStatus.status)}
                          </Badge>
                          {day.dateStatus.revenue > 0 && (
                            <div className="text-[9px] font-semibold text-gray-700">
                              ${day.dateStatus.revenue}
                            </div>
                          )}
                          {day.dateStatus.promoApplied && (
                            <div className="text-[8px] font-bold text-purple-700">
                              {day.dateStatus.promoApplied}
                            </div>
                          )}
                          {day.dateStatus.bookingCount > 0 && (
                            <div className="text-[8px] text-gray-600">
                              {day.dateStatus.bookingCount}/{day.dateStatus.capacity}
                            </div>
                          )}
                        </div>

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-normal">
                          <p className="font-semibold mb-1">{new Date(day.dateStatus.date).toLocaleDateString()}</p>
                          <p>Status: {getStatusLabel(day.dateStatus.status)}</p>
                          <p>Bookings: {day.dateStatus.bookingCount}/{day.dateStatus.capacity}</p>
                          <p>Revenue: ${day.dateStatus.revenue}</p>
                          {day.dateStatus.promoApplied && (
                            <p>Promo: {day.dateStatus.promoApplied}</p>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-400 text-xs">&nbsp;</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-semibold text-gray-700 mb-3">Status Legend</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                  <span>Sold Out</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
                  <span>Vacant</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
                  <span>Dead</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-50 border border-yellow-200 rounded"></div>
                  <span>Reserved</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded"></div>
                  <span>Promo</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
                  <span>Completed</span>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingCalendar;
