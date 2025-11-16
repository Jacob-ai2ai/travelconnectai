import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingCart, User, Mail, Grid3x3, List, TrendingUp } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  listingTitle: string;
  serviceType: 'stays' | 'flights' | 'experiences' | 'events' | 'essentials';
  amount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export default function VendorOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'tile' | 'list'>('list');

  useEffect(() => {
    const savedOrders = localStorage.getItem('vendorOrders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        initializeDemoData();
      }
    } else {
      initializeDemoData();
    }
  }, []);

  const initializeDemoData = () => {
    const demoOrders: Order[] = [
      {
        id: '1',
        orderNumber: 'ORD-001',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        listingTitle: 'Luxurious Beach Villa in Bali',
        serviceType: 'stays',
        amount: 1500,
        status: 'confirmed',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        orderNumber: 'ORD-002',
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        listingTitle: 'Flight NYC to LA',
        serviceType: 'flights',
        amount: 900,
        status: 'completed',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        orderNumber: 'ORD-003',
        customerName: 'Mike Johnson',
        customerEmail: 'mike@example.com',
        listingTitle: 'Mountain Adventure Experience',
        serviceType: 'experiences',
        amount: 2000,
        status: 'pending',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '4',
        orderNumber: 'ORD-004',
        customerName: 'Sarah Wilson',
        customerEmail: 'sarah@example.com',
        listingTitle: 'Music Festival Pass',
        serviceType: 'events',
        amount: 350,
        status: 'completed',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '5',
        orderNumber: 'ORD-005',
        customerName: 'Robert Brown',
        customerEmail: 'robert@example.com',
        listingTitle: 'Travel Insurance Package',
        serviceType: 'essentials',
        amount: 180,
        status: 'confirmed',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '6',
        orderNumber: 'ORD-006',
        customerName: 'Emily Davis',
        customerEmail: 'emily@example.com',
        listingTitle: 'Cozy Apartment in Paris',
        serviceType: 'stays',
        amount: 1200,
        status: 'completed',
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    setOrders(demoOrders);
    localStorage.setItem('vendorOrders', JSON.stringify(demoOrders));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getServiceColor = (type: string) => {
    switch (type) {
      case 'stays':
        return 'bg-blue-100 text-blue-800';
      case 'flights':
        return 'bg-orange-100 text-orange-800';
      case 'experiences':
        return 'bg-purple-100 text-purple-800';
      case 'events':
        return 'bg-pink-100 text-pink-800';
      case 'essentials':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFilteredAndSortedOrders = () => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }

    // Filter by service type
    if (serviceFilter !== 'all') {
      filtered = filtered.filter((o) => o.serviceType === serviceFilter);
    }

    // Filter by date range
    const now = new Date();
    if (dateRange !== 'all') {
      filtered = filtered.filter((o) => {
        const orderDate = new Date(o.createdAt);
        const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));

        switch (dateRange) {
          case 'today':
            return daysDiff === 0;
          case 'week':
            return daysDiff <= 7;
          case 'month':
            return daysDiff <= 30;
          case 'quarter':
            return daysDiff <= 90;
          default:
            return true;
        }
      });
    }

    // Sort
    const sorted = [...filtered];
    if (sortBy === 'newest') {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'oldest') {
      sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === 'highestAmount') {
      sorted.sort((a, b) => b.amount - a.amount);
    } else if (sortBy === 'lowestAmount') {
      sorted.sort((a, b) => a.amount - b.amount);
    }

    return sorted;
  };

  const filteredOrders = getFilteredAndSortedOrders();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link to="/vendor-dashboard">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <h1 className="text-3xl font-bold mb-2">All Orders</h1>
        <p className="text-muted-foreground mb-6">Track orders and customer requests</p>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-64 border rounded-lg p-2 text-sm"
            >
              <option value="all">All Orders ({orders.length})</option>
              <option value="pending">Pending ({orders.filter((o) => o.status === 'pending').length})</option>
              <option value="confirmed">Confirmed ({orders.filter((o) => o.status === 'confirmed').length})</option>
              <option value="completed">Completed ({orders.filter((o) => o.status === 'completed').length})</option>
              <option value="cancelled">Cancelled ({orders.filter((o) => o.status === 'cancelled').length})</option>
            </select>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <ShoppingCart className="h-5 w-5 text-travel-blue" />
                      <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                      <Badge className={`${getStatusColor(order.status)} capitalize`}>{order.status}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-3">{order.listingTitle}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{order.customerName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <span>{order.customerEmail}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-2xl font-bold text-travel-blue">${order.amount}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" className="flex-1">
                    Update Status
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground">No orders found.</p>
            </CardContent>
          </Card>
        )}

        {filteredOrders.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-travel-blue">{orders.length}</p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-travel-blue">
                  ${orders.reduce((sum, o) => sum + o.amount, 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-green-600">
                  {orders.filter((o) => o.status === 'completed').length}
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-yellow-600">
                  {orders.filter((o) => o.status === 'pending').length}
                </p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
