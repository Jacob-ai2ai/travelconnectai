/**
 * Notification Manager - Handles pending AI promotions, notifications, and approvals
 */

import { Promotion } from '@/types/promotions';

export interface PendingAIPromotion {
  id: string;
  promotionId: string;
  promotion: Promotion;
  listingId: string;
  listingTitle: string;
  listingType: string;
  generatedAt: string;
  expiresAt: string; // 7 days from generation
  status: 'pending' | 'approved' | 'rejected';
  occupancyGap: number;
  urgency: 'critical' | 'high' | 'medium' | 'low';
}

export interface NotificationEvent {
  id: string;
  type: 'new_ai_promotion' | 'occupancy_alert' | 'cancellation_detected';
  title: string;
  message: string;
  relatedPromotionId?: string;
  listingId?: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  inAppNotifications: boolean;
  pushNotifications: boolean;
  dailyScanEnabled: boolean;
  dailyScanTime: string; // HH:MM format
  autoApproveThreshold?: 'critical' | 'high' | 'medium'; // Auto-approve promotions below this threshold
}

const defaultPreferences: NotificationPreferences = {
  emailNotifications: true,
  inAppNotifications: true,
  pushNotifications: false,
  dailyScanEnabled: true,
  dailyScanTime: '09:00',
};

// Store and retrieve pending promotions
export const savePendingPromotions = (
  promotions: PendingAIPromotion[]
): void => {
  localStorage.setItem('pendingAIPromotions', JSON.stringify(promotions));
};

export const getPendingPromotions = (): PendingAIPromotion[] => {
  const saved = localStorage.getItem('pendingAIPromotions');
  return saved ? JSON.parse(saved) : [];
};

// Add a new pending promotion
export const addPendingPromotion = (promotion: PendingAIPromotion): void => {
  const existing = getPendingPromotions();
  existing.push(promotion);
  savePendingPromotions(existing);
  
  // Also trigger notification
  createNotification({
    type: 'new_ai_promotion',
    title: `New AI Promotion: ${promotion.promotion.name}`,
    message: `AI detected vacancy in "${promotion.listingTitle}". Review and approve the generated promotion.`,
    relatedPromotionId: promotion.promotionId,
    listingId: promotion.listingId,
    actionUrl: '/vendor/promotions',
  });
};

// Approve or reject pending promotion
export const approvePendingPromotion = (
  promotionId: string,
  approved: boolean
): void => {
  const promotions = getPendingPromotions();
  const index = promotions.findIndex((p) => p.promotionId === promotionId);
  
  if (index !== -1) {
    promotions[index].status = approved ? 'approved' : 'rejected';
    savePendingPromotions(promotions);
  }
};

// Notification management
export const createNotification = (event: Omit<NotificationEvent, 'id' | 'timestamp' | 'read'>): void => {
  const notification: NotificationEvent = {
    id: `notif-${Date.now()}`,
    ...event,
    timestamp: new Date().toISOString(),
    read: false,
  };

  const existing = getNotifications();
  existing.push(notification);
  localStorage.setItem('notifications', JSON.stringify(existing));

  // Simulate email notification
  if (getNotificationPreferences().emailNotifications) {
    simulateEmailNotification(notification);
  }
};

export const getNotifications = (): NotificationEvent[] => {
  const saved = localStorage.getItem('notifications');
  return saved ? JSON.parse(saved) : [];
};

export const markNotificationAsRead = (notificationId: string): void => {
  const notifications = getNotifications();
  const notification = notifications.find((n) => n.id === notificationId);
  if (notification) {
    notification.read = true;
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }
};

export const getUnreadNotificationCount = (): number => {
  return getNotifications().filter((n) => !n.read).length;
};

// Notification preferences
export const getNotificationPreferences = (): NotificationPreferences => {
  const saved = localStorage.getItem('notificationPreferences');
  return saved ? { ...defaultPreferences, ...JSON.parse(saved) } : defaultPreferences;
};

export const saveNotificationPreferences = (preferences: NotificationPreferences): void => {
  localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
};

export const toggleDailyScan = (enabled: boolean): void => {
  const prefs = getNotificationPreferences();
  prefs.dailyScanEnabled = enabled;
  saveNotificationPreferences(prefs);
};

export const setDailyScanTime = (time: string): void => {
  const prefs = getNotificationPreferences();
  prefs.dailyScanTime = time;
  saveNotificationPreferences(prefs);
};

// Simulate email notification (in real app, this would call a backend API)
const simulateEmailNotification = (notification: NotificationEvent): void => {
  console.log(`📧 Email Notification Sent:
    To: vendor@travelconnect.ai
    Subject: ${notification.title}
    Message: ${notification.message}
    Timestamp: ${new Date(notification.timestamp).toLocaleString()}
  `);

  // In a real implementation, this would be:
  // await fetch('/api/send-notification-email', {
  //   method: 'POST',
  //   body: JSON.stringify({
  //     to: userEmail,
  //     subject: notification.title,
  //     message: notification.message,
  //     actionUrl: notification.actionUrl
  //   })
  // });
};

// Daily scan simulation
export const scheduleDailyScan = (callback: () => void): (() => void) => {
  const prefs = getNotificationPreferences();
  
  if (!prefs.dailyScanEnabled) {
    return () => {};
  }

  // Parse the time (HH:MM)
  const [hours, minutes] = prefs.dailyScanTime.split(':').map(Number);
  
  const checkAndRunScan = () => {
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    if (now >= scheduledTime) {
      // Run scan immediately
      callback();
      
      // Schedule for next day
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilScan = scheduledTime.getTime() - Date.now();
    const timeout = setTimeout(() => {
      callback();
      // Schedule next scan for tomorrow
      setTimeout(checkAndRunScan, 24 * 60 * 60 * 1000);
    }, timeUntilScan);

    return () => clearTimeout(timeout);
  };

  return checkAndRunScan();
};

// Clear expired pending promotions
export const clearExpiredPromotions = (): void => {
  const promotions = getPendingPromotions();
  const now = new Date();
  
  const filtered = promotions.filter((p) => {
    const expiryDate = new Date(p.expiresAt);
    return expiryDate > now;
  });

  savePendingPromotions(filtered);
};

// Get summary for dashboard
export const getNotificationSummary = () => {
  const pendingCount = getPendingPromotions().filter((p) => p.status === 'pending').length;
  const unreadCount = getUnreadNotificationCount();
  const hasNewNotifications = unreadCount > 0;

  return {
    pendingApprovals: pendingCount,
    unreadNotifications: unreadCount,
    hasNewNotifications,
  };
};
