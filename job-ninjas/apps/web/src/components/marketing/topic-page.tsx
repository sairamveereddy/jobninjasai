import Link from "next/link";
import { MarketingShell } from "@/components/marketing-layout";
import { topicFor, TRIAL_HREF, type MarketingTopic } from "@/lib/marketing/site";

export function TopicPage({ section, slug }: { section: string; slug: string[] }) {
  const topic: MarketingTopic = topicFor(section, slug);

  return (
    <MarketingShell>
      <main className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
        <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#8b90d6]">{topic.kicker}</p>
        <h1 className="mt-3 text-[36px] font-medium leading-[1.1] tracking-[-0.02em] text-white sm:text-[48px]">
          {topic.title}
        </h1>
        <p className="mt-5 text-[17px] leading-relaxed text-[#b1b3b8]">{topic.lede}</p>

        <div className="mt-12 space-y-4">
          {topic.points.map((point) => (
            <article key={point.title} className="rounded-[8px] border border-white/[0.08] bg-[#111214] p-5">
              <h2 className="text-[15px] font-medium tracking-[-0.02em] text-white">{point.title}</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-[#b1b3b8]">{point.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Link
            href={TRIAL_HREF}
            className="inline-flex items-center justify-center rounded-[4px] bg-[#5e6ad2] px-4 py-2.5 text-[14px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] hover:bg-[#6d78d8]"
          >
            Try a role
          </Link>
          <Link
            href="/#pipeline"
            className="inline-flex items-center justify-center rounded-[4px] border border-white/[0.15] px-4 py-2.5 text-[14px] font-medium text-white hover:bg-white/[0.04]"
          >
            See the pipeline
          </Link>
        </div>
      </main>
    </MarketingShell>
  );
}
