// components/blog/TableOfContents.tsx
"use client";
import { useEffect, useState } from "react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface Props {
  content: string;
}

export default function TableOfContents({ content }: Props) {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  // 실제 렌더링된 DOM의 h2, h3에 id 부여 + 목차 생성
  useEffect(() => {
    const blogContent = document.querySelector(".blog-content");
    if (!blogContent) return;

    const elements = blogContent.querySelectorAll("h2, h3");
    const items: TOCItem[] = [];

    elements.forEach((el, idx) => {
      const text = el.textContent ?? "";
      const id = `heading-${idx}`;
      el.id = id;
      items.push({
        id,
        text,
        level: parseInt(el.tagName[1]),
      });
    });

    setHeadings(items);
  }, [content]);

  // 스크롤 감지 - 현재 보이는 헤딩 하이라이트
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );

    document.querySelectorAll(".blog-content h2[id], .blog-content h3[id]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="목차" className="bg-gray-50 rounded-xl border border-gray-200 p-4">
      <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
        <span>📋</span> 목차
      </h2>
      <ol className="space-y-1.5">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: heading.level === 3 ? "1rem" : "0" }}
          >
            <a
              href={`#${heading.id}`}
              className={`block text-sm leading-snug transition-colors py-0.5 ${
                activeId === heading.id
                  ? "text-blue-600 font-semibold border-l-2 border-blue-500 pl-2 -ml-0.5"
                  : "text-gray-500 hover:text-gray-900"
              }`}
              onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById(heading.id);
                if (target) {
                  const offset = 80; // 헤더 높이만큼 여백
                  const top = target.getBoundingClientRect().top + window.scrollY - offset;
                  window.scrollTo({ top, behavior: "smooth" });
                  setActiveId(heading.id);
                }
              }}
            >
              {heading.level === 3 && (
                <span className="text-gray-300 mr-1">└</span>
              )}
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
