import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, AlertCircle, CheckCircle, Clock, MessageSquare } from 'lucide-react';

interface Complaint {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  category: string;
  createdAt: string;
  updatedAt: string;
  priority: 'low' | 'medium' | 'high';
}

export default function TravelerComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const savedComplaints = localStorage.getItem('travelerComplaints');
    if (savedComplaints) {
      try {
        setComplaints(JSON.parse(savedComplaints));
      } catch (e) {
        console.error('Error loading complaints:', e);
        initializeDemoData();
      }
    } else {
      initializeDemoData();
    }
  }, []);

  const initializeDemoData = () => {
    const demoComplaints: Complaint[] = [
      {
        id: '1',
        title: 'Booking cancellation issue',
        description: 'Unable to cancel my hotel booking',
        status: 'open',
        category: 'Booking',
        priority: 'high',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        title: 'Payment refund delayed',
        description: 'Refund from cancelled flight not received',
        status: 'in-progress',
        category: 'Payment',
        priority: 'high',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        title: 'Poor service quality',
        description: 'Experience did not match the description',
        status: 'resolved',
        category: 'Service',
        priority: 'medium',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '4',
        title: 'Website technical issue',
        description: 'Unable to login to my account',
        status: 'closed',
        category: 'Technical',
        priority: 'low',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    setComplaints(demoComplaints);
    localStorage.setItem('travelerComplaints', JSON.stringify(demoComplaints));
  };

  const getFilteredComplaints = () => {
    if (statusFilter === 'all') return complaints;
    return complaints.filter((c) => c.status === statusFilter);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 border-red-200';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200';
      case 'low':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'closed':
        return <CheckCircle className="h-5 w-5 text-gray-600" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const filteredComplaints = getFilteredComplaints();
  const openCount = complaints.filter((c) => c.status === 'open' || c.status === 'in-progress').length;
  const resolvedCount = complaints.filter((c) => c.status === 'resolved' || c.status === 'closed').length;

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

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Complaints & Support</h1>
              <p className="text-muted-foreground">
                Report issues and track your support requests
              </p>
            </div>
            <Button className="bg-travel-blue hover:bg-travel-blue/90">
              <Plus className="h-4 w-4 mr-2" />
              File Complaint
            </Button>
          </div>
        </div>

        {/* Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div>
              <label className="text-sm font-medium block mb-2">Filter by Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full md:w-64 border rounded-lg p-2 text-sm"
              >
                <option value="all">All Complaints ({complaints.length})</option>
                <option value="open">Open ({complaints.filter((c) => c.status === 'open').length})</option>
                <option value="in-progress">In Progress ({complaints.filter((c) => c.status === 'in-progress').length})</option>
                <option value="resolved">Resolved ({complaints.filter((c) => c.status === 'resolved').length})</option>
                <option value="closed">Closed ({complaints.filter((c) => c.status === 'closed').length})</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Complaints List */}
        {filteredComplaints.length > 0 ? (
          <div className="space-y-4">
            {filteredComplaints.map((complaint) => (
              <Card
                key={complaint.id}
                className={`overflow-hidden hover:shadow-lg transition-shadow border-l-4 ${
                  complaint.priority === 'high' ? 'border-l-red-500' : complaint.priority === 'medium' ? 'border-l-yellow-500' : 'border-l-blue-500'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Status Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(complaint.status)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="text-lg font-semibold">{complaint.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{complaint.description}</p>
                        </div>
                        <Badge className={`${getStatusColor(complaint.status)} capitalize flex-shrink-0`}>
                          {complaint.status}
                        </Badge>
                      </div>

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <span className="px-2 py-1 bg-muted rounded text-xs">{complaint.category}</span>
                        <span>
                          Created {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <span>
                          Updated {new Date(complaint.updatedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button variant="outline" size="sm" className="flex-shrink-0">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Update
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
              <p className="text-muted-foreground mb-4">No complaints found.</p>
              <p className="text-sm text-muted-foreground">All issues have been resolved!</p>
            </CardContent>
          </Card>
        )}

        {/* Summary Stats */}
        {filteredComplaints.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-travel-blue">{complaints.length}</p>
                <p className="text-sm text-muted-foreground">Total Complaints</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-red-600">{openCount}</p>
                <p className="text-sm text-muted-foreground">Active Issues</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-green-600">{resolvedCount}</p>
                <p className="text-sm text-muted-foreground">Resolved</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-travel-blue">
                  {resolvedCount > 0 ? Math.round((resolvedCount / complaints.length) * 100) : 0}%
                </p>
                <p className="text-sm text-muted-foreground">Resolution Rate</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
