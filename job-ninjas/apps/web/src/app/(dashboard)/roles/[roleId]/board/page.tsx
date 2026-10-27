"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Canvas } from "@/components/board/canvas";
import CandidateManager from "@/components/board/CandidateManager";
import { IntakeWizard } from "@/components/board/intake-wizard";
import { RoleSurface } from "@/components/board/role-surface";
import { useBoardStore } from "@/store/board";
import { BoardIntake, composeJobDescription } from "@/lib/agents/contracts";
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
    
    fetch(`/api/boards/${roleId}`)
      .then(res => res.json())
      .then(data => {
        const nextIntake = !data.error ? (data.intake || null) : null;
        const nextLayerIds = !data.error ? (data.layerIds || []) : [];
        if (!data.error) {
          setLayerIds(nextLayerIds);
          setLayers(data.layers || {});
          setEdgeIds(data.edgeIds || []);
          setEdges(data.edges || {});
          setIntake(nextIntake);
        } else {
          // Explicitly clear if board doesn't exist yet
          setLayerIds([]);
          setLayers({});
          setEdgeIds([]);
          setEdges({});
          setIntake(null);
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
  }, [roleId, setLayerIds, setLayers, setEdgeIds, setEdges]);

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
        body: JSON.stringify({ layerIds, layers, edgeIds, edges, intake })
      })
      .finally(() => setSaving(false));
    }, 1500); // Debounce saves by 1.5s
    
    return () => clearTimeout(saveTimeout.current);
  }, [layerIds, layers, edgeIds, edges, intake, roleId, loading]);

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
        <p>Loading your workflow...</p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <div className="absolute top-6 left-6 z-50 flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-slate-200/50 cursor-pointer hover:bg-white transition-colors" onClick={() => window.location.href='/roles'}>
        <img src="/logo.png" alt="JobNinjas" className="w-8 h-8 object-contain" />
        <span className="font-extrabold text-slate-800 tracking-tight">JobNinjas</span>
      </div>

      {/* Candidate Pipeline Management & ATS Ingestion Widget */}
      {roleId && <CandidateManager roleId={roleId} />}
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
          Saving...
        </div>
      )}
      <Canvas boardId={roleId} />
    </div>
  );
}
