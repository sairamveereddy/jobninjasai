import { create } from 'zustand';
import { CanvasMode, CanvasState, Color, Layer, LayerType, Point, XYWH, Side, Edge } from '@/types/canvas';

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

  setLayerIds: (ids) => set({ layerIds: ids }),
  setLayers: (layers) => set({ layers }),
  setEdges: (edges) => set({ edges }),
  setEdgeIds: (ids) => set({ edgeIds: ids }),
  setInspectedNodeId: (id) => set({ inspectedNodeId: id }),
  
  insertLayer: (layerType, position, color, points?, agentRole?, src?, config?) => {
    const id = Math.random().toString(36).substring(7);
    const width = layerType === LayerType.Agent ? 250 : layerType === LayerType.Slide ? 800 : 100;
    const height = layerType === LayerType.Agent ? 164 : layerType === LayerType.Slide ? 450 : 100;
    const defaultAgentValue = agentRole ? agentRole.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Custom Agent';
    
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
    const id = Math.random().toString(36).substring(7);
    const newEdge: Edge = {
      id,
      fromNodeId,
      toNodeId,
    };
    set((state) => ({
      edgeIds: [...state.edgeIds, id],
      edges: { ...state.edges, [id]: newEdge }
    }));
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
        const id = Math.random().toString(36).substring(7);
        newEdgeIds.push(id);
        newEdges[id] = { id, fromNodeId: fromId, toNodeId: toId };
      };

      if (templateId === 'ultimate-recruiter' || templateId === 'standard') {
        const inputId = addNode(LayerType.Agent, startPos.x, startPos.y, 'Input / Job Details', 'entry-node');
        const dbId = addNode(LayerType.Agent, startPos.x, startPos.y + 180, 'Database Connector', 'database-connector');
        
        const sourceId = addNode(LayerType.Agent, startPos.x + 350, startPos.y, 'Sourcing Agent', 'sourcing-agent');
        const resumeId = addNode(LayerType.Agent, startPos.x + 700, startPos.y, 'Resume Verifier', 'resume-verifier');
        const techId = addNode(LayerType.Agent, startPos.x + 700, startPos.y + 180, 'Tech Assessor', 'tech-assessor');
        
        const interviewGenId = addNode(LayerType.Agent, startPos.x + 1050, startPos.y, 'Interview Topic Gen', 'interview-topic-generator');
        const cultureId = addNode(LayerType.Agent, startPos.x + 1050, startPos.y + 180, 'Culture Fit Interviewer', 'culture-fit-interviewer');
        const transcriptId = addNode(LayerType.Agent, startPos.x + 1400, startPos.y, 'Transcript Analyzer', 'transcript-analyzer');
        
        const rankerId = addNode(LayerType.Agent, startPos.x + 1750, startPos.y, 'Candidate Ranker', 'candidate-ranker');
        
        const offerId = addNode(LayerType.Agent, startPos.x + 2100, startPos.y, 'Offer Negotiator', 'offer-negotiator');
        const onboardId = addNode(LayerType.Agent, startPos.x + 2450, startPos.y, 'Onboarding Agent', 'onboarding-agent');
        
        addEdge(inputId, sourceId);
        addEdge(dbId, sourceId);
        addEdge(sourceId, resumeId);
        addEdge(resumeId, techId);
        addEdge(techId, interviewGenId);
        addEdge(interviewGenId, cultureId);
        addEdge(cultureId, transcriptId);
        addEdge(transcriptId, rankerId);
        addEdge(rankerId, offerId);
        addEdge(offerId, onboardId);
      } else if (templateId === 'tech-talent-scout') {
        const sourceId = addNode(LayerType.Agent, startPos.x, startPos.y, 'Sourcing Agent', 'sourcing-agent');
        const techId = addNode(LayerType.Agent, startPos.x + 350, startPos.y, 'Tech Assessor', 'tech-assessor');
        const resumeId = addNode(LayerType.Agent, startPos.x + 700, startPos.y, 'Resume Verifier', 'resume-verifier');
        
        addEdge(sourceId, techId);
        addEdge(techId, resumeId);
      } else if (templateId === 'volume-hiring') {
        const dbId = addNode(LayerType.Agent, startPos.x, startPos.y, 'Database Connector', 'database-connector');
        const resumeId = addNode(LayerType.Agent, startPos.x + 350, startPos.y, 'Resume Verifier', 'resume-verifier');
        const rankerId = addNode(LayerType.Agent, startPos.x + 700, startPos.y, 'Candidate Ranker', 'candidate-ranker');
        
        addEdge(dbId, resumeId);
        addEdge(resumeId, rankerId);
      } else if (templateId === 'executive-headhunter' || templateId === 'executive') {
        const sourceId = addNode(LayerType.Agent, startPos.x, startPos.y, 'Sourcing Agent', 'sourcing-agent');
        const dbId = addNode(LayerType.Agent, startPos.x, startPos.y + 180, 'Workday / Venus', 'workday-venus-connector');
        const cultureId = addNode(LayerType.Agent, startPos.x + 350, startPos.y, 'Culture Fit Interviewer', 'culture-fit-interviewer');
        const rankerId = addNode(LayerType.Agent, startPos.x + 700, startPos.y, 'Candidate Ranker', 'candidate-ranker');
        const offerId = addNode(LayerType.Agent, startPos.x + 1050, startPos.y, 'Offer Negotiator', 'offer-negotiator');
        
        addEdge(sourceId, cultureId);
        addEdge(dbId, cultureId);
        addEdge(cultureId, rankerId);
        addEdge(rankerId, offerId);
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
