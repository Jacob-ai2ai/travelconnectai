import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Trash2, Edit2, Users, Mail } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'manager' | 'staff' | 'viewer';
  joinedDate: string;
  status: 'active' | 'inactive';
}

export default function VendorTeam() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    const savedTeam = localStorage.getItem('vendorTeam');
    if (savedTeam) {
      try {
        setTeamMembers(JSON.parse(savedTeam));
      } catch (e) {
        initializeDemoData();
      }
    } else {
      initializeDemoData();
    }
  }, []);

  const initializeDemoData = () => {
    const demoTeam: TeamMember[] = [
      {
        id: '1',
        name: 'You',
        email: 'vendor@example.com',
        role: 'manager',
        joinedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        role: 'staff',
        joinedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
      },
      {
        id: '3',
        name: 'Mike Chen',
        email: 'mike@example.com',
        role: 'staff',
        joinedDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
      },
    ];
    setTeamMembers(demoTeam);
    localStorage.setItem('vendorTeam', JSON.stringify(demoTeam));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'staff':
        return 'bg-green-100 text-green-800';
      case 'viewer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteMember = (id: string) => {
    if (id === '1') {
      alert('Cannot remove yourself from the team');
      return;
    }
    const updated = teamMembers.filter((m) => m.id !== id);
    setTeamMembers(updated);
    localStorage.setItem('vendorTeam', JSON.stringify(updated));
  };

  const filteredMembers =
    roleFilter === 'all' ? teamMembers : teamMembers.filter((m) => m.role === roleFilter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link to="/vendor-dashboard">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Team Members</h1>
            <p className="text-muted-foreground">Manage your team and collaborators</p>
          </div>
          <Button className="bg-travel-blue hover:bg-travel-blue/90">
            <Plus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full md:w-64 border rounded-lg p-2 text-sm"
            >
              <option value="all">All Members ({teamMembers.length})</option>
              <option value="manager">Managers ({teamMembers.filter((m) => m.role === 'manager').length})</option>
              <option value="staff">Staff ({teamMembers.filter((m) => m.role === 'staff').length})</option>
              <option value="viewer">Viewers ({teamMembers.filter((m) => m.role === 'viewer').length})</option>
            </select>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      {member.status === 'active' && (
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{member.email}</span>
                    </div>
                    <Badge className={`${getRoleColor(member.role)} capitalize`}>{member.role}</Badge>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mb-4 pb-4 border-b">
                  Joined {new Date(member.joinedDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
                <div className="flex gap-2">
                  {member.id !== '1' && (
                    <>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit2 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-red-600 hover:text-red-600"
                        onClick={() => handleDeleteMember(member.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {teamMembers.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-travel-blue">{teamMembers.length}</p>
                <p className="text-sm text-muted-foreground">Total Members</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-green-600">
                  {teamMembers.filter((m) => m.status === 'active').length}
                </p>
                <p className="text-sm text-muted-foreground">Active</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-travel-blue">
                  {teamMembers.filter((m) => m.role === 'manager').length}
                </p>
                <p className="text-sm text-muted-foreground">Managers</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-travel-blue">
                  {teamMembers.filter((m) => m.role === 'staff').length}
                </p>
                <p className="text-sm text-muted-foreground">Staff</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
