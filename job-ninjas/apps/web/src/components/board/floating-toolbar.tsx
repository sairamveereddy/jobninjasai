"use client";

import { useBoardStore } from "@/store/board";
import { LayerType, XYWH } from "@/types/canvas";
import { Play, Loader2, Settings2, Trash2, Edit2, Link as LinkIcon, Database, Check, Upload } from "lucide-react";
import { useState } from "react";

interface FloatingToolbarProps {
  layerId: string;
  bounds: XYWH;
  zoom: number;
}

export const FloatingToolbar = ({ layerId, bounds, zoom }: FloatingToolbarProps) => {
  const layer = useBoardStore(state => state.layers[layerId]);
  const updateLayer = useBoardStore(state => state.updateLayer);
  const deleteLayers = useBoardStore(state => state.deleteLayers);
  const insertLayer = useBoardStore(state => state.insertLayer);
  const insertEdge = useBoardStore(state => state.insertEdge);
  const edges = useBoardStore(state => state.edges);
  const setInspectedNodeId = useBoardStore(state => state.setInspectedNodeId);

  if (!layer) return null;

  const isEntryNode = layer.type === LayerType.Agent && (layer as any).agentRole === 'entry-node';
  const isAgent = layer.type === LayerType.Agent && (layer as any).agentRole !== 'entry-node' && !(layer as any).agentRole?.includes('-doc');
  const isConnector = layer.type === LayerType.Agent && (layer as any).agentRole?.includes('connector');
  const isDocument = layer.type === LayerType.Agent && (layer as any).agentRole?.includes('-doc');
  const isTextOrNote = layer.type === LayerType.Text || layer.type === LayerType.Note;

  const handleRunAgent = () => {
    updateLayer(layerId, { status: 'running' });
    
    setTimeout(() => {
      const incomingEdges = Object.values(edges).filter(e => e.toNodeId === layerId);
      const connectedInputLayers = incomingEdges.map(e => useBoardStore.getState().layers[e.fromNodeId]).filter(l => l && l.agentRole === 'entry-node');
      
      const hasResumes = connectedInputLayers.map(l => (l as any).config?.resumes).filter(Boolean).join(', ');
      const instructions = (layer as any).config?.instructions;
      const hasData = hasResumes || instructions;
      
      updateLayer(layerId, { status: hasData ? 'success' : 'error' });
      
      const outEdges = Object.values(edges).filter(e => e.fromNodeId === layerId);
      const connectedNotes = outEdges.map(e => useBoardStore.getState().layers[e.toNodeId]).filter(l => l?.type === LayerType.Note);
      
      const noteX = layer.x + (layer.width || 250) + 100;
      const noteY = layer.y + (connectedNotes.length * 170);
      
      const noteId = insertLayer(LayerType.Note, { x: noteX, y: noteY }, hasData ? { r: 253, g: 224, b: 71 } : { r: 254, g: 202, b: 202 });
      
      if (!hasData) {
        updateLayer(noteId, { 
          value: `[Execution Failed]\n\nMissing input data for ${(layer as any).value || 'Agent'}.\n\nFix: Connect this agent to a Job Details node containing Candidate Resumes, or provide explicit Custom Instructions.`,
          width: 250,
          height: 160
        });
      } else {
        const timestamp = new Date().toLocaleTimeString();
        let analysisText = `Analysis Complete (${timestamp}):\n\n`;
        if (hasResumes) {
          analysisText += `Processed Candidates: ${hasResumes}\n`;
          analysisText += `- Experience verified against job requirements.\n- Keyword match score: ${Math.floor(Math.random() * 20 + 80)}%\n- Recommended for next round.`;
        } else if (instructions) {
          analysisText += `Executed Instructions: "${instructions.substring(0, 30)}..."\n`;
          analysisText += `- Action completed successfully.\n- See logs for full details.`;
        }
        
        updateLayer(noteId, { 
          value: analysisText,
          width: 280,
          height: 180
        });
      }
      insertEdge(layerId, noteId);
      
    }, 1500);
  };

  // Keep it fixed in size, but position it dynamically based on zoom
  return (
    <foreignObject
      x={bounds.x}
      y={bounds.y - (60 / zoom)} // Positioned above the node
      width={400}
      height={80}
      className="overflow-visible pointer-events-none"
    >
      <div 
        className="inline-flex items-center gap-2 p-2 bg-white/80 backdrop-blur-xl rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-slate-200/60 pointer-events-auto"
        onPointerDown={(e) => e.stopPropagation()} // Prevent canvas from interpreting this as a canvas drag
      >
        {isEntryNode && (
          <button 
            onClick={() => setInspectedNodeId(layerId)} // For now open settings to upload
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full border border-blue-200 text-sm font-semibold transition-colors shadow-sm"
          >
            <Upload className="w-4 h-4" />
            Upload Resumes
          </button>
        )}

        {isAgent && !isConnector && !isEntryNode && (
          <button 
            onClick={handleRunAgent}
            disabled={layer.status === 'running'}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full border border-indigo-200 text-sm font-semibold transition-colors shadow-sm disabled:opacity-50"
          >
            {layer.status === 'running' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            Run
          </button>
        )}

        {isDocument && (
          <button 
            onClick={() => {
              // Open presentation mode for this document
              const setPresentationMode = (window as any).__setPresentationMode;
              if (setPresentationMode) setPresentationMode({ active: true, layerId });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-full border border-orange-200 text-sm font-semibold transition-colors shadow-sm"
          >
            <Maximize className="w-4 h-4" />
            View Mode
          </button>
        )}

        {isConnector && (
          <button 
            onClick={() => setInspectedNodeId(layerId)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200 text-sm font-semibold transition-colors shadow-sm"
          >
            <Database className="w-4 h-4" />
            Connect API
          </button>
        )}

        <div className="w-px h-6 bg-slate-200 mx-1"></div>

        <button 
          onClick={() => setInspectedNodeId(layerId)}
          className="flex items-center justify-center w-8 h-8 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Settings"
        >
          <Settings2 className="w-4 h-4" />
        </button>

        <button 
          onClick={() => deleteLayers([layerId])}
          className="flex items-center justify-center w-8 h-8 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </foreignObject>
  );
};



