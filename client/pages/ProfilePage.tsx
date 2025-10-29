import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plane, Map, Users, Play, Video, Bell, Image as ImageIcon, Edit3 } from 'lucide-react';

type User = { id?: string; email?: string; username?: string };

type Post = {
  id: string;
  author: string;
  authorId?: string;
  content?: string;
  image?: string;
  video?: string;
  scheduledAt?: string;
  createdAt: string;
  likes?: string[]; // user ids
  comments?: { id: string; user: string; text: string; createdAt: string }[];
};

function uid(prefix = ''){ return prefix + Math.random().toString(36).slice(2,9); }

export default function ProfilePage(){
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(()=>{
    const raw = localStorage.getItem('user');
    if(raw) setUser(JSON.parse(raw));
    const rawPosts = localStorage.getItem('posts');
    if(rawPosts) setPosts(JSON.parse(rawPosts));
    else {
      // seed with sample posts from other users so feed isn't empty
      const seeded = generateSamplePosts(8, 0);
      setPosts(seeded);
      // store initial seed
      localStorage.setItem('posts', JSON.stringify(seeded));
    }
  },[]);

  useEffect(()=>{
    localStorage.setItem('posts', JSON.stringify(posts));
  },[posts]);

  function createPost(p: any){
    const newPost: Post = {
      id: uid('post-'),
      author: user?.username || user?.email || 'You',
      authorId: user?.id,
      content: p.content,
      image: p.image,
      video: p.video,
      scheduledAt: p.scheduledAt,
      createdAt: new Date().toISOString(),
      likes: [],
      comments: []
    };
    setPosts(prev => [newPost, ...prev]);
  }

  function toggleLike(postId: string){
    const userId = user?.id || 'anon';
    setPosts(prev => prev.map(post => {
      if(post.id !== postId) return post;
      const liked = post.likes?.includes(userId);
      return { ...post, likes: liked ? post.likes?.filter(l=> l !== userId) : [...(post.likes||[]), userId] } as Post;
    }));
  }

  function addComment(postId: string, text: string){
    const author = user?.username || user?.email || 'You';
    setPosts(prev => prev.map(post => {
      if(post.id !== postId) return post;
      return { ...post, comments: [...(post.comments||[]), { id: uid('c-'), user: author, text, createdAt: new Date().toISOString() }] } as Post;
    }));
  }

  // Stories / friends live strip sample data
  const [stories] = useState(() => [
    { id: 'f1', name: 'Ava', avatar: 'https://i.pravatar.cc/150?img=1', isLive: true, hasStory: true },
    { id: 'f2', name: 'Liam', avatar: 'https://i.pravatar.cc/150?img=2', isLive: false, hasStory: true },
    { id: 'f3', name: 'Mia', avatar: 'https://i.pravatar.cc/150?img=3', isLive: false, hasStory: false },
    { id: 'f4', name: 'Noah', avatar: 'https://i.pravatar.cc/150?img=4', isLive: false, hasStory: true },
    { id: 'f5', name: 'Olivia', avatar: 'https://i.pravatar.cc/150?img=5', isLive: true, hasStory: true },
  ]);
  const storiesRef = useRef<HTMLDivElement | null>(null);
  const isVendor = (user as any)?.role === 'vendor';
  const extraVendorStories = isVendor ? Array.from({length:6}).map((_,i)=>({ id:`v${i+1}`, name:`Live ${i+1}`, avatar:`https://i.pravatar.cc/150?img=${6+i}`, isLive:true, hasStory:true })) : [];
  const displayedStories = [...stories, ...extraVendorStories];
  function scrollStories(){ if(storiesRef.current) storiesRef.current.scrollBy({ left: 220, behavior: 'smooth' }); }
  function scrollStoriesLeft(){ if(storiesRef.current) storiesRef.current.scrollBy({ left: -220, behavior: 'smooth' }); }

  // Infinite scroll / load more posts
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const sampleIndexRef = useRef(0);
  function generateSamplePosts(count:number, start = 0){
    const authors = ['Maya','Carlos','Priya','Luka','Yara','Sam','Nina','Omar','Hana','Jon'];
    return Array.from({length: count}).map((_,i)=>({
      id: uid('sample-') + (start+i),
      author: authors[(start+i) % authors.length],
      content: `This is a sample post #${start+i+1} about a recent trip and some quick highlights.`,
      image: (i % 3 === 0) ? `https://picsum.photos/seed/${start+i}/800/400` : undefined,
      createdAt: new Date(Date.now() - (start+i)*1000*60*60).toISOString(),
      likes: [],
      comments: []
    }));
  }

  useEffect(()=>{
    const el = loadMoreRef.current;
    if(!el) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          // append more sample posts
          const next = generateSamplePosts(4, sampleIndexRef.current);
          sampleIndexRef.current += next.length;
          setPosts(prev => [...prev, ...next]);
        }
      });
    }, { root: null, rootMargin: '200px', threshold: 0.1 });
    obs.observe(el);
    return ()=> obs.disconnect();
  }, []);

  const [bio, setBio] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      const u = raw ? JSON.parse(raw) : null;
      return u?.bio || '';
    } catch { return ''; }
  });
  const [editingBio, setEditingBio] = useState(false);

  function ActionIcon({ to, Icon, label }:{ to:string; Icon:any; label:string }){
    return (
      <Link to={to} className="flex flex-col items-center text-center text-sm text-muted-foreground w-20">
        <div className="p-3 rounded-md bg-white shadow flex items-center justify-center"><Icon className="h-5 w-5" /></div>
        <div className="mt-1">{label}</div>
      </Link>
    );
  }

  function saveBio(){
    setEditingBio(false);
    const raw = localStorage.getItem('user');
    let u = raw ? JSON.parse(raw) : {};
    u.bio = bio;
    localStorage.setItem('user', JSON.stringify(u));
    setUser(u);
  }

  return (
    <div className="min-h-screen p-2 bg-background">
      <header className="border-b bg-sky-400 text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-1 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-gradient-to-br from-travel-blue to-travel-purple rounded-md flex items-center justify-center">
              <Plane className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold">Traveltheworld.ai</span>
          </div>
          <nav className="hidden md:flex items-center space-x-4 text-sm">
            <Link to="/stays" className="text-white/90 hover:text-white transition-colors">Stays</Link>
            <Link to="/flights" className="text-white/90 hover:text-white transition-colors">Flights</Link>
            <Link to="/xperiences" className="text-white/90 hover:text-white transition-colors">Xperiences</Link>
            <Link to="/events" className="text-white/90 hover:text-white transition-colors">Events</Link>
            <Link to="/essentials" className="text-white/90 hover:text-white transition-colors">Essentials</Link>
            <Link to="/ai-planner"><Button variant="default" className="text-sm py-1 px-2 bg-[#f5a623] text-black">Plan</Button></Link>
          </nav>
        </div>
      </header>
      <div className="h-4" />

      <div className="max-w-7xl mx-auto px-6">


        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <Card>
              <CardHeader>
                <div className="text-sm font-semibold">Traveler Profile</div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-muted mb-3 flex items-center justify-center text-2xl font-bold text-white">{(user?.username || user?.email || 'U').toString().slice(0,2).toUpperCase()}</div>
                  <div className="font-medium">{user?.username || 'Demo'}</div>

                  {!editingBio ? (
                    <div className="text-sm text-muted-foreground mt-2">{bio || <em className="text-muted-foreground">Add a short bio about yourself</em>}</div>
                  ) : (
                    <div className="mt-2 w-full">
                      <textarea className="w-full border rounded p-2" value={bio} onChange={e=> setBio(e.target.value)} />
                      <div className="mt-2 flex gap-2">
                        <Button size="sm" onClick={saveBio}>Save</Button>
                        <Button size="sm" variant="outline" onClick={()=> setEditingBio(false)}>Cancel</Button>
                      </div>
                    </div>
                  )}

                  <div className="w-full mt-4">
                    <Button className="w-full" onClick={()=> setEditingBio(true)}><Edit3 className="mr-2 h-4 w-4"/>Edit Profile</Button>
                  </div>

                </div>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <div className="text-sm font-semibold">Quick Links</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link to="/my/login-security">Login &amp; security</Link></li>
                  <li><Link to="/my/travel-preferences">Travel preferences</Link></li>
                  <li><Link to="/my/payment-info">Payment information</Link></li>
                  <li><Link to="/my/wallet">Wallet &amp; Rewards</Link></li>
                </ul>
              </CardContent>
            </Card>
          </aside>

          {/* Main feed & Suggestions area */}
          <div className="md:col-start-2 md:col-span-3">
            <div className="grid md:grid-cols-3 gap-6">
              <main className="md:col-span-2">
                <Card className="mb-4">
                  <CardContent>
                    <div className="mt-3 mb-2">
                      <div className="flex items-center gap-6 justify-start">
                        <ActionIcon to="/my/notifications" Icon={Bell} label="Notifications" />
                        <ActionIcon to="/my/trips" Icon={Map} label="Trips" />
                        <ActionIcon to="/my/friends" Icon={Users} label="Friends" />
                        <ActionIcon to="/my/videos" Icon={Play} label="Reels" />
                        <ActionIcon to="/my/media" Icon={ImageIcon} label="Media" />
                      </div>

                      <div className="mt-4 overflow-x-auto relative">
                        <button type="button" onClick={scrollStoriesLeft} className="absolute -left-8 top-1/2 -translate-y-1/2 bg-white/90 text-gray-800 rounded-full p-3 shadow z-10">&lt;</button>
                        <div ref={storiesRef} className="flex items-center gap-4 overflow-x-auto whitespace-nowrap py-2">
                          {displayedStories.map(s => (
                            <div key={s.id} className="flex flex-col items-center w-20 inline-block">
                              <div className={`w-14 h-14 rounded-full overflow-hidden flex items-center justify-center ${s.isLive ? 'ring-2 ring-red-500' : s.hasStory ? 'ring-2 ring-yellow-400' : ''}`}>
                                <img src={s.avatar} alt={s.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="text-xs text-center mt-1">{s.name}</div>
                            </div>
                          ))}
                        </div>
                        <button type="button" onClick={scrollStories} className="absolute -right-8 top-1/2 -translate-y-1/2 bg-white/90 text-gray-800 rounded-full p-3 shadow z-10">&gt;</button>
                      </div>

                    </div>
                  </CardContent>
                </Card>

                {/* Separate Create Post card */}
                <Card className="mb-4">
                  <CardContent>
                    <PostComposer onPost={createPost} />
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  {posts.map(post => (
                    <Card key={post.id}>
                      <CardContent>
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-white font-semibold">{post.author.slice(0,2).toUpperCase()}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="font-medium">{post.author}</div>
                              <div className="text-xs text-muted-foreground">{post.scheduledAt ? `Scheduled: ${new Date(post.scheduledAt).toLocaleString()}` : new Date(post.createdAt).toLocaleString()}</div>
                            </div>

                            {post.content && <div className="mt-2 text-sm">{post.content}</div>}
                            {post.image && <img src={post.image} alt="post" className="mt-2 max-h-64 w-full object-cover rounded" />}
                            {post.video && (
                              <div className="mt-2">
                                <video controls src={post.video} className="w-full rounded max-h-64" />
                              </div>
                            )}

                            <div className="mt-3 flex items-center gap-3 text-sm">
                              <button onClick={() => toggleLike(post.id)} className="text-muted-foreground">{post.likes && post.likes.length > 0 ? `❤ ${post.likes.length}` : 'Like'}</button>
                              <CommentSection post={post} onAdd={(text)=> addComment(post.id, text)} />
                            </div>

                            {post.comments && post.comments.length > 0 && (
                              <div className="mt-3 space-y-2">
                                {post.comments.map(c => (
                                  <div key={c.id} className="text-sm border rounded p-2">
                                    <div className="text-xs text-muted-foreground">{c.user} • {new Date(c.createdAt).toLocaleString()}</div>
                                    <div className="mt-1">{c.text}</div>
                                  </div>
                                ))}
                              </div>
                            )}

                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <div ref={loadMoreRef} className="h-6" />
                </div>
              </main>

              <aside className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <div className="text-sm font-semibold">Suggestions</div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">People you may know and experiences to try.</div>
                  </CardContent>
                </Card>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostComposer({ onPost }:{ onPost: (p: any)=>void }){
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [video, setVideo] = useState('');
  const [showAddOptions, setShowAddOptions] = useState(false);

  function submit(scheduledAt?: string){
    if(!text && !image && !video) return alert('Please add some content');
    onPost({ content: text, image: image || undefined, video: video || undefined, scheduledAt });
    setText(''); setImage(''); setVideo('');
    setShowAddOptions(false);
  }

  function schedule(){
    const when = window.prompt('Enter schedule datetime (YYYY-MM-DD HH:MM) in your local time');
    if(!when) return;
    // basic parse
    const dt = new Date(when.replace(' ', 'T'));
    if(isNaN(dt.getTime())) return alert('Invalid date format');
    submit(dt.toISOString());
  }

  return (
    <div>
      <div className="mt-3 mb-2 relative">
        <textarea className="w-full h-auto border rounded p-2" value={text} onChange={e=> setText(e.target.value)} placeholder="Share a status or photo..." />
        <button type="button" onClick={() => setShowAddOptions(s => !s)} className="absolute right-2 bottom-2 bg-[#1a8ab3] text-white rounded-full w-8 h-8 flex items-center justify-center">+</button>
      </div>

      {showAddOptions && (
        <div className="mb-2 flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1 border rounded"><ImageIcon className="h-4 w-4"/> Photo</button>
          <button className="flex items-center gap-2 px-3 py-1 border rounded"><Play className="h-4 w-4"/> Reel</button>
          <button className="flex items-center gap-2 px-3 py-1 border rounded"><Video className="h-4 w-4"/> Video</button>
          <button className="flex items-center gap-2 px-3 py-1 border rounded"><Map className="h-4 w-4"/> Trip</button>
          <button className="flex items-center gap-2 px-3 py-1 border rounded"><Map className="h-4 w-4"/> Itinerary</button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2" />
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={schedule} variant="outline">Schedule</Button>
          <Button onClick={() => submit()}>Post</Button>
        </div>
      </div>
    </div>
  );
}

function CommentSection({ post, onAdd }:{ post: Post; onAdd: (text:string)=>void }){
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');

  return (
    <div>
      <button className="text-muted-foreground" onClick={()=> setOpen(!open)}>{open ? 'Hide' : 'Comment'}</button>
      {open && (
        <div className="mt-2">
          <input className="border rounded p-2 w-full" placeholder="Write a comment..." value={text} onChange={e=> setText(e.target.value)} />
          <div className="mt-2 flex justify-end">
            <Button onClick={()=> { if(text.trim()){ onAdd(text.trim()); setText(''); } }}>Add</Button>
          </div>
        </div>
      )}
    </div>
  );
}
