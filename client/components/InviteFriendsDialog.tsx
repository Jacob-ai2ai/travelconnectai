import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface InviteFriendsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInviteComplete?: (participants: string[]) => void;
}

export default function InviteFriendsDialog({ open, onOpenChange, onInviteComplete }: InviteFriendsDialogProps) {
  const [list, setList] = useState<string[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('invitedParticipants');
      if (raw) setList(JSON.parse(raw));
    } catch (e) {}
  }, []);

  useEffect(() => {
    localStorage.setItem('invitedParticipants', JSON.stringify(list));
  }, [list]);

  const add = () => {
    const v = input.trim();
    if (!v) return;
    // simple normalization: accept email or name
    if (!list.includes(v)) setList(prev => [...prev, v]);
    setInput('');
  };

  const remove = (v: string) => setList(prev => prev.filter(x => x !== v));

  const confirm = () => {
    if (onInviteComplete) onInviteComplete(list);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto mx-4">
        <DialogHeader>
          <DialogTitle>Invite Friends</DialogTitle>
        </DialogHeader>

        <div className="p-3">
          <div className="flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="Enter name or email and press Add" className="flex-1 border rounded-md p-2" />
            <Button onClick={add}>Add</Button>
          </div>

          <div className="mt-3">
            {list.length === 0 && <div className="text-sm text-muted-foreground">No participants added yet.</div>}
            <div className="flex flex-col gap-2 mt-2">
              {list.map(p => (
                <div key={p} className="flex items-center justify-between bg-white rounded-md p-2">
                  <div className="text-sm">{p}</div>
                  <Button variant="ghost" onClick={() => remove(p)}>Remove</Button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={confirm}>Invite {list.length > 0 && `(${list.length})`}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
