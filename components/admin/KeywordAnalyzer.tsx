"use client";

import { useMemo, useState } from "react";

interface Props {
  content: string;
  title?: string;
}

interface WordCount {
  word: string;
  count: number;
  density: string;
}

export default function KeywordAnalyzer({ content, title = "" }: Props) {
  // 탭으로 이미 선택된 상태로 들어오므로 기본 펼침
  const [isOpen, setIsOpen] = useState(true);
  const [searchWord, setSearchWord] = useState("");

  const analysis = useMemo(() => {
    // HTML 태그 제거
    const text = content.replace(/<[^>]+>/g, " ").replace(/&[^;]+;/g, " ");
    const titleText = title.replace(/<[^>]+>/g, " ");
    const fullText = titleText + " " + text;

    // 단어 추출 (2글자 이상)
    const words = fullText
      .toLowerCase()
      .split(/[\s\n\r\t.,!?;:()\[\]{}"'\/\\|@#$%^&*+=<>~`]+/)
      .filter((w) => w.length >= 2);

    const totalWords = words.length;

    // 단어 빈도 계산
    const freq: Record<string, number> = {};
    words.forEach((w) => {
      freq[w] = (freq[w] ?? 0) + 1;
    });

    // 불용어 제거 (한국어 + 영어)
    const stopWords = new Set([
      "이", "그", "저", "것", "수", "있", "하", "되", "않", "들", "에서", "으로", "에게",
      "부터", "까지", "라고", "이라", "라는", "이는", "하는", "있는", "없는", "때문",
      "the", "a", "an", "is", "are", "was", "were", "be", "been", "have", "has",
      "had", "do", "does", "did", "will", "would", "could", "should", "may", "might",
      "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by",
      "이다", "있다", "없다", "하다", "되다", "같다", "때", "그리고", "하지만",
    ]);

    const filtered = Object.entries(freq)
      .filter(([word]) => !stopWords.has(word))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(([word, count]) => ({
        word,
        count,
        density: totalWords > 0 ? ((count / totalWords) * 100).toFixed(1) : "0",
      }));

    // 검색어 강조
    const searchResult = searchWord.trim()
      ? {
          word: searchWord.trim(),
          count: freq[searchWord.trim().toLowerCase()] ?? 0,
          density: totalWords > 0
            ? (((freq[searchWord.trim().toLowerCase()] ?? 0) / totalWords) * 100).toFixed(1)
            : "0",
        }
      : null;

    return { words: filtered, totalWords, searchResult };
  }, [content, title, searchWord]);

  const getDensityColor = (density: string) => {
    const d = parseFloat(density);
    if (d >= 3) return "text-red-600 bg-red-50";
    if (d >= 1.5) return "text-green-600 bg-green-50";
    return "text-gray-500 bg-gray-50";
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white mt-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3.5 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-base">🔍</span>
          <span className="text-sm font-semibold text-gray-700">키워드 분석</span>
          <span className="text-xs text-gray-400">총 {analysis.totalWords}단어</span>
        </div>
        <span className={`text-gray-400 transition-transform text-sm ${isOpen ? "rotate-180" : ""}`}>▾</span>
      </button>

      {isOpen && (
        <div className="p-5 border-t border-gray-100">
          {/* 특정 단어 검색 */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              특정 단어 검색
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
                placeholder="검색할 키워드 입력..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {analysis.searchResult && searchWord && (
              <div className={`mt-2 px-4 py-3 rounded-lg flex items-center justify-between ${
                analysis.searchResult.count > 0 ? "bg-blue-50 border border-blue-200" : "bg-gray-50 border border-gray-200"
              }`}>
                <span className="text-sm font-medium text-gray-700">
                  "{analysis.searchResult.word}"
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-blue-600">
                    {analysis.searchResult.count}회
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getDensityColor(analysis.searchResult.density)}`}>
                    {analysis.searchResult.density}%
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 키워드 밀도 가이드 */}
          <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
            <p className="text-xs font-medium text-amber-700 mb-1">📊 키워드 밀도 기준</p>
            <div className="flex gap-3 text-xs text-amber-600">
              <span>🟢 1.5~3% 최적</span>
              <span>🔴 3% 이상 과다</span>
              <span>⚪ 1.5% 미만 부족</span>
            </div>
          </div>

          {/* 상위 키워드 목록 */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">상위 30개 키워드</p>
            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              {analysis.words.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">본문을 입력하면 분석됩니다.</p>
              ) : (
                analysis.words.map((item, idx) => (
                  <div key={item.word} className="flex items-center gap-3 py-1.5 px-2 rounded-lg hover:bg-gray-50">
                    <span className="text-xs text-gray-300 w-5 text-right flex-shrink-0">{idx + 1}</span>
                    <span className="text-sm font-medium text-gray-700 flex-1">{item.word}</span>
                    <span className="text-sm font-bold text-gray-800 w-8 text-right">{item.count}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium w-14 text-center ${getDensityColor(item.density)}`}>
                      {item.density}%
                    </span>
                    {/* 빈도 바 */}
                    <div className="w-20 bg-gray-100 rounded-full h-1.5 flex-shrink-0">
                      <div
                        className="bg-blue-400 h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, (item.count / (analysis.words[0]?.count || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
