import type { Metadata } from "next";
import { TopicPage } from "@/components/marketing/topic-page";
import { topicFor } from "@/lib/marketing/site";

type Props = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = topicFor("use-cases", slug);
  return { title: `${topic.title} | JobNinjas`, description: topic.lede };
}

export default async function UseCasePage({ params }: Props) {
  const { slug } = await params;
  return <TopicPage section="use-cases" slug={slug} />;
}
