"use client";

import { useMemo, useState } from "react";
import { HIRING_STAGES, PIPELINE_TEMPLATES, normalizeStages, type BoardIntake } from "@/lib/agents/contracts";

const SENIORITY = ["Intern", "Junior", "Mid-level", "Senior", "Staff", "Manager", "Director"];
const VOLUMES = [
  { id: "1-10", label: "1–10" },
  { id: "11-50", label: "11–50" },
  { id: "51-200", label: "51–200" },
  { id: "200+", label: "200+" },
];
const ATS_OPTIONS = ["None yet", "Greenhouse", "Lever", "Ashby", "Workday", "Other"];

const EMPTY: BoardIntake = {
  roleTitle: "",
  jobDescription: "",
  mustHaveSkills: "",
  seniority: "Senior",
  locations: "",
  candidateVolume: "11-50",
  ats: "None yet",
  stages: [...PIPELINE_TEMPLATES[0].stages],
};

export function IntakeWizard({
  initial,
  hasPipeline,
  onComplete,
  onDismiss,
}: {
  initial?: Partial<BoardIntake> | null;
  hasPipeline: boolean;
  onComplete: (intake: BoardIntake, mode: "build" | "save") => void;
  onDismiss: () => void;
}) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<BoardIntake>({ ...EMPTY, ...initial, stages: initial?.stages?.length ? initial.stages : EMPTY.stages });
  const [error, setError] = useState("");

  const resolvedStages = useMemo(() => normalizeStages(draft.stages), [draft.stages]);
  const added = resolvedStages.filter((id) => !draft.stages.includes(id));

  const set = (partial: Partial<BoardIntake>) => setDraft((current) => ({ ...current, ...partial }));

  const next = () => {
    if (step === 0 && !draft.roleTitle.trim()) {
      setError("Add the role title. One board is one job.");
      return;
    }
    if (step === 1 && !draft.jobDescription.trim() && !draft.mustHaveSkills.trim()) {
      setError("Paste a job description or list the must-have skills.");
      return;
    }
    if (step === 3 && draft.stages.length === 0) {
      setError("Pick at least one stage. JobNinjas will add anything that stage depends on.");
      return;
    }
    setError("");
    setStep((value) => Math.min(value + 1, 3));
  };

  const finish = (mode: "build" | "save") => {
    if (!draft.roleTitle.trim() || (!draft.jobDescription.trim() && !draft.mustHaveSkills.trim()) || draft.stages.length === 0) {
      setError("Title, a job description or skills, and at least one stage are required.");
      return;
    }
    onComplete({ ...draft, stages: resolvedStages, completedAt: new Date().toISOString(), dismissed: false }, mode);
  };

  return (
    <div className="absolute inset-0 z-[320] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-2xl font-sans">
        <div className="border-b border-slate-100 px-6 py-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">This role</p>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">Set up the hiring pipeline</h2>
          <p className="mt-1 text-sm text-slate-600">
            One board is one open job. These answers become the job description, an HR note, and the agents that run this role.
          </p>
          <div className="mt-4 flex gap-1.5">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className={`h-1.5 flex-1 rounded-full ${index <= step ? "bg-[#5e6ad2]" : "bg-slate-100"}`} />
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          {step === 0 && (
            <>
              <Field label="Start from a hiring template">
                <div className="flex flex-wrap gap-2">
                  {PIPELINE_TEMPLATES.map((template) => {
                    const active = template.stages.length === draft.stages.length && template.stages.every((id) => draft.stages.includes(id));
                    return (
                      <button
                        key={template.id}
                        type="button"
                        title={template.detail}
                        onClick={() => set({ stages: [...template.stages], candidateVolume: template.id === "high-volume" ? "200+" : draft.candidateVolume })}
                        className={chipClass(active)}
                      >
                        {template.label}
                      </button>
                    );
                  })}
                </div>
              </Field>
              <Field label="Role title">
                <input className={inputClass} value={draft.roleTitle} placeholder="Senior Product Designer" onChange={(e) => set({ roleTitle: e.target.value })} />
              </Field>
              <Field label="Seniority">
                <div className="flex flex-wrap gap-2">
                  {SENIORITY.map((level) => (
                    <button key={level} type="button" onClick={() => set({ seniority: level })} className={chipClass(draft.seniority === level)}>
                      {level}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Locations">
                <input className={inputClass} value={draft.locations} placeholder="New York, Remote US" onChange={(e) => set({ locations: e.target.value })} />
                <button type="button" onClick={() => set({ locations: "" })} className="text-xs font-semibold text-[#5e6ad2] hover:underline cursor-pointer">
                  Location not decided
                </button>
              </Field>
            </>
          )}

          {step === 1 && (
            <>
              <Field label="Job description">
                <textarea className={`${inputClass} min-h-36`} value={draft.jobDescription} placeholder="Paste the JD. Responsibilities, requirements, and how the team works." onChange={(e) => set({ jobDescription: e.target.value })} />
              </Field>
              <Field label="Must-have skills">
                <input className={inputClass} value={draft.mustHaveSkills} placeholder="Figma, hiring loops, stakeholder management" onChange={(e) => set({ mustHaveSkills: e.target.value })} />
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <Field label="How many candidates do you expect?">
                <div className="flex flex-wrap gap-2">
                  {VOLUMES.map((volume) => (
                    <button key={volume.id} type="button" onClick={() => set({ candidateVolume: volume.id })} className={chipClass(draft.candidateVolume === volume.id)}>
                      {volume.label}
                    </button>
                  ))}
                </div>
              </Field>
              <p className="text-xs text-slate-500">These already have defaults. Continue if they look right.</p>
              <Field label="Applicant tracking system">
                <div className="flex flex-wrap gap-2">
                  {ATS_OPTIONS.map((ats) => (
                    <button key={ats} type="button" onClick={() => set({ ats })} className={chipClass(draft.ats === ats)}>
                      {ats}
                    </button>
                  ))}
                </div>
              </Field>
            </>
          )}

          {step === 3 && (
            <>
              <Field label="Start from a hiring template">
                <div className="flex flex-wrap gap-2">
                  {PIPELINE_TEMPLATES.map((template) => {
                    const active = template.stages.every((id) => draft.stages.includes(id)) && draft.stages.length === template.stages.length;
                    return (
                      <button
                        key={template.id}
                        type="button"
                        title={template.detail}
                        onClick={() => set({ stages: [...template.stages] })}
                        className={chipClass(active)}
                      >
                        {template.label}
                      </button>
                    );
                  })}
                </div>
              </Field>
              <Field label="Which stages should run?">
                <div className="space-y-2">
                  {HIRING_STAGES.map((stage) => {
                    const checked = draft.stages.includes(stage.id);
                    return (
                      <label key={stage.id} className="flex cursor-pointer gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3 hover:bg-slate-50 transition-colors">
                        <input
                          type="checkbox"
                          className="mt-1 accent-[#5e6ad2]"
                          checked={checked}
                          onChange={() => {
                            set({
                              stages: checked ? draft.stages.filter((id) => id !== stage.id) : [...draft.stages, stage.id],
                            });
                          }}
                        />
                        <span>
                          <span className="block text-sm font-semibold text-slate-800">{stage.label}</span>
                          <span className="block text-xs text-slate-500">{stage.detail}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </Field>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">Pipeline JobNinjas will place on this board</p>
                <p className="mt-1 text-xs text-slate-500">Build pipeline places these steps and connects them. Documents and team notes stay.</p>
                <p className="mt-2 font-medium text-indigo-700">{resolvedStages.map((id) => HIRING_STAGES.find((stage) => stage.id === id)?.label).filter(Boolean).join(" → ")}</p>
                {added.length > 0 && (
                  <p className="mt-2 text-xs font-medium text-slate-500">
                    Also included so the steps can connect: {added.map((id) => HIRING_STAGES.find((stage) => stage.id === id)?.label).join(", ")}.
                  </p>
                )}
              </div>
            </>
          )}

          {error && <p className="text-sm font-medium text-rose-600">{error}</p>}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 bg-slate-50/30">
          <button type="button" onClick={onDismiss} className="text-sm font-medium text-slate-500 hover:text-slate-800 cursor-pointer">
            {hasPipeline ? "Close" : "Start with an empty board"}
          </button>
          <div className="flex gap-2">
            {step > 0 && (
              <button type="button" onClick={() => { setError(""); setStep((value) => value - 1); }} className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs cursor-pointer">
                Back
              </button>
            )}
            {step < 3 ? (
              <button type="button" onClick={next} className="rounded-xl bg-[#5e6ad2] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4f59b6] shadow-xs cursor-pointer">
                {step === 2 ? "Keep the defaults" : "Continue"}
              </button>
            ) : (
              <>
                {hasPipeline && (
                  <button type="button" onClick={() => finish("save")} className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs cursor-pointer">
                    Save answers
                  </button>
                )}
                <button type="button" onClick={() => finish("build")} className="rounded-xl bg-[#5e6ad2] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4f59b6] shadow-xs cursor-pointer">
                  {hasPipeline ? "Replace pipeline" : "Build pipeline"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const inputClass = "w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#5e6ad2] focus:bg-white";

function chipClass(active: boolean) {
  return `rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
    active ? "border-[#5e6ad2] bg-indigo-50/70 text-indigo-700 shadow-2xs" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-2xs"
  }`;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span>
      {children}
    </label>
  );
}
