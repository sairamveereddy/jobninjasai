"use client";

import { X, Network, Briefcase } from "lucide-react";
import { useBoardStore } from "@/store/board";

interface TemplatesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  camera: { x: number; y: number; zoom: number };
}

export const TemplatesPanel = ({ isOpen, onClose, camera }: TemplatesPanelProps) => {
  const insertTemplate = useBoardStore(state => state.insertTemplate);

  if (!isOpen) return null;

  const handleInsert = (templateId: string) => {
    // Insert at center of current view
    const startX = (-camera.x + window.innerWidth / 2) / camera.zoom - 300;
    const startY = (-camera.y + window.innerHeight / 2) / camera.zoom;
    
    insertTemplate(templateId, { x: startX, y: startY });
    onClose();
  };

  return (
    <div className="absolute top-4 left-20 h-[calc(100%-2rem)] w-80 bg-card border border-border shadow-2xl z-50 rounded-2xl overflow-hidden flex flex-col transform transition-all">
      <div className="flex justify-between items-center p-4 border-b border-border bg-muted">
        <h2 className="text-lg font-semibold text-foreground">Templates</h2>
        <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full text-muted-foreground transition-colors">
          <X className="w-5 h-5"/>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/50">
        <div 
          className="bg-card border border-border rounded-xl p-4 hover:border-blue-500 hover:shadow-md cursor-pointer transition-all group"
          onClick={() => handleInsert('standard')}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Network className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-foreground">Standard Hiring Flow</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            A classic 4-stage pipeline integrating the Resume Screener AI Agent before technical review.
          </p>
        </div>
        
        <div 
          className="bg-card border border-border rounded-xl p-4 hover:border-blue-500 hover:shadow-md cursor-pointer transition-all group"
          onClick={() => handleInsert('executive')}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-foreground">Executive Search</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Automated Sourcing and Outreach agents working sequentially, terminating at a Partner Review stage.
          </p>
        </div>
      </div>
    </div>
  );
};
