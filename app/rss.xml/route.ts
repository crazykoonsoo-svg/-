export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";

function toRFC2822(dateStr: string): string | undefined {
  const date = new Date(dateStr);
  return Number.isNaN(date.getTime()) ? undefined : date.toUTCString();
}

export async function GET() {
  try {
    const posts = (await getAllPosts()).slice(0, 20);
    const lastBuildTime = posts
      .flatMap(({ publishedAt, updatedAt }) => [Date.parse(publishedAt), Date.parse(updatedAt)])
      .filter(Number.isFinite)
      .reduce((latest, time) => Math.max(latest, time), -Infinity);
    const lastBuildDate = Number.isFinite(lastBuildTime)
      ? new Date(lastBuildTime).toUTCString()
      : undefined;

    const items = posts.map((post) => {
      const link = escapeXml(`${SITE_URL}/blog/${post.slug}`);
      const published = toRFC2822(post.publishedAt);
      const description = (post.content || "").trim() || post.excerpt || post.title;
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(description)}</description>${published ? `\n      <pubDate>${published}</pubDate>` : ""}
      <category>${escapeXml(post.category)}</category>
    </item>`;
    }).join("");

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>ko</language>
    ${lastBuildDate ? `<lastBuildDate>${lastBuildDate}</lastBuildDate>` : ""}
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <generator>Next.js</generator>${items}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (e) {
    return new NextResponse("RSS 생성 오류", { status: 500 });
  }
}

function escapeXml(str: string): string {
  if (!str) return "";
  return str
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
