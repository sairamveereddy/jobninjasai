import Link from "next/link";
import { MarketingShell } from "@/components/marketing-layout";
import { topicFor, TRIAL_HREF, type MarketingTopic } from "@/lib/marketing/site";
import { ArrowRight, Sparkles, CheckCircle2, ChevronRight, Workflow } from "lucide-react";

export function TopicPage({ section, slug }: { section: string; slug: string[] }) {
  const topic: MarketingTopic = topicFor(section, slug);

  return (
    <MarketingShell>
      <main className="relative mx-auto max-w-4xl px-6 py-16 sm:py-24">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#ff6d5a]/15 via-[#7d52ff]/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ff6d5a]/30 bg-[#ff6d5a]/10 px-3.5 py-1.5 text-xs font-semibold text-[#ff806f] mb-4">
            <Sparkles className="size-3.5 text-[#ff6d5a]" />
            <span>{topic.kicker}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {topic.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-300">
            {topic.lede}
          </p>

          <div className="mt-12 space-y-4">
            {topic.points.map((point) => (
              <article
                key={point.title}
                className="group rounded-2xl border border-white/[0.1] bg-[#0e1017]/90 p-6 backdrop-blur-md shadow-lg shadow-black/40 hover:border-white/20 hover:bg-[#121420] transition-all"
              >
                <div className="flex items-start gap-3.5">
                  <div className="size-8 rounded-lg bg-[#ff6d5a]/15 border border-[#ff6d5a]/30 flex items-center justify-center text-[#ff7a68] shrink-0 mt-0.5">
                    <CheckCircle2 className="size-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white group-hover:text-[#ff806f] transition-colors tracking-tight">
                      {point.title}
                    </h2>
                    <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                      {point.body}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center gap-4 pt-8 border-t border-white/[0.08]">
            <Link
              href={TRIAL_HREF}
              className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff6d5a] to-[#ff4732] px-6 text-sm font-bold text-white shadow-lg shadow-[#ff6d5a]/25 hover:brightness-110 active:scale-95 transition-all"
            >
              <span>Test This Workflow on Role Canvas</span>
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/#pipeline"
              className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-6 text-sm font-semibold text-white hover:bg-white/[0.1] transition-all"
            >
              <Workflow className="size-4 text-[#ff7a68]" />
              <span>Explore All 15 Agents</span>
            </Link>
          </div>
        </div>
      </main>
    </MarketingShell>
  );
}
