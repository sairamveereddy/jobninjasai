const CANDIDATES = [
  { name: "Maya Chen", meta: "Staff backend · 9 yrs", score: "92", stage: "Interview", note: "Python verified · K8s partial" },
  { name: "Jordan Hale", meta: "Backend · 6 yrs", score: "81", stage: "Screen", note: "Strong APIs · systems gap" },
  { name: "Sam Okonkwo", meta: "Backend · 4 yrs", score: "64", stage: "Hold", note: "Timeline gap flagged" },
];

const STAGES = [
  { name: "Inbox", count: "14" },
  { name: "Screened", count: "6", active: true },
  { name: "Interview", count: "3" },
  { name: "Decision", count: "1" },
];

export function RoleWorkspace() {
  return (
    <div className="overflow-hidden rounded-[8px] border border-white/[0.08] bg-[#111214] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
      <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] px-4 py-3.5 sm:px-5">
        <div className="min-w-0">
          <p className="truncate text-[14px] font-medium tracking-[-0.02em] text-white">Senior Backend Engineer</p>
          <p className="mt-0.5 text-[12px] text-[#94969c]">Engineering · Remote · Hiring manager: Priya</p>
        </div>
        <span className="shrink-0 rounded-[4px] border border-white/[0.08] bg-[#1a1b1e] px-2 py-1 text-[11px] text-[#b1b3b8]">
          One role
        </span>
      </div>

      <div className="grid lg:grid-cols-[200px_minmax(0,1fr)]">
        <div className="border-b border-white/[0.08] p-4 lg:border-b-0 lg:border-r">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#94969c]">Pipeline</p>
          <ul className="mt-3 space-y-1">
            {STAGES.map((stage) => (
              <li
                key={stage.name}
                className={`flex items-center justify-between rounded-[4px] px-2.5 py-2 text-[13px] ${
                  stage.active ? "bg-[#5e6ad2]/15 text-white" : "text-[#b1b3b8]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={`size-1.5 rounded-full ${stage.active ? "bg-[#5e6ad2]" : "bg-white/20"}`} />
                  {stage.name}
                </span>
                <span className="text-[12px] text-[#94969c]">{stage.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#94969c]">Candidates on this role</p>
            <p className="text-[11px] text-[#94969c]">Same job description</p>
          </div>
          <ul className="mt-3 divide-y divide-white/[0.06] rounded-[8px] border border-white/[0.08]">
            {CANDIDATES.map((person) => (
              <li key={person.name} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 px-3 py-3 sm:grid-cols-[minmax(0,1.3fr)_auto_auto] sm:items-center">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-white">{person.name}</p>
                  <p className="truncate text-[12px] text-[#94969c]">{person.meta}</p>
                </div>
                <p className="hidden text-[12px] text-[#b1b3b8] sm:block">{person.note}</p>
                <div className="text-right">
                  <p className="text-[13px] font-medium tabular-nums text-white">{person.score}</p>
                  <p className="text-[11px] text-[#8b90d6]">{person.stage}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 rounded-[8px] border border-white/[0.08] bg-[#0d0e10] p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[13px] font-medium text-white">Screen & Score</p>
              <p className="text-[11px] text-[#94969c]">Ran for Maya Chen</p>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#94969c]">In</p>
                <p className="mt-1 text-[12px] leading-relaxed text-[#b1b3b8]">Parsed job · maya-chen-resume.pdf</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#94969c]">Out</p>
                <p className="mt-1 text-[12px] leading-relaxed text-[#b1b3b8]">92 match · strengths · gaps · interview focus</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
