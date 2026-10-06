"use client";

import { X, Search, Sparkles, Workflow, Layout, FileText, Bot, Briefcase, Network, ClipboardList, PenTool, Database, MessageSquare, Code, Users } from "lucide-react";
import { useBoardStore } from "@/store/board";
import { useState } from "react";

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  camera: { x: number; y: number; zoom: number };
}

export const LibraryModal = ({ isOpen, onClose, camera }: LibraryModalProps) => {
  const insertTemplate = useBoardStore(state => state.insertTemplate);
  const [activeCategory, setActiveCategory] = useState("All templates");

  if (!isOpen) return null;

  const handleInsert = (templateId: string) => {
    // Insert at center of current view
    const startX = (-camera.x + window.innerWidth / 2) / camera.zoom - 300;
    const startY = (-camera.y + window.innerHeight / 2) / camera.zoom;
    
    insertTemplate(templateId, { x: startX, y: startY });
    onClose();
  };

  const categories = [
    { name: "All templates", icon: Layout },
    { name: "AI Accelerated", icon: Sparkles, badge: "New" },
    { name: "Recruiting Flow", icon: Briefcase },
    { name: "Agent Nodes", icon: Bot },
  ];

  const useCases = [
    "Sourcing & Outreach",
    "Screening & Shortlisting",
    "Interview & Assessment",
    "Offer & Onboarding",
    "Analytics & Reporting",
  ];

  const templates = [
    {
      id: "ultimate-recruiter",
      name: "The Ultimate AI Recruiter",
      type: "Master Blueprint",
      description: "A colossal, end-to-end recruitment pipeline featuring 10+ AI agents connecting sourcing, technical assessment, multi-stage interviewing, transcript analysis, and offer negotiation into one perfect flow.",
      icon: Network,
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      id: "tech-talent-scout",
      name: "Tech Talent Scout",
      type: "Workflow",
      description: "Built for engineering teams. Rapidly sources candidates and validates their skills using the specialized Tech Assessor agent.",
      icon: Code,
      color: "text-teal-600",
      bg: "bg-teal-100"
    },
    {
      id: "volume-hiring",
      name: "High Volume Engine",
      type: "Pipeline",
      description: "Batch process thousands of applicants by connecting your Database directly to the Resume Verifier and Candidate Ranker.",
      icon: Database,
      color: "text-purple-600",
      bg: "bg-purple-100"
    },
    {
      id: "executive-headhunter",
      name: "Executive Headhunter",
      type: "Workflow",
      description: "White-glove workflow for leadership roles. Integrates Workday, Culture Fit interviews, and personalized Offer Negotiation.",
      icon: Briefcase,
      color: "text-amber-600",
      bg: "bg-amber-100"
    },
    {
      id: "university-recruiting",
      name: "University Campus Board",
      type: "Blueprint",
      description: "Streamlined flow for campus hiring. Focuses on broad sourcing, background checks, and automated onboarding.",
      icon: Users,
      color: "text-rose-600",
      bg: "bg-rose-100"
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-8">
      <div className="bg-card w-full max-w-6xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="text-xl font-semibold text-foreground">Templates</h2>
            <div className="relative flex-1 max-w-md ml-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search templates by name or category" 
                className="w-full pl-9 pr-4 py-2 bg-muted/50 border-transparent focus:bg-card focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg text-sm transition-all"
              />
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted/50 rounded-full text-muted-foreground transition-colors">
            <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-border bg-muted overflow-y-auto p-4 flex flex-col gap-6">
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeCategory === cat.name 
                      ? "bg-blue-50 text-blue-700 font-medium" 
                      : "text-foreground hover:bg-slate-200/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <cat.icon className={`w-4 h-4 ${activeCategory === cat.name ? "text-blue-600" : "text-muted-foreground"}`} />
                    {cat.name}
                  </div>
                  {cat.badge && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white px-1.5 py-0.5 rounded">
                      {cat.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">Use Cases</h3>
              <div className="space-y-1">
                {useCases.map((useCase) => (
                  <button
                    key={useCase}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-slate-200/50 transition-colors"
                  >
                    {useCase}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-8 bg-card">
            <h1 className="text-2xl font-bold text-foreground mb-6">{activeCategory}</h1>
            
            {/* Banner */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6 mb-8 flex items-center justify-between relative overflow-hidden">
              <div className="relative z-10 max-w-lg">
                <h3 className="text-xl font-bold text-foreground mb-2">Templates with AI built in</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Deploy autonomous agents ready to help you source, screen, and interview candidates — no setup needed.
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
                  Start with AI templates
                </button>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none">
                {/* Decorative background for banner */}
                <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#6366f1" d="M37.5,-73.2C48.6,-68.8,57.7,-59.4,66.5,-49.6C75.3,-39.8,83.9,-29.5,88.4,-17.1C92.9,-4.7,93.4,9.8,87.9,21.8C82.4,33.8,70.9,43.3,60.2,53.2C49.5,63.1,39.6,73.4,27.5,77.5C15.4,81.6,1.2,79.5,-12.3,76.2C-25.8,72.9,-38.6,68.4,-51,61.1C-63.4,53.8,-75.4,43.7,-82.1,30.8C-88.8,17.9,-90.2,2.2,-86.6,-12.1C-83,-26.4,-74.4,-39.3,-62.9,-48.9C-51.4,-58.5,-37,-64.8,-23.7,-68.1C-10.4,-71.4,1.8,-71.7,14.6,-73.4C27.4,-75.1,40.8,-78.2,37.5,-73.2Z" transform="translate(200 100)" />
                </svg>
              </div>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div 
                  key={template.id}
                  onClick={() => handleInsert(template.id)}
                  className="group flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer h-64"
                >
                  <div className="h-32 bg-muted border-b border-border p-4 flex items-center justify-center relative overflow-hidden">
                    {/* Abstract Template Preview */}
                    <div className="absolute inset-0 opacity-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
                    <div className={`w-16 h-16 rounded-xl ${template.bg} ${template.color} flex items-center justify-center shadow-sm z-10 group-hover:scale-110 transition-transform duration-300`}>
                      <template.icon className="w-8 h-8" />
                    </div>
                    <div className="absolute top-3 right-3 bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                      {template.type}
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 rounded flex items-center justify-center bg-slate-800 text-white text-[10px] font-bold">
                        P
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">ProofHire</span>
                    </div>
                    <h4 className="font-semibold text-foreground text-sm mb-1">{template.name}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-auto">{template.description}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
