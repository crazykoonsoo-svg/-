"use client";
import { useState, useEffect } from "react";

interface Post {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
}

interface Props {
  content: string;
  currentSlug?: string;
  onInsertLink: (title: string, url: string) => void;
}

export default function InternalLinkSuggester({ content, currentSlug, onInsertLink }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  // 탭으로 이미 선택된 상태로 들어오므로 기본 펼침
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/posts?admin=false")
      .then((r) => r.json())
      .then((d) => {
        const filtered = (d.posts ?? []).filter((p: Post) => p.slug !== currentSlug);
        setPosts(filtered);
      });
  }, [isOpen, currentSlug]);

  // 본문에서 키워드 추출해서 관련 글 추천
  const suggested = (() => {
    if (!content || posts.length === 0) return posts.slice(0, 5);
    const text = content.replace(/<[^>]+>/g, " ").toLowerCase();
    return posts
      .map((p) => {
        let score = 0;
        const words = p.title.split(/\s+/);
        words.forEach((w) => { if (w.length > 1 && text.includes(w.toLowerCase())) score++; });
        p.tags?.forEach((t) => { if (text.includes(t.toLowerCase())) score += 2; });
        return { ...p, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  })();

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white mt-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span>🔗</span>
          <span className="text-sm font-semibold text-gray-700">내부 링크 추천</span>
          <span className="text-xs text-gray-400">관련 글 연결로 SEO 향상</span>
        </div>
        <span className={`text-gray-400 text-sm transition-transform ${isOpen ? "rotate-180" : ""}`}>▾</span>
      </button>

      {isOpen && (
        <div className="p-5 border-t border-gray-100">
          {suggested.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">발행된 글이 없습니다.</p>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 mb-3">클릭하면 본문에 링크가 삽입됩니다</p>
              {suggested.map((post) => (
                <button
                  key={post.id}
                  type="button"
                  onClick={() => onInsertLink(post.title, `/blog/${post.slug}`)}
                  className="w-full text-left px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors group"
                >
                  <p className="text-sm font-medium text-gray-700 group-hover:text-blue-700 line-clamp-1">{post.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">/blog/{post.slug}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
