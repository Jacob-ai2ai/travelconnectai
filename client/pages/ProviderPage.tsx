import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Play } from 'lucide-react';
import { SAMPLE_EXPERIENCES } from './ExperiencePage';
import InventoryForm from '@/components/inventory/InventoryForm';
import CalendarEditor from '@/components/inventory/CalendarEditor';

export default function ProviderPage(){
  const { providerId } = useParams();
  // find provider by scanning SAMPLE_EXPERIENCES
  const experiences = SAMPLE_EXPERIENCES.filter(e => e.host?.id === providerId);
  const provider = experiences[0]?.host || null;

  if(!provider) return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto">
        <Card>
          <CardContent>
            <div className="text-center">Provider not found</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const averageRating = Number((experiences.reduce((s, e) => s + (e.rating||0), 0) / Math.max(1, experiences.length)).toFixed(1));

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="container mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-muted"><img src={provider.avatar} alt={provider.name} className="w-full h-full object-cover" /></div>
            <div>
              <div className="text-2xl font-bold">{provider.name}</div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground"><Star className="h-4 w-4 text-yellow-400" />{averageRating} • {experiences.length} experiences</div>
              <div className="text-sm text-muted-foreground mt-2">{provider.about}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={()=> alert('Start chat with provider')}>Chat</Button>
            <Button variant="outline" onClick={()=> alert('Request live demo')}>Request Live Demo</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <main className="md:col-span-2">
            <Card className="mb-4">
              <CardHeader>
                <div className="text-sm font-semibold">About</div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">{provider.about}</div>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Upcoming live streams</h4>
                  <div className="space-y-2">
                    {experiences.filter(e=>e.isLiveDemo).length === 0 && <div className="text-sm text-muted-foreground">No upcoming live streams</div>}
                    {experiences.filter(e=>e.isLiveDemo).map(e => (
                      <div key={e.id} className="flex items-center justify-between border rounded p-2">
                        <div>
                          <div className="font-medium">{e.name}</div>
                          <div className="text-xs text-muted-foreground">{e.startDate ? new Date(e.startDate).toLocaleString() : 'TBA'}</div>
                        </div>
                        <div>
                          <Button size="sm" onClick={() => window.open(`/live/${e.id}`, '_blank')}><Play className="h-4 w-4 mr-1 inline"/>Join</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Running offers</h4>
                  <div className="text-sm text-muted-foreground">No active offers</div>
                </div>

              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="text-sm font-semibold">Experiences by {provider.name}</div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {experiences.map(e=> (
                    <div key={e.id} className="flex items-center justify-between border rounded p-3">
                      <div>
                        <div className="font-medium"><Link to={`/experience/${e.id}`}>{e.name}</Link></div>
                        <div className="text-xs text-muted-foreground">${e.price} • {e.duration}</div>
                      </div>
                      <div>
                        <Link to={`/experience/${e.id}`}><Button size="sm">View</Button></Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </main>

          <aside>
            <Card>
              <CardHeader>
                <div className="text-sm font-semibold">Testimonials</div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">No testimonials yet.</div>
              </CardContent>
            </Card>
          </aside>
        </div>

      </div>
    </div>
  );
}
