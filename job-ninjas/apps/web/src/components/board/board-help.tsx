"use client";

import { useState } from "react";
import { HelpCircle, X } from "lucide-react";
import { PIPELINE_TEMPLATES, RESUME_INPUT_HELP } from "@/lib/agents/contracts";

export function BoardHelp() {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute right-6 top-6 z-50">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#111214] px-3 py-2 text-xs font-medium text-white shadow-lg hover:border-[#5e6ad2]"
        title="How this role board works"
      >
        <HelpCircle className="h-3.5 w-3.5 text-[#c7c9ff]" />
        How this board works
      </button>
      {open && (
        <div className="mt-2 max-h-[min(72vh,640px)] w-[min(400px,calc(100vw-3rem))] overflow-y-auto rounded-lg border border-white/10 bg-[#111214] p-4 text-sm text-[#b1b3b8] shadow-2xl">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#8b8fa8]">This role</p>
              <h2 className="text-base font-medium text-white">One board is one open job</h2>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="text-[#8b8fa8] hover:text-white" aria-label="Close help">
              <X className="h-4 w-4" />
            </button>
          </div>
          <p>The steps on this board run hiring for this job only. Add people in <span className="text-white">This role</span>, attach a resume, then run the pipeline for the person you selected.</p>

          <h3 className="mb-1 mt-4 text-xs font-medium uppercase tracking-wide text-[#8b8fa8]">Connect steps</h3>
          <p>Draw a line from the right side of a step to the left side of the next one. The label on the line is what that connection carries, such as Resume or Scorecard. If the types do not fit, nothing is connected and the message says what to connect instead.</p>

          <h3 className="mb-1 mt-4 text-xs font-medium uppercase tracking-wide text-[#8b8fa8]">Give an agent a resume</h3>
          <ul className="space-y-1.5">
            {RESUME_INPUT_HELP.map((item) => (
              <li key={item.id}>
                <span className="text-white">{item.title}.</span> {item.detail}
              </li>
            ))}
          </ul>

          <h3 className="mb-1 mt-4 text-xs font-medium uppercase tracking-wide text-[#8b8fa8]">Team notes</h3>
          <p>Sticky notes are for your team. Agents do not read them. A transcript has to be pasted on the Transcript step, and a resume has to be attached to a candidate.</p>

          <h3 className="mb-1 mt-4 text-xs font-medium uppercase tracking-wide text-[#8b8fa8]">Hiring templates</h3>
          <p className="mb-2">Open <span className="text-white">Edit role setup</span> and start from one of these. Replacing the pipeline keeps documents and team notes.</p>
          <ul className="space-y-1.5">
            {PIPELINE_TEMPLATES.map((template) => (
              <li key={template.id}>
                <span className="text-white">{template.label}.</span> {template.detail}
              </li>
            ))}
          </ul>

          <h3 className="mb-1 mt-4 text-xs font-medium uppercase tracking-wide text-[#8b8fa8]">When a step will not run</h3>
          <p>The error stays on the step. It names the missing candidate, resume, job description, or earlier step. Fix that, then run the step again.</p>
        </div>
      )}
    </div>
  );
}
