"use client";
import { useState } from "react";

interface Props {
  content: string;
  onTitleSelect: (title: string) => void;
  onExcerptSelect: (excerpt: string) => void;
}

export default function AiSuggester({ content, onTitleSelect, onExcerptSelect }: Props) {
  const [loading, setLoading] = useState(false);
  const [titles, setTitles] = useState<string[]>([]);
  const [excerpts, setExcerpts] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const analyze = async () => {
    const plainText = content.replace(/<[^>]+>/g, " ").slice(0, 2000);
    if (!plainText.trim()) { alert("본문을 먼저 작성해주세요!"); return; }

    setLoading(true);
    setIsOpen(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `다음 블로그 본문을 분석해서 JSON으로만 응답해주세요. 다른 말은 하지 마세요.

본문:
${plainText}

응답 형식:
{
  "titles": ["SEO 최적화 제목1 (40-60자)", "제목2", "제목3"],
  "excerpts": ["검색결과에 표시될 요약1 (100-150자)", "요약2"]
}

조건:
- 제목은 검색 키워드가 포함된 SEO 친화적 제목 3개
- 요약은 클릭을 유도하는 100-150자 요약 2개
- 한국어로 작성`
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.[0]?.text ?? "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setTitles(parsed.titles ?? []);
      setExcerpts(parsed.excerpts ?? []);
    } catch {
      alert("AI 분석에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white mt-4">
      <div className="px-5 py-4 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">🤖</span>
          <span className="text-sm font-semibold text-gray-700">AI 제목/요약 추천</span>
          <span className="text-xs text-gray-400">본문 기반 자동 생성</span>
        </div>
        <button
          type="button"
          onClick={analyze}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <><span className="animate-spin">⟳</span> 분석 중...</>
          ) : (
            <><span>✨</span> AI 분석</>
          )}
        </button>
      </div>

      {isOpen && (titles.length > 0 || excerpts.length > 0) && (
        <div className="p-5 space-y-5 border-t border-gray-100">
          {/* 제목 추천 */}
          {titles.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">📝 추천 제목 (클릭하면 적용)</p>
              <div className="space-y-2">
                {titles.map((t, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onTitleSelect(t)}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 bg-purple-50 border border-purple-100 rounded-lg hover:bg-purple-100 hover:border-purple-300 transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 요약 추천 */}
          {excerpts.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">💬 추천 요약 (클릭하면 적용)</p>
              <div className="space-y-2">
                {excerpts.map((e, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onExcerptSelect(e)}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-colors"
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
