"use client";
import { useMemo } from "react";

interface Props {
  title: string;
  metaTitle: string;
  metaDescription: string;
  content: string;
  coverImage: string;
  coverImageAlt: string;
  slug: string;
  tags: string[];
}

interface Check {
  label: string;
  pass: boolean;
  message: string;
  weight: number;
}

export default function SeoScoreChecker(props: Props) {
  const { title, metaTitle, metaDescription, content, coverImage, coverImageAlt, slug, tags } = props;

  const checks: Check[] = useMemo(() => {
    const plainText = content.replace(/<[^>]+>/g, " ");
    const wordCount = plainText.split(/\s+/).filter(Boolean).length;
    const hasH2 = content.includes("<h2");
    const hasH3 = content.includes("<h3");
    const imgCount = (content.match(/<img/g) ?? []).length;
    const imgWithAlt = (content.match(/<img[^>]+alt="[^"]{2,}"/g) ?? []).length;

    return [
      {
        label: "제목 길이",
        pass: title.length >= 10 && title.length <= 60,
        message: title.length < 10 ? `너무 짧아요 (${title.length}자)` : title.length > 60 ? `너무 길어요 (${title.length}자)` : `적절해요 (${title.length}자)`,
        weight: 15,
      },
      {
        label: "메타 제목",
        pass: metaTitle.length >= 10 && metaTitle.length <= 60,
        message: !metaTitle ? "입력해주세요" : metaTitle.length > 60 ? `너무 길어요 (${metaTitle.length}/60자)` : `좋아요 (${metaTitle.length}자)`,
        weight: 15,
      },
      {
        label: "메타 설명",
        pass: metaDescription.length >= 50 && metaDescription.length <= 160,
        message: !metaDescription ? "입력해주세요" : metaDescription.length < 50 ? `너무 짧아요 (${metaDescription.length}자)` : metaDescription.length > 160 ? `너무 길어요 (${metaDescription.length}/160자)` : `좋아요 (${metaDescription.length}자)`,
        weight: 15,
      },
      {
        label: "본문 길이",
        pass: wordCount >= 300,
        message: wordCount < 300 ? `${wordCount}단어 (300 이상 권장)` : `${wordCount}단어 ✓`,
        weight: 15,
      },
      {
        label: "H2 소제목",
        pass: hasH2,
        message: hasH2 ? "사용됨 ✓" : "H2 소제목을 추가하세요",
        weight: 10,
      },
      {
        label: "대표 이미지",
        pass: !!coverImage,
        message: coverImage ? "설정됨 ✓" : "대표 이미지를 추가하세요",
        weight: 10,
      },
      {
        label: "이미지 alt 텍스트",
        pass: !!coverImage && coverImageAlt.length >= 2,
        message: !coverImage ? "이미지 없음" : coverImageAlt.length < 2 ? "alt 텍스트를 입력하세요" : `"${coverImageAlt}" ✓`,
        weight: 10,
      },
      {
        label: "태그",
        pass: tags.length >= 3,
        message: tags.length < 3 ? `${tags.length}개 (3개 이상 권장)` : `${tags.length}개 ✓`,
        weight: 5,
      },
      {
        label: "URL 슬러그",
        pass: slug.length >= 3 && /^[a-z0-9-]+$/.test(slug),
        message: !slug ? "슬러그를 입력하세요" : !/^[a-z0-9-]+$/.test(slug) ? "영문/숫자/-만 사용하세요" : `좋아요 ✓`,
        weight: 5,
      },
    ];
  }, [title, metaTitle, metaDescription, content, coverImage, coverImageAlt, slug, tags]);

  const score = useMemo(() => {
    const total = checks.reduce((sum, c) => sum + c.weight, 0);
    const earned = checks.filter((c) => c.pass).reduce((sum, c) => sum + c.weight, 0);
    return Math.round((earned / total) * 100);
  }, [checks]);

  const scoreColor = score >= 80 ? "text-green-600" : score >= 50 ? "text-amber-500" : "text-red-500";
  const barColor = score >= 80 ? "bg-green-500" : score >= 50 ? "bg-amber-400" : "bg-red-400";
  const grade = score >= 80 ? "좋음 🟢" : score >= 50 ? "보통 🟡" : "개선 필요 🔴";

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white mt-4">
      <div className="px-5 py-4 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">📊</span>
          <span className="text-sm font-semibold text-gray-700">SEO 점수</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">{grade}</span>
          <span className={`text-2xl font-bold ${scoreColor}`}>{score}</span>
        </div>
      </div>

      <div className="px-5 pt-3 pb-1">
        <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
          <div className={`h-2 rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${score}%` }} />
        </div>
      </div>

      <div className="px-5 pb-4 space-y-2">
        {checks.map((check) => (
          <div key={check.label} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-2">
              <span className="text-xs">{check.pass ? "✅" : "❌"}</span>
              <span className="text-xs font-medium text-gray-700">{check.label}</span>
            </div>
            <span className={`text-xs ${check.pass ? "text-green-600" : "text-red-500"}`}>
              {check.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
