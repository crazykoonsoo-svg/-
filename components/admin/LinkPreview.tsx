"use client";
import { useState } from "react";
import Image from "next/image";

interface Preview {
  title: string;
  description: string;
  image: string;
  siteName: string;
  url: string;
}

interface Props {
  onInsert: (html: string) => void;
}

export default function LinkPreview({ onInsert }: Props) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [error, setError] = useState("");

  const fetchPreview = async (inputUrl: string) => {
    if (!inputUrl.startsWith("http")) return;
    setLoading(true);
    setError("");
    setPreview(null);
    try {
      const res = await fetch(`/api/link-preview?url=${encodeURIComponent(inputUrl)}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPreview(data);
    } catch (e: any) {
      setError("링크 정보를 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text");
    if (text.startsWith("http")) {
      setUrl(text);
      setTimeout(() => fetchPreview(text), 100);
    }
  };

  const insertCard = () => {
    if (!preview) return;
    const html = `
<div style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;margin:16px 0;display:flex;max-width:100%;background:#fff;text-decoration:none;" class="link-card">
  ${preview.image ? `<div style="width:160px;min-width:160px;overflow:hidden;"><img src="${preview.image}" alt="${preview.title}" style="width:100%;height:100%;object-fit:cover;" loading="lazy"/></div>` : ""}
  <div style="padding:16px;flex:1;min-width:0;">
    <p style="font-size:11px;color:#9ca3af;margin:0 0 6px;">${preview.siteName}</p>
    <a href="${preview.url}" target="_blank" rel="noopener noreferrer" style="font-size:15px;font-weight:600;color:#111827;text-decoration:none;display:block;margin-bottom:6px;">${preview.title}</a>
    ${preview.description ? `<p style="font-size:13px;color:#6b7280;margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${preview.description}</p>` : ""}
  </div>
</div>`;
    onInsert(html);
    setUrl("");
    setPreview(null);
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white mt-4">
      <div className="px-5 py-4 bg-gray-50">
        <div className="flex items-center gap-2 mb-3">
          <span>🔗</span>
          <span className="text-sm font-semibold text-gray-700">링크 카드 삽입</span>
          <span className="text-xs text-gray-400">URL 붙여넣으면 자동으로 정보 불러오기</span>
        </div>
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onPaste={handlePaste}
            onKeyDown={(e) => { if (e.key === "Enter") fetchPreview(url); }}
            placeholder="https:// 링크를 붙여넣으세요..."
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => fetchPreview(url)}
            disabled={loading || !url}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "불러오는 중..." : "불러오기"}
          </button>
        </div>
      </div>

      {/* 오류 */}
      {error && (
        <div className="px-5 py-3 text-sm text-red-500 border-t border-gray-100">{error}</div>
      )}

      {/* 미리보기 */}
      {preview && (
        <div className="p-5 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-500 mb-3">미리보기</p>
          <div className="border border-gray-200 rounded-xl overflow-hidden flex bg-white mb-4">
            {preview.image && (
              <div className="w-40 flex-shrink-0 overflow-hidden bg-gray-100">
                <img
                  src={preview.image}
                  alt={preview.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
            )}
            <div className="p-4 flex-1 min-w-0">
              <p className="text-xs text-gray-400 mb-1">{preview.siteName}</p>
              <p className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">{preview.title}</p>
              {preview.description && (
                <p className="text-xs text-gray-500 line-clamp-2">{preview.description}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={insertCard}
            className="w-full py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            📌 본문에 카드 삽입
          </button>
        </div>
      )}
    </div>
  );
}
