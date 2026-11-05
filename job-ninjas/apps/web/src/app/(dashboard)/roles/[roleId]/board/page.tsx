"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Canvas } from "@/components/board/canvas";
import CandidateManager from "@/components/board/CandidateManager";
import { IntakeWizard } from "@/components/board/intake-wizard";
import { RoleSurface } from "@/components/board/role-surface";
import { BoardShareModal } from "@/components/board/board-share-modal";
import { useBoardStore } from "@/store/board";
import { BoardIntake, PIPELINE_TEMPLATES, composeJobDescription } from "@/lib/agents/contracts";
import { LayerType } from "@/types/canvas";
import { Loader2, Share2, Users, Shield, Eye, Lock, AlertCircle } from "lucide-react";

export default function RoleBoardPage({ params }: { params?: Promise<{ roleId: string }> | { roleId: string } }) {
  const routeParams = useParams();
  const searchParams = useSearchParams();
  const roleId = (routeParams?.roleId as string) || "";
  
  // URL permission query (e.g. ?role=viewer or ?role=editor or ?role=owner)
  const queryRole = searchParams.get("role") || "owner";
  const isReadOnly = queryRole === "viewer";

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
  const [roleTitle, setRoleTitle] = useState("");
  const initialLoadRef = useRef(false);

  // Load initial state
  useEffect(() => {
    if (!roleId) return;
    initialLoadRef.current = false;
    setLoading(true);
    setWizardOpen(false);
    // Optimistically clear the board to prevent flickering old data
    setLayerIds([]);
    setLayers({});
    setEdgeIds([]);
    setEdges({});
    setActivity({});
    
    fetch(`/api/boards/${roleId}`)
      .then(res => res.json())
      .then(data => {
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
          // Explicitly clear if board doesn't exist yet
          setLayerIds([]);
          setLayers({});
          setEdgeIds([]);
          setEdges({});
          setIntake(null);
          setActivity({});
        }
        if (nextLayerIds.length === 0 && !nextIntake?.completedAt && !nextIntake?.dismissed && !isReadOnly) {
          setWizardOpen(true);
        }
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
        initialLoadRef.current = true;
      });
  }, [roleId, isReadOnly, setLayerIds, setLayers, setEdgeIds, setEdges, setActivity]);

  useEffect(() => {
    const openSetup = () => setWizardOpen(true);
    window.addEventListener('openRoleSetup', openSetup);
    return () => window.removeEventListener('openRoleSetup', openSetup);
  }, []);

  useEffect(() => {
    if (!roleId) return;
    fetch('/api/roles')
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.roles || [];
        const match = list.find((role: { id: string; title?: string }) => role.id === roleId);
        if (match?.title) setRoleTitle(match.title);
      })
      .catch(() => undefined);
  }, [roleId, intake?.roleTitle]);

  // Save changes automatically (only if not in read-only mode)
  const saveTimeout = useRef<any>(null);
  
  useEffect(() => {
    if (loading || !initialLoadRef.current || !roleId || isReadOnly) return;
    
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    
    setSaving(true);
    saveTimeout.current = setTimeout(() => {
      fetch(`/api/boards/${roleId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layerIds, layers, edgeIds, edges, intake, activity })
      })
      .finally(() => setSaving(false));
    }, 1500); // Debounce saves by 1.5s
    
    return () => clearTimeout(saveTimeout.current);
  }, [layerIds, layers, edgeIds, edges, intake, activity, roleId, loading, isReadOnly]);

  const handleIntake = async (next: BoardIntake, mode: "build" | "save") => {
    if (isReadOnly) return;
    setIntake(next);
    setRoleTitle(next.roleTitle);
    setWizardOpen(false);
    if (mode === "build") loadScaffold(next);
    if (!roleId) return;
    const jobDescription = composeJobDescription(next);
    await fetch('/api/roles', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: roleId,
        title: next.roleTitle,
        location: next.locations,
        jobDescription,
      }),
    }).catch(() => undefined);
  };

  if (loading && !initialLoadRef.current) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted text-muted-foreground font-sans">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
        <p>Opening requisition board…</p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-[#f6f8fa] font-sans">
      
      {/* Top Read-Only Banner when visiting as viewer */}
      {isReadOnly && (
        <div className="absolute top-0 left-0 right-0 z-50 bg-amber-500/90 text-white px-4 py-1.5 text-xs font-semibold flex items-center justify-center gap-2 backdrop-blur-md shadow-xs">
          <Eye className="size-3.5" />
          <span>Viewing in Read-Only Mode · Contact the requisition owner to request edit permission.</span>
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

        {roleId && <CandidateManager roleId={roleId} />}
      </div>

      {/* Top Right Collaboration & Share Toolbar */}
      <div className={`absolute ${isReadOnly ? 'top-10' : 'top-4'} right-4 z-40 flex items-center gap-2 pointer-events-auto transition-all`}>
        {/* Collaborators Facepile */}
        <div className="hidden sm:flex items-center -space-x-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200/80 shadow-xs">
          <div className="size-6 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
            HM
          </div>
          <div className="size-6 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
            SL
          </div>
          <div className="size-6 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
            RD
          </div>
          <span className="pl-3 text-[11px] font-medium text-slate-500">3 online</span>
        </div>

        {/* Role Badge */}
        <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-200/80 shadow-xs text-xs font-semibold text-slate-700">
          <Shield className="size-3.5 text-blue-600" />
          <span className="capitalize">{queryRole}</span>
        </div>

        {/* Share Button */}
        <button
          type="button"
          onClick={() => setShareOpen(true)}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-2xl shadow-sm shadow-blue-500/20 font-semibold text-xs transition-all cursor-pointer active:scale-95"
        >
          <Share2 className="size-3.5" />
          <span>Share</span>
        </button>
      </div>

      {roleId && (
        <RoleSurface
          roleId={roleId}
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
        <div className="absolute bottom-6 right-6 z-50 bg-card/80 backdrop-blur px-3 py-1.5 rounded-full shadow-sm text-xs font-medium text-muted-foreground flex items-center gap-2 border border-border/50">
          <Loader2 className="w-3 h-3 animate-spin" />
          Saving this role…
        </div>
      )}

      {roleId && !wizardOpen && !layerIds.some((id) => layers[id]?.type === LayerType.Agent) && (
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
      <Canvas boardId={roleId} />

      {/* Board Share Modal */}
      <BoardShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        roleId={roleId}
        roleTitle={roleTitle || intake?.roleTitle}
      />
    </div>
  );
}
