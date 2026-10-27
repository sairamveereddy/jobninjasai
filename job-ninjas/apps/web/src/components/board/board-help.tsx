"use client";

import { useState } from "react";
import { HelpCircle, X } from "lucide-react";
import { PIPELINE_TEMPLATES, RESUME_INPUT_HELP } from "@/lib/agents/contracts";

export function BoardHelp() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="How this board works"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:border-indigo-400 transition-colors cursor-pointer"
        title="How this role board works"
      >
        <HelpCircle className="h-3.5 w-3.5 text-indigo-600" />
        <span className="hidden sm:inline">How this board works</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 max-h-[min(72vh,640px)] w-[min(400px,calc(100vw-3rem))] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-2xl z-50">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400 font-bold">This role</p>
              <h2 className="text-base font-bold text-slate-900">One board is one open job</h2>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-700 p-1" aria-label="Close help">
              <X className="h-4 w-4" />
            </button>
          </div>
          <p>The steps on this board run hiring for this job only. Add people in <span className="font-semibold text-slate-900">This role</span>, attach a resume, then choose <span className="font-semibold text-slate-900">Run pipeline</span>. It walks the steps in order for the person you selected, and each step keeps its last result. <span className="font-semibold text-slate-900">Stop</span> ends the run and leaves earlier results in place.</p>
          <p className="mt-2">Choose <span className="font-semibold text-slate-900">View</span> on a step, or the badges under a person, to read the scorecard, shortlist, outreach draft, interview times, interview analysis, or hiring recommendation. On a shortlist you can advance, hold, or pass that person, note the reason, and select them for the next run.</p>

          <h3 className="mb-1 mt-4 text-xs font-bold uppercase tracking-wide text-slate-400">Connect steps</h3>
          <p>Draw a line from the right side of a step to the left side of the next one. The label on the line is what that connection carries, such as Resume or Scorecard. If the types do not fit, nothing is connected and the message says what to connect instead.</p>

          <h3 className="mb-1 mt-4 text-xs font-bold uppercase tracking-wide text-slate-400">Give an agent a resume</h3>
          <ul className="space-y-1.5 mt-1">
            {RESUME_INPUT_HELP.map((item) => (
              <li key={item.id}>
                <span className="font-semibold text-slate-900">{item.title}.</span> {item.detail}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
