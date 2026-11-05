"use client";

import { useState, useEffect } from "react";
import { 
  Share2, 
  Copy, 
  Check, 
  X, 
  Users, 
  Shield, 
  Eye, 
  Edit3, 
  Crown, 
  Trash2, 
  Mail, 
  Globe, 
  Lock,
  ChevronDown
} from "lucide-react";

export interface BoardCollaborator {
  id: string;
  email: string;
  name: string;
  role: "owner" | "editor" | "viewer";
  avatar?: string;
  invitedAt: string;
  status: "active" | "pending";
}

interface BoardShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleId: string;
  roleTitle?: string;
}

export function BoardShareModal({ isOpen, onClose, roleId, roleTitle }: BoardShareModalProps) {
  const [collaborators, setCollaborators] = useState<BoardCollaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"viewer" | "editor" | "owner">("editor");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [linkAccess, setLinkAccess] = useState<"team" | "public">("team");

  // Fetch collaborators
  useEffect(() => {
    if (!isOpen || !roleId) return;
    setLoading(true);
    fetch(`/api/boards/${roleId}/share`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.collaborators)) {
          setCollaborators(data.collaborators);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isOpen, roleId]);

  if (!isOpen) return null;

  const currentUrl = typeof window !== "undefined" ? window.location.href.split("?")[0] : "";
  const shareableUrl = `${currentUrl}?role=${inviteRole}`;

  const copyToClipboard = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(shareableUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteEmail.includes("@")) {
      setError("Please enter a valid work email address.");
      return;
    }
    setError("");
    setSending(true);
    try {
      const res = await fetch(`/api/boards/${roleId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail.trim(),
          role: inviteRole,
          name: inviteEmail.split("@")[0],
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCollaborators(data.collaborators || [...collaborators, data.collaborator]);
        setInviteEmail("");
        setSuccessMsg(`Invitation sent to ${inviteEmail} as ${inviteRole.toUpperCase()}`);
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setError(data.error || "Failed to invite teammate");
      }
    } catch {
      setError("Network error sending invite.");
    } finally {
      setSending(false);
    }
  };

  const handleRoleChange = async (email: string, nextRole: "owner" | "editor" | "viewer") => {
    try {
      const res = await fetch(`/api/boards/${roleId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: nextRole }),
      });
      const data = await res.json();
      if (data.success && data.collaborators) {
        setCollaborators(data.collaborators);
      }
    } catch (err) {
      console.error("Failed to update role:", err);
    }
  };

  const handleRemove = async (email: string) => {
    try {
      const res = await fetch(`/api/boards/${roleId}/share?email=${encodeURIComponent(email)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setCollaborators((prev) => prev.filter((c) => c.email !== email));
      }
    } catch (err) {
      console.error("Failed to remove teammate:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150 font-sans">
      <div 
        className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Share2 className="size-4.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Share Requisition Board
              </h3>
              <p className="text-xs text-slate-500">
                {roleTitle || "Active Pipeline"} · Manage team member access
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Invite by Email */}
        <form onSubmit={handleInvite} className="mt-5 space-y-2">
          <label className="block text-xs font-semibold text-slate-700">
            Invite Teammates or Hiring Managers
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="email"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all shadow-2xs"
              />
            </div>

            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as any)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50 cursor-pointer shadow-2xs"
            >
              <option value="viewer">Can View</option>
              <option value="editor">Can Edit</option>
              <option value="owner">Admin / Owner</option>
            </select>

            <button
              type="submit"
              disabled={sending}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-xs font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-50 shrink-0"
            >
              {sending ? "Sending..." : "Invite"}
            </button>
          </div>

          {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
          {successMsg && <p className="text-xs text-emerald-600 font-medium">{successMsg}</p>}
        </form>

        {/* Copy Shareable Link Box */}
        <div className="mt-5 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
              <Globe className="size-3.5 text-blue-600" />
              <span>Direct Link Sharing</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Permission: {inviteRole.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareableUrl}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-600 outline-none select-all"
            />
            <button
              type="button"
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 transition-all shadow-2xs cursor-pointer shrink-0"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5 text-slate-500" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Active Members Table */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Users className="size-3.5 text-slate-400" />
              <span>People with access ({collaborators.length})</span>
            </span>
          </div>

          <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
            {collaborators.map((collab) => {
              const isOwner = collab.role === "owner";
              return (
                <div
                  key={collab.id || collab.email}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white p-3 hover:border-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 text-white font-bold text-xs uppercase shadow-2xs">
                      {collab.name?.charAt(0) || collab.email.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {collab.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate font-mono">
                        {collab.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={collab.role}
                      onChange={(e) => handleRoleChange(collab.email, e.target.value as any)}
                      className="rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1 text-xs font-medium text-slate-700 outline-none hover:bg-white cursor-pointer"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                      <option value="owner">Owner</option>
                    </select>

                    {!isOwner && (
                      <button
                        type="button"
                        onClick={() => handleRemove(collab.email)}
                        title="Remove access"
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Lock className="size-3.5 text-slate-400" />
            <span>Encrypted access control · Role-based permissions</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
