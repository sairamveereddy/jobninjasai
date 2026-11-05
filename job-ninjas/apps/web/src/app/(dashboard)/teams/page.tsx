"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Plus, 
  Briefcase, 
  Shield, 
  UserPlus, 
  Check, 
  X, 
  Trash2, 
  ExternalLink, 
  Lock, 
  Globe, 
  Mail, 
  Sparkles, 
  ChevronRight, 
  Loader2, 
  Settings,
  CheckCircle2,
  Building2,
  Edit3,
  Eye,
  Crown
} from "lucide-react";
import { Team, TeamMember, TeamBoardRef } from "@/app/api/teams/route";

export default function TeamsPage() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [activeTeamId, setActiveTeamId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);
  const [isManageAccessOpen, setIsManageAccessOpen] = useState(false);
  const [selectedBoardForAccess, setSelectedBoardForAccess] = useState<TeamBoardRef | null>(null);

  // Form states
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDomain, setNewTeamDomain] = useState("jobninjas.ai");
  const [newTeamDesc, setNewTeamDesc] = useState("");
  const [newTeamEmails, setNewTeamEmails] = useState("");

  const [memberEmail, setMemberEmail] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberRole, setMemberRole] = useState<"recruiter" | "hiring_manager" | "admin" | "interviewer">("recruiter");

  // Board creation form
  const [boardTitle, setBoardTitle] = useState("");
  const [boardDept, setBoardDept] = useState("Engineering");
  const [boardLocation, setBoardLocation] = useState("Remote (US/EU)");
  const [boardHM, setBoardHM] = useState("Hiring Lead");
  const [boardAccessRule, setBoardAccessRule] = useState<"all_team" | "selected_only">("all_team");
  const [selectedAllowedMembers, setSelectedAllowedMembers] = useState<string[]>([]);
  const [selectedEditors, setSelectedEditors] = useState<string[]>([]);
  const [boardCreating, setBoardCreating] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/teams");
      const data = await res.json();
      if (data.success && Array.isArray(data.teams)) {
        setTeams(data.teams);
        if (data.teams.length > 0 && !activeTeamId) {
          setActiveTeamId(data.teams[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load teams:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const activeTeam = teams.find((t) => t.id === activeTeamId) || teams[0];

  // Initialize member permissions when opening Create Board Modal
  useEffect(() => {
    if (activeTeam && isCreateBoardOpen) {
      const allEmails = activeTeam.members.map((m) => m.email);
      setSelectedAllowedMembers(allEmails);
      setSelectedEditors(allEmails);
    }
  }, [isCreateBoardOpen, activeTeam]);

  // Handle Create Team
  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName) return;

    try {
      const emailsArray = newTeamEmails
        .split(/[\n,;]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTeamName,
          domain: newTeamDomain,
          description: newTeamDesc,
          initialEmails: emailsArray,
        }),
      });

      const data = await res.json();
      if (data.success && data.team) {
        setTeams((prev) => [data.team, ...prev]);
        setActiveTeamId(data.team.id);
        setIsCreateTeamOpen(false);
        setNewTeamName("");
        setNewTeamDesc("");
        setNewTeamEmails("");
        showToast(`Team "${data.team.name}" created successfully!`);
      }
    } catch (err) {
      console.error("Failed to create team:", err);
    }
  };

  // Handle Add Member
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberEmail || !activeTeam) return;

    try {
      const res = await fetch("/api/teams", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_member",
          teamId: activeTeam.id,
          email: memberEmail.trim(),
          name: memberName.trim() || undefined,
          role: memberRole,
        }),
      });

      const data = await res.json();
      if (data.success) {
        fetchTeams();
        setIsAddMemberOpen(false);
        setMemberEmail("");
        setMemberName("");
        showToast(`Invited ${memberEmail} to ${activeTeam.name}`);
      }
    } catch (err) {
      console.error("Failed to add member:", err);
    }
  };

  // Handle Remove Member
  const handleRemoveMember = async (email: string) => {
    if (!activeTeam) return;
    try {
      const res = await fetch("/api/teams", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "remove_member",
          teamId: activeTeam.id,
          email,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchTeams();
        showToast(`Removed ${email} from team`);
      }
    } catch (err) {
      console.error("Failed to remove member:", err);
    }
  };

  // Handle Create Board under Team
  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardTitle || !activeTeam) return;

    setBoardCreating(true);
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_board",
          teamId: activeTeam.id,
          title: boardTitle,
          department: boardDept,
          location: boardLocation,
          hiringManager: boardHM,
          accessRule: boardAccessRule,
          allowedMembers: boardAccessRule === "all_team" ? activeTeam.members.map((m) => m.email) : selectedAllowedMembers,
          editors: boardAccessRule === "all_team" ? activeTeam.members.map((m) => m.email) : selectedEditors,
        }),
      });

      const data = await res.json();
      if (data.success && data.boardUrl) {
        setIsCreateBoardOpen(false);
        setBoardTitle("");
        showToast(`Board "${boardTitle}" created! Redirecting...`);
        router.push(data.boardUrl);
      }
    } catch (err) {
      console.error("Failed to create board:", err);
    } finally {
      setBoardCreating(false);
    }
  };

  // Handle Save Board Access Permissions
  const handleSaveBoardAccess = async () => {
    if (!activeTeam || !selectedBoardForAccess) return;

    try {
      const res = await fetch("/api/teams", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_board_access",
          teamId: activeTeam.id,
          roleId: selectedBoardForAccess.roleId,
          accessRule: boardAccessRule,
          allowedMembers: selectedAllowedMembers,
          editors: selectedEditors,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsManageAccessOpen(false);
        fetchTeams();
        showToast("Board access permissions updated!");
      }
    } catch (err) {
      console.error("Failed to update board access:", err);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "admin":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "hiring_manager":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "recruiter":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans space-y-6">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold tracking-wide uppercase border border-blue-200">
              <Users className="size-3" />
              Collaborative Workspaces
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Teams & Permission Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Organize recruiting squads, add people by email, and create boards with tailored view and edit rights.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsCreateTeamOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold text-xs shadow-sm shadow-blue-500/20 transition-all cursor-pointer active:scale-95"
          >
            <Plus className="size-3.5" />
            <span>Create New Team</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-sm font-medium">Loading teams and permission graph...</p>
        </div>
      ) : teams.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
          <div className="size-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <Users className="size-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No teams created yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Create your first hiring squad to collaborate with hiring managers, recruiters, and engineers on role boards.
          </p>
          <button
            type="button"
            onClick={() => setIsCreateTeamOpen(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors cursor-pointer"
          >
            + Create Team Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Team Switcher Left Sidebar */}
          <div className="lg:col-span-1 space-y-3">
            <span className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 px-1">
              Your Teams ({teams.length})
            </span>
            <div className="space-y-1.5">
              {teams.map((team) => {
                const isActive = team.id === (activeTeam?.id || "");
                return (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => setActiveTeamId(team.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isActive 
                        ? "bg-blue-50/80 border-blue-200 shadow-xs" 
                        : "bg-white border-slate-200/70 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <div className={`size-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                      isActive ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"
                    }`}>
                      {team.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-bold truncate ${isActive ? "text-blue-900" : "text-slate-800"}`}>
                        {team.name}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono truncate">
                        {team.domain} &bull; {team.members.length} members
                      </p>
                    </div>
                    {isActive && <ChevronRight className="size-4 text-blue-600 shrink-0 self-center" />}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setIsCreateTeamOpen(true)}
              className="w-full flex items-center justify-center gap-1.5 p-3 rounded-2xl border-2 border-dashed border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/40 text-slate-600 hover:text-blue-600 font-semibold text-xs transition-colors cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Add Another Team</span>
            </button>
          </div>

          {/* Active Team Workspace Details */}
          {activeTeam && (
            <div className="lg:col-span-3 space-y-6">
              
              {/* Team Banner Card */}
              <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-white via-slate-50/60 to-blue-50/30 p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="size-12 rounded-2xl bg-blue-600 text-white font-black text-lg flex items-center justify-center shadow-sm">
                      {activeTeam.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-black text-slate-900">{activeTeam.name}</h2>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 font-semibold">
                          @{activeTeam.domain}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{activeTeam.description || "Hiring workspace and agentic coordination team."}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddMemberOpen(true)}
                      className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                    >
                      <UserPlus className="size-3.5 text-blue-600" />
                      <span>Add Teammate</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCreateBoardOpen(true)}
                      className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm shadow-blue-500/20 transition-all cursor-pointer active:scale-95"
                    >
                      <Plus className="size-3.5" />
                      <span>Create Board</span>
                    </button>
                  </div>
                </div>

                {/* Team Quick Stats */}
                <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-200/60 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-mono uppercase">Squad Members</span>
                    <span className="font-bold text-slate-900 text-sm">{activeTeam.members.length} People</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-mono uppercase">Hiring Boards</span>
                    <span className="font-bold text-slate-900 text-sm">{activeTeam.boards.length} Active</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-mono uppercase">Created</span>
                    <span className="font-bold text-slate-900 text-sm">{new Date(activeTeam.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* SECTION 1: Team Members */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="size-4 text-blue-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Team Members & Email Access ({activeTeam.members.length})
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddMemberOpen(true)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="size-3.5" />
                    <span>Invite via Email</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                        <th className="pb-2.5 font-semibold">Member</th>
                        <th className="pb-2.5 font-semibold">Email</th>
                        <th className="pb-2.5 font-semibold">Role</th>
                        <th className="pb-2.5 font-semibold">Status</th>
                        <th className="pb-2.5 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeTeam.members.map((member) => (
                        <tr key={member.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 font-semibold text-slate-900 flex items-center gap-2.5">
                            <div className="size-7 rounded-lg bg-gradient-to-tr from-blue-600 to-sky-500 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                              {member.name ? member.name.slice(0, 2).toUpperCase() : member.email.slice(0, 2).toUpperCase()}
                            </div>
                            <span className="truncate">{member.name || member.email.split("@")[0]}</span>
                          </td>
                          <td className="py-3 font-mono text-slate-600">{member.email}</td>
                          <td className="py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getRoleBadge(member.role)}`}>
                              {member.role.replace("_", " ")}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                              <span className="size-1.5 rounded-full bg-emerald-500" />
                              Active
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            {member.role !== "owner" && (
                              <button
                                type="button"
                                onClick={() => handleRemoveMember(member.email)}
                                title="Remove member"
                                className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECTION 2: Team Boards & Requisitions */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="size-4 text-blue-600" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Hiring Boards & Access Rules ({activeTeam.boards.length})
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Boards created for this team. You can control which team members have access and edit permissions.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCreateBoardOpen(true)}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-xl font-semibold text-xs shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    <Plus className="size-3.5" />
                    <span>New Team Board</span>
                  </button>
                </div>

                {activeTeam.boards.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center bg-slate-50/50">
                    <Briefcase className="size-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-800">No boards created for this team yet</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Create a hiring board where you can specify who on the team can view and edit the pipeline.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsCreateBoardOpen(true)}
                      className="mt-3 px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      + Create First Board
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeTeam.boards.map((board) => {
                      const boardUrl = `/roles/${board.slug}/board`;
                      const isAllTeam = board.accessRule === "all_team";
                      return (
                        <div
                          key={board.roleId}
                          className="rounded-2xl border border-slate-200 bg-white hover:border-blue-200 hover:shadow-md transition-all p-4 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                                {board.department || "Engineering"}
                              </span>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                isAllTeam ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-purple-50 text-purple-700 border border-purple-200"
                              }`}>
                                <Lock className="size-2.5" />
                                {isAllTeam ? "All Team Access" : "Selective Access"}
                              </span>
                            </div>

                            <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                              {board.title}
                            </h4>
                            <p className="text-[11px] font-mono text-slate-400 mt-0.5 truncate">
                              /roles/{board.slug}/board
                            </p>

                            {/* Access info */}
                            <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                              <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1.5">
                                <span className="font-medium">Permissions:</span>
                                <span className="font-bold text-slate-900">
                                  {isAllTeam ? `All ${activeTeam.members.length} members can edit` : `${board.editors?.length || 0} Editors · ${(board.allowedMembers?.length || 0) - (board.editors?.length || 0)} Viewers`}
                                </span>
                              </div>

                              {/* Facepile */}
                              <div className="flex items-center -space-x-1.5">
                                {activeTeam.members
                                  .filter((m) => isAllTeam || (board.allowedMembers || []).includes(m.email))
                                  .slice(0, 5)
                                  .map((m, idx) => (
                                    <div
                                      key={m.id || idx}
                                      title={`${m.name} (${m.email})`}
                                      className="size-5 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white"
                                    >
                                      {m.name.slice(0, 1)}
                                    </div>
                                  ))}
                                {(board.allowedMembers?.length || 0) > 5 && (
                                  <span className="text-[10px] text-slate-400 pl-2">
                                    +{(board.allowedMembers?.length || 0) - 5} more
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedBoardForAccess(board);
                                setBoardAccessRule(board.accessRule);
                                setSelectedAllowedMembers(board.allowedMembers || []);
                                setSelectedEditors(board.editors || []);
                                setIsManageAccessOpen(true);
                              }}
                              className="text-xs font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
                            >
                              <Settings className="size-3" />
                              <span>Manage Access</span>
                            </button>

                            <Link
                              href={boardUrl}
                              className="flex items-center gap-1 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-xl transition-colors"
                            >
                              <span>Open Board</span>
                              <ExternalLink className="size-3" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      )}

      {/* MODAL 1: Create Team */}
      {isCreateTeamOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Building2 className="size-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Create New Team</h3>
              </div>
              <button onClick={() => setIsCreateTeamOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Team / Squad Name *</label>
                <input
                  required
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="e.g. Core AI Engineering Squad"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company Domain</label>
                <input
                  type="text"
                  value={newTeamDomain}
                  onChange={(e) => setNewTeamDomain(e.target.value)}
                  placeholder="e.g. jobninjas.ai"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newTeamDesc}
                  onChange={(e) => setNewTeamDesc(e.target.value)}
                  placeholder="Briefly describe this squad's hiring focus..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Invite Teammates by Email (comma or newline separated)
                </label>
                <textarea
                  rows={3}
                  value={newTeamEmails}
                  onChange={(e) => setNewTeamEmails(e.target.value)}
                  placeholder="sarah@company.com, rad@company.com"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 outline-none focus:border-blue-600 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateTeamOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm cursor-pointer"
                >
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Add Member via Email */}
      {isAddMemberOpen && activeTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <UserPlus className="size-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Add Team Member</h3>
                  <p className="text-[11px] text-slate-400">to {activeTeam.name}</p>
                </div>
              </div>
              <button onClick={() => setIsAddMemberOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Teammate Work Email *</label>
                <input
                  required
                  type="email"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 outline-none focus:border-blue-600 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name (optional)</label>
                <input
                  type="text"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="e.g. Jordan Lee"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Role in Team</label>
                <select
                  value={memberRole}
                  onChange={(e: any) => setMemberRole(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 outline-none focus:border-blue-600 bg-white"
                >
                  <option value="recruiter">Recruiter (Can create and edit boards)</option>
                  <option value="hiring_manager">Hiring Manager (Pipeline decision maker)</option>
                  <option value="admin">Team Admin (Full workspace permissions)</option>
                  <option value="interviewer">Interviewer (Review candidates & score)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddMemberOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm cursor-pointer"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Create Board with Member Access Control */}
      {isCreateBoardOpen && activeTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Briefcase className="size-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Create Hiring Board for Team</h3>
                  <p className="text-[11px] text-slate-400">Team: {activeTeam.name}</p>
                </div>
              </div>
              <button onClick={() => setIsCreateBoardOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBoard} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Requisition / Job Title *</label>
                <input
                  required
                  type="text"
                  value={boardTitle}
                  onChange={(e) => setBoardTitle(e.target.value)}
                  placeholder="e.g. Senior Autonomous Agent Developer"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-slate-900 outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={boardDept}
                    onChange={(e) => setBoardDept(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 outline-none focus:border-blue-600 bg-white"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Operations">Operations</option>
                    <option value="Design">Design</option>
                    <option value="Sales">Sales</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hiring Manager</label>
                  <input
                    type="text"
                    value={boardHM}
                    onChange={(e) => setBoardHM(e.target.value)}
                    placeholder="e.g. Rad Vance"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* ACCESS CONTROL RULE */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="block font-bold text-slate-800 text-xs">
                  Who can access and edit this board?
                </span>

                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="accessRule"
                      checked={boardAccessRule === "all_team"}
                      onChange={() => setBoardAccessRule("all_team")}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-semibold text-slate-800 block">All Team Members</span>
                      <span className="text-[11px] text-slate-500">Every member of this squad ({activeTeam.members.length} people) can access and edit.</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="accessRule"
                      checked={boardAccessRule === "selected_only"}
                      onChange={() => setBoardAccessRule("selected_only")}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-semibold text-slate-800 block">Selective Member Access</span>
                      <span className="text-[11px] text-slate-500">Choose specifically who has permission to view or edit this board.</span>
                    </div>
                  </label>
                </div>

                {/* SELECTIVE MEMBER CHECKLIST */}
                {boardAccessRule === "selected_only" && (
                  <div className="mt-3 pt-3 border-t border-slate-200 space-y-2 max-h-48 overflow-y-auto">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                      Select Member Permissions:
                    </span>
                    {activeTeam.members.map((member) => {
                      const isAllowed = selectedAllowedMembers.includes(member.email);
                      const isEditor = selectedEditors.includes(member.email);
                      return (
                        <div key={member.id} className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 text-xs">
                          <label className="flex items-center gap-2 cursor-pointer min-w-0">
                            <input
                              type="checkbox"
                              checked={isAllowed}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedAllowedMembers([...selectedAllowedMembers, member.email]);
                                } else {
                                  setSelectedAllowedMembers(selectedAllowedMembers.filter((em) => em !== member.email));
                                  setSelectedEditors(selectedEditors.filter((em) => em !== member.email));
                                }
                              }}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900 truncate">{member.name || member.email}</p>
                              <p className="text-[10px] text-slate-400 font-mono truncate">{member.email}</p>
                            </div>
                          </label>

                          {isAllowed && (
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  if (isEditor) {
                                    setSelectedEditors(selectedEditors.filter((em) => em !== member.email));
                                  } else {
                                    setSelectedEditors([...selectedEditors, member.email]);
                                  }
                                }}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                                  isEditor ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-slate-50 text-slate-600 border-slate-200"
                                }`}
                              >
                                {isEditor ? "Can Edit" : "View Only"}
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateBoardOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={boardCreating}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {boardCreating ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>Creating Board...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-3.5" />
                      <span>Create & Launch Board</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Manage Existing Board Access */}
      {isManageAccessOpen && activeTeam && selectedBoardForAccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Manage Board Permissions</h3>
                <p className="text-[11px] text-slate-500">{selectedBoardForAccess.title}</p>
              </div>
              <button onClick={() => setIsManageAccessOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-4 pt-4 text-xs">
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="editAccessRule"
                    checked={boardAccessRule === "all_team"}
                    onChange={() => setBoardAccessRule("all_team")}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-semibold text-slate-800 block">All Team Members</span>
                    <span className="text-[11px] text-slate-500">Every member of {activeTeam.name} can access and edit.</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="editAccessRule"
                    checked={boardAccessRule === "selected_only"}
                    onChange={() => setBoardAccessRule("selected_only")}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-semibold text-slate-800 block">Selective Member Access</span>
                    <span className="text-[11px] text-slate-500">Specify exactly who can open and edit.</span>
                  </div>
                </label>
              </div>

              {boardAccessRule === "selected_only" && (
                <div className="space-y-2 max-h-52 overflow-y-auto p-1">
                  {activeTeam.members.map((member) => {
                    const isAllowed = selectedAllowedMembers.includes(member.email);
                    const isEditor = selectedEditors.includes(member.email);
                    return (
                      <div key={member.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <label className="flex items-center gap-2 cursor-pointer min-w-0">
                          <input
                            type="checkbox"
                            checked={isAllowed}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedAllowedMembers([...selectedAllowedMembers, member.email]);
                              } else {
                                setSelectedAllowedMembers(selectedAllowedMembers.filter((em) => em !== member.email));
                                setSelectedEditors(selectedEditors.filter((em) => em !== member.email));
                              }
                            }}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 truncate">{member.name || member.email}</p>
                            <p className="text-[10px] text-slate-400 font-mono truncate">{member.email}</p>
                          </div>
                        </label>

                        {isAllowed && (
                          <button
                            type="button"
                            onClick={() => {
                              if (isEditor) {
                                setSelectedEditors(selectedEditors.filter((em) => em !== member.email));
                              } else {
                                setSelectedEditors([...selectedEditors, member.email]);
                              }
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                              isEditor ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-white text-slate-600 border-slate-200"
                            }`}
                          >
                            {isEditor ? "Can Edit" : "View Only"}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsManageAccessOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveBoardAccess}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm cursor-pointer"
                >
                  Save Access Rules
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
