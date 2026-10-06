"use client";

import { X, Search, Settings, Link as LinkIcon, Sparkles } from "lucide-react";
import Image from "next/image";

import { useState } from "react";

export const ShareDialog = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [inviteEmail, setInviteEmail] = useState("");
  const [accessList, setAccessList] = useState([
    { id: 1, name: "Dev team team (4)", role: "Editor", initials: "DT", color: "bg-rose-600" }
  ]);

  if (!isOpen) return null;

  const handleInvite = () => {
    if (inviteEmail.trim() && inviteEmail.includes("@")) {
      const initials = inviteEmail.substring(0, 2).toUpperCase();
      setAccessList([
        ...accessList,
        { id: Date.now(), name: inviteEmail, role: "Viewer", initials, color: "bg-emerald-600" }
      ]);
      setInviteEmail("");
    }
  };

  const handleRemoveAccess = (id: number) => {
    setAccessList(accessList.filter(user => user.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
      <div 
        className="bg-card rounded-xl shadow-2xl w-[480px] max-w-full overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-border flex justify-between items-center">
          <div className="flex gap-6">
            <button className="pb-1 text-sm font-semibold border-b-2 border-blue-600 text-foreground px-2">Invite</button>
            <button className="pb-1 text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2 px-2">
              AI <Sparkles className="w-3 h-3 text-purple-500" />
            </button>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-muted/50 rounded-md">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          <div className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Enter emails or team name..." 
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleInvite();
                }}
              />
            </div>
            <button 
              onClick={handleInvite}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-md text-sm font-medium transition-colors"
            >
              Invite
            </button>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-muted-foreground tracking-wider mb-3">BOARD ACCESS</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                    SR
                  </div>
                  <span className="text-sm font-medium text-foreground">You're the board owner</span>
                </div>
                <span className="text-sm text-muted-foreground">Owner</span>
              </div>

              {accessList.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${user.color} rounded-md flex items-center justify-center text-white font-semibold text-xs`}>
                      {user.initials}
                    </div>
                    <span className="text-sm font-medium text-foreground">{user.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{user.role}</span>
                    <button onClick={() => handleRemoveAccess(user.id)} className="text-xs text-rose-500 hover:text-rose-700 font-medium">Remove</button>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted/50 rounded-full flex items-center justify-center text-muted-foreground">
                    <span className="text-xs">🌐</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">Anyone with the link</span>
                </div>
                <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                  No access <span className="text-[10px]">▼</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border bg-muted flex items-center justify-between">
          <button className="flex items-center gap-2 text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors">
            <LinkIcon className="w-4 h-4" />
            Copy board link
          </button>
          
          <button className="flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground transition-colors">
            Sharing settings <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
