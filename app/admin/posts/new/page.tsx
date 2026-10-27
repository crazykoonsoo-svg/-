// app/admin/posts/new/page.tsx
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import ImageUpload from "@/components/admin/ImageUpload";
import KeywordAnalyzer from "@/components/admin/KeywordAnalyzer";
import SeoScoreChecker from "@/components/admin/SeoScoreChecker";
import InternalLinkSuggester from "@/components/admin/InternalLinkSuggester";
import LinkPreview from "@/components/admin/LinkPreview";
import { PostFormData, FAQItem } from "@/types/post";
import { Plus, Trash2, Eye, Save, Send } from "lucide-react";

const Editor = dynamic(() => import("@/components/admin/Editor"), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-300 rounded-xl p-8 text-center text-gray-400">
      에디터 로딩 중...
    </div>
  ),
});

const CATEGORIES = ["교육", "자격증", "국비지원", "비용", "취업·창업", "애견미용학원", "이바우펫"];

// 키워드분석/SEO점수/SEO설정/GEO최적화/내부링크/링크카드/AEO/대표이미지 — 메인 작성창 하단 탭으로 통합
const TOOL_TABS: { key: string; label: string }[] = [
  { key: "keyword", label: "🔍 키워드분석" },
  { key: "seoscore", label: "📊 SEO점수" },
  { key: "seosettings", label: "🛠️ SEO설정" },
  { key: "geo", label: "🧭 GEO최적화" },
  { key: "link", label: "🔗 내부링크" },
  { key: "linkcard", label: "🃏 링크카드" },
  { key: "aeo", label: "❓ AEO" },
  { key: "cover", label: "🖼️ 대표이미지" },
];

const initialForm: PostFormData = {
  title: "", slug: "", excerpt: "", content: "", category: "",
  tags: [], coverImage: "", coverImageAlt: "", metaTitle: "",
  metaDescription: "", canonicalUrl: "", ogImage: "", status: "draft",
  faqItems: [], summary: "", keyPoints: [],
};

function generateSlug(title: string): string {
  const englishWords = title.toLowerCase().match(/[a-z]+/g) ?? [];
  const today = new Date();
  const date = `${today.getFullYear()}${String(today.getMonth()+1).padStart(2,"0")}${String(today.getDate()).padStart(2,"0")}`;
  const num = String(Date.now()).slice(-3);
  if (englishWords.length >= 2) return `${englishWords.slice(0,4).join("-")}-${date}-${num}`;
  if (englishWords.length === 1) return `${englishWords[0]}-${date}-${num}`;
  return `post-${date}-${num}`;
}

export default function NewPostPage() {
  const router = useRouter();
  const [form, setForm] = useState<PostFormData>(initialForm);
  const [tagInput, setTagInput] = useState("");
  const [keyPointInput, setKeyPointInput] = useState("");
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toolTab, setToolTab] = useState<string>("keyword");

  const update = useCallback(
    <K extends keyof PostFormData>(key: K, value: PostFormData[K]) => {
      setForm((prev) => ({
        ...prev,
        [key]: value,
        ...(key === "title" && !prev.slug ? { slug: generateSlug(value as string) } : {}),
        ...(key === "title" && !prev.metaTitle ? { metaTitle: value as string } : {}),
        ...(key === "excerpt" && !prev.metaDescription ? { metaDescription: value as string } : {}),
      }));
    }, []
  );

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) update("tags", [...form.tags, tag]);
    setTagInput("");
  };

  const addFAQ = () => {
    update("faqItems", [...form.faqItems, { question: "", answer: "" } as FAQItem]);
  };

  const updateFAQ = (idx: number, field: keyof FAQItem, value: string) => {
    const updated = [...form.faqItems];
    updated[idx] = { ...updated[idx], [field]: value };
    update("faqItems", updated);
  };

  const save = async (status: "draft" | "published") => {
    if (!form.title) { alert("제목을 입력해주세요."); return; }
    if (!form.slug) { alert("슬러그를 입력해주세요."); return; }
    if (!form.content) { alert("본문을 작성해주세요."); return; }

    setSaving(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, status }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { post } = await res.json();
      alert(status === "published" ? "글이 발행되었습니다!" : "임시저장 완료!");
      router.push(status === "published" ? `/blog/${post.slug}` : "/admin");
    } catch (err) {
      alert("저장에 실패했습니다.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-16 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/admin" className="text-sm text-gray-500 hover:text-blue-600">← 관리자</a>
            <span className="text-gray-300">/</span>
            <span className="text-sm font-semibold text-gray-800">새 글 작성</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setPreview(!preview)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <Eye size={14} /> {preview ? "닫기" : "미리보기"}
            </button>
            <button onClick={() => save("draft")} disabled={saving}
              className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors">
              <Save size={14} /> 임시저장
            </button>
            <button onClick={() => save("published")} disabled={saving}
              className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
              <Send size={14} /> {saving ? "저장 중..." : "발행하기"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {preview ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{form.title || "제목 없음"}</h1>
            {form.excerpt && <p className="text-gray-500 text-lg mb-6">{form.excerpt}</p>}
            <div className="blog-content" dangerouslySetInnerHTML={{ __html: form.content || "<p>본문 없음</p>" }} />
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-7">
                <input type="text" value={form.title} onChange={(e) => update("title", e.target.value)}
                  placeholder="제목을 입력하세요"
                  className="w-full text-3xl font-bold text-gray-900 placeholder-gray-300 border-0 focus:ring-0 focus:outline-none resize-none" />
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-gray-400">URL:</span>
                  <span className="text-xs text-gray-400">/blog/</span>
                  <input type="text" value={form.slug} onChange={(e) => update("slug", e.target.value)}
                    className="flex-1 text-xs text-blue-600 border-b border-dashed border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                    placeholder="url-slug" />
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  글 요약 / 설명
                  <span className="ml-1 text-xs text-gray-400 font-normal">(검색결과 및 카드 미리보기에 표시)</span>
                </label>
                <textarea value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)}
                  rows={3} placeholder="글의 핵심 내용을 2~3문장으로 요약해주세요.."
                  className="w-full px-0 text-sm text-gray-700 border-0 focus:ring-0 focus:outline-none resize-none placeholder-gray-300"
                  maxLength={200} />
                <p className="text-xs text-gray-400 text-right">{form.excerpt.length}/200</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 pt-4 pb-2 border-b border-gray-100">
                  <h2 className="text-sm font-semibold text-gray-700">본문 작성</h2>
                </div>
                <Editor value={form.content} onChange={(html) => update("content", html)} />
              </div>

              {/* 키워드분석/SEO점수/내부링크/링크카드/AEO/대표이미지 — 탭으로 전환하며 메인 작성창에서 바로 사용 */}
              <ToolsPanel tabs={TOOL_TABS} active={toolTab} onChange={setToolTab} />

              {toolTab === "keyword" && (
                <KeywordAnalyzer content={form.content} title={form.title} />
              )}
              {toolTab === "seoscore" && (
                <SeoScoreChecker
                  title={form.title} metaTitle={form.metaTitle}
                  metaDescription={form.metaDescription} content={form.content}
                  coverImage={form.coverImage} coverImageAlt={form.coverImageAlt}
                  slug={form.slug} tags={form.tags}
                />
              )}
              {toolTab === "seosettings" && (
                <div className="border border-gray-200 rounded-xl bg-white mt-4 p-5 space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span>🛠️</span>
                    <span className="text-sm font-semibold text-gray-700">SEO 설정</span>
                    <span className="text-xs text-gray-400">검색 최적화</span>
                  </div>
                  <FormField label="메타 제목" hint={`${form.metaTitle.length}/60`}
                    hintColor={form.metaTitle.length > 60 ? "red" : "gray"}>
                    <input type="text" value={form.metaTitle}
                      onChange={(e) => update("metaTitle", e.target.value)} maxLength={80}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="검색결과에 표시될 제목 (60자 이내)" />
                  </FormField>
                  <FormField label="메타 설명" hint={`${form.metaDescription.length}/160`}
                    hintColor={form.metaDescription.length > 160 ? "red" : "gray"}>
                    <textarea value={form.metaDescription}
                      onChange={(e) => update("metaDescription", e.target.value)}
                      rows={3} maxLength={200}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="검색결과에 표시될 설명 (160자 이내)" />
                  </FormField>
                  <FormField label="Canonical URL">
                    <input type="url" value={form.canonicalUrl}
                      onChange={(e) => update("canonicalUrl", e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="비워두면 자동 설정" />
                  </FormField>
                  <FormField label="OG 이미지 URL">
                    <input type="url" value={form.ogImage}
                      onChange={(e) => update("ogImage", e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="비워두면 대표 이미지 사용" />
                  </FormField>
                  {(form.metaTitle || form.title) && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-2 font-medium">예상 검색 미리보기</p>
                      <p className="text-xs text-green-700 truncate">yourblog.com/blog/{form.slug || "slug"}</p>
                      <p className="text-sm text-blue-800 font-medium mt-0.5 line-clamp-1">{form.metaTitle || form.title}</p>
                      <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{form.metaDescription || form.excerpt}</p>
                    </div>
                  )}
                </div>
              )}
              {toolTab === "geo" && (
                <div className="border border-gray-200 rounded-xl bg-white mt-4 p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <span>🧭</span>
                    <span className="text-sm font-semibold text-gray-700">GEO 최적화 - 핵심 요약 &amp; 핵심포인트</span>
                    <span className="text-xs text-gray-400">AI 검색 최적화</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">핵심 요약</label>
                    <textarea value={form.summary} onChange={(e) => update("summary", e.target.value)}
                      rows={3} placeholder="이 글의 핵심 내용을 3~5문장으로 작성해주세요."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">핵심 포인트</label>
                    <div className="space-y-2">
                      {form.keyPoints.map((point, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input type="text" value={point}
                            onChange={(e) => {
                              const updated = [...form.keyPoints];
                              updated[idx] = e.target.value;
                              update("keyPoints", updated);
                            }}
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder={`포인트 ${idx + 1}`} />
                          <button type="button"
                            onClick={() => update("keyPoints", form.keyPoints.filter((_, i) => i !== idx))}
                            className="p-2 text-red-400 hover:text-red-600">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <input type="text" value={keyPointInput}
                          onChange={(e) => setKeyPointInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (keyPointInput.trim()) {
                                update("keyPoints", [...form.keyPoints, keyPointInput.trim()]);
                                setKeyPointInput("");
                              }
                            }
                          }}
                          className="flex-1 px-3 py-2 text-sm border border-dashed border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="포인트 추가 (Enter로 추가)" />
                        <button type="button"
                          onClick={() => {
                            if (keyPointInput.trim()) {
                              update("keyPoints", [...form.keyPoints, keyPointInput.trim()]);
                              setKeyPointInput("");
                            }
                          }}
                          className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg">
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {toolTab === "link" && (
                <InternalLinkSuggester
                  content={form.content} currentSlug={form.slug}
                  onInsertLink={(title, url) => {
                    update("content", form.content + `<p><a href="${url}">${title}</a></p>`);
                  }}
                />
              )}
              {toolTab === "linkcard" && (
                <LinkPreview onInsert={(html) => update("content", form.content + html)} />
              )}
              {toolTab === "aeo" && (
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white mt-4">
                  <div className="px-5 py-4 bg-gray-50 flex items-center gap-2">
                    <span>❓</span>
                    <span className="text-sm font-semibold text-gray-700">AEO 최적화 - FAQ 구성</span>
                    <span className="text-xs text-gray-400">AI 답변 최적화</span>
                  </div>
                  <div className="p-5 space-y-3">
                    {form.faqItems.map((faq, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-500">Q{idx + 1}</span>
                          <button type="button"
                            onClick={() => update("faqItems", form.faqItems.filter((_, i) => i !== idx))}
                            className="text-red-400 hover:text-red-600">
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <input type="text" value={faq.question}
                          onChange={(e) => updateFAQ(idx, "question", e.target.value)}
                          className="w-full px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="질문을 입력해주세요" />
                        <textarea value={faq.answer}
                          onChange={(e) => updateFAQ(idx, "answer", e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="답변을 입력해주세요" />
                      </div>
                    ))}
                    <button type="button" onClick={addFAQ}
                      className="w-full py-2.5 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 flex items-center justify-center gap-1.5 transition-colors">
                      <Plus size={14} /> FAQ 항목 추가
                    </button>
                  </div>
                </div>
              )}
              {toolTab === "cover" && (
                <div className="border border-gray-200 rounded-xl bg-white mt-4 p-5">
                  <ImageUpload value={form.coverImage} altValue={form.coverImageAlt}
                    onImageChange={(url) => update("coverImage", url)}
                    onAltChange={(alt) => update("coverImageAlt", alt)} />
                </div>
              )}

            </div>

            <div className="space-y-5">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">발행 설정</h3>
                <div className="space-y-3">
                  <button onClick={() => save("draft")} disabled={saving}
                    className="w-full py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2">
                    <Save size={14} /> 임시저장
                  </button>
                  <button onClick={() => save("published")} disabled={saving}
                    className="w-full py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                    <Send size={14} /> {saving ? "저장 중..." : "발행하기"}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">분류</h3>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">카테고리</label>
                  <select value={form.category} onChange={(e) => update("category", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="">카테고리 선택</option>
                    {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">태그</label>
                  <div className="flex gap-2 mb-2">
                    <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                      className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="태그 입력 후 Enter" />
                    <button type="button" onClick={addTag}
                      className="px-3 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">추가</button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {form.tags.map((tag) => (
                      <span key={tag} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                        #{tag}
                        <button type="button"
                          onClick={() => update("tags", form.tags.filter((t) => t !== tag))}
                          className="text-blue-400 hover:text-blue-700">×</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ToolsPanel({ tabs, active, onChange }: {
  tabs: { key: string; label: string }[]; active: string; onChange: (key: string) => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-2 flex flex-wrap gap-1">
      {tabs.map((tab) => (
        <button key={tab.key} type="button" onClick={() => onChange(tab.key)}
          className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
            active === tab.key ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
          }`}>
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function FormField({ label, hint, hintColor = "gray", children }: {
  label: string; hint?: string; hintColor?: "gray" | "red"; children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-xs font-medium text-gray-600">{label}</label>
        {hint && <span className={`text-xs ${hintColor === "red" ? "text-red-500" : "text-gray-400"}`}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}
