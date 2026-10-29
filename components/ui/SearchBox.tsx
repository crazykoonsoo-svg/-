// components/ui/SearchBox.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const QUICK = ["애견미용자격증", "국비지원", "비용"];

export default function SearchBox({ variant = "default" }: { variant?: "default" | "hero" }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const go = (q: string) => {
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    go(query);
  };

  return (
    <div className={variant === "hero" ? "max-w-[505px]" : "max-w-xl mx-auto"}>
      <form onSubmit={handleSubmit} role="search"
        className="flex items-center bg-white border border-[#cfe6d8] rounded-[9px] p-1.5 shadow-[0_6px_20px_#2d454208]">
        <Search className="ml-3 shrink-0 text-muted" size={19} aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="자격증, 국비지원, 지역 학원 검색"
          aria-label="블로그 검색"
          className="w-full min-w-0 bg-transparent border-0 px-3 py-2.5 text-sm text-ink placeholder:text-[#758481] focus:outline-none"
        />
        <button type="submit"
          className="shrink-0 rounded-md bg-teal-dark hover:bg-teal text-white text-sm font-semibold px-[19px] py-2.5 transition-colors">
          검색
        </button>
      </form>
      {variant === "hero" && (
        <div className="flex items-center gap-3 mt-3 text-xs text-muted">
          <span>바로 찾기</span>
          {QUICK.map((q) => (
            <button key={q} type="button" onClick={() => go(q)}
              className="text-[13px] text-ink border-b border-[#9aada7] leading-[1.8] hover:text-teal">
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
