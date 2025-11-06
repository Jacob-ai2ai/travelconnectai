import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, Zap } from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  body?: string;
  time: string;
  read?: boolean;
}

interface NotificationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const defaultNotifications: NotificationItem[] = [
  { id: 'n1', title: 'Request accepted', body: 'Your booking request for Bali was accepted', time: '2h', read: false },
  { id: 'n2', title: 'Live stream started', body: 'Host @CoastalHomes started live stream on Santorini villa', time: '6h', read: false },
  { id: 'n3', title: 'New comment on post', body: 'Alex commented on your photo', time: '1d', read: true },
  { id: 'n4', title: 'Reward earned', body: 'You earned 50 coins for referring a friend', time: '3d', read: false },
];

export default function NotificationsDialog({ open, onOpenChange }: NotificationsDialogProps) {
  const [items, setItems] = useState<NotificationItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('notifications');
      if (raw) {
        setItems(JSON.parse(raw));
      } else {
        setItems(defaultNotifications);
        localStorage.setItem('notifications', JSON.stringify(defaultNotifications));
      }
    } catch (e) {
      setItems(defaultNotifications);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(items));
  }, [items]);

  const markAllRead = () => setItems(items.map(i => ({ ...i, read: true })));
  const clear = () => setItems([]);
  const toggleRead = (id: string) => setItems(items.map(i => i.id === id ? { ...i, read: !i.read } : i));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Bell className="h-4 w-4" /> Notifications</DialogTitle>
        </DialogHeader>

        <div className="p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-muted-foreground">Recent activity from your network</div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={markAllRead}>Mark all read</Button>
              <Button variant="ghost" onClick={clear}>Clear</Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {items.length === 0 && <div className="text-sm text-muted-foreground p-4">You have no notifications.</div>}

            {items.map(it => (
              <div key={it.id} className={`flex items-start gap-3 p-3 rounded-md ${it.read ? 'bg-gray-50' : 'bg-white shadow-sm'}`}>
                <div className="bg-gradient-to-br from-travel-blue to-travel-purple rounded-full w-8 h-8 flex items-center justify-center text-white">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{it.title}</div>
                  {it.body && <div className="text-sm text-muted-foreground">{it.body}</div>}
                  <div className="text-xs text-muted-foreground mt-1">{it.time}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Button variant="ghost" onClick={() => toggleRead(it.id)}>{it.read ? 'Unread' : 'Read'}</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
