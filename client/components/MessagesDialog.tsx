import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquare, Bot } from "lucide-react";

interface Message {
  id: string;
  from: string;
  text: string;
  time?: string;
}

interface Conversation {
  id: string;
  title: string;
  participants: string[];
  messages: Message[];
  aiJoined?: boolean;
}

interface MessagesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const sampleConvos: Conversation[] = [
  { id: 'c1', title: 'Planning Japan Trip', participants: ['You','Maya'], messages: [{ id: 'm1', from: 'Maya', text: 'Should we do Kyoto or Tokyo first?' }], aiJoined: false },
  { id: 'c2', title: 'Family Reunion', participants: ['You','Sam','Lina'], messages: [{ id: 'm1', from: 'Sam', text: 'I prefer a beach.' }], aiJoined: false },
];

export default function MessagesDialog({ open, onOpenChange }: MessagesDialogProps) {
  const [convos, setConvos] = useState<Conversation[]>(sampleConvos);
  const [active, setActive] = useState<string | null>(convos[0]?.id || null);
  const [input, setInput] = useState('');

  const activeConvo = convos.find(c => c.id === active) || null;

  const send = () => {
    if (!activeConvo || !input.trim()) return;
    const m: Message = { id: String(Date.now()), from: 'You', text: input.trim() };
    setConvos(convos.map(c => c.id === activeConvo.id ? { ...c, messages: [...c.messages, m] } : c));
    setInput('');
  };

  const inviteAI = (convoId: string) => {
    setConvos(convos.map(c => c.id === convoId ? { ...c, aiJoined: true, messages: [...c.messages, { id: 'ai-' + Date.now(), from: 'TripPlannerAI', text: 'Hi — I joined this conversation to help with itinerary suggestions.' }] } : c));
    alert('Trip Planner AI invited to the conversation. It will follow the chat and can help generate itineraries.');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Messages</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3">
          <div className="col-span-1">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">Conversations</div>
              <Button variant="ghost" onClick={() => { setConvos([...convos, { id: 'c'+Date.now(), title: 'New Conversation', participants: ['You'], messages: [] }]); }}>New</Button>
            </div>
            <div className="flex flex-col gap-2">
              {convos.map(c => (
                <div key={c.id} onClick={() => setActive(c.id)} className={`p-2 rounded-md cursor-pointer ${active === c.id ? 'bg-black text-white' : 'bg-white'}`}>
                  <div className="font-medium">{c.title}</div>
                  <div className="text-xs text-muted-foreground">{c.participants.join(', ')}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-2">
            {!activeConvo && <div className="text-sm text-muted-foreground">Select a conversation to view messages.</div>}
            {activeConvo && (
              <div className="flex flex-col h-[60vh]">
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {activeConvo.messages.map(m => (
                    <div key={m.id} className={`p-2 rounded-md ${m.from === 'You' ? 'bg-cta-lemon self-end' : 'bg-gray-100 self-start'}`}>{m.from}: {m.text}</div>
                  ))}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <input value={input} onChange={e => setInput(e.target.value)} placeholder="Write a message" className="flex-1 border rounded-md p-2" />
                  <Button onClick={send}>Send</Button>
                  {!activeConvo.aiJoined && <Button variant="outline" onClick={() => inviteAI(activeConvo.id)} className="ml-2"><Bot className="h-4 w-4 mr-1" />Invite AI</Button>}
                  {activeConvo.aiJoined && <div className="text-xs text-muted-foreground flex items-center gap-1"><Bot className="h-4 w-4" /> Trip Planner AI is in this chat</div>}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
