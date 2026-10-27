import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing-layout";
import { RoleWorkspace } from "@/components/marketing/role-workspace";
import { FaqList } from "@/components/marketing/faq-list";
import { AGENTS, OG_IMAGE, PLANS, SITE_DESCRIPTION, SITE_TITLE, SITE_URL, TRIAL_HREF } from "@/lib/marketing/site";

export const metadata: Metadata = {
  title: { absolute: SITE_TITLE },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
  alternates: { canonical: SITE_URL },
};

const STEPS = [
  {
    n: "01",
    title: "Open the role",
    body: "Create one board for the job you are actually hiring. The title, the hiring manager, and the job description live there.",
  },
  {
    n: "02",
    title: "Bring the inputs",
    body: "Add resumes, paste a transcript, or import candidates from a Greenhouse job. Everyone stays attached to this requisition.",
  },
  {
    n: "03",
    title: "Run the agents",
    body: "The same pipeline runs for each person: parse the job and the resume, score the match, then shortlist, draft outreach, schedule, analyze the interview, and write a recommendation. You choose who advances.",
  },
];

const USES = [
  {
    href: "/use-cases/technical",
    title: "Technical hiring",
    body: "One engineering req, a stack of resumes, and interview questions aimed at the gaps.",
  },
  {
    href: "/use-cases/high-volume",
    title: "A full slate",
    body: "Import many candidates onto one role and compare them against the same job description.",
  },
  {
    href: "/use-cases/executive",
    title: "A short senior search",
    body: "Fewer people, a written recommendation, and interview times you send yourself.",
  },
  {
    href: "/use-cases/campus",
    title: "A campus cohort",
    body: "One intern or new-grad role, one screen, and the same interview plan for every interviewer.",
  },
];

export default function Home() {
  return (
    <MarketingShell>
      <main>
        <section className="mx-auto max-w-6xl px-5 pb-16 pt-16 sm:pb-24 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#8b90d6]">
              The operating system for one open role
            </p>
            <h1 className="mt-4 text-[40px] font-medium leading-[1.05] tracking-[-0.02em] text-white sm:text-[64px]">
              One board. One role. Agents that run the hire.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-relaxed text-[#b1b3b8] sm:text-[18px]">
              JobNinjas gives every requisition its own workspace. Put the job description and the resumes in one place.
              Agents parse the job and the resumes, score each candidate, and write a hiring recommendation your team can defend.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={TRIAL_HREF}
                className="inline-flex h-11 w-full items-center justify-center rounded-[4px] bg-[#5e6ad2] px-5 text-[14px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] hover:bg-[#6d78d8] sm:w-auto"
              >
                Try a role
              </Link>
              <Link
                href="#pipeline"
                className="inline-flex h-11 w-full items-center justify-center rounded-[4px] border border-white/[0.15] px-5 text-[14px] font-medium text-white hover:bg-white/[0.04] sm:w-auto"
              >
                See the pipeline
              </Link>
            </div>
          </div>
          <div className="mx-auto mt-14 max-w-5xl">
            <RoleWorkspace />
          </div>
        </section>

        <section id="how" className="border-t border-white/[0.08]">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#8b90d6]">How it works</p>
              <h2 className="mt-3 text-[32px] font-medium leading-[1.15] tracking-[-0.02em] sm:text-[40px]">
                Three steps on the requisition.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[#b1b3b8]">
                The board is the open role: the job description, the people in process, their documents, and the agents working that hire.
              </p>
            </div>
            <ol className="space-y-4">
              {STEPS.map((step) => (
                <li key={step.n} className="rounded-[8px] border border-white/[0.08] bg-[#111214] p-5">
                  <p className="text-[12px] font-medium tabular-nums text-[#8b90d6]">{step.n}</p>
                  <h3 className="mt-2 text-[18px] font-medium tracking-[-0.02em]">{step.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#b1b3b8]">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t border-white/[0.08]">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#8b90d6]">Not a whiteboard</p>
            <h2 className="mt-3 max-w-3xl text-[32px] font-medium leading-[1.15] tracking-[-0.02em] sm:text-[40px]">
              Miro-class tools do not run a hire.
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#b1b3b8]">
              A whiteboard stores stickies. JobNinjas runs agents on one open role. JD Parser, Screen & Score, Outreach, and Hiring Recommendation each take an input and write an output. Nothing on the role is there just to be arranged.
            </p>
          </div>
        </section>

        <section id="pipeline" className="border-t border-white/[0.08]">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
            <div className="max-w-2xl">
              <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#8b90d6]">The agent pipeline</p>
              <h2 className="mt-3 text-[32px] font-medium leading-[1.15] tracking-[-0.02em] sm:text-[40px]">
                Each agent reads something and writes something back.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[#b1b3b8]">
                These are the agents on the role, with the same names as the product. Interview Planning writes the guide that Interview Schedule and Interview Analysis read. The sequence runs per candidate.
              </p>
            </div>
            <ol className="mt-10 space-y-3">
              {AGENTS.map((agent, index) => (
                <li key={agent.name} className="grid gap-4 rounded-[8px] border border-white/[0.08] bg-[#111214] p-4 sm:grid-cols-[220px_minmax(0,1fr)] sm:p-5">
                  <div>
                    <p className="text-[12px] tabular-nums text-[#94969c]">{String(index + 1).padStart(2, "0")}</p>
                    <h3 className="mt-1 text-[16px] font-medium tracking-[-0.02em]">{agent.name}</h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-[#b1b3b8]">{agent.summary}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[4px] bg-[#0d0e10] p-3">
                      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#94969c]">Inputs</p>
                      <ul className="mt-2 space-y-1">
                        {agent.inputs.map((item) => (
                          <li key={item} className="text-[13px] text-[#b1b3b8]">{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-[4px] bg-[#0d0e10] p-3">
                      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#94969c]">Outputs</p>
                      <ul className="mt-2 space-y-1">
                        {agent.outputs.map((item) => (
                          <li key={item} className="text-[13px] text-white">{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t border-white/[0.08]">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
            <div className="max-w-2xl">
              <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#8b90d6]">Use cases</p>
              <h2 className="mt-3 text-[32px] font-medium leading-[1.15] tracking-[-0.02em] sm:text-[40px]">
                Different searches. Same shape: one role.
              </h2>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {USES.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-[8px] border border-white/[0.08] bg-[#111214] p-5 transition-colors hover:bg-[#1a1b1e]"
                >
                  <h3 className="text-[16px] font-medium tracking-[-0.02em]">{item.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#b1b3b8]">{item.body}</p>
                  <p className="mt-4 text-[13px] text-[#8b90d6]">Read the use case</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="border-t border-white/[0.08]">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
            <div className="max-w-2xl">
              <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#8b90d6]">Pricing</p>
              <h2 className="mt-3 text-[32px] font-medium leading-[1.15] tracking-[-0.02em] sm:text-[40px]">
                Start with one role.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[#b1b3b8]">
                Starter is one open role. Team is $49 a month for the workspace, not per person.
              </p>
            </div>
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {PLANS.map((plan) => (
                <article
                  key={plan.name}
                  className={`flex flex-col rounded-[8px] border p-5 ${
                    plan.featured ? "border-[#5e6ad2] bg-[#5e6ad2]" : "border-white/[0.08] bg-[#111214]"
                  }`}
                >
                  <p className={`text-[12px] font-medium uppercase tracking-[0.14em] ${plan.featured ? "text-white" : "text-[#94969c]"}`}>
                    {plan.name}
                  </p>
                  <p className="mt-3 text-[36px] font-medium tracking-[-0.02em]">{plan.price}</p>
                  <p className={`text-[13px] ${plan.featured ? "text-white" : "text-[#94969c]"}`}>{plan.period}</p>
                  <p className={`mt-4 text-[14px] leading-relaxed ${plan.featured ? "text-white" : "text-[#b1b3b8]"}`}>{plan.blurb}</p>
                  <ul className="mt-5 flex-1 space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className={`text-[13px] ${plan.featured ? "text-white" : "text-[#b1b3b8]"}`}>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.href}
                    className={`mt-6 inline-flex h-10 items-center justify-center rounded-[4px] text-[13px] font-medium ${
                      plan.featured ? "bg-white text-[#1c2148] hover:bg-white/90" : "bg-white/[0.06] text-white hover:bg-white/[0.1]"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="border-t border-white/[0.08]">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:py-24 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#8b90d6]">FAQ</p>
              <h2 className="mt-3 text-[32px] font-medium leading-[1.15] tracking-[-0.02em]">Questions recruiters actually ask.</h2>
            </div>
            <FaqList />
          </div>
        </section>

        <section className="border-t border-white/[0.08]">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
            <div className="rounded-[8px] border border-white/[0.08] bg-[#111214] px-6 py-10 sm:px-10">
              <h2 className="max-w-xl text-[32px] font-medium leading-[1.15] tracking-[-0.02em] sm:text-[40px]">
                Open a role and run the first resume.
              </h2>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[#b1b3b8]">
                The demo workspace drops you into the product. Create a requisition, add candidates, and run the pipeline.
              </p>
              <Link
                href={TRIAL_HREF}
                className="mt-6 inline-flex h-11 items-center justify-center rounded-[4px] bg-[#5e6ad2] px-5 text-[14px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] hover:bg-[#6d78d8]"
              >
                Try a role
              </Link>
            </div>
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}
