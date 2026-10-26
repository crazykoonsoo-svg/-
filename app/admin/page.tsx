"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Post } from "@/types/post";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "-";
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  } catch { return "-"; }
}

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts?admin=true");
      const data = await res.json();
      setPosts(data.posts ?? []);
    } catch { setPosts([]); }
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const deletePost = async (id: string, title: string) => {
    if (!confirm(`"${title}" 글을 삭제할까요?`)) return;
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (res.ok) setPosts((prev) => prev.filter((p) => p.id !== id));
    else alert("삭제에 실패했습니다.");
  };

  const pub = posts.filter((p) => p.status === "published").length;
  const draft = posts.filter((p) => p.status === "draft").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
            <p className="text-sm text-gray-500 mt-1">전체 {posts.length}개 · 발행 {pub}개 · 임시저장 {draft}개</p>
          </div>
          <Link href="/admin/posts/new" className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
            <Plus size={16} /> 새 글 작성
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[["전체 글", posts.length], ["발행된 글", pub], ["임시저장", draft]].map(([label, val]) => (
            <div key={label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              <p className="text-3xl font-bold text-gray-900">{val}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">글 목록</h2>
          </div>
          {loading ? (
            <div className="p-12 text-center text-gray-400">불러오는 중...</div>
          ) : posts.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <p className="mb-4">작성된 글이 없습니다.</p>
              <Link href="/admin/posts/new" className="text-blue-600 hover:underline text-sm">첫 글 작성하기 →</Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {posts.map((post) => (
                <div key={post.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group">
                  <span className={`flex-shrink-0 flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${post.status === "published" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {post.status === "published" ? <Eye size={10} /> : <EyeOff size={10} />}
                    {post.status === "published" ? "발행" : "임시"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate text-sm">{post.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {post.category && <span className="mr-2">📁 {post.category}</span>}
                      {formatDate(post.publishedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {post.status === "published" && (
                      <Link href={`/blog/${post.slug}`} target="_blank" className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="보기">
                        <Eye size={15} />
                      </Link>
                    )}
                    <Link href={`/admin/posts/${post.id}/edit`} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="수정">
                      <Edit size={15} />
                    </Link>
                    <button onClick={() => deletePost(post.id, post.title)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="삭제">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
