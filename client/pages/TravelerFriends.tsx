import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, MessageSquare, User, Trash2, Grid3x3, List } from 'lucide-react';

interface Friend {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  status: 'active' | 'offline';
  mutualFriends?: number;
  joinedDate?: string;
}

export default function TravelerFriends() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'tile' | 'list'>('tile');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedFriends = localStorage.getItem('travelerFriends');
    if (savedFriends) {
      try {
        setFriends(JSON.parse(savedFriends));
      } catch (e) {
        console.error('Error loading friends:', e);
        initializeDemoData();
      }
    } else {
      initializeDemoData();
    }
  }, []);

  const initializeDemoData = () => {
    const demoFriends: Friend[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        avatar: 'https://i.pravatar.cc/150?img=10',
        email: 'sarah@example.com',
        status: 'active',
        mutualFriends: 5,
        joinedDate: '2024-01-15',
      },
      {
        id: '2',
        name: 'Michael Chen',
        avatar: 'https://i.pravatar.cc/150?img=11',
        email: 'michael@example.com',
        status: 'offline',
        mutualFriends: 3,
        joinedDate: '2024-02-20',
      },
      {
        id: '3',
        name: 'Emma Wilson',
        avatar: 'https://i.pravatar.cc/150?img=12',
        email: 'emma@example.com',
        status: 'active',
        mutualFriends: 8,
        joinedDate: '2024-01-10',
      },
      {
        id: '4',
        name: 'James Rodriguez',
        avatar: 'https://i.pravatar.cc/150?img=13',
        email: 'james@example.com',
        status: 'offline',
        mutualFriends: 2,
        joinedDate: '2024-03-05',
      },
      {
        id: '5',
        name: 'Lisa Anderson',
        avatar: 'https://i.pravatar.cc/150?img=14',
        email: 'lisa@example.com',
        status: 'active',
        mutualFriends: 6,
        joinedDate: '2024-01-20',
      },
      {
        id: '6',
        name: 'David Martinez',
        avatar: 'https://i.pravatar.cc/150?img=15',
        email: 'david@example.com',
        status: 'active',
        mutualFriends: 4,
        joinedDate: '2024-02-14',
      },
    ];
    setFriends(demoFriends);
    localStorage.setItem('travelerFriends', JSON.stringify(demoFriends));
  };

  const getFilteredFriends = () => {
    if (statusFilter === 'all') return friends;
    return friends.filter((f) => f.status === statusFilter);
  };

  const handleRemoveFriend = (id: string) => {
    const updated = friends.filter((f) => f.id !== id);
    setFriends(updated);
    localStorage.setItem('travelerFriends', JSON.stringify(updated));
  };

  const filteredFriends = getFilteredFriends();
  const activeFriends = friends.filter((f) => f.status === 'active').length;

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
              <h1 className="text-3xl font-bold mb-2">Friends</h1>
              <p className="text-muted-foreground">
                Connect with other travelers and share your experiences
              </p>
            </div>
            <Button className="bg-travel-blue hover:bg-travel-blue/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Friend
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
                <option value="all">All Friends ({friends.length})</option>
                <option value="active">Active ({activeFriends})</option>
                <option value="offline">Offline ({friends.length - activeFriends})</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Friends Grid */}
        {filteredFriends.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFriends.map((friend) => (
              <Card key={friend.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  {/* Avatar and Status */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div
                        className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                          friend.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{friend.name}</h3>
                      <Badge
                        className={`mt-1 ${
                          friend.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {friend.status === 'active' ? '🟢 Active' : '⚪ Offline'}
                      </Badge>
                    </div>
                  </div>

                  {/* Friend Details */}
                  <div className="space-y-2 mb-4 pb-4 border-b">
                    {friend.email && (
                      <p className="text-sm text-muted-foreground">{friend.email}</p>
                    )}
                    {friend.mutualFriends && (
                      <p className="text-sm text-muted-foreground">
                        {friend.mutualFriends} mutual friends
                      </p>
                    )}
                    {friend.joinedDate && (
                      <p className="text-xs text-muted-foreground">
                        Friends since {new Date(friend.joinedDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <User className="h-4 w-4 mr-1" />
                      Profile
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFriend(friend.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-4">No friends found.</p>
              <Button className="bg-travel-blue hover:bg-travel-blue/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Friend
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Summary Stats */}
        {filteredFriends.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-travel-blue">{friends.length}</p>
                <p className="text-sm text-muted-foreground">Total Friends</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-green-600">{activeFriends}</p>
                <p className="text-sm text-muted-foreground">Active Now</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-travel-blue">
                  {friends.length > 0
                    ? (friends.reduce((sum, f) => sum + (f.mutualFriends || 0), 0) / friends.length).toFixed(1)
                    : 0}
                </p>
                <p className="text-sm text-muted-foreground">Avg Mutual Friends</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-travel-blue">{friends.length - activeFriends}</p>
                <p className="text-sm text-muted-foreground">Offline</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
