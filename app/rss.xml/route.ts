export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";

function toRFC2822(dateStr: string): string {
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return new Date().toUTCString().replace(/[^\x00-\x7F]/g, "");
  return `${days[d.getUTCDay()]}, ${String(d.getUTCDate()).padStart(2,"0")} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()} ${String(d.getUTCHours()).padStart(2,"0")}:${String(d.getUTCMinutes()).padStart(2,"0")}:${String(d.getUTCSeconds()).padStart(2,"0")} GMT`;
}

export async function GET() {
  try {
    const posts = (await getAllPosts()).slice(0, 20);
    const lastBuildDate = toRFC2822(new Date().toISOString());

    const items = posts.map((post) => {
      const link = `${SITE_URL}/blog/${post.slug}`;
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(post.excerpt || post.title)}</description>
      <pubDate>${toRFC2822(post.publishedAt)}</pubDate>
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
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
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
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
