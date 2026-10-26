"use client";
import { useState } from "react";

interface Props {
  content: string;
}

export default function SpellChecker({ content }: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const check = async () => {
    const text = content.replace(/<[^>]+>/g, " ").slice(0, 1500).trim();
    if (!text) { alert("본문을 먼저 작성해주세요!"); return; }

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
            content: `다음 한국어 텍스트의 맞춤법과 문법을 검사해주세요.

텍스트:
${text}

응답 형식:
1. 오류 목록: 잘못된 표현 → 올바른 표현 (이유)
2. 전체 평가: 한 줄로

오류가 없으면 "맞춤법 오류가 없습니다 ✅"라고만 답하세요.`
          }]
        })
      });
      const data = await res.json();
      setResult(data.content?.[0]?.text ?? "분석 실패");
    } catch {
      setResult("맞춤법 검사에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white mt-4">
      <div className="px-5 py-4 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>✍️</span>
          <span className="text-sm font-semibold text-gray-700">맞춤법 검사</span>
          <span className="text-xs text-gray-400">AI 기반</span>
        </div>
        <button
          type="button"
          onClick={check}
          disabled={loading}
          className="px-4 py-1.5 text-xs font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50"
        >
          {loading ? "검사 중..." : "검사하기"}
        </button>
      </div>

      {isOpen && result && (
        <div className="p-5 border-t border-gray-100">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed font-sans">{result}</pre>
        </div>
      )}
    </div>
  );
}
