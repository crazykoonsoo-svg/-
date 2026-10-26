// app/search/page.tsx
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import PostCard from "@/components/blog/PostCard";
import { Post } from "@/types/post";
import { Suspense } from "react";
import { Search } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [results, setResults] = useState<Post[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/posts?search=${encodeURIComponent(q)}`);
    const data = await res.json();
    setResults(data.posts ?? []);
    setSearched(true);
    setLoading(false);
    window.history.replaceState({}, "", `/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <p className="flex items-center gap-2 text-[13px] font-semibold tracking-[.7px] text-teal mb-3">
        <span className="block w-4 h-px bg-teal" />SEARCH
      </p>
      <h1 className="text-[30px] font-bold tracking-[-1.5px] text-ink mb-6">무엇이 궁금하세요?</h1>

      {/* 검색 입력 */}
      <div className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSearch(query); }}
            placeholder="검색어를 입력하세요"
            className="w-full pl-10 pr-4 py-3 text-sm border border-[#cfdbd8] rounded-[9px] focus:ring-2 focus:ring-teal-200 focus:border-teal"
            autoFocus
          />
        </div>
        <button
          onClick={() => handleSearch(query)}
          className="px-6 py-3 bg-teal-dark text-white text-sm font-semibold rounded-[9px] hover:bg-teal transition-colors"
        >
          검색
        </button>
      </div>

      {/* 결과 */}
      {loading && (
        <div className="text-center text-gray-400 py-8">검색 중...</div>
      )}

      {searched && !loading && (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            <strong className="text-gray-900">"{query}"</strong> 검색 결과{" "}
            {results.length}개
          </p>
          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {results.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg mb-2">검색 결과가 없습니다.</p>
              <p className="text-sm">다른 키워드로 검색해보세요.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
