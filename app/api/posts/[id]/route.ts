export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
  return createClient(url, key);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getSupabase();
    const body = await req.json();
    const { data, error } = await supabase.from("posts").update({
      title: body.title, slug: body.slug, excerpt: body.excerpt,
      content: body.content, category: body.category, tags: body.tags,
      cover_image: body.coverImage, cover_image_alt: body.coverImageAlt,
      status: body.status, meta_title: body.metaTitle,
      meta_description: body.metaDescription, updated_at: new Date().toISOString(),
    }).eq("id", params.id).select().single();
    if (error) throw error;
    return NextResponse.json({ post: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from("posts").delete().eq("id", params.id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
