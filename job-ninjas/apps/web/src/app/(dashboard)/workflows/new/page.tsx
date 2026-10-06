"use client";

import { use, useEffect } from "react";
import { Canvas } from "@/components/board/canvas";
import { useDemoStore } from "@/lib/store";
import { useBoardStore } from "@/store/board";

export default function NewWorkflowPage() {
  const roles = useDemoStore(state => state.roles);
  const candidates = useDemoStore(state => state.candidates);
  
  const layerIds = useBoardStore(state => state.layerIds);
  const insertLayer = useBoardStore(state => state.insertLayer);

  useEffect(() => {
    // Canvas starts empty
  }, []);

  return (
    <div className="absolute inset-0">
      <Canvas boardId="new-workflow" />
    </div>
  );
}
