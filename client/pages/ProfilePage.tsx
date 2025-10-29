import React, { useEffect, useState } from 'react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type User = { id?: string; email?: string; username?: string };

type Post = {
  id: string;
  author: string;
  authorId?: string;
  content?: string;
  image?: string;
  video?: string;
  isBlog?: boolean;
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
  },[]);

  useEffect(()=>{
    localStorage.setItem('posts', JSON.stringify(posts));
  },[posts]);

  function createPost(p: Omit<Post,'id'|'author'|'authorId'|'createdAt'|'likes'|'comments'>){
    const newPost: Post = {
      id: uid('post-'),
      author: user?.username || user?.email || 'You',
      authorId: user?.id,
      content: p.content,
      image: p.image,
      video: p.video,
      isBlog: !!p.isBlog,
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

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <Card>
              <CardHeader>
                <div className="text-sm font-semibold">{user?.username || 'Profile'}</div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-muted mb-3 flex items-center justify-center text-2xl font-bold text-white">{(user?.username || user?.email || 'U').toString().slice(0,2).toUpperCase()}</div>
                  <div className="font-medium">{user?.username || user?.email}</div>
                  <div className="text-sm text-muted-foreground mt-2">Member since 2025</div>

                  <div className="w-full mt-4">
                    <Button className="w-full mb-2">Edit Profile</Button>
                    <Button variant="outline" className="w-full">Account Settings</Button>
                  </div>

                  <div className="mt-6 w-full">
                    <h4 className="font-semibold mb-2">Buddies</h4>
                    <div className="text-sm text-muted-foreground">Connect with friends here.</div>
                    <div className="mt-2">
                      <Button size="sm" className="w-full">View Buddies</Button>
                    </div>
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
                  <li><Link to="/my/profile">Personal information</Link></li>
                  <li><Link to="/my/settings">Site preferences</Link></li>
                  <li><Link to="/my/buddies">Buddies</Link></li>
                </ul>
              </CardContent>
            </Card>
          </aside>

          {/* Feed */}
          <main className="md:col-span-2">
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
                          <div className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleString()}</div>
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

                        {/* comments */}
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
            </div>

          </main>

          {/* Right side suggestions */}
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
  );
}

function PostComposer({ onPost }:{ onPost: (p: any)=>void }){
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [video, setVideo] = useState('');
  const [isBlog, setIsBlog] = useState(false);

  function submit(){
    if(!text && !image && !video) return alert('Please add some content');
    onPost({ content: text, image: image || undefined, video: video || undefined, isBlog });
    setText(''); setImage(''); setVideo(''); setIsBlog(false);
  }

  return (
    <div>
      <div className="mb-2">
        <textarea className="w-full border rounded p-2" value={text} onChange={e=> setText(e.target.value)} placeholder="Share a status, photo, or blog post..." />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Input placeholder="Image URL" value={image} onChange={e=> setImage(e.target.value)} />
        <Input placeholder="Video URL" value={video} onChange={e=> setVideo(e.target.value)} />
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={isBlog} onChange={e=> setIsBlog(e.target.checked)} /> Post as blog</label>
        </div>
        <div>
          <Button onClick={submit}>Post</Button>
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
