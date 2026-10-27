"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Canvas } from "@/components/board/canvas";
import CandidateManager from "@/components/board/CandidateManager";
import { IntakeWizard } from "@/components/board/intake-wizard";
import { RoleSurface } from "@/components/board/role-surface";
import { useBoardStore } from "@/store/board";
import { BoardIntake, PIPELINE_TEMPLATES, composeJobDescription } from "@/lib/agents/contracts";
import { LayerType } from "@/types/canvas";
import { Loader2 } from "lucide-react";

export default function RoleBoardPage({ params }: { params?: Promise<{ roleId: string }> | { roleId: string } }) {
  const routeParams = useParams();
  const roleId = (routeParams?.roleId as string) || "";
  
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
        if (nextLayerIds.length === 0 && !nextIntake?.completedAt && !nextIntake?.dismissed) {
          setWizardOpen(true);
        }
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
        initialLoadRef.current = true;
      });
  }, [roleId, setLayerIds, setLayers, setEdgeIds, setEdges, setActivity]);

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

  // Save changes automatically
  const saveTimeout = useRef<any>(null);
  
  useEffect(() => {
    if (loading || !initialLoadRef.current || !roleId) return;
    
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
  }, [layerIds, layers, edgeIds, edges, intake, activity, roleId, loading]);

  const handleIntake = async (next: BoardIntake, mode: "build" | "save") => {
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
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
        <p>Opening this role…</p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-[#f6f8fa]">
      {/* Top Left Navigation Bar: Logo & Candidate Selector */}
      <div className="absolute top-4 left-4 z-40 flex items-center gap-2.5 pointer-events-auto">
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

      {roleId && (
        <RoleSurface
          roleId={roleId}
          roleTitle={roleTitle || intake?.roleTitle}
          onEditSetup={() => setWizardOpen(true)}
        />
      )}
      {wizardOpen && (
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
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-[#5e6ad2] hover:bg-indigo-50 hover:text-indigo-700 transition-colors shadow-2xs cursor-pointer"
              >
                {template.label}
              </button>
            ))}
          </div>
        </div>
      )}
      <Canvas boardId={roleId} />
    </div>
  );
}
