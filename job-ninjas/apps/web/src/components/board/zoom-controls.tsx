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
    <div className="absolute bottom-4 right-4 z-40 flex items-center gap-1 rounded-lg border border-white/10 bg-[#111214] p-1 text-[#b1b3b8] shadow-md">
      <button
        onClick={handleZoomOut}
        className="rounded p-1 text-[#b1b3b8] transition-colors hover:bg-white/5 hover:text-white"
        title="Zoom Out"
      >
        <Minus className="w-4 h-4" />
      </button>
      
      <div className="w-12 cursor-pointer select-none text-center text-xs font-medium text-white transition-colors hover:text-[#c7c9ff]" onClick={handleFit} title="Fit to screen">
        {zoomPercent}%
      </div>
      
      <button
        onClick={handleZoomIn}
        className="rounded p-1 text-[#b1b3b8] transition-colors hover:bg-white/5 hover:text-white"
        title="Zoom In"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};
