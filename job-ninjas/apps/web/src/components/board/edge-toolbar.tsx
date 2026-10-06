"use client";

import { useBoardStore } from "@/store/board";
import { Trash2, Settings2, GitBranch, XCircle } from "lucide-react";

interface EdgeToolbarProps {
  edgeId: string;
  zoom: number;
}

export const EdgeToolbar = ({ edgeId, zoom }: EdgeToolbarProps) => {
  const edge = useBoardStore(state => state.edges[edgeId]);
  const deleteEdge = useBoardStore(state => state.deleteEdge);
  const layers = useBoardStore(state => state.layers);
  const setInspectedNodeId = useBoardStore(state => state.setInspectedNodeId);

  if (!edge) return null;

  const fromLayer = layers[edge.fromNodeId];
  const toLayer = layers[edge.toNodeId];
  
  if (!fromLayer || !toLayer) return null;

  const startCenter = { x: fromLayer.x + (fromLayer.width || 100) / 2, y: fromLayer.y + (fromLayer.height || 100) / 2 };
  const endCenter = { x: toLayer.x + (toLayer.width || 100) / 2, y: toLayer.y + (toLayer.height || 100) / 2 };
  
  const midX = (startCenter.x + endCenter.x) / 2;
  const midY = (startCenter.y + endCenter.y) / 2;

  const isRoutingEdge = fromLayer.type === LayerType.Agent && toLayer.type === LayerType.Agent;

  return (
    <foreignObject
      x={midX - 100}
      y={midY - (40 / zoom)}
      width={200}
      height={60}
      className="overflow-visible pointer-events-none"
    >
      <div 
        className="flex items-center justify-center pointer-events-auto"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="inline-flex items-center gap-1.5 p-1.5 bg-white/90 backdrop-blur-md rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200">
          
          <button 
            onClick={() => deleteEdge(edgeId)}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
            title="Delete Connection"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </foreignObject>
  );
};

// Need LayerType to be imported
import { LayerType } from "@/types/canvas";
