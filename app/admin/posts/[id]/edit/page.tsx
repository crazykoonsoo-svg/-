"use client";
import { useEffect, useState } from "react";
import { toKoreaDateTimeInput } from "@/lib/dates";
import { useRouter } from "next/navigation";

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [wasPublished, setWasPublished] = useState(false);
  const [publicationCorrection, setPublicationCorrection] = useState<string | undefined>();
  useEffect(() => {
    let active = true;
    fetch("/api/posts?admin=true", { cache: "no-store" })
      .then(async r => { if (!r.ok) throw new Error("글을 불러올 수 없습니다."); return r.json(); })
      .then(({ posts }) => {
        if (!active) return;
        const found = posts.find((p: any) => String(p.id) === params.id);
        if (!found) throw new Error("글을 찾을 수 없습니다.");
        setPost(found);
        setWasPublished(found.status === "published");
      }).catch(e => { if (active) setError(e.message); });
    return () => { active = false; };
  }, [params.id]);
  const change = (key: string, value: unknown) => setPost((p: any) => ({ ...p, [key]: value }));
  const save = async () => {
    if (!post.title.trim() || !post.content.trim()) { setError("제목과 본문을 입력해 주세요."); return; }
    setSaving(true); setError("");
    try {
      const res = await fetch(`/api/posts/${params.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publishedAt: publicationCorrection,
          title: post.title, slug: post.slug, excerpt: post.excerpt,
          content: post.content, category: post.category, tags: post.tags,
          coverImage: post.cover_image, coverImageAlt: post.cover_image_alt,
          status: post.status, metaTitle: post.meta_title, metaDescription: post.meta_description,
          summary: post.summary || "",
          keyPoints: (post.key_points || []).filter((point: string) => point.trim()),
          faqItems: post.faq_items || []
        })
      });
      if (!res.ok) throw new Error("저장하지 못했습니다. 입력 내용을 유지했습니다.");
      router.push(`/blog/${post.slug}`); router.refresh();
    } catch (e: any) { setError(e.message); } finally { setSaving(false); }
  };
  if (!post) return <div className="max-w-4xl mx-auto p-8">{error || "글을 불러오는 중입니다."}</div>;
  const fields = [
    ["title", "제목"], ["excerpt", "글 요약"], ["meta_title", "메타 제목"],
    ["meta_description", "메타 설명"],
    ["cover_image", "대표 이미지 URL"], ["cover_image_alt", "대표 이미지 대체텍스트"]
  ];
  return <main className="max-w-4xl mx-auto px-5 py-10 space-y-6">
    <a href="/admin">← 관리자</a>
    <h1 className="text-2xl font-bold">게시물 수정</h1>
    <p className="text-sm text-gray-500">/blog/{post.slug}</p>
    <label className="block"><span className="block font-semibold mb-2">카테고리</span>
      <select className="w-full border rounded-lg p-3" value={post.category || ""} onChange={e => change("category", e.target.value)}>
        {Array.from(new Set([post.category, "교육", "자격증", "국비지원", "비용", "취업·창업", "애견미용학원", "이바우펫", "견종"].filter(Boolean))).map(category => <option key={category} value={category}>{category}</option>)}
      </select>
    </label>
    <label className="block"><span className="block font-semibold mb-2">발행 상태</span>
      <select className="w-full border rounded-lg p-3" value={post.status || "draft"} onChange={e => change("status", e.target.value)}>
        <option value="draft">임시저장</option>
        <option value="published">발행</option>
      </select>
    </label>
    {wasPublished && <label className="block">
      <span className="block font-semibold mb-2">발행 시각 (한국시간)</span>
      <input type="datetime-local" step="0.001" className="w-full border rounded-lg p-3"
        value={toKoreaDateTimeInput(publicationCorrection ?? post.published_at)}
        onChange={e => setPublicationCorrection(e.target.value ? `${e.target.value}+09:00` : "")} />
      <span className="block text-sm text-gray-500 mt-2">실제 공개한 시각입니다. 일반 수정 저장으로는 발행일이 바뀌지 않습니다.</span>
    </label>}
    {!wasPublished && <p className="text-sm text-gray-500">발행 시각은 공개 전환을 저장할 때 한국시간 기준으로 자동 기록됩니다.</p>}
    {fields.map(([key, label]) => <label key={key} className="block">
      <span className="block font-semibold mb-2">{label}</span>
      <input className="w-full border rounded-lg p-3" value={post[key] || ""} onChange={e => change(key, e.target.value)} />
    </label>)}
    <label className="block"><span className="block font-semibold mb-2">본문 HTML</span>
      <textarea className="w-full border rounded-lg p-3 font-mono text-sm" rows={24} value={post.content || ""} onChange={e => change("content", e.target.value)} />
    </label>
    <label className="block"><span className="block font-semibold mb-2">핵심 요약</span>
      <textarea className="w-full border rounded-lg p-3" rows={3} value={post.summary || ""} onChange={e => change("summary", e.target.value)} />
    </label>
    <label className="block"><span className="block font-semibold mb-2">핵심 포인트 (한 줄에 하나)</span>
      <textarea className="w-full border rounded-lg p-3" rows={5} value={(post.key_points || []).join("\n")} onChange={e => change("key_points", e.target.value.split("\n"))} />
    </label>
    <fieldset className="space-y-4">
      <legend className="font-semibold">자주 묻는 질문</legend>
      {(post.faq_items || []).map((faq: { question: string; answer: string }, index: number) => <div key={index} className="border rounded-lg p-4 space-y-3">
        <label className="block">질문 {index + 1}
          <input className="w-full border rounded-lg p-3" value={faq.question} onChange={e => change("faq_items", post.faq_items.map((item: typeof faq, i: number) => i === index ? { ...item, question: e.target.value } : item))} />
        </label>
        <label className="block">답변 {index + 1}
          <textarea className="w-full border rounded-lg p-3" rows={3} value={faq.answer} onChange={e => change("faq_items", post.faq_items.map((item: typeof faq, i: number) => i === index ? { ...item, answer: e.target.value } : item))} />
        </label>
        <button type="button" className="text-red-700 underline" onClick={() => change("faq_items", post.faq_items.filter((_: unknown, i: number) => i !== index))}>질문 {index + 1} 삭제</button>
      </div>)}
      <button type="button" className="border rounded-lg px-4 py-2" onClick={() => change("faq_items", [...(post.faq_items || []), { question: "", answer: "" }])}>질문 추가</button>
    </fieldset>
    <details><summary className="cursor-pointer font-semibold">본문 미리보기</summary>
      <div className="blog-content border rounded-lg p-6 mt-4" dangerouslySetInnerHTML={{ __html: post.content }} />
    </details>
    {error && <p role="alert" className="text-red-600">{error}</p>}
    <button type="button" disabled={saving} onClick={save} className="bg-teal-dark text-white rounded-lg px-6 py-3 disabled:opacity-50">{saving ? "저장 중..." : "수정 저장"}</button>
  </main>;
}
