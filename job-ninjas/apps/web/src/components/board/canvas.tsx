"use client";

import { useCallback, useState, useEffect, useRef } from 'react';
import { useBoardStore } from '@/store/board';
import { useDemoStore } from '@/lib/store';
import { Camera, CanvasMode, CanvasState, LayerType, Point, Color } from '@/types/canvas';
import { Toolbar, AGENTS } from './toolbar';
import { ZoomControls } from './zoom-controls';
import { LibraryModal } from './library-modal';
import { getStroke } from 'perfect-freehand';
import Link from 'next/link';
import { Play, Loader2, Plus, X, Trash2, Upload, Plug, Mail, Calendar, MessageSquare, Database, Workflow, FileText, ArrowLeft, Presentation, Maximize, Sparkles } from 'lucide-react';
import { getNodeSpec } from '@/lib/agents/node-specs';
import { collectUpstreamOutputs, dataTypeLabel, documentKind, isSharedStep, localRunBlockers, outputForCandidate, plainLanguage, stepHealth, summarizeAgentOutput, validateConnection } from '@/lib/agents/contracts';
import { SelectionBox } from './selection-box';
import { resizeBounds } from '@/lib/geometry';
import { Side, XYWH } from '@/types/canvas';
import { InspectorPanel } from './inspector-panel';
import { FloatingToolbar } from './floating-toolbar';
import { EdgeToolbar } from './edge-toolbar';
import { PresentationViewer } from './presentation-viewer';
import { CandidateConciergeNode } from './candidate-concierge-node';
import { CandidateNodeBlock } from './candidate-node-block';
import { BoardHelp } from './board-help';
import { ArtifactSheet, artifactKind, artifactTitle } from './artifact-sheet';
import { markCandidateRun, recordCandidateRun, saveResultEdit } from './result-edits';

let jdPersistTimer: ReturnType<typeof setTimeout> | undefined;
function persistJobDescription(roleId: string | undefined, text: string) {
  if (!roleId || roleId === 'new-workflow') return;
  window.clearTimeout(jdPersistTimer);
  jdPersistTimer = setTimeout(() => {
    fetch('/api/roles', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: roleId, jobDescription: text }),
    }).catch(() => undefined);
  }, 500);
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// MCP Connector definitions
const MCP_CONNECTORS = [
  { icon: Mail, label: 'Gmail', desc: 'Send emails to candidates automatically', color: 'text-red-500', bg: 'bg-red-50', agentRole: 'gmail-connector' },
  { icon: Calendar, label: 'Google Calendar', desc: 'Schedule interviews automatically', color: 'text-blue-500', bg: 'bg-blue-50', agentRole: 'gcalendar-connector' },
  { icon: MessageSquare, label: 'Slack', desc: 'Notify hiring managers in real-time', color: 'text-purple-500', bg: 'bg-purple-50', agentRole: 'slack-connector' },
  { icon: Database, label: 'Greenhouse ATS', desc: 'Sync candidates to your ATS', color: 'text-green-600', bg: 'bg-green-50', agentRole: 'greenhouse-connector' },
  { icon: Workflow, label: 'Workday', desc: 'Push hired candidates to Workday', color: 'text-indigo-600', bg: 'bg-indigo-50', agentRole: 'workday-connector' },
  { icon: FileText, label: 'DocuSign', desc: 'Send offer letters for e-signature', color: 'text-yellow-600', bg: 'bg-yellow-50', agentRole: 'docusign-connector' },
];

// Helper to convert freehand stroke points to SVG path data
const getSvgPathFromStroke = (stroke: number[][]) => {
  if (!stroke.length) return "";
  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );
  d.push("Z");
  return d.join(" ");
};

const getPointerPos = (e: React.PointerEvent | React.WheelEvent | React.MouseEvent, camera: Camera): Point => {
  return {
    x: (e.clientX - camera.x) / camera.zoom,
    y: (e.clientY - camera.y) / camera.zoom,
  };
};
function getBoxIntersection(
  startX: number, startY: number,
  boxX: number, boxY: number, boxW: number, boxH: number, padding = 12
) {
  const endX = boxX + boxW / 2;
  const endY = boxY + boxH / 2;
  const dx = endX - startX;
  const dy = endY - startY;

  const halfW = boxW / 2 + padding;
  const halfH = boxH / 2 + padding;

  if (Math.abs(dx) < 0.0001 && Math.abs(dy) < 0.0001) return { x: endX, y: endY };

  const scaleX = Math.abs(dx) > 0.0001 ? halfW / Math.abs(dx) : Infinity;
  const scaleY = Math.abs(dy) > 0.0001 ? halfH / Math.abs(dy) : Infinity;
  const scale = Math.min(scaleX, scaleY, 1);
  
  return {
    x: endX - dx * scale,
    y: endY - dy * scale
  };
}

const NOTE_COLORS = [
  { name: 'Indigo', fill: { r: 94, g: 106, b: 210 } },
  { name: 'Amber', fill: { r: 176, g: 132, b: 48 } },
  { name: 'Slate', fill: { r: 71, g: 78, b: 94 } },
  { name: 'Rose', fill: { r: 168, g: 72, b: 90 } },
];

function orderedAgentIds(layerIds: string[], layers: Record<string, { type?: LayerType; x?: number }>, edges: Record<string, { fromNodeId: string; toNodeId: string }>) {
  const ids = layerIds.filter((id) => layers[id]?.type === LayerType.Agent);
  const indegree: Record<string, number> = {};
  const outgoing: Record<string, string[]> = {};
  ids.forEach((id) => {
    indegree[id] = 0;
    outgoing[id] = [];
  });
  Object.values(edges).forEach((edge) => {
    if (indegree[edge.toNodeId] === undefined || outgoing[edge.fromNodeId] === undefined) return;
    indegree[edge.toNodeId] += 1;
    outgoing[edge.fromNodeId].push(edge.toNodeId);
  });
  const ready = ids.filter((id) => indegree[id] === 0).sort((a, b) => (layers[a]?.x || 0) - (layers[b]?.x || 0));
  const order: string[] = [];
  const seen = new Set<string>();
  while (ready.length > 0) {
    const id = ready.shift()!;
    if (seen.has(id)) continue;
    seen.add(id);
    order.push(id);
    for (const next of outgoing[id] || []) {
      indegree[next] -= 1;
      if (indegree[next] <= 0 && !seen.has(next)) {
        ready.push(next);
        ready.sort((a, b) => (layers[a]?.x || 0) - (layers[b]?.x || 0));
      }
    }
  }
  ids.forEach((id) => {
    if (!seen.has(id)) order.push(id);
  });
  return order;
}

export const Canvas = ({ boardId }: { boardId: string }) => {
  const layerIds = useBoardStore(state => state.layerIds);
  const layers = useBoardStore(state => state.layers);
  const insertLayer = useBoardStore(state => state.insertLayer);
  const translateSelectedLayers = useBoardStore(state => state.translateSelectedLayers);
  const updateLayer = useBoardStore(state => state.updateLayer);
  const selections = useBoardStore(state => state.selections);
  const setSelection = useBoardStore(state => state.setSelection);
  const edges = useBoardStore(state => state.edges);
  const edgeIds = useBoardStore(state => state.edgeIds);
  const insertEdge = useBoardStore(state => state.insertEdge);
  const deleteLayers = useBoardStore(state => state.deleteLayers);
  const deleteEdge = useBoardStore(state => state.deleteEdge);
  const setInspectedNodeId = useBoardStore(state => state.setInspectedNodeId);
  const insertTemplate = useBoardStore(state => state.insertTemplate);
  
  const roles = useDemoStore(state => state.roles);
  const [roleData, setRoleData] = useState<any>(null);

  useEffect(() => {
    if (!boardId || boardId === 'new-workflow') return;
    fetch('/api/roles')
      .then(res => res.json())
      .then(data => {
        const rolesList = Array.isArray(data) ? data : data?.roles || [];
        const match = rolesList.find((r: any) => r.id === boardId);
        if (match) setRoleData(match);
      })
      .catch(console.error);
  }, [boardId]);

  const currentRole = roleData || roles.find(r => r.id === boardId);

  const getInitialConfig = (roleType?: string) => {
    if (!roleType) return undefined;
    if (['entry-node', 'resume-verifier', 'resume-analyzer'].includes(roleType)) {
      return {
        jobTitle: currentRole?.title || "",
        jobDescription: currentRole?.jobDescription || "",
      };
    }
    return undefined;
  };

  const [canvasState, setCanvasState] = useState<CanvasState>({ mode: CanvasMode.None });
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0, zoom: 1 });
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [quickAddMenuFor, setQuickAddMenuFor] = useState<string | null>(null);
  const [presentationMode, setPresentationMode] = useState<{ active: boolean, layerId?: string }>({ active: false });

  useEffect(() => {
    (window as any).__setPresentationMode = setPresentationMode;
    return () => {
      delete (window as any).__setPresentationMode;
    };
  }, []);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeHasResume, setActiveHasResume] = useState<boolean | null>(null);
  const [activeCandidateId, setActiveCandidateId] = useState<string | null>(null);
  const [isMcpPanelOpen, setIsMcpPanelOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRunSingleAgent = async (layerId: string): Promise<boolean> => {
    const store = useBoardStore.getState();
    const layers = store.layers;
    const edges = store.edges;
    const updateLayer = store.updateLayer;
    const setConnectionNotice = store.setConnectionNotice;
    const layer = layers[layerId];
    if (!layer || layer.type !== LayerType.Agent) return false;
    
    if (layer.agentRole === 'input-job-details') {
      const doc = Object.values(layers).find((item) => (item as { docKind?: string }).docKind === 'jd') as { value?: string } | undefined;
      const fromNode = typeof layer.outputData === 'string' ? layer.outputData.trim() : '';
      const text = doc ? String(doc.value || '').trim() : fromNode;
      if (doc && !text) {
        updateLayer(layerId, {
          status: 'error',
          outputData: undefined,
          errorDetails: 'Add a job description on the job card, or in role setup.',
        });
        persistJobDescription(boardId, '');
        return false;
      }
      updateLayer(layerId, {
        status: text ? 'success' : 'idle',
        outputData: text || undefined,
        errorDetails: undefined,
      });
      if (text) persistJobDescription(boardId, text);
      return true;
    }

    if (layer.agentRole === 'input-transcript') {
      const text = String(layer.config?.transcriptText || layer.outputData || '').trim();
      if (!text) {
        updateLayer(layerId, {
          status: 'error',
          errorDetails: 'Paste the interview transcript on this step. Agents only score a transcript you provide.',
        });
        return false;
      }
      updateLayer(layerId, { status: 'success', outputData: text, errorDetails: undefined });
      return true;
    }

    // Other input nodes and human gates succeed immediately
    if (!layer.agentRole?.startsWith('agent-')) {
       updateLayer(layerId, { status: 'success', errorDetails: undefined });
       return true;
    }

    const activeCandIdEarly = typeof window !== 'undefined' ? window.localStorage.getItem('activeCandidateId') || '' : '';
    const collected = collectUpstreamOutputs(layers, Object.values(edges), layerId, activeCandIdEarly);
    const upstreamNodeIds = collected.upstreamNodeIds;
    const clientUpstreamOutputs = collected.outputs;

    const activeCandId = activeCandIdEarly;

    if (!activeCandId && layer.agentRole !== 'agent-jd-parser') {
      const message = 'Pick a candidate on this role first. Use This role to add someone and attach a resume.';
      setConnectionNotice({ tone: 'error', message });
      return false;
    }

    const blockers = localRunBlockers(layer.agentRole, clientUpstreamOutputs, {
      hasCandidate: !!activeCandId,
      hasResume: activeHasResume !== false,
      hasJobDescription: !!currentRole?.jobDescription,
    });
    if (blockers.length) {
      const message = blockers.join(' ');
      if (activeCandId) recordCandidateRun(layerId, activeCandId, { ok: false, error: message });
      else updateLayer(layerId, { status: 'error', errorDetails: message });
      setConnectionNotice({ tone: 'error', message });
      return false;
    }

    if (activeCandId) markCandidateRun(layerId, activeCandId);
    else updateLayer(layerId, { status: 'running', errorDetails: undefined });

    try {
      const response = await fetch('/api/agents/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodeId: layerId,
          agentType: layer.agentRole,
          roleId: currentRole?.id || boardId, 
          candidateId: activeCandId,
          upstreamNodeIds,
          clientUpstreamOutputs
        })
      });

      const data = await response.json();
      
      if (response.ok && data.status !== 'ERROR' && data.status !== 'BLOCKED') {
        recordCandidateRun(layerId, activeCandId, {
          ok: true,
          output: data.output,
          executionTimeMs: data.executionTimeMs,
          input: data.input,
          runId: data.runId,
        });
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('candidateChanged'));
        }
        return true;
      } else {
        const message = data.error || (Array.isArray(data.missingInputs) ? data.missingInputs.join(', ') : '') || 'Execution failed';
        recordCandidateRun(layerId, activeCandId, {
          ok: false,
          error: message,
          executionTimeMs: data.executionTimeMs,
          input: data.input,
        });
        setConnectionNotice({ tone: 'error', message });
        return false;
      }
    } catch (e: any) {
      recordCandidateRun(layerId, activeCandId, { ok: false, error: e.message || 'This step failed.' });
      return false;
    }
  };

  const connectionNotice = useBoardStore(state => state.connectionNotice);
  const setConnectionNotice = useBoardStore(state => state.setConnectionNotice);

  useEffect(() => {
    if (!connectionNotice) return;
    const timer = setTimeout(() => setConnectionNotice(null), connectionNotice.tone === 'error' ? 14000 : 7000);
    return () => clearTimeout(timer);
  }, [connectionNotice, setConnectionNotice]);

  useEffect(() => {
    const syncResume = (event?: Event) => {
      const candidate = (event as CustomEvent | undefined)?.detail?.candidate;
      if (candidate?.id) setActiveCandidateId(candidate.id);
      if (candidate && 'resumeText' in candidate) {
        setActiveHasResume(!!candidate.resumeText);
        if (candidate.firstName || candidate.lastName) return;
      }
      const id = candidate?.id || (typeof window !== 'undefined' ? window.localStorage.getItem('activeCandidateId') : '');
      if (id) setActiveCandidateId(id);
      if (!id || !boardId || boardId === 'new-workflow') {
        if (!id) {
          setActiveCandidateId(null);
          setActiveHasResume(null);
        }
        return;
      }
      fetch(`/api/candidates?candidateId=${id}`)
        .then((res) => res.json())
        .then((data) => {
          const next = data.candidate || data.candidates?.[0];
          setActiveHasResume(next ? !!next.resumeText : null);
          if (next?.id && (next.firstName || next.lastName)) {
            setNotePeople((people) => people.some((item) => item.id === next.id) ? people : [...people, next]);
          }
        })
        .catch(() => setActiveHasResume(null));
    };
    syncResume();
    window.addEventListener('candidateChanged', syncResume);
    return () => window.removeEventListener('candidateChanged', syncResume);
  }, [boardId]);

  // Handle file drag-and-drop onto canvas
  const handleFileDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (!files.length) return;

    const dropPoint = {
      x: (e.clientX - camera.x) / camera.zoom,
      y: (e.clientY - camera.y) / camera.zoom,
    };

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isResume = file.name.match(/\.(pdf|docx|doc|txt)$/i);

      const placeOnBoard = (kind: string) => {
        const nodeX = dropPoint.x + (i % 3) * 300;
        const nodeY = dropPoint.y + Math.floor(i / 3) * 200;
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          if (file.type.startsWith('image/')) {
            insertLayer(LayerType.Image, { x: nodeX, y: nodeY }, { r: 255, g: 255, b: 255 }, undefined, undefined, base64);
            return;
          }
          const id = insertLayer(LayerType.Slide, { x: nodeX, y: nodeY }, { r: 255, g: 255, b: 255 });
          updateLayer(id, {
            width: 280,
            height: 180,
            fileSrc: base64,
            value: file.name,
            fileName: file.name,
            docKind: kind,
          } as any);
        };
        reader.readAsDataURL(file);
      };

      // Attach resumes to the selected person, and keep the file on the board.
      if (isResume && boardId && boardId !== 'new-workflow') {
        const kind = documentKind(file.name) === 'JD' ? 'jd' : 'resume';
        try {
          let targetCandId = typeof window !== 'undefined' ? window.localStorage.getItem('activeCandidateId') : null;
          let createdName = '';

          if (!targetCandId && kind === 'resume') {
            const cleanName = file.name.replace(/\.(pdf|docx|doc|txt)$/i, '').replace(/[-_]/g, ' ').replace(/\s+resume\b/i, '').trim();
            const parts = cleanName.split(/\s+/);
            const fName = parts[0] || 'Applicant';
            const lName = parts.slice(1).join(' ') || 'Candidate';
            createdName = `${fName} ${lName}`;

            const createRes = await fetch('/api/candidates', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                roleId: currentRole?.id || boardId,
                firstName: fName,
                lastName: lName,
                email: `${fName.toLowerCase()}.${lName.toLowerCase().replace(/\s+/g, '.')}@candidate.com`,
              })
            });
            const createData = await createRes.json();
            if (createData.success && createData.candidate) {
              targetCandId = createData.candidate.id;
            }
          }

          if (kind === 'jd') {
            setConnectionNotice({ tone: 'ok', message: `${file.name} is on this role as a job description. Agents read the job description saved in role setup.` });
          } else if (targetCandId) {
            const formData = new FormData();
            formData.append('candidateId', targetCandId);
            formData.append('file', file);
            const uploadRes = await fetch('/api/resumes/upload', { method: 'POST', body: formData });
            const uploadData = await uploadRes.json();
            if (uploadData.success && uploadData.candidate) {
              const person = `${uploadData.candidate.firstName || ''} ${uploadData.candidate.lastName || ''}`.trim() || createdName || 'the selected person';
              window.localStorage.setItem('activeCandidateId', uploadData.candidate.id);
              window.dispatchEvent(new CustomEvent('candidateChanged', { detail: { candidate: uploadData.candidate } }));
              setActiveHasResume(true);
              const emailNote = createdName ? ' Add a real email on This role before you draft outreach.' : '';
              setConnectionNotice({ tone: 'ok', message: `Attached ${file.name} to ${person}. The file is also on this role as a resume.${emailNote}` });
            } else {
              setConnectionNotice({ tone: 'error', message: uploadData.error || `Could not attach ${file.name}. It is on the board. Select a person in This role and use Attach resume.` });
            }
          } else {
            setConnectionNotice({ tone: 'error', message: `Could not attach ${file.name}. It is on the board. Select a person in This role and use Attach resume.` });
          }
        } catch {
          setConnectionNotice({ tone: 'error', message: `Could not attach ${file.name}. It is on the board. Select a person in This role and use Attach resume.` });
        }
        placeOnBoard(kind);
        continue;
      }

      const isOfficeDoc = file.name.match(/\.(ppt|pptx)$/i);
      
      if (isOfficeDoc) {
        // Mock extraction: generate 10 slides horizontally
        for (let s = 1; s <= 10; s++) {
          const slideX = dropPoint.x + (s - 1) * 800;
          const slideY = dropPoint.y;
          const slideId = insertLayer(LayerType.Slide, { x: slideX, y: slideY }, { r: 255, g: 255, b: 255 });
          updateLayer(slideId, { 
            fileName: `${file.name} - Slide ${s}`,
            value: `${file.name} - Slide ${s}`,
            fileSrc: `/extracted_slides/slide_${s}.png`
          } as any);
        }
      } else {
        const nodeX = dropPoint.x + (i % 3) * 300;
        const nodeY = dropPoint.y + Math.floor(i / 3) * 200;
        
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          if (file.type.startsWith('image/')) {
            insertLayer(LayerType.Image, { x: nodeX, y: nodeY }, { r: 255, g: 255, b: 255 }, undefined, undefined, base64);
          } else {
            const id = insertLayer(LayerType.Slide, { x: nodeX, y: nodeY }, { r: 255, g: 255, b: 255 });
            updateLayer(id, { fileSrc: base64, value: file.name, fileName: file.name } as any);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }, [camera, insertLayer, updateLayer, boardId, currentRole]);

  const [runQueue, setRunQueue] = useState<{ active: string; next: string[] } | null>(null);
  const [openResultId, setOpenResultId] = useState<string | null>(null);
  const [notePeople, setNotePeople] = useState<{ id: string; firstName?: string; lastName?: string }[]>([]);

  useEffect(() => {
    if (!boardId || boardId === 'new-workflow') return;
    fetch(`/api/candidates?roleId=${boardId}`)
      .then((res) => res.json())
      .then((data) => setNotePeople(Array.isArray(data) ? data : data?.candidates || []))
      .catch(() => setNotePeople([]));
    const refreshPeople = () => {
      fetch(`/api/candidates?roleId=${boardId}`)
        .then((res) => res.json())
        .then((data) => setNotePeople(Array.isArray(data) ? data : data?.candidates || []))
        .catch(() => undefined);
    };
    window.addEventListener('candidateChanged', refreshPeople);
    return () => window.removeEventListener('candidateChanged', refreshPeople);
  }, [boardId]);

  const runWorkflow = async () => {
    if (isRunning) return;
    const state = useBoardStore.getState();
    const order = orderedAgentIds(state.layerIds, state.layers, state.edges);
    const stepName = (id: string) => {
      const layer = useBoardStore.getState().layers[id] as { value?: string; agentRole?: string } | undefined;
      return layer?.value || getNodeSpec(layer?.agentRole).displayName;
    };
    if (order.length === 0) {
      state.setConnectionNotice({ tone: 'error', message: 'There is no pipeline on this role yet. Pick a template in role setup, then run it for one person.' });
      return;
    }
    const candId = typeof window !== 'undefined' ? window.localStorage.getItem('activeCandidateId') : '';
    if (!candId) {
      state.setConnectionNotice({ tone: 'error', message: 'Select a person on this role, then run the pipeline. Every step scores whoever is selected.' });
      return;
    }
    setIsRunning(true);
    const failed = new Set<string>();
    for (let index = 0; index < order.length; index += 1) {
      const currentId = order[index];
      const upcoming = order.slice(index + 1, index + 4).map(stepName);
      setRunQueue({ active: stepName(currentId), next: upcoming });
      const freshEdges = Object.values(useBoardStore.getState().edges);
      const blockerId = freshEdges.find((edge) => edge.toNodeId === currentId && failed.has(edge.fromNodeId))?.fromNodeId;
        if (blockerId) {
        const message = `Stopped because ${stepName(blockerId)} did not finish. Fix that step, then run the pipeline again.`;
        recordCandidateRun(currentId, candId, { ok: false, error: message });
        failed.add(currentId);
        continue;
      }
      const success = await handleRunSingleAgent(currentId);
      if (!success) failed.add(currentId);
    }
    setIsRunning(false);
    setRunQueue(null);
    const notice = useBoardStore.getState().setConnectionNotice;
    if (failed.size) {
      notice({ tone: 'error', message: `Pipeline stopped on ${failed.size} step${failed.size === 1 ? '' : 's'}. Read the message on the step. Earlier results stay where they are.` });
    } else {
      notice({ tone: 'ok', message: 'Pipeline finished for the selected person. Their results stay on the steps when you switch people.' });
    }
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('candidateChanged'));
  };
  
  // Track pencil drawing state locally before committing
  const [pencilDraft, setPencilDraft] = useState<Point[] | null>(null);

  // Disable default browser zooming
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Poll for MCP commands
  useEffect(() => {
    let active = true;
    const poll = async () => {
      if (!active) return;
      try {
        const res = await fetch('/api/mcp-sync');
        if (res.ok) {
          const { commands } = await res.json();
          commands.forEach((cmd: any) => {
            if (cmd.action === 'add_agent') {
              insertLayer(
                LayerType.Agent,
                { x: Number(cmd.x) || 100, y: Number(cmd.y) || 100 },
                { r: 255, g: 255, b: 255 },
                undefined,
                cmd.agentRole
              );
            }
          });
        }
      } catch (err) {
        console.error('MCP Sync Error:', err);
      }
      if (active) setTimeout(poll, 2000);
    };
    poll();
    return () => { active = false; };
  }, [insertLayer]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement;
      if (active?.tagName === 'INPUT' || active?.tagName === 'TEXTAREA' || active?.closest('[role="dialog"]') || document.querySelector('[role="dialog"]')) return;
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const selected = selections['local-user'];
        if (selected && selected.length > 0) {
          selected.forEach(id => {
            if (layerIds.includes(id)) {
              deleteLayers([id]);
            } else if (edgeIds.includes(id)) {
              deleteEdge(id);
            }
          });
          setSelection([]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selections, deleteLayers, deleteEdge, setSelection, layerIds, edgeIds]);

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation();
    if (e.ctrlKey) {
      // Zooming
      const zoomSensitivity = 0.005;
      const delta = -e.deltaY * zoomSensitivity;
      setCamera(c => {
        const newZoom = Math.min(Math.max(c.zoom * (1 + delta), 0.1), 5);
        
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        const newX = mouseX - (mouseX - c.x) * (newZoom / c.zoom);
        const newY = mouseY - (mouseY - c.y) * (newZoom / c.zoom);
        
        return { x: newX, y: newY, zoom: newZoom };
      });
    } else {
      // Panning
      setCamera(c => ({
        x: c.x - e.deltaX,
        y: c.y - e.deltaY,
        zoom: c.zoom
      }));
    }
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const isMiddleClick = e.button === 1;
    const isSpacePressed = e.shiftKey; // Fallback if we don't have global spacebar tracking

    const point = getPointerPos(e, camera);

    if (canvasState.mode === CanvasMode.Inserting) {
      const newLayerId = insertLayer(canvasState.layerType, point, { r: 255, g: 255, b: 255 }, undefined, canvasState.agentRole, (canvasState as any).src, getInitialConfig(canvasState.agentRole));
      
      if (canvasState.layerType === LayerType.Slide && (canvasState as any).fileSrc) {
        updateLayer(newLayerId, { 
          fileSrc: (canvasState as any).fileSrc, 
          value: (canvasState as any).fileName 
        });
      }
      
      setCanvasState({ mode: CanvasMode.None });
      return;
    }

    if (canvasState.mode === CanvasMode.Pencil) {
      setPencilDraft([point]);
      return;
    }

    if (isMiddleClick || isSpacePressed) {
      setCanvasState({ mode: CanvasMode.Pressing, origin: { x: e.clientX, y: e.clientY } });
      return;
    }

    if (e.target instanceof SVGElement && e.target.tagName === 'svg') {
      setCanvasState({ mode: CanvasMode.SelectionNet, origin: point, current: point });
      setSelection([]); // Clear selection
      setInspectedNodeId(null); // Close inspector
    }
  }, [canvasState, camera, insertLayer, setSelection, setInspectedNodeId]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    
    if (canvasState.mode === CanvasMode.Pressing) {
      setCamera(c => ({
        x: c.x + e.movementX,
        y: c.y + e.movementY,
        zoom: c.zoom
      }));
    } else if (canvasState.mode === CanvasMode.Resizing) {
      const point = getPointerPos(e, camera);
      const bounds = resizeBounds(
        canvasState.initialBounds,
        canvasState.corner,
        point
      );

      if (Math.abs(bounds.width) > 10 && Math.abs(bounds.height) > 10) {
        updateLayer(selections['local-user'][0], {
          x: bounds.x,
          y: bounds.y,
          width: bounds.width,
          height: bounds.height,
        });
      }
    } else if (canvasState.mode === CanvasMode.Translating) {
      // Adjust movement for zoom scale
      const offset = { 
        x: e.movementX / camera.zoom, 
        y: e.movementY / camera.zoom 
      };
      translateSelectedLayers(offset, selections['local-user'] || []);
    } else if (canvasState.mode === CanvasMode.Pencil && pencilDraft) {
      const point = getPointerPos(e, camera);
      setPencilDraft([...pencilDraft, point]);
    } else if (canvasState.mode === CanvasMode.SelectionNet) {
      const point = getPointerPos(e, camera);
      setCanvasState({ ...canvasState, current: point });
    } else if (canvasState.mode === CanvasMode.Connecting && canvasState.fromNodeId) {
      setCanvasState({ ...canvasState, currentPoint: getPointerPos(e, camera) });
    }
  }, [canvasState, camera, selections, translateSelectedLayers, pencilDraft]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (canvasState.mode === CanvasMode.Pencil && pencilDraft) {
      // Commit drawing
      insertLayer(
        LayerType.Path, 
        pencilDraft[0], 
        { r: 0, g: 0, b: 0 },
        pencilDraft.map(p => [p.x, p.y])
      );
      setPencilDraft(null);
    }

    if (canvasState.mode !== CanvasMode.None && canvasState.mode !== CanvasMode.Pencil && canvasState.mode !== CanvasMode.Inserting && canvasState.mode !== CanvasMode.Connecting) {
      setCanvasState({ mode: CanvasMode.None });
    }
  }, [canvasState, pencilDraft, insertLayer]);

  const onResizeHandlePointerDown = useCallback((corner: Side, initialBounds: XYWH) => {
    setCanvasState({
      mode: CanvasMode.Resizing,
      initialBounds,
      corner
    });
  }, []);

  const onLayerPointerDown = useCallback((e: React.PointerEvent, layerId: string) => {
    if (canvasState.mode === CanvasMode.Pencil || canvasState.mode === CanvasMode.Inserting) return;
    
    e.stopPropagation();

    if (canvasState.mode === CanvasMode.Connecting) {
      if (canvasState.fromNodeId) {
        if (canvasState.fromNodeId !== layerId) {
          insertEdge(canvasState.fromNodeId, layerId);
        }
        setCanvasState({ mode: CanvasMode.None });
      } else {
        setCanvasState({ mode: CanvasMode.Connecting, fromNodeId: layerId, currentPoint: getPointerPos(e, camera) });
      }
      return;
    }
    
    // Add to selection if not already selected
    const currentSelection = selections['local-user'] || [];
    if (!currentSelection.includes(layerId)) {
      setSelection([layerId]);
    }
    
    setCanvasState({ mode: CanvasMode.Translating, current: getPointerPos(e, camera) });
  }, [canvasState, selections, setSelection, camera, insertEdge]);

  const onLayerPointerUp = useCallback((e: React.PointerEvent, layerId: string) => {
    if (canvasState.mode === CanvasMode.Connecting && canvasState.fromNodeId && canvasState.fromNodeId !== layerId) {
      insertEdge(canvasState.fromNodeId, layerId);
      setCanvasState({ mode: CanvasMode.None });
      e.stopPropagation();
    }
  }, [canvasState, insertEdge]);

  const renderLayer = (layerId: string) => {
    const layer = layers[layerId];
    if (!layer) return null;
    
    const isSelected = (selections['local-user'] || []).includes(layerId);
    const nodeSpec = getNodeSpec(layer.agentRole);
    
    return (
      <g 
        key={layerId} 
        transform={`translate(${layer.x}, ${layer.y})`} 
        className={`group ${canvasState.mode === CanvasMode.None ? "cursor-move" : ""}`}
        onPointerDown={(e) => onLayerPointerDown(e, layerId)}
        onPointerUp={(e) => onLayerPointerUp(e, layerId)}
        onDoubleClick={(e) => {
          e.stopPropagation();
          setInspectedNodeId(layerId);
        }}
      >
        {layer.type === LayerType.Slide && (
          <foreignObject
            x={0}
            y={0}
            width={layer.width || 800}
            height={layer.height || 450}
            className="overflow-visible"
          >
            <div 
              className={`w-full h-full flex flex-col ${
                isSelected ? 'ring-2 ring-indigo-500' : 'ring-1 ring-slate-300'
              } bg-transparent pointer-events-none rounded-xl relative`}
            >
              <div className="absolute -top-12 left-0 flex items-center gap-2 pointer-events-auto">
                <div 
                  className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors group/play"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    if ((layer as any).fileSrc) {
                      setPresentationMode({ active: true, layerId });
                      try { document.documentElement.requestFullscreen(); } catch(e) {}
                    }
                  }}
                >
                  <Play className={`w-4 h-4 ${(layer as any).fileSrc ? 'text-indigo-600 fill-indigo-600 group-hover/play:scale-110' : 'text-slate-400'} transition-transform`} />
                  <span className="text-sm font-semibold text-slate-700">{(layer as any).fileName || layer.value || 'Slide / Presentation'}</span>
                </div>
              </div>
              
              <div className="w-full h-full border-2 border-dashed border-slate-300/50 bg-slate-50/80 rounded-xl flex items-center justify-center pointer-events-auto overflow-hidden group/slide" onPointerDown={(e) => {
                if (!isSelected) {
                   onLayerPointerDown(e, layerId);
                } else {
                   e.stopPropagation(); // allow interacting with contents if selected
                }
              }}>
                {(layer as any).fileSrc ? (
                  <div className="w-full h-full relative flex flex-col items-center justify-center bg-white">
                    {/* Render Image or iframe for PDF */}
                    {((layer as any).fileSrc.startsWith('data:image') || (layer as any).fileSrc.match(/\.(jpeg|jpg|gif|png)$/)) ? (
                       <img src={(layer as any).fileSrc} alt="Presentation Slide" className="w-full h-full object-contain bg-white" />
                    ) : ((layer as any).fileSrc.startsWith('data:application/pdf') || (layer as any).fileSrc.endsWith('.pdf')) ? (
                       <iframe src={(layer as any).fileSrc} className="w-full h-full bg-white border-none" title="Presentation Viewer" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-900 text-white relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-violet-500"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent blur-2xl pointer-events-none"></div>
                            <div className="z-10 flex flex-col items-center text-center p-12">
                              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-2xl border border-white/20 backdrop-blur-md">
                                <FileText className="w-10 h-10 text-blue-300 drop-shadow-md" />
                              </div>
                              <h2 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight drop-shadow-md bg-gradient-to-br from-white to-blue-200 bg-clip-text text-transparent">{(layer as any).fileName?.replace(/\.[^/.]+$/, "") || 'Presentation'}</h2>
                              <p className="text-blue-200/80 text-lg mb-8 font-medium max-w-lg">Job Ninjas Interactive Presentation</p>
                            </div>
                         </div>
                    )}
                    <div className="absolute inset-0 bg-transparent" /> {/* Event shield */}
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-8 w-full h-full cursor-pointer hover:bg-slate-100/50 transition-colors">
                    <Presentation className="w-10 h-10 text-indigo-400 mb-3" />
                    <span className="font-semibold text-slate-600 mb-1">Upload Presentation</span>
                    <span className="text-xs text-slate-400">PDF, PPTX, or Images</span>
                    <input 
                      type="file" 
                      accept=".pdf,.pptx,image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const isOfficeDoc = file.name.match(/\.(ppt|pptx|doc|docx)$/i);
                          if (isOfficeDoc) {
                             updateLayer(layerId, { fileName: file.name, value: file.name } as any);
                             const formData = new FormData();
                             formData.append('file', file);
                             fetch('/api/upload', { method: 'POST', body: formData })
                               .then(res => res.json())
                               .then(data => {
                                 if (data.url) updateLayer(layerId, { fileSrc: data.url } as any);
                               })
                               .catch(err => console.error(err));
                          } else {
                             const reader = new FileReader();
                             reader.onload = (event) => {
                               updateLayer(layerId, { fileSrc: event.target?.result as string, fileName: file.name } as any);
                             };
                             reader.readAsDataURL(file);
                          }
                        }
                      }}
                    />
                  </label>
                )}
              </div>
            </div>
          </foreignObject>
        )}
        {layer.type === LayerType.Rectangle && (
          <rect 
            width={layer.width || 250} 
            height={layer.height || 120} 
            fill="#ffffff" 
            stroke={isSelected ? "#3b82f6" : "#e2e8f0"}
            strokeWidth={isSelected ? 2 : 1}
            rx={8}
            className="shadow-md"
          />
        )}
        
        {layer.type === LayerType.Agent && (
          <>
          {layer.agentRole === 'candidate-concierge' ? (
            <foreignObject
              width={Math.max(layer.width || 960, 960)}
              height={Math.max(layer.height || 560, 560)}
              className="overflow-visible"
              style={{ position: 'relative', zIndex: 10 }}
            >
              <CandidateConciergeNode layerId={layerId} layer={layer} isSelected={isSelected} />
            </foreignObject>
          ) : (
          <foreignObject
            width={layer.width || 250}
            height={Math.max(layer.height || 164, 164)}
            className="overflow-visible"
          >
            {layer.agentRole === 'candidate-node' ? (
              <CandidateNodeBlock layer={layer} isSelected={isSelected} />
            ) : ((layer.agentRole === 'word-doc' || layer.agentRole === 'excel-doc') && !(layer as any).displayMode) ? (
              <div className="w-full h-full rounded-2xl border-2 border-indigo-500 shadow-2xl flex flex-col items-center justify-center p-6 bg-white gap-4">
                <div className="text-center space-y-1">
                  <h4 className="font-bold text-foreground text-sm">Display Options</h4>
                  <p className="text-xs text-muted-foreground">How do you want to show this document?</p>
                </div>
                <div className="flex w-full gap-2">
                  <button 
                    onPointerDown={(e) => { 
                      e.stopPropagation(); 
                      updateLayer(layerId, { displayMode: 'doc' } as any); 
                    }}
                    className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer pointer-events-auto"
                  >
                    Doc Mode
                  </button>
                  <button 
                    onPointerDown={(e) => { 
                      e.stopPropagation(); 
                      updateLayer(layerId, {
                        type: LayerType.Slide,
                        width: 800,
                        height: 450,
                        fileSrc: layer.config?.docUrl || undefined,
                        fileName: layer.value || 'Document',
                        agentRole: undefined,
                        status: undefined,
                        displayMode: undefined
                      } as any);
                    }}
                    className="flex-1 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer pointer-events-auto"
                  >
                    <Maximize className="w-3 h-3" />
                    View Mode
                  </button>
                </div>
              </div>
            ) : (
            <div 
              className={`w-full h-full rounded-2xl border flex flex-col overflow-visible bg-white/95 backdrop-blur-xl shadow-lg transition-all duration-200 relative group/node ${
                isSelected 
                  ? 'border-indigo-500 ring-4 ring-indigo-500/15 shadow-indigo-500/20 scale-[1.01] z-30' 
                  : 'border-slate-200/90 hover:border-slate-300 hover:shadow-xl'
              }`}
            >
              {/* Left Input Port Connector (n8n port dot) */}
              <div
                className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-2 border-slate-300 hover:border-indigo-600 flex items-center justify-center cursor-crosshair z-30 transition-transform hover:scale-110 shadow-xs group/inport pointer-events-auto"
                title={`Receives ${nodeSpec.inputs.map((port) => dataTypeLabel(port.type)).join(", ") || "no typed input"}`}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  if (canvasState.mode === CanvasMode.Connecting && canvasState.fromNodeId && canvasState.fromNodeId !== layerId) {
                    insertEdge(canvasState.fromNodeId, layerId);
                    setCanvasState({ mode: CanvasMode.None });
                  }
                }}
              >
                <div className="w-2 h-2 rounded-full bg-slate-400 group-hover/inport:bg-indigo-600" />
              </div>

              {/* Right Output Port Connector (n8n port dot) */}
              <div
                className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-2 border-indigo-500 hover:border-indigo-700 flex items-center justify-center cursor-crosshair z-30 transition-transform hover:scale-110 shadow-xs group/outport pointer-events-auto"
                title={`Sends ${nodeSpec.outputs.map((port) => dataTypeLabel(port.type)).join(", ") || "no typed output"}`}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setCanvasState({
                    mode: CanvasMode.Connecting,
                    fromNodeId: layerId,
                    currentPoint: { x: layer.x + (layer.width || 250), y: layer.y + (layer.height || 164) / 2 }
                  });
                }}
              >
                <div className="w-2 h-2 rounded-full bg-indigo-600 group-hover/outport:scale-125 transition-transform" />
              </div>

              {/* Node Header */}
              <div className="px-3.5 py-2.5 bg-slate-50/90 rounded-t-2xl border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg border text-xs ${nodeSpec.bg} ${nodeSpec.color} flex items-center justify-center`}>
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md border ${nodeSpec.bg} ${nodeSpec.color}`}>
                    {nodeSpec.category}
                  </span>
                </div>

                {/* Status Indicator Pill */}
                <div className="flex items-center gap-1.5">
                  {(() => {
                    const shared = isSharedStep(layer.agentRole);
                    const forPerson = !!layer.agentRole?.startsWith('agent-') && !shared;
                    const scoped = outputForCandidate(layer, forPerson ? activeCandidateId : undefined);
                    const scopedError = forPerson ? (layer.config?.errorsByCandidate?.[activeCandidateId || ''] as string | undefined) : (layer.status === 'error' ? layer.errorDetails : undefined);
                    const running = layer.status === 'running' && (!forPerson || !layer.config?.lastRunCandidateId || layer.config.lastRunCandidateId === activeCandidateId);
                    const upstream = forPerson ? collectUpstreamOutputs(layers, Object.values(edges), layerId, activeCandidateId).outputs : {};
                    const blockers = forPerson ? localRunBlockers(layer.agentRole, upstream, {
                      hasCandidate: !!activeCandidateId,
                      hasResume: activeHasResume !== false,
                      hasJobDescription: !!(currentRole?.jobDescription || outputForCandidate(Object.values(layers).find((item) => (item as { agentRole?: string }).agentRole === 'input-job-details') as { agentRole?: string; outputData?: unknown } | undefined, null)),
                    }) : [];
                    const health = stepHealth({
                      running,
                      hasResult: scoped != null && scoped !== '',
                      hasError: !!scopedError && !running,
                      blocked: forPerson ? (!activeCandidateId || blockers.length > 0) : layer.status === 'error',
                    });
                    const tone = health === 'done'
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      : health === 'blocked'
                      ? 'text-amber-800 bg-amber-50 border-amber-200'
                      : health === 'running'
                      ? 'text-indigo-700 bg-indigo-50 border-indigo-200'
                      : 'text-slate-500 bg-slate-50 border-slate-200';
                    const label = health === 'running' ? 'Running' : health === 'done' ? 'Done' : health === 'blocked' ? 'Blocked' : 'Ready';
                    return (
                      <span title={scopedError || blockers[0] || label} className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${tone} ${health === 'running' ? 'animate-pulse' : ''}`}>
                        {label}
                      </span>
                    );
                  })()}
                </div>
              </div>

              {/* Node Body */}
              <div className="flex-1 px-4 py-3 flex flex-col justify-between bg-white rounded-b-2xl">
                <div>
                  <h4 className="font-bold text-slate-900 text-[14px] leading-tight mb-1">
                    {layer.value || nodeSpec.displayName}
                  </h4>
                  {layer.agentRole?.startsWith('agent-') && !isSharedStep(layer.agentRole) && (
                    <p className="mb-1 text-[10px] font-medium text-indigo-700">
                      {activeCandidateId
                        ? `For ${(notePeople.find((item) => item.id === activeCandidateId) ? `${notePeople.find((item) => item.id === activeCandidateId)?.firstName || ''} ${notePeople.find((item) => item.id === activeCandidateId)?.lastName || ''}`.trim() : 'the selected person')}`
                        : 'Select a person'}
                    </p>
                  )}
                  <p className={`text-[11px] leading-snug ${layer.config?.errorsByCandidate?.[activeCandidateId || ''] ? 'line-clamp-3 text-rose-700' : 'line-clamp-2 text-slate-500'}`}>
                    {(() => {
                      const shared = isSharedStep(layer.agentRole);
                      const forPerson = !!layer.agentRole?.startsWith('agent-') && !shared;
                      const scoped = outputForCandidate(layer, forPerson ? activeCandidateId : undefined);
                      const scopedError = forPerson ? layer.config?.errorsByCandidate?.[activeCandidateId || ''] : (layer.status === 'error' ? layer.errorDetails : undefined);
                      const running = layer.status === 'running' && (!forPerson || !layer.config?.lastRunCandidateId || layer.config.lastRunCandidateId === activeCandidateId);
                      const person = notePeople.find((item) => item.id === activeCandidateId);
                      const personName = person ? `${person.firstName || ''} ${person.lastName || ''}`.trim() : 'the selected person';
                      if (running) return `Running this step for ${personName}…`;
                      if (!forPerson) {
                        if (scopedError) return scopedError;
                        if (scoped != null && scoped !== '') return summarizeAgentOutput(layer.agentRole, scoped);
                        return plainLanguage(layer.agentRole);
                      }
                      if (!activeCandidateId) return 'Select a person in This role. This step will not show someone else’s result.';
                      if (scopedError) return scopedError;
                      if (scoped != null && scoped !== '') return summarizeAgentOutput(layer.agentRole, scoped);
                      return `No result yet for ${personName}.`;
                    })()}
                  </p>
                  {!!layer.agentRole?.startsWith('agent-') && !isSharedStep(layer.agentRole) && layer.config?.errorsByCandidate?.[activeCandidateId || ''] && outputForCandidate(layer, activeCandidateId) != null && (
                    <p className="mt-1 line-clamp-2 text-[10px] leading-snug text-slate-500">
                      Last result: {summarizeAgentOutput(layer.agentRole, outputForCandidate(layer, activeCandidateId))}
                    </p>
                  )}
                  {isSelected && (
                    <p className="mt-1 truncate text-[10px] text-slate-500">
                      In {nodeSpec.inputs.length ? nodeSpec.inputs.map((port) => dataTypeLabel(port.type)).join(" · ") : "—"}
                      {" → "}
                      Out {nodeSpec.outputs.length ? nodeSpec.outputs.map((port) => dataTypeLabel(port.type)).join(" · ") : "—"}
                    </p>
                  )}
                </div>

                {/* Node Action Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
                  <button
                    type="button"
                    aria-label="Open inspector"
                    onClick={(e) => {
                      e.stopPropagation();
                      setInspectedNodeId(layerId);
                    }}
                    className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors pointer-events-auto cursor-pointer"
                  >
                    Inspector
                  </button>

                  <div className="flex items-center gap-1.5">
                    {(layer.agentRole === 'word-doc' || layer.agentRole === 'excel-doc') && (
                      <button 
                        onPointerDown={(e) => { 
                          e.stopPropagation(); 
                          updateLayer(layerId, {
                            type: LayerType.Slide,
                            width: 800,
                            height: 450,
                            fileSrc: layer.config?.docUrl || undefined,
                            fileName: layer.value || 'Document',
                            agentRole: undefined,
                            status: undefined
                          } as any);
                        }}
                        className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer pointer-events-auto"
                      >
                        <Maximize className="w-3 h-3" />
                        View
                      </button>
                    )}

                    {artifactKind(layer.agentRole, outputForCandidate(layer, isSharedStep(layer.agentRole) ? undefined : activeCandidateId)) && (
                      <button
                        type="button"
                        aria-label={`View ${artifactTitle(artifactKind(layer.agentRole, outputForCandidate(layer, isSharedStep(layer.agentRole) ? undefined : activeCandidateId))!)} for ${activeCandidateId ? 'the selected person' : 'this step'}`}
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenResultId(layerId);
                        }}
                        className="px-2 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 rounded-lg pointer-events-auto cursor-pointer"
                      >
                        View
                      </button>
                    )}

                    {layer.agentRole?.startsWith('agent-') && (
                      <button 
                        type="button"
                        aria-label="Test this step"
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleRunSingleAgent(layerId); 
                        }}
                        disabled={layer.status === 'running'}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 pointer-events-auto cursor-pointer"
                        title="Test step"
                      >
                        {layer.status === 'running' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 fill-current" />}
                        Test step
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            )}
          </foreignObject>
          )}
          </>
        )}

        {layer.type === LayerType.Note && (
          <foreignObject
            x={0}
            y={0}
            width={layer.width || 250}
            height={layer.height || 200}
            className="overflow-visible"
          >
            <div 
              className={`w-full h-full rounded-2xl bg-white border flex flex-col overflow-hidden transition-all ${
                isSelected ? 'ring-2 ring-indigo-500 border-indigo-500' : 'border-slate-200'
              }`}
              style={{
                boxShadow: layer.fill ? `0 12px 40px -12px rgba(${layer.fill.r}, ${layer.fill.g}, ${layer.fill.b}, 0.35)` : '0 12px 40px -12px rgba(0,0,0,0.08)'
              }}
            >
              <div 
                className="h-2 w-full shrink-0"
                style={{ backgroundColor: layer.fill ? `rgb(${layer.fill.r}, ${layer.fill.g}, ${layer.fill.b})` : '#fef08a' }}
              />
              <div className="flex items-center justify-between gap-2 px-3 pt-2">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Team note</span>
                <span className="text-[10px] text-slate-400">Agents do not read this.</span>
              </div>
              {isSelected && (
                <div className="flex flex-wrap items-center gap-1 px-3 pt-2" onPointerDown={(e) => e.stopPropagation()}>
                  {NOTE_COLORS.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      title={color.name}
                      aria-label={`${color.name} note color`}
                      onClick={() => updateLayer(layerId, { fill: color.fill })}
                      className="h-4 w-4 rounded-full border border-white/80"
                      style={{ backgroundColor: `rgb(${color.fill.r}, ${color.fill.g}, ${color.fill.b})` }}
                    />
                  ))}
                  <button
                    type="button"
                    aria-pressed={!!(layer as any).config?.pinned}
                    aria-label={(layer as any).config?.pinned ? 'Unpin note' : 'Pin note'}
                    onClick={() => updateLayer(layerId, { config: { ...((layer as any).config || {}), pinned: !(layer as any).config?.pinned } } as any)}
                    className={`rounded-md px-1.5 py-0.5 text-[10px] ${(layer as any).config?.pinned ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}
                  >
                    {(layer as any).config?.pinned ? 'Pinned' : 'Pin'}
                  </button>
                  <select
                    value={(layer as any).config?.candidateId || ''}
                    onChange={(event) => {
                      const person = notePeople.find((item) => item.id === event.target.value);
                      updateLayer(layerId, {
                        config: {
                          ...((layer as any).config || {}),
                          candidateId: person?.id || '',
                          candidateName: person ? `${person.firstName || ''} ${person.lastName || ''}`.trim() : '',
                        },
                      } as any);
                    }}
                    aria-label="Link this note to a person"
                    className="max-w-[140px] rounded-md border border-slate-200 bg-white px-1 py-0.5 text-[10px] text-slate-700"
                    title="Link this note to a person. Agents still do not read it."
                  >
                    <option value="">Not about one person</option>
                    {notePeople.map((person) => (
                      <option key={person.id} value={person.id}>{person.firstName} {person.lastName}</option>
                    ))}
                  </select>
                </div>
              )}
              {(layer as any).config?.candidateName && (
                <p className="px-3 pt-1 text-[10px] text-slate-500">About {(layer as any).config.candidateName}. Agents do not read this.</p>
              )}
              <div className="px-5 pb-4 pt-1 flex-1 flex flex-col bg-slate-50/30">
                <textarea
                  value={layer.value || ""}
                  onChange={(e) => updateLayer(layerId, { value: e.target.value })}
                  placeholder={isSelected ? "Write a note for your team. Agents do not read this." : ""}
                  className={`w-full h-full bg-transparent border-none outline-none resize-none placeholder:text-slate-400 font-medium text-slate-700 text-[13px] leading-relaxed ${!isSelected && 'pointer-events-none'}`}
                  onPointerDown={(e) => isSelected ? e.stopPropagation() : undefined}
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          </foreignObject>
        )}

        {layer.type === LayerType.Ellipse && (
          <ellipse 
            cx={(layer.width || 100) / 2} 
            cy={(layer.height || 100) / 2}
            rx={(layer.width || 100) / 2}
            ry={(layer.height || 100) / 2}
            fill="#f8fafc" 
            stroke={isSelected ? "#3b82f6" : "#cbd5e1"}
            strokeWidth={isSelected ? 2 : 2}
          />
        )}

        {layer.type === LayerType.Path && layer.points && (
          <path
            d={getSvgPathFromStroke(getStroke(layer.points.map(p => [p[0], p[1]]), {
              size: 8,
              thinning: 0.5,
              smoothing: 0.5,
              streamline: 0.5,
            }))}
            fill={layer.fill ? `rgb(${layer.fill.r}, ${layer.fill.g}, ${layer.fill.b})` : "#000"}
          />
        )}

        {layer.type === LayerType.Text && (layer as any).docKind === 'jd' && (
          <foreignObject
            x={0}
            y={0}
            width={layer.width || 280}
            height={layer.height || 220}
          >
            <div className={`flex h-full w-full flex-col overflow-hidden rounded-xl border bg-white shadow-sm ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-200'}`}>
              <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-indigo-700">Job description</span>
                <span className="text-[10px] text-slate-400">Read by JD Parser</span>
              </div>
              <textarea
                value={layer.value || ""}
                aria-label="Job description"
                onChange={(e) => {
                  const value = e.target.value;
                  updateLayer(layerId, { value });
                  const jobId = useBoardStore.getState().layerIds.find((id) => (useBoardStore.getState().layers[id] as { agentRole?: string } | undefined)?.agentRole === 'input-job-details');
                  if (jobId) {
                    updateLayer(jobId, { outputData: value, status: value.trim() ? 'success' : 'idle', errorDetails: undefined });
                  }
                  persistJobDescription(boardId, value);
                }}
                placeholder="Job description for this role"
                className={`w-full flex-1 resize-none bg-transparent px-3 py-2 text-xs leading-relaxed text-slate-700 outline-none ${!isSelected && 'pointer-events-none'}`}
                onPointerDown={(e) => isSelected ? e.stopPropagation() : undefined}
                onKeyDown={(e) => e.stopPropagation()}
              />
            </div>
          </foreignObject>
        )}

        {layer.type === LayerType.Text && (layer as any).docKind !== 'jd' && (
          <foreignObject
            x={0}
            y={0}
            width={layer.width || 300}
            height={layer.height || 100}
          >
            <textarea
              value={layer.value || ""}
              onChange={(e) => updateLayer(layerId, { value: e.target.value })}
              placeholder={isSelected ? "Type text..." : "Text Layer"}
              className={`w-full h-full bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground ${!isSelected && 'pointer-events-none'}`}
              style={{
                fontFamily: (layer as any).fontFamily || 'inherit',
                fontSize: `${(layer as any).fontSize || 24}px`,
                color: (layer as any).color || '#334155',
                fontWeight: 500
              }}
              onPointerDown={(e) => isSelected ? e.stopPropagation() : undefined}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </foreignObject>
        )}

        {layer.type === LayerType.Image && (layer as any).src && (
          <image
            x={0}
            y={0}
            width={layer.width || 100}
            height={layer.height || 100}
            href={(layer as any).src}
            preserveAspectRatio="none"
          />
        )}
        
        {/* Inline editable text for Shapes */}
        {layer.type !== LayerType.Text && layer.type !== LayerType.Agent && layer.type !== LayerType.Image && layer.type !== LayerType.Path && layer.type !== LayerType.Note && layer.type !== LayerType.Slide && (
          <foreignObject
            x={0}
            y={0}
            width={layer.width || 100}
            height={layer.height || 100}
          >
            <div className={`w-full h-full p-4 flex flex-col overflow-hidden justify-center`}>
              <textarea
                value={layer.value || ""}
                onChange={(e) => updateLayer(layerId, { value: e.target.value })}
                placeholder={isSelected ? "Type here..." : ""}
                className={`w-full bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/50 ${!isSelected && 'pointer-events-none'}`}
                style={{
                  textAlign: 'center',
                  fontFamily: (layer as any).fontFamily || 'inherit',
                  fontSize: `${(layer as any).fontSize || 16}px`,
                  color: (layer as any).color || '#334155',
                  height: `${((layer as any).fontSize || 16) * 1.5 * (layer.value?.split('\n').length || 1)}px`,
                  minHeight: `${((layer as any).fontSize || 16) * 1.5}px`
                }}
                onPointerDown={(e) => isSelected ? e.stopPropagation() : undefined}
                onKeyDown={(e) => e.stopPropagation()}
              />
            </div>
          </foreignObject>
        )}

        {/* Quick Add Button on Hover */}
        <g className={`transition-opacity ${quickAddMenuFor === layerId ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          <path 
            d={`M ${layer.width || 100} ${(layer.height || 100) / 2} L ${(layer.width || 100) + 24} ${(layer.height || 100) / 2}`}
            stroke="#3b82f6" 
            strokeWidth="3" 
            markerEnd="url(#arrowhead)"
          />
          <foreignObject
            x={(layer.width || 100) + 16}
            y={(layer.height || 100) / 2 - 250}
            width={400}
            height={500}
            className="overflow-visible"
            style={{ pointerEvents: 'none' }}
          >
            <div className="relative w-full h-full pointer-events-none">
              <div className="absolute top-1/2 left-0 pointer-events-auto flex flex-col gap-2" style={{ transform: 'translateY(-50%)' }}>
                <button
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setQuickAddMenuFor(quickAddMenuFor === layerId ? null : layerId);
                  }}
                  className="w-8 h-8 rounded-full bg-card shadow-lg border border-border flex items-center justify-center text-muted-foreground hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all hover:scale-110 active:scale-95"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    useBoardStore.getState().deleteLayers([layerId]);
                  }}
                  className="w-8 h-8 rounded-full bg-card shadow-lg border border-border flex items-center justify-center text-red-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all hover:scale-110 active:scale-95"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {quickAddMenuFor === layerId && (
                  <div className="absolute left-full top-1/2 ml-2 -translate-y-1/2 bg-card shadow-2xl border border-border rounded-xl p-2 flex flex-col gap-1 w-64 animate-in fade-in zoom-in-95 pointer-events-auto">
                    <div className="text-xs font-semibold text-muted-foreground px-2 py-1 uppercase tracking-wider mb-1 flex justify-between items-center">
                      <span>Add Connected Node</span>
                      <button onClick={(e) => { e.stopPropagation(); setQuickAddMenuFor(null); }} className="hover:text-foreground"><X className="w-3 h-3" /></button>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto pr-1">
                      {AGENTS.map((agent) => (
                        <button
                          key={agent.role}
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            const verdict = validateConnection(layer, { type: LayerType.Agent, agentRole: agent.role });
                            if (!verdict.ok) {
                              setConnectionNotice({ tone: 'error', message: verdict.message });
                              return;
                            }
                            const newId = insertLayer(
                              LayerType.Agent,
                              { x: layer.x + (layer.width || 100) + 100, y: layer.y },
                              { r: 255, g: 255, b: 255 },
                              undefined,
                              agent.role,
                              undefined,
                              getInitialConfig(agent.role)
                            );
                            insertEdge(layerId, newId);
                            setSelection([newId]);
                            setQuickAddMenuFor(null);
                          }}
                          title={plainLanguage(agent.role)}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors group/agent text-left"
                        >
                          <div className={`p-1.5 rounded-md ${agent.bg} ${agent.color}`}>
                            <agent.icon className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium text-foreground group-hover/agent:text-foreground">
                            {agent.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </foreignObject>
        </g>
      </g>
    );
  };

  return (
    <main 
      className="h-full w-full relative touch-none overflow-hidden bg-background" 
      style={{ 
        cursor: canvasState.mode === CanvasMode.Pressing ? 'grabbing' : 
                canvasState.mode === CanvasMode.Inserting ? 'crosshair' : 
                canvasState.mode === CanvasMode.Pencil ? 'crosshair' : 'default' 
      }}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleFileDrop}
      >
      
      {/* === FEATURE 1.5: Blank Canvas Onboarding === */}
      {layerIds.length === 0 && !isDragOver && (
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-4 text-slate-400">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
              <Plus className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-xl font-bold text-slate-300">No pipeline on this role yet</p>
            <p className="text-sm max-w-sm text-center px-4">Pick a hiring template for this job. Add people from This role, then run the steps. Sticky notes stay with your team.</p>
          </div>
        </div>
      )}

      {/* === FEATURE 1: Drag & Drop overlay === */}
      {isDragOver && (
        <div className="absolute inset-0 z-[200] bg-indigo-500/10 border-4 border-dashed border-indigo-400 flex flex-col items-center justify-center pointer-events-none">
          <div className="bg-white rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center gap-3">
            <Upload className="w-12 h-12 text-indigo-600 animate-bounce" />
            <p className="text-xl font-bold text-slate-800">Drop a resume or a job file</p>
            <p className="text-sm text-slate-500 max-w-sm text-center">A resume attaches to the selected person. A job description stays on this role as a document.</p>
          </div>
        </div>
      )}

      {/* Hidden file input for toolbar upload button */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.xlsx,.xls,.csv,.ppt,.pptx"
        className="hidden"
        onChange={(e) => {
          const fakeEvent = { preventDefault: () => {}, dataTransfer: { files: e.target.files }, clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 } as unknown as React.DragEvent;
          if (e.target.files?.length) handleFileDrop(fakeEvent);
        }}
      />

      {connectionNotice && (
        <div className={`absolute top-20 left-1/2 z-[80] flex w-[min(520px,calc(100%-2rem))] -translate-x-1/2 items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-xl ${
          connectionNotice.tone === 'error'
            ? 'border-red-400/40 bg-[#1a1214] text-red-100'
            : 'border-white/10 bg-[#111214] text-white'
        }`}>
          <p className="flex-1 leading-relaxed">{connectionNotice.message}</p>
          <button type="button" onClick={() => setConnectionNotice(null)} className="shrink-0 text-xs opacity-70 hover:opacity-100">
            Dismiss
          </button>
        </div>
      )}

      {/* MCP connectors */}
      {isMcpPanelOpen && (
        <div className="absolute top-0 right-0 h-full w-80 z-[100] bg-white border-l border-slate-200 shadow-2xl flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2">
              <Plug className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-800">MCP Connectors</h3>
            </div>
            <button onClick={() => setIsMcpPanelOpen(false)} className="text-slate-400 hover:text-slate-700 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">Click to add a connector to the canvas</p>
            {MCP_CONNECTORS.map((conn) => (
              <button
                key={conn.agentRole}
                onClick={() => {
                  const cx = (window.innerWidth / 2 - camera.x) / camera.zoom;
                  const cy = (window.innerHeight / 2 - camera.y) / camera.zoom;
                  insertLayer(LayerType.Agent, { x: cx, y: cy }, { r: 255, g: 255, b: 255 }, undefined, conn.agentRole);
                  setIsMcpPanelOpen(false);
                }}
                className="w-full text-left flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                <div className={`p-2 rounded-lg ${conn.bg} ${conn.color} shrink-0 group-hover:scale-110 transition-transform`}>
                  <conn.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{conn.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{conn.desc}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <p className="text-xs text-slate-400 text-center">More connectors coming soon. Connect via custom MCP API.</p>
          </div>
        </div>
      )}

      {/* Fullscreen Presentation Overlay */}
      {presentationMode.active && presentationMode.layerId && (
        <PresentationViewer 
          layers={layers} 
          startLayerId={presentationMode.layerId} 
          onClose={() => setPresentationMode({ active: false })} 
        />
      )}

      <BoardHelp />
      <Toolbar canvasState={canvasState} setCanvasState={setCanvasState} onOpenTemplates={() => setIsTemplatesOpen(true)} />
      <LibraryModal isOpen={isTemplatesOpen} onClose={() => setIsTemplatesOpen(false)} camera={camera} />
      <ZoomControls camera={camera} setCamera={setCamera} />
      <InspectorPanel boardId={boardId} />
      
      {/* Top Left Header / Home Bar (Only shown in standalone new-workflow mode to avoid duplicate header) */}
      {boardId === 'new-workflow' && (
        <div className="absolute top-4 left-4 z-50 flex items-center gap-3">
          <Link 
            href="/roles"
            className="flex items-center justify-center w-10 h-10 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-slate-600 hover:text-indigo-600"
            title="Back to Roles"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm flex items-center gap-2">
            <Workflow className="w-4 h-4 text-indigo-500" />
            <h1 className="font-semibold text-slate-800 text-sm">
              New AI Workflow
            </h1>
          </div>
        </div>
      )}
      
      {/* Top Bar Actions: Upload Resumes + Integrations + Run */}
      <div className="absolute top-16 left-1/2 z-30 flex w-[min(640px,calc(100vw-2rem))] -translate-x-1/2 flex-col items-center gap-2 sm:top-4">
        <div className="flex max-w-full flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          aria-label="Upload a resume for the selected person"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-3 py-2 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 hover:bg-white shadow-xs hover:shadow-sm transition-all cursor-pointer"
          title="Upload a resume for the selected person"
        >
          <Upload className="w-3.5 h-3.5 text-indigo-600" />
          Upload resume
        </button>
        <button
          type="button"
          aria-label="Open integrations"
          aria-pressed={isMcpPanelOpen}
          onClick={() => setIsMcpPanelOpen(v => !v)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer ${isMcpPanelOpen ? 'bg-indigo-600 text-white border border-indigo-600' : 'bg-white/95 backdrop-blur-md border border-slate-200/80 text-slate-700 hover:bg-white hover:shadow-sm'}`}
          title="Connect Greenhouse, Workday, Gmail, Calendar..."
        >
          <Plug className="w-3.5 h-3.5 text-emerald-600" />
          Integrations
        </button>
        <button
          type="button"
          aria-label="Run pipeline for the selected person"
          onClick={runWorkflow}
          disabled={isRunning}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer ${isRunning ? 'bg-indigo-300 text-white cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
          title="Run each step in order for the selected person. Earlier results stay on the steps."
        >
          {isRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          {isRunning ? 'Running pipeline…' : 'Run pipeline'}
        </button>
        </div>
        {runQueue && (
          <div className="w-full rounded-lg border border-white/10 bg-[#111214] px-3 py-2 text-xs text-white shadow-xl">
            <p>Running <span className="font-medium">{runQueue.active}</span> for the selected person.</p>
            <p className="mt-1 text-[#b1b3b8]">{runQueue.next.length ? `Next: ${runQueue.next.join(' → ')}` : 'This is the last step.'}</p>
          </div>
        )}
        {activeCandidateId && (
          <p className="pointer-events-none text-[11px] text-slate-600">
            Showing {notePeople.find((item) => item.id === activeCandidateId) ? `${notePeople.find((item) => item.id === activeCandidateId)?.firstName || ''} ${notePeople.find((item) => item.id === activeCandidateId)?.lastName || ''}`.trim() : 'the selected person'}. Done, ready, and blocked are for this person.
          </p>
        )}
        {!activeCandidateId && !runQueue && (
          <p className="pointer-events-none text-[11px] text-slate-500">Select a person in This role. Steps stay blank until you do.</p>
        )}
      </div>

      {/* Grid Pattern and Arrowhead */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        <defs>
          <pattern id="grid-pattern" x={camera.x % (24 * camera.zoom)} y={camera.y % (24 * camera.zoom)} width={24 * camera.zoom} height={24 * camera.zoom} patternUnits="userSpaceOnUse">
            <circle cx={1 * camera.zoom} cy={1 * camera.zoom} r={1} fill="#cbd5e1" />
          </pattern>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
          </marker>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>

      <svg
        className="h-full w-full absolute inset-0 z-10"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <g style={{ transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})` }}>
          {/* Render edges */}
          {edgeIds.map(edgeId => {
            const edge = edges[edgeId];
            if (!edge) return null;
            const fromLayer = layers[edge.fromNodeId];
            const toLayer = layers[edge.toNodeId];
            if (!fromLayer || !toLayer) return null;
            
            const startCenter = { x: fromLayer.x + (fromLayer.width || 100) / 2, y: fromLayer.y + (fromLayer.height || 100) / 2 };
            const endCenter = { x: toLayer.x + (toLayer.width || 100) / 2, y: toLayer.y + (toLayer.height || 100) / 2 };

            const p1 = getBoxIntersection(endCenter.x, endCenter.y, fromLayer.x, fromLayer.y, fromLayer.width || 100, fromLayer.height || 100, 0);
            const p2 = getBoxIntersection(startCenter.x, startCenter.y, toLayer.x, toLayer.y, toLayer.width || 100, toLayer.height || 100, 16);
            
            const isSelected = selections['local-user']?.includes(edgeId);
            const verdict = validateConnection(fromLayer, toLayer, [], { ignoreDuplicate: true });
            const carries = edge.carries?.length ? edge.carries : verdict.carries;
            const incompatible = !verdict.ok;
            const edgeLabel = incompatible
              ? "Incompatible"
              : carries.length > 2
                ? `${carries.slice(0, 2).join(" · ")} +${carries.length - 2}`
                : carries.join(" · ");
            const edgeTitle = incompatible ? verdict.message : `This connection carries ${carries.join(", ")}.`;
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;
            
            const isNoteOrDoc = (l: any) => l.type === LayerType.Note || l.agentRole === 'word-doc' || l.agentRole === 'excel-doc';
            let pathD = `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;

            return (
              <g key={edgeId}>
                <title>{edgeTitle}</title>
                <path
                  d={pathD}
                  stroke={incompatible ? "#e11d48" : isSelected ? "#5e6ad2" : "#64748b"}
                  strokeWidth={isSelected ? "4" : "3"}
                  strokeDasharray={incompatible ? "2,6" : "6,6"}
                  fill="none"
                  markerEnd="url(#arrowhead)"
                  pointerEvents="auto"
                  className="cursor-pointer transition-all hover:stroke-blue-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelection([edgeId]);
                  }}
                />
                {(carries.length > 0 || incompatible) && (
                  <foreignObject x={midX - 80} y={midY - 22} width={160} height={28} className="overflow-visible pointer-events-none">
                    <div className={`mx-auto w-fit max-w-[160px] truncate rounded-full border px-2 py-0.5 text-center text-[10px] font-semibold ${
                      incompatible ? "border-red-200 bg-red-50 text-red-700" : "border-slate-200 bg-white text-slate-600"
                    }`}>
                      {edgeLabel}
                    </div>
                  </foreignObject>
                )}
                {isSelected && (
                  <EdgeToolbar edgeId={edgeId} zoom={camera.zoom} />
                )}
              </g>
            );
          })}

          {[...layerIds].sort((a, b) => {
            const isSlideA = layers[a]?.type === LayerType.Slide ? -1 : 1;
            const isSlideB = layers[b]?.type === LayerType.Slide ? -1 : 1;
            return isSlideA - isSlideB;
          }).map(layerId => renderLayer(layerId))}

          {/* Render in-progress edge */}
          {canvasState.mode === CanvasMode.Connecting && canvasState.fromNodeId && canvasState.currentPoint && (
            (() => {
              const fromLayer = layers[canvasState.fromNodeId];
              if (!fromLayer) return null;
              const startCenter = { x: fromLayer.x + (fromLayer.width || 100) / 2, y: fromLayer.y + (fromLayer.height || 100) / 2 };
              const p1 = getBoxIntersection(canvasState.currentPoint.x, canvasState.currentPoint.y, fromLayer.x, fromLayer.y, fromLayer.width || 100, fromLayer.height || 100, 0);
              const p2 = canvasState.currentPoint;
              
              const isNoteOrDoc = fromLayer.type === LayerType.Note || fromLayer.agentRole === 'word-doc' || fromLayer.agentRole === 'excel-doc';
              let pathD = `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;

              return (
                <path
                  d={pathD}
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                  pointerEvents="none"
                />
              );
            })()
          )}

          {/* Render in-progress drawing */}
          {pencilDraft && pencilDraft.length > 0 && (
            <path
              d={getSvgPathFromStroke(getStroke(pencilDraft.map(p => [p.x, p.y]), {
                size: 8,
                thinning: 0.5,
                smoothing: 0.5,
                streamline: 0.5,
              }))}
              fill="#3b82f6"
            />
          )}
          
          {/* Render selection net */}
          {canvasState.mode === CanvasMode.SelectionNet && canvasState.current && (
            <rect
              x={Math.min(canvasState.origin.x, canvasState.current.x)}
              y={Math.min(canvasState.origin.y, canvasState.current.y)}
              width={Math.abs(canvasState.origin.x - canvasState.current.x)}
              height={Math.abs(canvasState.origin.y - canvasState.current.y)}
              fill="rgba(59, 130, 246, 0.1)"
              stroke="#3b82f6"
              strokeWidth={1}
            />
          )}

          {/* Edge selected: Quick add in between */}
          {selections['local-user']?.length === 1 && edges[selections['local-user'][0]] && (
            (() => {
              const edgeId = selections['local-user'][0];
              const edge = edges[edgeId];
              if (!edge) return null;
              
              const fromLayer = layers[edge.fromNodeId];
              const toLayer = layers[edge.toNodeId];
              if (!fromLayer || !toLayer) return null;

              const startCenter = { x: fromLayer.x + (fromLayer.width || 100) / 2, y: fromLayer.y + (fromLayer.height || 100) / 2 };
              const endCenter = { x: toLayer.x + (toLayer.width || 100) / 2, y: toLayer.y + (toLayer.height || 100) / 2 };

              const midX = (startCenter.x + endCenter.x) / 2;
              const midY = (startCenter.y + endCenter.y) / 2;

              return (
                <g>
                  <foreignObject
                    x={midX - 250}
                    y={midY - 250}
                    width={500}
                    height={500}
                    className="overflow-visible"
                    style={{ pointerEvents: 'none' }}
                  >
                    <div className="relative w-full h-full pointer-events-none">
                      <div className="absolute top-1/2 left-1/2 pointer-events-auto flex flex-col gap-2" style={{ transform: 'translate(-50%, -50%)' }}>
                        <button
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setQuickAddMenuFor(quickAddMenuFor === edgeId ? null : edgeId);
                          }}
                          className="w-8 h-8 rounded-full bg-card shadow-lg border border-border flex items-center justify-center text-muted-foreground hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all hover:scale-110 active:scale-95"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                        <button
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            deleteEdge(edgeId);
                            setSelection([]);
                          }}
                          className="w-8 h-8 rounded-full bg-card shadow-lg border border-border flex items-center justify-center text-red-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all hover:scale-110 active:scale-95"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        {quickAddMenuFor === edgeId && (
                          <div className="absolute top-1/2 left-full ml-2 -translate-y-1/2 bg-card shadow-2xl border border-border rounded-xl p-2 flex flex-col gap-1 w-64 animate-in fade-in zoom-in-95 pointer-events-auto">
                            <div className="text-xs font-semibold text-muted-foreground px-2 py-1 uppercase tracking-wider mb-1 flex justify-between items-center">
                              <span>Insert Node Between</span>
                              <button onClick={(e) => { e.stopPropagation(); setQuickAddMenuFor(null); }} className="hover:text-foreground"><X className="w-3 h-3" /></button>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto pr-1">
                              {AGENTS.map((agent) => (
                                <button
                                  key={agent.role}
                                  onPointerDown={(e) => e.stopPropagation()}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    const middle = { type: LayerType.Agent, agentRole: agent.role };
                                    const intoMiddle = validateConnection(fromLayer, middle);
                                    const outOfMiddle = validateConnection(middle, toLayer);
                                    if (!intoMiddle.ok || !outOfMiddle.ok) {
                                      setConnectionNotice({
                                        tone: 'error',
                                        message: !intoMiddle.ok ? intoMiddle.message : outOfMiddle.message,
                                      });
                                      return;
                                    }
                                    const newId = insertLayer(
                                      LayerType.Agent,
                                      { x: midX - 125, y: midY - 60 },
                                      { r: 255, g: 255, b: 255 },
                                      undefined,
                                      agent.role,
                                      undefined,
                                      getInitialConfig(agent.role)
                                    );
                                    deleteEdge(edgeId);
                                    insertEdge(edge.fromNodeId, newId);
                                    insertEdge(newId, edge.toNodeId);
                                    setSelection([newId]);
                                    setQuickAddMenuFor(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors group text-left"
                                >
                                  <div className={`p-1.5 rounded-md ${agent.bg} ${agent.color}`}>
                                    <agent.icon className="w-4 h-4" />
                                  </div>
                                  <span className="text-sm font-medium text-foreground group-hover:text-foreground">
                                    {agent.label}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </foreignObject>
                </g>
              );
            })()
          )}

          {/* Render SelectionBox for resizing if exactly one layer is selected */}
          {selections['local-user']?.length === 1 && layers[selections['local-user'][0]] && (
            (() => {
              const layerId = selections['local-user'][0];
              const layer = layers[layerId];
              if (!layer) return null;
              
              // Only rectangles, ellipses, text, notes, images, agents have bounding boxes.
              // Paths do too but they might require different logic. Let's just pass the bounds.
              const bounds = {
                x: layer.x,
                y: layer.y,
                width: layer.width || 100,
                height: layer.height || 100
              };

              return (
                <g>
                  <SelectionBox
                    bounds={bounds}
                    zoom={camera.zoom}
                    onResizeHandlePointerDown={onResizeHandlePointerDown}
                  />
                  <FloatingToolbar
                    layerId={layerId}
                    bounds={bounds}
                    zoom={camera.zoom}
                  />
                </g>
              );
            })()
          )}
        </g>
      </svg>
      {openResultId && layers[openResultId] && artifactKind((layers[openResultId] as { agentRole?: string }).agentRole, outputForCandidate(layers[openResultId] as { agentRole?: string; outputData?: unknown }, isSharedStep((layers[openResultId] as { agentRole?: string }).agentRole) ? undefined : activeCandidateId)) && (
        <ArtifactSheet
          key={`${openResultId}-${activeCandidateId || 'role'}`}
          kind={artifactKind((layers[openResultId] as { agentRole?: string }).agentRole, outputForCandidate(layers[openResultId] as { agentRole?: string; outputData?: unknown }, isSharedStep((layers[openResultId] as { agentRole?: string }).agentRole) ? undefined : activeCandidateId))!}
          data={outputForCandidate(layers[openResultId] as { agentRole?: string; outputData?: unknown }, isSharedStep((layers[openResultId] as { agentRole?: string }).agentRole) ? undefined : activeCandidateId)}
          candidateName={(() => {
            const person = notePeople.find((item) => item.id === activeCandidateId);
            return person ? `${person.firstName || ''} ${person.lastName || ''}`.trim() : undefined;
          })()}
          candidateSelected={!!activeCandidateId}
          onSelectCandidate={() => {
            const id = window.localStorage.getItem('activeCandidateId');
            if (!id) return;
            const person = notePeople.find((item) => item.id === id);
            window.dispatchEvent(new CustomEvent('candidateChanged', { detail: { candidate: person || { id } } }));
          }}
          onClose={() => setOpenResultId(null)}
          onSaveOutreach={(next) => saveResultEdit('outreach', window.localStorage.getItem('activeCandidateId'), next)}
          onSaveShortlist={(next) => saveResultEdit('shortlist', window.localStorage.getItem('activeCandidateId'), next)}
          onSaveSchedule={(next) => saveResultEdit('schedule', window.localStorage.getItem('activeCandidateId'), next)}
        />
      )}
    </main>
  );
};

























