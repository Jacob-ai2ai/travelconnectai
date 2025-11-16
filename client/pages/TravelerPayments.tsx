import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, CreditCard, Wallet, TrendingUp, DollarSign } from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: string;
  name: string;
  number: string;
  expiryDate: string;
  isDefault: boolean;
}

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'debit' | 'credit';
  date: string;
  category: string;
  status: 'completed' | 'pending' | 'failed';
}

export default function TravelerPayments() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [rewardsPoints, setRewardsPoints] = useState(0);

  useEffect(() => {
    const savedPaymentMethods = localStorage.getItem('travelerPaymentMethods');
    if (savedPaymentMethods) {
      try {
        setPaymentMethods(JSON.parse(savedPaymentMethods));
      } catch (e) {
        console.error('Error loading payment methods:', e);
        initializePaymentData();
      }
    } else {
      initializePaymentData();
    }

    const savedTransactions = localStorage.getItem('travelerTransactions');
    if (savedTransactions) {
      try {
        const txs = JSON.parse(savedTransactions);
        setTransactions(txs);
      } catch (e) {
        console.error('Error loading transactions:', e);
      }
    }

    // Initialize wallet data
    const savedWallet = localStorage.getItem('travelerWallet');
    if (savedWallet) {
      try {
        const wallet = JSON.parse(savedWallet);
        setWalletBalance(wallet.balance);
        setRewardsPoints(wallet.rewards);
      } catch (e) {
        console.error('Error loading wallet:', e);
      }
    } else {
      setWalletBalance(1250.5);
      setRewardsPoints(5480);
      localStorage.setItem(
        'travelerWallet',
        JSON.stringify({ balance: 1250.5, rewards: 5480 })
      );
    }
  }, []);

  const initializePaymentData = () => {
    const demoPaymentMethods: PaymentMethod[] = [
      {
        id: '1',
        type: 'Credit Card',
        name: 'Visa',
        number: '****  ****  ****  4242',
        expiryDate: '12/26',
        isDefault: true,
      },
      {
        id: '2',
        type: 'Credit Card',
        name: 'Mastercard',
        number: '****  ****  ****  8888',
        expiryDate: '06/25',
        isDefault: false,
      },
      {
        id: '3',
        type: 'Digital Wallet',
        name: 'PayPal',
        number: 'john.doe@email.com',
        expiryDate: 'N/A',
        isDefault: false,
      },
    ];

    const demoTransactions: Transaction[] = [
      {
        id: '1',
        title: 'Flight Booking - NY to LA',
        amount: 450,
        type: 'debit',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'Travel',
        status: 'completed',
      },
      {
        id: '2',
        title: 'Hotel Reservation - Paris',
        amount: 720,
        type: 'debit',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'Accommodation',
        status: 'completed',
      },
      {
        id: '3',
        title: 'Refund - Cancelled Experience',
        amount: 120,
        type: 'credit',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'Refund',
        status: 'completed',
      },
      {
        id: '4',
        title: 'Restaurant Booking - Tokyo',
        amount: 180,
        type: 'debit',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'Dining',
        status: 'completed',
      },
      {
        id: '5',
        title: 'Travel Insurance Premium',
        amount: 45,
        type: 'debit',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'Insurance',
        status: 'pending',
      },
    ];

    setPaymentMethods(demoPaymentMethods);
    setTransactions(demoTransactions);
    localStorage.setItem('travelerPaymentMethods', JSON.stringify(demoPaymentMethods));
    localStorage.setItem('travelerTransactions', JSON.stringify(demoTransactions));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalSpent = transactions
    .filter((t) => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/traveler-dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <div>
            <h1 className="text-3xl font-bold mb-2">Banking & Payments</h1>
            <p className="text-muted-foreground">
              Manage your payment methods, wallet, and rewards
            </p>
          </div>
        </div>

        {/* Wallet & Rewards Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Wallet Balance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wallet className="h-5 w-5 text-travel-blue" />
                Wallet Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-travel-blue mb-2">${walletBalance.toFixed(2)}</p>
              <Button className="w-full mt-4" variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Funds
              </Button>
            </CardContent>
          </Card>

          {/* Rewards Points */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                Rewards Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-500 mb-2">{rewardsPoints.toLocaleString()}</p>
              <Button className="w-full mt-4" variant="outline" size="sm">
                Redeem Points
              </Button>
            </CardContent>
          </Card>

          {/* Total Spent */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-5 w-5 text-green-500" />
                Total Spent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600 mb-2">${totalSpent.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">This year</p>
            </CardContent>
          </Card>
        </div>

        {/* Payment Methods */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Methods
              </CardTitle>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">{method.name}</p>
                      <p className="text-sm text-muted-foreground">{method.number}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-muted-foreground">Exp: {method.expiryDate}</p>
                    {method.isDefault && <Badge>Default</Badge>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{transaction.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.category} •{' '}
                        {new Date(transaction.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          transaction.type === 'debit' ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {transaction.type === 'debit' ? '-' : '+'}${transaction.amount.toFixed(2)}
                      </p>
                      <Badge className={`${getStatusColor(transaction.status)} text-xs capitalize`}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
