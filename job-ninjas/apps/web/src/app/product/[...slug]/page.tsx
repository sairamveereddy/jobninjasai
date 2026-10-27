import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { TopicPage } from "@/components/marketing/topic-page";
import { topicFor, topicSeo } from "@/lib/marketing/site";

type Props = { params: Promise<{ slug: string[] }> };

const ALIASES: Record<string, string> = {
  canvas: "/product/role-board",
  copilot: "/product/interview-analysis",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = topicFor("product", slug);
  return topicSeo(topic);
}

export default async function ProductTopicPage({ params }: Props) {
  const { slug } = await params;
  const alias = slug.length === 1 ? ALIASES[slug[0]] : undefined;
  if (alias) redirect(alias);
  return <TopicPage section="product" slug={slug} />;
}
