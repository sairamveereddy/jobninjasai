import os

board_path = r'c:\Users\vsair\Downloads\novasquar-main\novasquad-main\nova-ninjas\job-ninjas\apps\web\src\store\board.ts'
with open(board_path, 'r', encoding='utf-8') as f:
    board_content = f.read()

# Add setEdges and setEdgeIds to BoardState
old_board_actions = """  setLayerIds: (ids: string[]) => void;
  setLayers: (layers: Record<string, Layer>) => void;
  insertLayer: (layerType: LayerType, position: Point, color: Color, points?: number[][], agentRole?: string, src?: string) => string;"""

new_board_actions = """  setLayerIds: (ids: string[]) => void;
  setLayers: (layers: Record<string, Layer>) => void;
  setEdges: (edges: Record<string, Edge>) => void;
  setEdgeIds: (ids: string[]) => void;
  insertLayer: (layerType: LayerType, position: Point, color: Color, points?: number[][], agentRole?: string, src?: string) => string;"""

if old_board_actions in board_content:
    board_content = board_content.replace(old_board_actions, new_board_actions)
else:
    board_content = board_content.replace(old_board_actions.replace('\n', '\r\n'), new_board_actions)

old_board_impl = """  setLayerIds: (ids) => set({ layerIds: ids }),
  setLayers: (layers) => set({ layers }),
  setInspectedNodeId: (id) => set({ inspectedNodeId: id }),"""

new_board_impl = """  setLayerIds: (ids) => set({ layerIds: ids }),
  setLayers: (layers) => set({ layers }),
  setEdges: (edges) => set({ edges }),
  setEdgeIds: (ids) => set({ edgeIds: ids }),
  setInspectedNodeId: (id) => set({ inspectedNodeId: id }),"""

if old_board_impl in board_content:
    board_content = board_content.replace(old_board_impl, new_board_impl)
else:
    board_content = board_content.replace(old_board_impl.replace('\n', '\r\n'), new_board_impl)

with open(board_path, 'w', encoding='utf-8') as f:
    f.write(board_content)

print("Updated store/board.ts")

# Now update page.tsx
page_path = r'c:\Users\vsair\Downloads\novasquar-main\novasquad-main\nova-ninjas\job-ninjas\apps\web\src\app\(dashboard)\roles\[roleId]\board\page.tsx'

new_page_content = """"use client";

import { use, useEffect, useRef, useState } from "react";
import { Canvas } from "@/components/board/canvas";
import { useBoardStore } from "@/store/board";
import { LayerType } from "@/types/canvas";
import { Loader2 } from "lucide-react";

export default function RoleBoardPage({ params }: { params: Promise<{ roleId: string }> }) {
  const resolvedParams = use(params);
  
  const layerIds = useBoardStore(state => state.layerIds);
  const layers = useBoardStore(state => state.layers);
  const edgeIds = useBoardStore(state => state.edgeIds);
  const edges = useBoardStore(state => state.edges);
  
  const setLayerIds = useBoardStore(state => state.setLayerIds);
  const setLayers = useBoardStore(state => state.setLayers);
  const setEdgeIds = useBoardStore(state => state.setEdgeIds);
  const setEdges = useBoardStore(state => state.setEdges);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const initialLoadRef = useRef(false);

  // Load initial state
  useEffect(() => {
    setLoading(true);
    fetch(`/api/boards/${resolvedParams.roleId}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setLayerIds(data.layerIds || []);
          setLayers(data.layers || {});
          setEdgeIds(data.edgeIds || []);
          setEdges(data.edges || {});
        }
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
        initialLoadRef.current = true;
      });
  }, [resolvedParams.roleId, setLayerIds, setLayers, setEdgeIds, setEdges]);

  // Save changes automatically
  const saveTimeout = useRef<any>(null);
  
  useEffect(() => {
    if (loading || !initialLoadRef.current) return;
    
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    
    setSaving(true);
    saveTimeout.current = setTimeout(() => {
      fetch(`/api/boards/${resolvedParams.roleId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layerIds, layers, edgeIds, edges })
      })
      .finally(() => setSaving(false));
    }, 1500); // Debounce saves by 1.5s
    
    return () => clearTimeout(saveTimeout.current);
  }, [layerIds, layers, edgeIds, edges, resolvedParams.roleId, loading]);

  if (loading) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
        <p>Loading your workflow...</p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      {saving && (
        <div className="absolute top-20 right-4 z-50 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full shadow-sm text-xs font-medium text-slate-500 flex items-center gap-2 border border-slate-200/50">
          <Loader2 className="w-3 h-3 animate-spin" />
          Saving...
        </div>
      )}
      <Canvas boardId={resolvedParams.roleId} />
    </div>
  );
}
"""

with open(page_path, 'w', encoding='utf-8') as f:
    f.write(new_page_content)

print("Updated board/page.tsx")
