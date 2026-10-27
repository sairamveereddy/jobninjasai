"use client";

import { useMemo, useState } from "react";
import { HIRING_STAGES, normalizeStages, type BoardIntake } from "@/lib/agents/contracts";

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
  stages: ["parse-jd", "parse-resume", "screen", "shortlist", "outreach", "interview-plan", "decision"],
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
    if (step === 0 && !draft.locations.trim()) {
      setError("Add where this role can be hired.");
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
    <div className="absolute inset-0 z-[320] flex items-center justify-center bg-black/70 p-4">
      <div className="flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-lg border border-white/10 bg-[#111214] text-white shadow-2xl">
        <div className="border-b border-white/10 px-6 py-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b8fa8]">This role</p>
          <h2 className="mt-1 text-xl font-medium tracking-tight">Set up the hiring pipeline</h2>
          <p className="mt-1 text-sm text-[#b1b3b8]">
            One board is one open job. These answers become the job description, an HR note, and the agents that run this role.
          </p>
          <div className="mt-4 flex gap-1.5">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className={`h-1 flex-1 rounded-full ${index <= step ? "bg-[#5e6ad2]" : "bg-white/10"}`} />
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          {step === 0 && (
            <>
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
              <Field label="Which stages should run?">
                <div className="space-y-2">
                  {HIRING_STAGES.map((stage) => {
                    const checked = draft.stages.includes(stage.id);
                    return (
                      <label key={stage.id} className="flex cursor-pointer gap-3 rounded-md border border-white/10 bg-black/20 px-3 py-2.5">
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
                          <span className="block text-sm font-medium">{stage.label}</span>
                          <span className="block text-xs text-[#8b8fa8]">{stage.detail}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </Field>
              <div className="rounded-md border border-white/10 bg-black/30 px-3 py-3 text-sm text-[#b1b3b8]">
                <p className="font-medium text-white">Pipeline JobNinjas will place on this board</p>
                <p className="mt-1">{resolvedStages.map((id) => HIRING_STAGES.find((stage) => stage.id === id)?.label).filter(Boolean).join(" → ")}</p>
                {added.length > 0 && (
                  <p className="mt-2 text-xs text-[#c7c9ff]">
                    Also included so the steps can connect: {added.map((id) => HIRING_STAGES.find((stage) => stage.id === id)?.label).join(", ")}.
                  </p>
                )}
              </div>
            </>
          )}

          {error && <p className="text-sm text-red-300">{error}</p>}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-white/10 px-6 py-4">
          <button type="button" onClick={onDismiss} className="text-sm text-[#8b8fa8] hover:text-white">
            {hasPipeline ? "Close" : "Start with an empty board"}
          </button>
          <div className="flex gap-2">
            {step > 0 && (
              <button type="button" onClick={() => { setError(""); setStep((value) => value - 1); }} className="rounded-md border border-white/15 px-3 py-2 text-sm">
                Back
              </button>
            )}
            {step < 3 ? (
              <button type="button" onClick={next} className="rounded-md bg-[#5e6ad2] px-4 py-2 text-sm font-medium">
                Continue
              </button>
            ) : (
              <>
                {hasPipeline && (
                  <button type="button" onClick={() => finish("save")} className="rounded-md border border-white/15 px-3 py-2 text-sm">
                    Save answers
                  </button>
                )}
                <button type="button" onClick={() => finish("build")} className="rounded-md bg-[#5e6ad2] px-4 py-2 text-sm font-medium">
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

const inputClass = "w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-[#707277] focus:border-[#5e6ad2]";

function chipClass(active: boolean) {
  return `rounded-md border px-3 py-1.5 text-sm ${active ? "border-[#5e6ad2] bg-[#5e6ad2]/20 text-white" : "border-white/10 text-[#b1b3b8] hover:border-white/20"}`;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-medium uppercase tracking-wide text-[#8b8fa8]">{label}</span>
      {children}
    </label>
  );
}
