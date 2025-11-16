import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CreditCard, DollarSign, TrendingUp, Download } from 'lucide-react';

export default function VendorPayments() {
  const [transactions] = useState([
    {
      id: '1',
      orderNumber: 'ORD-001',
      customerName: 'John Doe',
      amount: 1500,
      commission: 150,
      net: 1350,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
    },
    {
      id: '2',
      orderNumber: 'ORD-002',
      customerName: 'Jane Smith',
      amount: 900,
      commission: 90,
      net: 810,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
    },
    {
      id: '3',
      orderNumber: 'ORD-003',
      customerName: 'Mike Johnson',
      amount: 2000,
      commission: 200,
      net: 1800,
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
    },
  ]);

  const totalEarned = transactions.reduce((sum, t) => sum + t.net, 0);
  const totalCommission = transactions.reduce((sum, t) => sum + t.commission, 0);
  const thisMonth = transactions.filter((t) => new Date(t.date).getMonth() === new Date().getMonth()).reduce((sum, t) => sum + t.net, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link to="/vendor-dashboard">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <h1 className="text-3xl font-bold mb-6">Payments & Revenue</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Total Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">${totalEarned.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-travel-blue" />
                This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-travel-blue">${thisMonth.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">Current month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-orange-600" />
                Commission Paid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-600">${totalCommission.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">Cumulative</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.map((txn) => (
                <div key={txn.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                  <div className="flex-1">
                    <p className="font-semibold">{txn.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">{txn.customerName}</p>
                  </div>
                  <div className="text-right">
                    <div className="space-y-1 text-sm">
                      <p className="text-muted-foreground">
                        Gross: <span className="font-semibold">${txn.amount}</span>
                      </p>
                      <p className="text-muted-foreground">
                        Commission: <span className="font-semibold">-${txn.commission}</span>
                      </p>
                      <p className="font-semibold text-travel-blue">
                        Net: ${txn.net}
                      </p>
                    </div>
                  </div>
                  <div className="ml-4">
                    <Badge
                      className={
                        txn.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {txn.status === 'completed' ? 'Completed' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 border rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">Bank Account</p>
                    <p className="text-sm text-muted-foreground">****  ****  9876</p>
                  </div>
                </div>
                <Badge>Primary</Badge>
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline">
              Add Payment Method
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
