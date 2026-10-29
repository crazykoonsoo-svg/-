"use client";
// 홈 글 목록: 한 페이지에 6개씩 보여주고 번호로 넘김 (주소는 바뀌지 않음)
// 모든 카드는 HTML에 그대로 들어가 있어 검색엔진은 전부 읽을 수 있고, 화면에서만 6개씩 보입니다.
import { Children, useRef, useState, type ReactNode } from "react";

export default function PostPager({ children, perPage = 6 }: { children: ReactNode; perPage?: number }) {
  const items = Children.toArray(children);
  const pages = Math.max(1, Math.ceil(items.length / perPage));
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);

  const go = (p: number) => {
    const next = Math.min(pages, Math.max(1, p));
    setPage(next);
    const el = topRef.current;
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 110, behavior: "smooth" });
  };

  // 현재 페이지 주변 번호만 보여주기 (1 … 4 5 6 … 13)
  const nums: (number | "…")[] = [];
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - page) <= 1) nums.push(i);
    else if (nums[nums.length - 1] !== "…") nums.push("…");
  }

  const btn = "min-w-[38px] h-[38px] px-3 rounded-full text-sm border transition-colors";
  return (
    <div ref={topRef}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((child, i) => (
          <div key={i} className={Math.floor(i / perPage) + 1 === page ? "flex [&>*]:w-full" : "hidden"}>
            {child}
          </div>
        ))}
      </div>
      {pages > 1 && (
        <nav className="flex flex-wrap items-center justify-center gap-1.5 mt-10" aria-label="글 목록 페이지">
          <button type="button" onClick={() => go(page - 1)} disabled={page === 1}
            className={`${btn} border-line bg-white text-ink hover:bg-wash disabled:opacity-35 disabled:cursor-default`} aria-label="이전 페이지">‹</button>
          {nums.map((n, i) =>
            n === "…" ? (
              <span key={`e${i}`} className="px-1 text-muted">…</span>
            ) : (
              <button key={n} type="button" onClick={() => go(n)} aria-current={n === page ? "page" : undefined}
                className={`${btn} ${n === page ? "bg-teal-dark border-teal-dark text-white font-semibold" : "border-line bg-white text-muted hover:bg-wash hover:border-[#a9d9bd]"}`}>
                {n}
              </button>
            )
          )}
          <button type="button" onClick={() => go(page + 1)} disabled={page === pages}
            className={`${btn} border-line bg-white text-ink hover:bg-wash disabled:opacity-35 disabled:cursor-default`} aria-label="다음 페이지">›</button>
        </nav>
      )}
    </div>
  );
}
