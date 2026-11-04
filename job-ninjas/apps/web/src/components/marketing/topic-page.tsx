import Link from "next/link";
import { MarketingShell } from "@/components/marketing-layout";
import { topicFor, TRIAL_HREF, type MarketingTopic } from "@/lib/marketing/site";
import { ArrowRight, Sparkles, CheckCircle2, ChevronRight, Workflow } from "lucide-react";

export function TopicPage({ section, slug }: { section: string; slug: string[] }) {
  const topic: MarketingTopic = topicFor(section, slug);

  return (
    <MarketingShell>
      <main className="relative mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-20 font-sans">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-mono font-semibold text-neutral-700 mb-4">
            <Sparkles className="size-3 text-[#ea4b71]" />
            <span>{topic.kicker}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-950 leading-tight">
            {topic.title}
          </h1>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-600">
            {topic.lede}
          </p>

          <div className="mt-10 space-y-4">
            {topic.points.map((point) => (
              <article
                key={point.title}
                className="group rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs hover:border-neutral-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3.5">
                  <div className="size-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                    <CheckCircle2 className="size-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-neutral-900 group-hover:text-[#ea4b71] transition-colors tracking-tight">
                      {point.title}
                    </h2>
                    <p className="mt-1.5 text-xs sm:text-sm text-neutral-500 leading-relaxed">
                      {point.body}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center gap-3.5 pt-8 border-t border-neutral-200">
            <Link
              href={TRIAL_HREF}
              className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#ea4b71] hover:bg-[#df3860] px-6 text-sm font-semibold text-white shadow-xs transition-all hover:shadow-md active:scale-95 cursor-pointer"
            >
              <span>Test This Workflow on Role Canvas</span>
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/#pipeline"
              className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white hover:bg-neutral-50 px-6 text-sm font-semibold text-neutral-800 shadow-2xs transition-colors cursor-pointer"
            >
              <Workflow className="size-4 text-[#ea4b71]" />
              <span>Explore All 15 Agents</span>
            </Link>
          </div>
        </div>
      </main>
    </MarketingShell>
  );
}
