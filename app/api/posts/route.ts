export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
  return createClient(url, key);
}

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabase();
    const isAdmin = req.nextUrl.searchParams.get("admin") === "true";
    const searchQuery = req.nextUrl.searchParams.get("search");

    let query = supabase.from("posts").select("*").order("published_at", { ascending: false });
    if (!isAdmin) query = query.eq("status", "published");
    if (searchQuery) query = query.or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`);

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ posts: data ?? [] });
  } catch (e: any) {
    return NextResponse.json({ posts: [], error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await req.json();
    if (!body.title || !body.slug) return NextResponse.json({ error: "제목과 슬러그는 필수입니다." }, { status: 400 });

    const now = new Date().toISOString();
    const readingTime = Math.max(1, Math.ceil(body.content?.replace(/<[^>]+>/g, "").split(/\s+/).length / 300));

    const { data, error } = await supabase.from("posts").insert({
      title: body.title, slug: body.slug, excerpt: body.excerpt ?? "",
      content: body.content ?? "", category: body.category ?? "일반",
      tags: body.tags ?? [], cover_image: body.coverImage ?? "",
      cover_image_alt: body.coverImageAlt ?? "", author: body.author ?? "관리자",
      published_at: body.publishedAt ?? now, status: body.status ?? "draft",
      meta_title: body.metaTitle ?? body.title, meta_description: body.metaDescription ?? "",
      canonical_url: body.canonicalUrl ?? "", og_image: body.ogImage ?? "",
      faq_items: body.faqItems ?? [], summary: body.summary ?? "",
      key_points: body.keyPoints ?? [], reading_time: readingTime, views: 0,
    }).select().single();

    if (error) throw error;
    return NextResponse.json({ post: data }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
