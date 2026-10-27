import { create } from 'zustand';
import { CanvasMode, CanvasState, Color, Layer, LayerType, Point, XYWH, Side, Edge } from '@/types/canvas';
import { getNodeSpec } from '@/lib/agents/node-specs';
import { BoardIntake, composeJobDescription, scaffoldFromIntake, validateConnection } from '@/lib/agents/contracts';

export interface ConnectionNotice {
  tone: 'error' | 'ok';
  message: string;
}

interface BoardState {
  layerIds: string[];
  layers: Record<string, Layer>;
  edgeIds: string[];
  edges: Record<string, Edge>;
  selections: Record<string, string[]>; // connectionId -> layerIds[]
  pencilDraft: [number, number, number][] | null;
  penColor: Color;
  
  // Actions to replace Liveblocks mutations
  setLayerIds: (ids: string[]) => void;
  setLayers: (layers: Record<string, Layer>) => void;
  setEdges: (edges: Record<string, Edge>) => void;
  setEdgeIds: (ids: string[]) => void;
  insertLayer: (layerType: LayerType, position: Point, color: Color, points?: number[][], agentRole?: string, src?: string, config?: any) => string;
  insertEdge: (fromNodeId: string, toNodeId: string) => void;
  insertTemplate: (templateId: string, startPos: Point) => void;
  translateSelectedLayers: (offset: Point, selection: string[]) => void;
  updateLayer: (id: string, partial: Partial<Layer>) => void;
  deleteLayers: (ids: string[]) => void;
  deleteEdge: (id: string) => void;
  setSelection: (ids: string[]) => void;
  
  inspectedNodeId: string | null;
  setInspectedNodeId: (id: string | null) => void;
  connectionNotice: ConnectionNotice | null;
  setConnectionNotice: (notice: ConnectionNotice | null) => void;
  loadScaffold: (intake: BoardIntake) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  layerIds: [],
  layers: {},
  edgeIds: [],
  edges: {},
  selections: {
    'local-user': []
  },
  pencilDraft: null,
  penColor: { r: 0, g: 0, b: 0 },
  inspectedNodeId: null,
  connectionNotice: null,

  setLayerIds: (ids) => set({ layerIds: ids }),
  setLayers: (layers) => set({ layers }),
  setEdges: (edges) => set({ edges }),
  setEdgeIds: (ids) => set({ edgeIds: ids }),
  setInspectedNodeId: (id) => set({ inspectedNodeId: id }),
  setConnectionNotice: (notice) => set({ connectionNotice: notice }),
  
  insertLayer: (layerType, position, color, points?, agentRole?, src?, config?) => {
    const id = Math.random().toString(36).substring(7);
    const width = layerType === LayerType.Agent ? 250 : layerType === LayerType.Slide ? 800 : 100;
    const height = layerType === LayerType.Agent ? 176 : layerType === LayerType.Slide ? 450 : 100;
    const nodeSpec = agentRole ? getNodeSpec(agentRole) : null;
    const defaultAgentValue = nodeSpec ? nodeSpec.displayName : (agentRole ? agentRole.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Custom Agent');
    
    const newLayer = {
      type: layerType,
      x: position.x,
      y: position.y,
      height,
      width,
      fill: color,
      value: layerType === LayerType.Agent ? defaultAgentValue : undefined,
      ...(points ? { points } : {}),
      ...(agentRole ? { agentRole, status: 'idle' } : {}),
      ...(src ? { src } : {}),
      ...(config ? { config } : {})
    } as Layer;

    set((state) => ({
      layerIds: [...state.layerIds, id],
      layers: { ...state.layers, [id]: newLayer },
      selections: { ...state.selections, 'local-user': [id] }
    }));
    
    return id;
  },

  insertEdge: (fromNodeId, toNodeId) => {
    const state = get();
    const verdict = validateConnection(state.layers[fromNodeId], state.layers[toNodeId], Object.values(state.edges), {
      fromId: fromNodeId,
      toId: toNodeId,
    });
    if (!verdict.ok) {
      set({ connectionNotice: { tone: 'error', message: verdict.message } });
      return;
    }
    const id = Math.random().toString(36).substring(7);
    const newEdge: Edge = {
      id,
      fromNodeId,
      toNodeId,
      carries: verdict.carries,
      label: verdict.carries.join(' · '),
    };
    set((current) => ({
      edgeIds: [...current.edgeIds, id],
      edges: { ...current.edges, [id]: newEdge },
      connectionNotice: { tone: 'ok', message: verdict.message },
    }));
  },

  loadScaffold: (intake) => {
    const plan = scaffoldFromIntake(intake);
    const jdText = composeJobDescription(intake);
    const state = get();
    const tagged = state.layerIds.some((id) => (state.layers[id] as { config?: { fromIntake?: boolean } })?.config?.fromIntake);
    const remove = new Set<string>();
    for (const id of state.layerIds) {
      const layer = state.layers[id] as { type?: LayerType; value?: string; config?: { fromIntake?: boolean; pinned?: boolean } } | undefined;
      if (!layer) continue;
      if (layer.config?.fromIntake) {
        remove.add(id);
        continue;
      }
      if (layer.config?.pinned) continue;
      if (tagged) continue;
      if (layer.type === LayerType.Agent) remove.add(id);
      else if (layer.type === LayerType.Note && String(layer.value || '').includes('Pipeline:')) remove.add(id);
    }

    const layers: Record<string, Layer> = { ...state.layers };
    const layerIds = state.layerIds.filter((id) => !remove.has(id));
    for (const id of remove) delete layers[id];

    let shiftX = 0;
    for (const id of layerIds) {
      const layer = layers[id];
      if (!layer) continue;
      shiftX = Math.max(shiftX, (layer.x || 0) + (layer.width || 240) + 48);
    }
    const keptCount = layerIds.length;

    const idByKey: Record<string, string> = {};
    for (const node of plan.nodes) {
      const id = Math.random().toString(36).substring(2, 9);
      idByKey[node.key] = id;
      layerIds.push(id);
      const config = { fromIntake: true, scaffoldKey: node.key };
      if (node.kind === 'note') {
        layers[id] = {
          type: LayerType.Note,
          x: node.x + shiftX,
          y: node.y,
          width: 280,
          height: 320,
          fill: { r: 94, g: 106, b: 210 },
          value: node.text || '',
          config,
        } as Layer;
      } else {
        const spec = getNodeSpec(node.role);
        const carriesJd = node.role === 'input-job-details' && !!jdText;
        layers[id] = {
          type: LayerType.Agent,
          x: node.x + shiftX,
          y: node.y,
          width: 260,
          height: 176,
          fill: { r: 255, g: 255, b: 255 },
          value: spec.displayName,
          agentRole: node.role,
          status: carriesJd ? 'success' : 'idle',
          outputData: carriesJd ? jdText : undefined,
          config,
        };
      }
    }

    if (jdText) {
      const jdId = Math.random().toString(36).substring(2, 9);
      layerIds.push(jdId);
      layers[jdId] = {
        type: LayerType.Text,
        x: 70 + shiftX,
        y: 440,
        width: 280,
        height: 220,
        fill: { r: 255, g: 255, b: 255 },
        value: jdText,
        fileName: `${intake.roleTitle || 'Role'} job description`,
        docKind: 'jd',
        fontSize: 13,
        config: { fromIntake: true, scaffoldKey: 'jd-doc' },
      } as Layer;
    }

    const edges: Record<string, Edge> = {};
    const edgeIds: string[] = [];
    for (const id of state.edgeIds) {
      const edge = state.edges[id];
      if (!edge || remove.has(edge.fromNodeId) || remove.has(edge.toNodeId)) continue;
      edgeIds.push(id);
      edges[id] = edge;
    }
    for (const link of plan.edges) {
      const fromNodeId = idByKey[link.from];
      const toNodeId = idByKey[link.to];
      const verdict = validateConnection(layers[fromNodeId], layers[toNodeId]);
      if (!verdict.ok) continue;
      const id = Math.random().toString(36).substring(2, 9);
      edgeIds.push(id);
      edges[id] = {
        id,
        fromNodeId,
        toNodeId,
        carries: verdict.carries,
        label: verdict.carries.join(' · '),
      };
    }

    const summary = keptCount > 0
      ? `${plan.summary} Documents and team notes already on this board were kept.`
      : plan.summary;

    set({
      layerIds,
      layers,
      edgeIds,
      edges,
      selections: { 'local-user': [] },
      inspectedNodeId: null,
      connectionNotice: { tone: 'ok', message: summary },
    });
  },

  insertTemplate: (templateId, startPos) => {
    set((state) => {
      let newLayerIds = [...state.layerIds];
      let newLayers = { ...state.layers };
      let newEdgeIds = [...state.edgeIds];
      let newEdges = { ...state.edges };

      const addNode = (type: LayerType, x: number, y: number, value: string, agentRole?: string) => {
        const id = Math.random().toString(36).substring(7);
        newLayerIds.push(id);
        const width = 250;
        const height = 164;
        newLayers[id] = {
          type, x, y, width, height, fill: { r: 255, g: 255, b: 255 }, value, agentRole



        } as Layer;
        return id;
      };

      const addEdge = (fromId: string, toId: string) => {
        const verdict = validateConnection(newLayers[fromId], newLayers[toId], Object.values(newEdges), {
          fromId,
          toId,
        });
        if (!verdict.ok) return;
        const id = Math.random().toString(36).substring(7);
        newEdgeIds.push(id);
        newEdges[id] = { id, fromNodeId: fromId, toNodeId: toId, carries: verdict.carries, label: verdict.carries.join(' · ') };
      };

      if (templateId === 'ultimate-recruiter' || templateId === 'standard') {
        const inputId = addNode(LayerType.Agent, startPos.x, startPos.y, 'Job Details', 'input-job-details');
        const resumeId = addNode(LayerType.Agent, startPos.x + 350, startPos.y, 'Resume Intelligence', 'agent-resume');
        const gateId = addNode(LayerType.Agent, startPos.x + 700, startPos.y, 'Shortlist Gate', 'gate-shortlist');
        const interviewGenId = addNode(LayerType.Agent, startPos.x + 1050, startPos.y, 'Interview Planning', 'agent-interview-plan');
        const transcriptId = addNode(LayerType.Agent, startPos.x + 1400, startPos.y, 'Interview Analysis', 'agent-interview-analysis');
        const decisionId = addNode(LayerType.Agent, startPos.x + 1750, startPos.y, 'Candidate Decision', 'agent-decision');
        const conciergeId = addNode(LayerType.Agent, startPos.x + 2100, startPos.y, 'Candidate Concierge', 'agent-concierge');
        
        addEdge(inputId, resumeId);
        addEdge(resumeId, gateId);
        addEdge(gateId, interviewGenId);
        addEdge(interviewGenId, transcriptId);
        addEdge(transcriptId, decisionId);
        addEdge(decisionId, conciergeId);
      } else if (templateId === 'tech-talent-scout') {
        const inputId = addNode(LayerType.Agent, startPos.x, startPos.y, 'Job Details', 'input-job-details');
        const resumeId = addNode(LayerType.Agent, startPos.x + 350, startPos.y, 'Resume Intelligence', 'agent-resume');
        const interviewId = addNode(LayerType.Agent, startPos.x + 700, startPos.y, 'Interview Planning', 'agent-interview-plan');
        const analysisId = addNode(LayerType.Agent, startPos.x + 1050, startPos.y, 'Interview Analysis', 'agent-interview-analysis');
        
        addEdge(inputId, resumeId);
        addEdge(resumeId, interviewId);
        addEdge(interviewId, analysisId);
      } else if (templateId === 'volume-hiring') {
        const candId = addNode(LayerType.Agent, startPos.x, startPos.y, 'Candidate Input', 'input-candidate');
        const resumeId = addNode(LayerType.Agent, startPos.x + 350, startPos.y, 'Resume Intelligence', 'agent-resume');
        const decisionId = addNode(LayerType.Agent, startPos.x + 700, startPos.y, 'Candidate Decision', 'agent-decision');
        
        addEdge(candId, resumeId);
        addEdge(resumeId, decisionId);
      } else if (templateId === 'executive-headhunter' || templateId === 'executive') {
        const inputId = addNode(LayerType.Agent, startPos.x, startPos.y, 'Job Details', 'input-job-details');
        const resumeId = addNode(LayerType.Agent, startPos.x + 350, startPos.y, 'Resume Intelligence', 'agent-resume');
        const interviewId = addNode(LayerType.Agent, startPos.x + 700, startPos.y, 'Interview Planning', 'agent-interview-plan');
        const decisionId = addNode(LayerType.Agent, startPos.x + 1050, startPos.y, 'Candidate Decision', 'agent-decision');
        const conciergeId = addNode(LayerType.Agent, startPos.x + 1400, startPos.y, 'Candidate Concierge', 'agent-concierge');
        
        addEdge(inputId, resumeId);
        addEdge(resumeId, interviewId);
        addEdge(interviewId, decisionId);
        addEdge(decisionId, conciergeId);
      } else if (templateId === 'university-recruiting') {
        const sourceId = addNode(LayerType.Agent, startPos.x, startPos.y, 'Sourcing Agent', 'sourcing-agent');
        const bgId = addNode(LayerType.Agent, startPos.x + 350, startPos.y, 'Background Checker', 'background-checker');
        const techId = addNode(LayerType.Agent, startPos.x + 700, startPos.y, 'Tech Assessor', 'tech-assessor');
        const onboardId = addNode(LayerType.Agent, startPos.x + 1050, startPos.y, 'Onboarding Agent', 'onboarding-agent');
        
        addEdge(sourceId, bgId);
        addEdge(bgId, techId);
        addEdge(techId, onboardId);
      }

      return {
        layerIds: newLayerIds,
        layers: newLayers,
        edgeIds: newEdgeIds,
        edges: newEdges
      };
    });
  },

  translateSelectedLayers: (offset, selection) => {
    set((state) => {
      const newLayers = { ...state.layers };
      for (const id of selection) {
        if (newLayers[id]) {
          newLayers[id] = {
            ...newLayers[id],
            x: newLayers[id].x + offset.x,
            y: newLayers[id].y + offset.y,
          };
        }
      }
      return { layers: newLayers };
    });
  },

  updateLayer: (id, partial) => {
    set((state) => ({
      layers: {
        ...state.layers,
        [id]: { ...state.layers[id], ...partial }
      }
    }));
  },

  deleteLayers: (ids) => {
    set((state) => {
      const newLayerIds = state.layerIds.filter(id => !ids.includes(id));
      const newLayers = { ...state.layers };
      for (const id of ids) {
        delete newLayers[id];
      }
      
      // Also delete any edges connected to these nodes, or edges that are directly selected
      const newEdgeIds = state.edgeIds.filter(edgeId => {
        const edge = state.edges[edgeId];
        return !ids.includes(edgeId) && !ids.includes(edge.fromNodeId) && !ids.includes(edge.toNodeId);
      });
      const newEdges = { ...state.edges };
      for (const edgeId of state.edgeIds) {
        if (!newEdgeIds.includes(edgeId)) {
          delete newEdges[edgeId];
        }
      }

      return { layerIds: newLayerIds, layers: newLayers, edgeIds: newEdgeIds, edges: newEdges };
    });
  },

  deleteEdge: (id) => {
    set((state) => {
      const newEdgeIds = state.edgeIds.filter(edgeId => edgeId !== id);
      const newEdges = { ...state.edges };
      delete newEdges[id];
      return { edgeIds: newEdgeIds, edges: newEdges };
    });
  },

  setSelection: (ids) => {
    set((state) => ({
      selections: { ...state.selections, 'local-user': ids }
    }));
  }
}));
