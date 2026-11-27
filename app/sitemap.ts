export const dynamic = 'force-dynamic';

import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { isPostIndexable } from "@/lib/post-indexing";

function validDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 빌드 시에는 기본 페이지만, 런타임에 동적 생성
  try {
    const { getAllPosts } = await import("@/lib/posts");
    const posts = await getAllPosts();

    return [
      { url: SITE_URL, changeFrequency: "daily", priority: 1.0 },
      { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
      ...posts.filter((post) => isPostIndexable(post.slug)).map((post) => ({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: validDate(post.updatedAt) ?? validDate(post.publishedAt),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ];
  } catch (err) {
    // 여기서 원인을 로그로 남겨야 Vercel Logs에서 실제 에러를 확인할 수 있습니다.
    console.error("[sitemap] 생성 중 에러 발생, 기본 URL만 반환합니다:", err);
    return [
      { url: SITE_URL, changeFrequency: "daily", priority: 1.0 },
      { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    ];
  }
}
