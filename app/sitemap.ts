export const dynamic = 'force-dynamic';

import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// updatedAt/publishedAt이 비어있거나 잘못된 값이면 new Date()가 "Invalid Date"를 만들고,
// 이걸 sitemap이 문자열로 변환하려는 순간 에러가 나서 전체 sitemap 생성이 실패했습니다
// (그래서 글이 있어도 sitemap엔 기본 2개만 나왔던 것입니다). 유효하지 않으면 현재 시각으로 대체합니다.
function safeDate(value: unknown, fallback: Date): Date {
  if (!value) return fallback;
  const d = new Date(value as string);
  return isNaN(d.getTime()) ? fallback : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // 빌드 시에는 기본 페이지만, 런타임에 동적 생성
  try {
    const { getAllPosts } = await import("@/lib/posts");
    const posts = await getAllPosts();

    // Only indexable pages belong in the sitemap; tag/category archives are noindex.
    return [
      { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
      { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
      ...posts.map((post) => ({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: safeDate(post.updatedAt || post.publishedAt, now),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ];
  } catch (err) {
    // 여기서 원인을 로그로 남겨야 Vercel Logs에서 실제 에러를 확인할 수 있습니다.
    console.error("[sitemap] 생성 중 에러 발생, 기본 URL만 반환합니다:", err);
    return [
      { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
      { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    ];
  }
}
