"use client";

import { Minus, Plus, Maximize } from "lucide-react";
import { Camera } from "@/types/canvas";

interface ZoomControlsProps {
  camera: Camera;
  setCamera: React.Dispatch<React.SetStateAction<Camera>>;
}

export const ZoomControls = ({ camera, setCamera }: ZoomControlsProps) => {
  const handleZoomIn = () => {
    setCamera((c) => ({ ...c, zoom: Math.min(c.zoom * 1.2, 5) }));
  };

  const handleZoomOut = () => {
    setCamera((c) => ({ ...c, zoom: Math.max(c.zoom / 1.2, 0.1) }));
  };

  const handleFit = () => {
    setCamera({ x: 0, y: 0, zoom: 1 });
  };

  const zoomPercent = Math.round(camera.zoom * 100);

  return (
    <div className="absolute bottom-4 right-4 z-40 bg-card shadow-md border border-border rounded-lg flex items-center p-1 gap-1 text-foreground">
      <button
        onClick={handleZoomOut}
        className="p-1 hover:bg-muted/50 rounded transition-colors"
        title="Zoom Out"
      >
        <Minus className="w-4 h-4" />
      </button>
      
      <div className="w-12 text-center text-xs font-medium cursor-pointer hover:text-blue-600 transition-colors select-none" onClick={handleFit} title="Fit to Screen">
        {zoomPercent}%
      </div>
      
      <button
        onClick={handleZoomIn}
        className="p-1 hover:bg-muted/50 rounded transition-colors"
        title="Zoom In"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};
