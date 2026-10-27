"use client";

import { useState, type ComponentType } from "react";
import { 
  MousePointer2, LayoutTemplate, Square, Circle, Type, Bot, Pen, ArrowUpRight, 
  StickyNote, Briefcase, MessageSquare, FileText, Image as ImageIcon,
  Database, Building, Plug, ShieldCheck, Presentation,
  PlaneTakeoff, UserCheck, ScanText, FileSearch, ClipboardCheck, Mail, CalendarClock, ListChecks, Award
} from "lucide-react";
import { CanvasMode, LayerType } from "@/types/canvas";
import { plainLanguage } from "@/lib/agents/contracts";

interface ToolbarProps {
  canvasState: any;
  setCanvasState: (newState: any) => void;
  onOpenTemplates?: () => void;
}

export const NODE_CATEGORIES = [
  {
    category: "Hiring agents",
    items: [
      { icon: ScanText, label: "JD Parser", role: "agent-jd-parser", color: "text-sky-700", bg: "bg-sky-100 dark:bg-sky-900/30 dark:text-sky-300" },
      { icon: FileSearch, label: "Resume Parser", role: "agent-resume-parser", color: "text-cyan-700", bg: "bg-cyan-100 dark:bg-cyan-900/30 dark:text-cyan-300" },
      { icon: ClipboardCheck, label: "Screen & Score", role: "agent-screen", color: "text-indigo-700", bg: "bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300" },
      { icon: ListChecks, label: "Shortlist", role: "agent-shortlist", color: "text-emerald-700", bg: "bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300" },
      { icon: Mail, label: "Outreach", role: "agent-outreach", color: "text-fuchsia-700", bg: "bg-fuchsia-100 dark:bg-fuchsia-900/30 dark:text-fuchsia-300" },
      { icon: Bot, label: "Interview Planning", role: "agent-interview-plan", color: "text-indigo-600", bg: "bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400" },
      { icon: CalendarClock, label: "Interview Schedule", role: "agent-schedule", color: "text-violet-700", bg: "bg-violet-100 dark:bg-violet-900/30 dark:text-violet-300" },
      { icon: Bot, label: "Interview Analysis", role: "agent-interview-analysis", color: "text-indigo-600", bg: "bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400" },
      { icon: Bot, label: "Hiring Recommendation", role: "agent-decision", color: "text-indigo-600", bg: "bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400" },
      { icon: Bot, label: "Resume Intelligence", role: "agent-resume", color: "text-indigo-600", bg: "bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400" },
      { icon: PlaneTakeoff, label: "Candidate Concierge", role: "agent-concierge", color: "text-indigo-600", bg: "bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400" },
      { icon: Award, label: "Offer & Comp Draft", role: "agent-offer-draft", color: "text-emerald-700", bg: "bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300" },
      { icon: Mail, label: "Rejection Draft", role: "agent-rejection-draft", color: "text-rose-700", bg: "bg-rose-100 dark:bg-rose-900/30 dark:text-rose-300" },
      { icon: ListChecks, label: "Onboarding Handoff", role: "agent-onboarding-handoff", color: "text-teal-700", bg: "bg-teal-100 dark:bg-teal-900/30 dark:text-teal-300" },
    ]
  },
  {
    category: "Inputs",
    items: [
      { icon: Briefcase, label: "Job Details", role: "input-job-details", color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400" },
      { icon: UserCheck, label: "Candidate", role: "input-candidate", color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400" },
      { icon: FileText, label: "Resume", role: "input-resume", color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400" },
      { icon: MessageSquare, label: "Interview Transcript", role: "input-transcript", color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400" },
    ]
  },
  {
    category: "Not live",
    hint: "These do not send, book, or sync.",
    items: [
      { icon: Plug, label: "Ophelia", role: "integration-ophelia", color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400" },
      { icon: Building, label: "ATS / Workday", role: "integration-ats", color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400" },
      { icon: Database, label: "Database", role: "integration-db", color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400" },
      { icon: Plug, label: "MCP/API", role: "integration-mcp", color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400" },
    ]
  },
  {
    category: "Human Gates",
    items: [
      { icon: ShieldCheck, label: "Shortlist Approval", role: "gate-shortlist", color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400" },
      { icon: ShieldCheck, label: "Interview Decision", role: "gate-interview", color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400" },
      { icon: ShieldCheck, label: "Final Decision", role: "gate-final", color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400" },
      { icon: ShieldCheck, label: "Transaction Approval", role: "gate-transaction", color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400" },
    ]
  },
  {
    category: "Outputs",
    items: [
      { icon: FileText, label: "Candidate Profile", role: "output-profile", color: "text-slate-600", bg: "bg-slate-100 dark:bg-slate-900/30 dark:text-slate-400" },
      { icon: FileText, label: "Interview Plan", role: "output-interview-plan", color: "text-slate-600", bg: "bg-slate-100 dark:bg-slate-900/30 dark:text-slate-400" },
      { icon: FileText, label: "Interview Evaluation", role: "output-evaluation", color: "text-slate-600", bg: "bg-slate-100 dark:bg-slate-900/30 dark:text-slate-400" },
      { icon: FileText, label: "Candidate Decision", role: "output-decision", color: "text-slate-600", bg: "bg-slate-100 dark:bg-slate-900/30 dark:text-slate-400" },
      { icon: FileText, label: "Candidate Experience / Itinerary", role: "output-itinerary", color: "text-slate-600", bg: "bg-slate-100 dark:bg-slate-900/30 dark:text-slate-400" },
    ]
  }
];

export const Toolbar = ({ canvasState, setCanvasState, onOpenTemplates }: ToolbarProps) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const layoutTools = [
    { icon: Type, label: "Text", mode: { mode: CanvasMode.Inserting, layerType: LayerType.Text } },
    { icon: Square, label: "Rectangle", mode: { mode: CanvasMode.Inserting, layerType: LayerType.Rectangle } },
    { icon: Circle, label: "Ellipse", mode: { mode: CanvasMode.Inserting, layerType: LayerType.Ellipse } },
    { icon: Pen, label: "Pen", mode: { mode: CanvasMode.Pencil } },
    { icon: Presentation, label: "Blank slide", mode: { mode: CanvasMode.Inserting, layerType: LayerType.Slide } },
  ];

  return (
    <div className="absolute top-1/2 -translate-y-1/2 left-4 z-40 flex gap-2">
      <div className="flex flex-col gap-1 rounded-lg border border-white/10 bg-[#111214] p-1.5 text-white shadow-xl">
        <ToolButton
          icon={MousePointer2}
          isActive={
            canvasState.mode === CanvasMode.None ||
            canvasState.mode === CanvasMode.Translating ||
            canvasState.mode === CanvasMode.SelectionNet ||
            canvasState.mode === CanvasMode.Pressing ||
            canvasState.mode === CanvasMode.Resizing
          }
          onClick={() => { setCanvasState({ mode: CanvasMode.None }); setActiveMenu(null); }}
          tooltip="Select"
        />

        <div className="relative">
          <ToolButton
            icon={Bot}
            isActive={activeMenu === 'agents' || (canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Agent)}
            onClick={() => setActiveMenu(activeMenu === 'agents' ? null : 'agents')}
            tooltip="Hiring steps"
          />
          {activeMenu === 'agents' && (
            <div className="absolute left-full top-0 ml-2 flex max-h-[80vh] w-80 flex-col gap-1 overflow-y-auto rounded-lg border border-white/10 bg-[#111214] p-2 text-white shadow-xl">
              <div className="sticky top-0 z-10 bg-[#111214] px-2 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#8b8fa8]">Hiring steps</div>
              {NODE_CATEGORIES.map((group) => (
                <div key={group.category} className="mb-2">
                  <div className="px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-[#8b8fa8]">
                    {group.category}
                  </div>
                  {'hint' in group && group.hint && <p className="px-2 pb-1 text-[11px] leading-snug text-[#b1b3b8]">{group.hint}</p>}
                  {group.items.map((agent) => (
                    <button
                      key={agent.role}
                      type="button"
                      onClick={() => {
                        setCanvasState({ mode: CanvasMode.Inserting, layerType: LayerType.Agent, agentRole: agent.role });
                        setActiveMenu(null);
                      }}
                      title={plainLanguage(agent.role)}
                      className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm text-white hover:bg-white/5"
                    >
                      <div className={`rounded-md p-1.5 ${agent.bg} ${agent.color}`}>
                        <agent.icon className="h-4 w-4 shrink-0" />
                      </div>
                      <span className="flex min-w-0 flex-col">
                        <span className="font-medium leading-tight">{agent.label}</span>
                        <span className="text-[11px] font-normal leading-snug text-[#b1b3b8]">{plainLanguage(agent.role)}</span>
                      </span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <ToolButton
          icon={LayoutTemplate}
          isActive={false}
          onClick={() => { onOpenTemplates?.(); setActiveMenu(null); }}
          tooltip="Hiring templates"
        />

        <ToolButton
          icon={StickyNote}
          isActive={canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Note}
          onClick={() => { setCanvasState({ mode: CanvasMode.Inserting, layerType: LayerType.Note }); setActiveMenu(null); }}
          tooltip="Team note. Agents do not read this."
        />

        <label className="flex cursor-pointer items-center justify-center rounded-lg p-2.5 text-[#b1b3b8] hover:bg-white/5 hover:text-white" title="Add a document to this role">
          <FileText className="h-5 w-5" />
          <span className="sr-only">Add a document</span>
          <input
            type="file"
            accept=".pdf,.ppt,.pptx,.doc,.docx"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  const base64 = event.target?.result as string;
                  setCanvasState({ mode: CanvasMode.Inserting, layerType: LayerType.Slide, fileSrc: base64, fileName: file.name } as any);
                  setActiveMenu(null);
                };
                reader.readAsDataURL(file);
              }
              e.target.value = '';
            }}
          />
        </label>

        <ToolButton
          icon={ArrowUpRight}
          isActive={canvasState.mode === CanvasMode.Connecting}
          onClick={() => { setCanvasState({ mode: CanvasMode.Connecting }); setActiveMenu(null); }}
          tooltip="Connect steps"
        />

        <div className="my-0.5 h-px w-full bg-white/10" />

        <div className="relative">
          <ToolButton
            icon={Square}
            isActive={activeMenu === 'layout' || canvasState.mode === CanvasMode.Pencil || (canvasState.mode === CanvasMode.Inserting && [LayerType.Rectangle, LayerType.Ellipse, LayerType.Text, LayerType.Slide, LayerType.Image].includes(canvasState.layerType))}
            onClick={() => setActiveMenu(activeMenu === 'layout' ? null : 'layout')}
            tooltip="Layout. Shapes, pen, and slides."
          />
          {activeMenu === 'layout' && (
            <div className="absolute left-full top-0 ml-2 w-56 rounded-lg border border-white/10 bg-[#111214] p-2 text-white shadow-xl">
              <p className="px-2 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#8b8fa8]">Layout</p>
              <p className="px-2 pb-2 text-[11px] leading-snug text-[#b1b3b8]">Hiring uses the steps, notes, and documents above. These only mark up the board.</p>
              {layoutTools.map((tool) => (
                <button
                  key={tool.label}
                  type="button"
                  onClick={() => {
                    setCanvasState(tool.mode);
                    setActiveMenu(null);
                  }}
                  className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm text-white hover:bg-white/5"
                >
                  <tool.icon className="h-4 w-4 text-[#b1b3b8]" />
                  {tool.label}
                </button>
              ))}
              <label className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm text-white hover:bg-white/5">
                <ImageIcon className="h-4 w-4 text-[#b1b3b8]" />
                Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const base64 = event.target?.result as string;
                        setCanvasState({ mode: CanvasMode.Inserting, layerType: LayerType.Image, src: base64 } as any);
                        setActiveMenu(null);
                      };
                      reader.readAsDataURL(file);
                    }
                    e.target.value = '';
                  }}
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ToolButton = ({ icon: Icon, isActive, onClick, tooltip }: { icon: ComponentType<{ className?: string }>; isActive: boolean; onClick: () => void; tooltip: string }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      title={tooltip}
      aria-label={tooltip}
      className={`flex items-center justify-center rounded-lg p-2.5 transition-colors ${isActive ? 'bg-[#5e6ad2] text-white' : 'text-[#b1b3b8] hover:bg-white/5 hover:text-white'}`}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
};

export const AGENTS = NODE_CATEGORIES.flatMap(c => c.items);
