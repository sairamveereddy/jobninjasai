"use client";

import { Minus, Plus } from "lucide-react";
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
    <div className="absolute bottom-6 right-6 z-40 flex items-center gap-1 rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-1.5 text-slate-700 shadow-xl pointer-events-auto">
      <button
        onClick={handleZoomOut}
        className="rounded-xl p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
        title="Zoom Out"
      >
        <Minus className="w-4 h-4" />
      </button>
      
      <div className="w-12 cursor-pointer select-none text-center text-xs font-semibold text-slate-700 transition-colors hover:text-[#5e6ad2]" onClick={handleFit} title="Fit to screen">
        {zoomPercent}%
      </div>
      
      <button
        onClick={handleZoomIn}
        className="rounded-xl p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
        title="Zoom In"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};
