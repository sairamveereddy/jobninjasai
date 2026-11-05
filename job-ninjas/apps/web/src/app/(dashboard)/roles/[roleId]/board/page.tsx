"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Canvas } from "@/components/board/canvas";
import CandidateManager from "@/components/board/CandidateManager";
import { IntakeWizard } from "@/components/board/intake-wizard";
import { RoleSurface } from "@/components/board/role-surface";
import { BoardShareModal, BoardCollaborator } from "@/components/board/board-share-modal";
import { useBoardStore } from "@/store/board";
import { BoardIntake, PIPELINE_TEMPLATES, composeJobDescription } from "@/lib/agents/contracts";
import { LayerType } from "@/types/canvas";
import { 
  Loader2, 
  Share2, 
  Users, 
  Shield, 
  Eye, 
  Lock, 
  AlertCircle, 
  ArrowLeft, 
  Send, 
  CheckCircle2, 
  UserPlus, 
  Sparkles 
} from "lucide-react";

export default function RoleBoardPage({ params }: { params?: Promise<{ roleId: string }> }) {
  const router = useRouter();
  const routeParams = useParams();
  const searchParams = useSearchParams();
  const rawParamId = (routeParams?.roleId as string) || "";
  
  // URL permission query override (e.g. ?role=viewer or ?role=editor or ?role=owner)
  const queryRole = searchParams.get("role");

  const layerIds = useBoardStore(state => state.layerIds);
  const layers = useBoardStore(state => state.layers);
  const edgeIds = useBoardStore(state => state.edgeIds);
  const edges = useBoardStore(state => state.edges);
  
  const setLayerIds = useBoardStore(state => state.setLayerIds);
  const setLayers = useBoardStore(state => state.setLayers);
  const setEdgeIds = useBoardStore(state => state.setEdgeIds);
  const setEdges = useBoardStore(state => state.setEdges);
  const activity = useBoardStore(state => state.activity);
  const setActivity = useBoardStore(state => state.setActivity);
  
  const loadScaffold = useBoardStore(state => state.loadScaffold);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [intake, setIntake] = useState<BoardIntake | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  
  // Resolved state
  const [resolvedRoleId, setResolvedRoleId] = useState<string>(rawParamId);
  const [roleTitle, setRoleTitle] = useState("");
  const [boardSlug, setBoardSlug] = useState("");
  const [collaborators, setCollaborators] = useState<BoardCollaborator[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [accessAllowed, setAccessAllowed] = useState(true);
  const [effectiveRole, setEffectiveRole] = useState<"owner" | "editor" | "viewer">("owner");
  const [requestSent, setRequestSent] = useState(false);
  const [requestNote, setRequestNote] = useState("");

  const isReadOnly = effectiveRole === "viewer";
  const initialLoadRef = useRef(false);

  // 1. Fetch current user session
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => undefined);
  }, []);

  // 2. Load initial board state and resolve slug
  useEffect(() => {
    if (!rawParamId) return;
    initialLoadRef.current = false;
    setLoading(true);
    setWizardOpen(false);
    
    // Optimistically clear the board to prevent flickering old data
    setLayerIds([]);
    setLayers({});
    setEdgeIds([]);
    setEdges({});
    setActivity({});
    
    fetch(`/api/boards/${rawParamId}`)
      .then(res => res.json())
      .then(data => {
        const trueId = data.roleId || rawParamId;
        setResolvedRoleId(trueId);
        if (data.roleTitle) setRoleTitle(data.roleTitle);
        if (data.slug) {
          setBoardSlug(data.slug);
          // Upgrade URL in browser address bar to use clean board name
          if (typeof window !== "undefined") {
            const currentPath = window.location.pathname;
            const targetPath = `/roles/${data.slug}/board`;
            if (currentPath !== targetPath && !currentPath.includes(encodeURIComponent(data.slug))) {
              window.history.replaceState(null, "", targetPath + (window.location.search || ""));
            }
          }
        }

        const nextIntake = !data.error ? (data.intake || null) : null;
        const nextLayerIds = !data.error ? (data.layerIds || []) : [];
        if (!data.error) {
          const rawLayers = { ...(data.layers || {}) };
          const tucked = rawLayers.__activity;
          delete rawLayers.__activity;
          setLayerIds(nextLayerIds);
          setLayers(rawLayers);
          setEdgeIds(data.edgeIds || []);
          setEdges(data.edges || {});
          setIntake(nextIntake);
          setActivity(data.activity || tucked || {});
        } else {
          setLayerIds([]);
          setLayers({});
          setEdgeIds([]);
          setEdges({});
          setIntake(null);
          setActivity({});
        }

        if (nextLayerIds.length === 0 && !nextIntake?.completedAt && !nextIntake?.dismissed && queryRole !== "viewer") {
          setWizardOpen(true);
        }

        // Fetch collaborators for this board
        return fetch(`/api/boards/${trueId}/share`);
      })
      .then(res => res ? res.json() : null)
      .then(shareData => {
        if (shareData?.collaborators) {
          setCollaborators(shareData.collaborators);
        }
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
        initialLoadRef.current = true;
      });
  }, [rawParamId, queryRole, setLayerIds, setLayers, setEdgeIds, setEdges, setActivity]);

  // 3. Evaluate access control
  useEffect(() => {
    if (!currentUser || collaborators.length === 0) return;

    const userEmail = (currentUser.email || "").toLowerCase().trim();
    
    // Query override from an invite link (e.g. ?role=viewer or ?role=editor)
    if (queryRole === "viewer" || queryRole === "editor" || queryRole === "owner") {
      setAccessAllowed(true);
      setEffectiveRole(queryRole);
      return;
    }

    // Is the user in the collaborators list for this board?
    const match = collaborators.find(c => c.email.toLowerCase() === userEmail);
    if (match) {
      setAccessAllowed(true);
      setEffectiveRole(match.role);
      return;
    }

    // Default demo session or admin access
    if (
      userEmail.includes("demo@") || 
      userEmail.includes("admin@") || 
      currentUser.isAdmin || 
      userEmail.endsWith("@jobninjas.ai")
    ) {
      setAccessAllowed(true);
      setEffectiveRole("owner");
      return;
    }

    // User is neither in the allowed collaborator list nor admin
    // Restrict access
    setAccessAllowed(false);
  }, [currentUser, collaborators, queryRole]);

  useEffect(() => {
    const openSetup = () => setWizardOpen(true);
    window.addEventListener('openRoleSetup', openSetup);
    return () => window.removeEventListener('openRoleSetup', openSetup);
  }, []);

  // Save changes automatically (only if not in read-only mode)
  const saveTimeout = useRef<any>(null);
  
  useEffect(() => {
    const saveId = resolvedRoleId || rawParamId;
    if (loading || !initialLoadRef.current || !saveId || isReadOnly || !accessAllowed) return;
    
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    
    setSaving(true);
    saveTimeout.current = setTimeout(() => {
      fetch(`/api/boards/${saveId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layerIds, layers, edgeIds, edges, intake, activity })
      })
      .finally(() => setSaving(false));
    }, 1500); // Debounce saves by 1.5s
    
    return () => clearTimeout(saveTimeout.current);
  }, [layerIds, layers, edgeIds, edges, intake, activity, resolvedRoleId, rawParamId, loading, isReadOnly, accessAllowed]);

  const handleIntake = async (next: BoardIntake, mode: "build" | "save") => {
    if (isReadOnly) return;
    setIntake(next);
    setRoleTitle(next.roleTitle);
    setWizardOpen(false);
    if (mode === "build") loadScaffold(next);
    const saveId = resolvedRoleId || rawParamId;
    if (!saveId) return;
    const jobDescription = composeJobDescription(next);
    await fetch('/api/roles', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: saveId,
        title: next.roleTitle,
        location: next.locations,
        jobDescription,
      }),
    }).catch(() => undefined);
  };

  if (loading && !initialLoadRef.current) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#f8fafc] text-slate-500 font-sans">
        <Loader2 className="w-9 h-9 animate-spin mb-3 text-blue-600" />
        <p className="text-sm font-semibold text-slate-700">Loading {roleTitle || "Hiring Board"}...</p>
        <p className="text-xs text-slate-400 mt-1">Verifying team permissions and canvas topology</p>
      </div>
    );
  }

  // ACCESS RESTRICTED SCREEN
  if (!accessAllowed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-slate-50 p-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-2xl p-7 text-center">
          <div className="size-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Lock className="size-6 text-amber-600" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold uppercase tracking-wider mb-2">
            Private Requisition Board
          </span>

          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {roleTitle || "Requisition Pipeline"}
          </h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            This board is restricted to authorized team members and collaborators. Your account does not have permission to view or edit this canvas.
          </p>

          <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-left">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Signed in as:</p>
            <p className="text-xs font-bold text-slate-800 truncate">{currentUser?.email || "Guest"}</p>
          </div>

          {requestSent ? (
            <div className="mt-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-center gap-2">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
              <span className="font-medium">Access request dispatched to board owners. You will receive an email once approved.</span>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              <input
                type="text"
                value={requestNote}
                onChange={(e) => setRequestNote(e.target.value)}
                placeholder="Add an optional note to the team..."
                className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2 text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setRequestSent(true)}
                className="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Send className="size-3.5" />
                <span>Request Access from Board Owner</span>
              </button>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link href="/roles" className="hover:text-blue-600 font-medium flex items-center gap-1 transition-colors">
              <ArrowLeft className="size-3.5" />
              <span>Back to all roles</span>
            </Link>
            <Link href="/login" className="text-blue-600 font-semibold hover:underline">
              Switch account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const activeRoleId = resolvedRoleId || rawParamId;

  return (
    <div className="absolute inset-0 bg-[#f6f8fa] font-sans">
      
      {/* Top Read-Only Banner when visiting as viewer */}
      {isReadOnly && (
        <div className="absolute top-0 left-0 right-0 z-50 bg-amber-500/90 text-white px-4 py-1.5 text-xs font-semibold flex items-center justify-center gap-2 backdrop-blur-md shadow-xs">
          <Eye className="size-3.5" />
          <span>Viewing in Read-Only Mode · Contact board owner to request edit permission.</span>
        </div>
      )}

      {/* Top Left Navigation Bar: Logo & Candidate Selector */}
      <div className={`absolute ${isReadOnly ? 'top-10' : 'top-4'} left-4 z-40 flex items-center gap-2.5 pointer-events-auto transition-all`}>
        <button
          type="button"
          aria-label="Back to roles"
          onClick={() => { window.location.href = '/roles'; }}
          className="flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-sm border border-slate-200/80 cursor-pointer hover:bg-slate-50 transition-colors"
        >
          <img src="/logo.png" alt="" className="w-6 h-6 object-contain" />
          <span className="font-extrabold text-slate-800 tracking-tight text-sm">JobNinjas</span>
        </button>

        {activeRoleId && <CandidateManager roleId={activeRoleId} />}
      </div>

      {/* Top Right Collaboration & Share Toolbar */}
      <div className={`absolute ${isReadOnly ? 'top-10' : 'top-4'} right-4 z-40 flex items-center gap-2 pointer-events-auto transition-all`}>
        {/* Collaborators Facepile */}
        <div 
          onClick={() => setShareOpen(true)}
          title="Manage board access and collaborators"
          className="hidden sm:flex items-center -space-x-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200/80 shadow-xs cursor-pointer hover:border-blue-300 transition-colors"
        >
          {collaborators.slice(0, 3).map((collab, idx) => {
            const colors = ["bg-blue-600", "bg-purple-600", "bg-emerald-600", "bg-amber-600"];
            const initials = collab.name ? collab.name.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase() : collab.email.slice(0, 2).toUpperCase();
            return (
              <div 
                key={collab.id || idx} 
                title={`${collab.name} (${collab.email}) - ${collab.role}`}
                className={`size-6 rounded-full ${colors[idx % colors.length]} text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white`}
              >
                {initials}
              </div>
            );
          })}
          <span className="pl-3 text-[11px] font-medium text-slate-600">
            {collaborators.length} member{collaborators.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Role Badge */}
        <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-200/80 shadow-xs text-xs font-semibold text-slate-700">
          <Shield className="size-3.5 text-blue-600" />
          <span className="capitalize">{effectiveRole}</span>
        </div>

        {/* Share & Add People Button */}
        <button
          type="button"
          onClick={() => setShareOpen(true)}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-2xl shadow-sm shadow-blue-500/20 font-semibold text-xs transition-all cursor-pointer active:scale-95"
        >
          <UserPlus className="size-3.5" />
          <span>Share & Access</span>
        </button>
      </div>

      {activeRoleId && (
        <RoleSurface
          roleId={activeRoleId}
          roleTitle={roleTitle || intake?.roleTitle}
          onEditSetup={() => { if (!isReadOnly) setWizardOpen(true); }}
        />
      )}

      {wizardOpen && !isReadOnly && (
        <IntakeWizard
          initial={intake}
          hasPipeline={layerIds.length > 0}
          onComplete={handleIntake}
          onDismiss={() => {
            setWizardOpen(false);
            setIntake((current) => current?.completedAt ? current : {
              roleTitle: current?.roleTitle || "",
              jobDescription: current?.jobDescription || "",
              mustHaveSkills: current?.mustHaveSkills || "",
              seniority: current?.seniority || "",
              locations: current?.locations || "",
              candidateVolume: current?.candidateVolume || "",
              ats: current?.ats || "",
              stages: current?.stages || [],
              dismissed: true,
            });
          }}
        />
      )}

      {saving && (
        <div className="absolute bottom-6 right-6 z-50 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-sm text-xs font-medium text-slate-600 flex items-center gap-2 border border-slate-200">
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
          Saving this role…
        </div>
      )}

      {activeRoleId && !wizardOpen && !layerIds.some((id) => layers[id]?.type === LayerType.Agent) && (
        <div className="absolute left-1/2 top-[34%] z-30 w-[min(560px,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-md p-6 text-slate-800 shadow-2xl">
          <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">This role</p>
          <p className="mt-1 text-base font-bold text-slate-900">No hiring pipeline yet</p>
          <p className="mt-1 text-sm text-slate-500">Pick a template and name the job. Then add a person in This role and run the steps. Nothing is scored until someone is selected.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {PIPELINE_TEMPLATES.map((template) => (
              <button
                key={template.id}
                type="button"
                disabled={isReadOnly}
                title={template.detail}
                aria-label={`Start with ${template.label}`}
                onClick={() => {
                  setIntake((current) => ({
                    roleTitle: current?.roleTitle || "",
                    jobDescription: current?.jobDescription || "",
                    mustHaveSkills: current?.mustHaveSkills || "",
                    seniority: current?.seniority || "Senior",
                    locations: current?.locations || "",
                    candidateVolume: current?.candidateVolume || (template.id === "high-volume" ? "200+" : "11-50"),
                    ats: current?.ats || "None yet",
                    stages: [...template.stages],
                    dismissed: false,
                  }));
                  setWizardOpen(true);
                }}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-[#5e6ad2] hover:bg-indigo-50 hover:text-indigo-700 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
              >
                {template.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Canvas */}
      <Canvas boardId={activeRoleId} />

      {/* Board Share & Access Modal */}
      <BoardShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        roleId={activeRoleId}
        roleTitle={roleTitle || intake?.roleTitle}
      />
    </div>
  );
}
