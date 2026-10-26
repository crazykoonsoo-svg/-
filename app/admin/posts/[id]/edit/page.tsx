"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    let active = true;
    fetch("/api/posts?admin=true", { cache: "no-store" })
      .then(async r => { if (!r.ok) throw new Error("글을 불러올 수 없습니다."); return r.json(); })
      .then(({ posts }) => {
        if (!active) return;
        const found = posts.find((p: any) => String(p.id) === params.id);
        if (!found) throw new Error("글을 찾을 수 없습니다.");
        setPost(found);
      }).catch(e => { if (active) setError(e.message); });
    return () => { active = false; };
  }, [params.id]);
  const change = (key: string, value: string) => setPost((p: any) => ({ ...p, [key]: value }));
  const save = async () => {
    if (!post.title.trim() || !post.content.trim()) { setError("제목과 본문을 입력해 주세요."); return; }
    setSaving(true); setError("");
    try {
      const res = await fetch(`/api/posts/${params.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: post.title, slug: post.slug, excerpt: post.excerpt,
          content: post.content, category: post.category, tags: post.tags,
          coverImage: post.cover_image, coverImageAlt: post.cover_image_alt,
          status: post.status, metaTitle: post.meta_title, metaDescription: post.meta_description
        })
      });
      if (!res.ok) throw new Error("저장하지 못했습니다. 입력 내용을 유지했습니다.");
      router.push(`/blog/${post.slug}`); router.refresh();
    } catch (e: any) { setError(e.message); } finally { setSaving(false); }
  };
  if (!post) return <div className="max-w-4xl mx-auto p-8">{error || "글을 불러오는 중입니다."}</div>;
  const fields = [
    ["title", "제목"], ["excerpt", "글 요약"], ["meta_title", "메타 제목"],
    ["meta_description", "메타 설명"]
  ];
  return <main className="max-w-4xl mx-auto px-5 py-10 space-y-6">
    <a href="/admin">← 관리자</a>
    <h1 className="text-2xl font-bold">게시물 수정</h1>
    <p className="text-sm text-gray-500">/blog/{post.slug}</p>
    {fields.map(([key, label]) => <label key={key} className="block">
      <span className="block font-semibold mb-2">{label}</span>
      <input className="w-full border rounded-lg p-3" value={post[key] || ""} onChange={e => change(key, e.target.value)} />
    </label>)}
    <label className="block"><span className="block font-semibold mb-2">본문 HTML</span>
      <textarea className="w-full border rounded-lg p-3 font-mono text-sm" rows={24} value={post.content || ""} onChange={e => change("content", e.target.value)} />
    </label>
    <details><summary className="cursor-pointer font-semibold">본문 미리보기</summary>
      <div className="blog-content border rounded-lg p-6 mt-4" dangerouslySetInnerHTML={{ __html: post.content }} />
    </details>
    {error && <p role="alert" className="text-red-600">{error}</p>}
    <button type="button" disabled={saving} onClick={save} className="bg-teal-dark text-white rounded-lg px-6 py-3 disabled:opacity-50">{saving ? "저장 중..." : "수정 저장"}</button>
  </main>;
}
