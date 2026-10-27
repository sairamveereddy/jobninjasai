import type { Metadata } from "next";
import { TopicPage } from "@/components/marketing/topic-page";
import { topicFor, topicSeo } from "@/lib/marketing/site";

type Props = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = topicFor("product", slug);
  return topicSeo(topic);
}

export default async function ProductTopicPage({ params }: Props) {
  const { slug } = await params;
  return <TopicPage section="product" slug={slug} />;
}
