export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) return NextResponse.json({ error: "환경변수 누락" }, { status: 500 });

    const supabase = createClient(url, key);
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "파일 없음" }, { status: 400 });

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";

    // Supabase Storage는 키(경로)에 영문/숫자/하이픈만 허용 (한글·유니코드 불가)
    // 한글 파일명은 alt 텍스트로 별도 저장되므로 SEO에는 영향 없음
    const baseName = file.name
      .replace(/\.[^.]+$/, "")          // 확장자 제거
      .replace(/[^a-zA-Z0-9\s-]/g, "")  // 영문/숫자/공백/하이픈만 허용 (한글 등 제거)
      .replace(/\s+/g, "-")             // 공백 → 하이픈
      .replace(/-+/g, "-")              // 연속 하이픈 정리
      .trim()
      .replace(/^-|-$/g, "")            // 앞뒤 하이픈 제거
      .slice(0, 60);

    const safeName = baseName || "image"; // 한글만 있던 경우 fallback
    const filename = `${safeName}-${Date.now()}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const { error } = await supabase.storage
      .from("blog-images")
      .upload(filename, buffer, { contentType: file.type });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from("blog-images")
      .getPublicUrl(filename);

    return NextResponse.json({ url: publicUrl });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
