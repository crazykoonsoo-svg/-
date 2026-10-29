export const dynamicParams = true;

import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { getAllPosts, getPostBySlug, getRelatedPosts, getAdjacentPosts } from "@/lib/posts";
import { getPostMetadata } from "@/lib/seo";
import { lazyContentImages, splitBeforeHeading } from "@/lib/content";
import { getArticleSchema, getBreadcrumbSchema, getFAQSchema, serializeSchema } from "@/lib/schema";
import TableOfContents from "@/components/blog/TableOfContents";
import RelatedPosts from "@/components/blog/RelatedPosts";
import PostNavigation from "@/components/blog/PostNavigation";
import ShareButtons from "@/components/blog/ShareButtons";
import { SITE_URL, AUTHOR_NAME } from "@/lib/seo";
import { Clock, Calendar, Folder, Tag, PenLine } from "lucide-react";
import ScrollProgress from "@/components/blog/ScrollProgress";
import GiscusComments from "@/components/blog/GiscusComments";

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  } catch { return ""; }
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "글을 찾을 수 없습니다" };
  return getPostMetadata(post);
}

export const revalidate = 3600;

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post || post.status !== "published") notFound();

  // Count distinct published articles, matching the single-tag redirect query.
  const publishedPosts = await getAllPosts();
  const tagCounts = new Map<string, number>();
  for (const publishedPost of publishedPosts) {
    for (const tag of Array.from(new Set(publishedPost.tags))) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }

  const relatedPosts = await getRelatedPosts(post);
  const { prev, next } = await getAdjacentPosts(params.slug);

  // 작성자 표시: 예전 기본값 "관리자"는 학원 이름으로 보여줌
  const authorName = post.author && post.author !== "관리자" ? post.author : AUTHOR_NAME;
  const updatedLabel = post.updatedAt && formatDate(post.updatedAt) !== formatDate(post.publishedAt) ? formatDate(post.updatedAt) : "";

  const readingTime = post.readingTime ?? Math.ceil((post.content || "").replace(/<[^>]+>/g, "").split(/\s+/).length / 300);
  const articleSchema = getArticleSchema(post);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "홈", url: SITE_URL },
    { name: post.category, url: `${SITE_URL}/blog/category/${encodeURIComponent(post.category)}` },
    { name: post.title, url: `${SITE_URL}/blog/${post.slug}` },
  ]);
  const faqSchema = post.faqItems && post.faqItems.length > 0 ? getFAQSchema(post.faqItems) : null;

  // 본문 이미지 지연 로딩 + 세 번째 소제목 앞에 "함께 읽으면 좋은 글" 넣기
  const [contentTop, contentRest] = splitBeforeHeading(lazyContentImages(post.content || ""), 3);
  const inlineRelated = contentRest ? relatedPosts.slice(0, 3) : [];

  return (
    <>
      <ScrollProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(faqSchema) }} />}

      <div className="max-w-[1160px] mx-auto px-5 lg:px-6 py-8 lg:py-10">
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li><a href="/" className="hover:text-blue-600">홈</a></li>
            <li>/</li>
            <li><a href={`/blog/category/${encodeURIComponent(post.category)}`} className="hover:text-blue-600">{post.category}</a></li>
            <li>/</li>
            <li className="text-gray-700 truncate max-w-xs">{post.title}</li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10">
          <article className="flex-1 min-w-0">
            <header className="mb-8">
              <div className="mb-3">
                <a href={`/blog/category/${encodeURIComponent(post.category)}`} className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal bg-teal-50 px-2 py-1 rounded hover:bg-teal-100">
                  <Folder size={12} />{post.category}
                </a>
              </div>
              <h1 className="text-[26px] sm:text-[32px] lg:text-[38px] font-bold text-ink leading-[1.38] tracking-[-1.5px] mb-4">{post.title}</h1>
              {post.excerpt && <p className="text-[17px] text-muted leading-[1.7] mb-5">{post.excerpt}</p>}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 border-t border-b border-gray-100 py-3">
                <span className="flex items-center gap-1.5"><PenLine size={14} />작성 {authorName}</span>
                <time dateTime={post.publishedAt} className="flex items-center gap-1.5">
                  <Calendar size={14} />{formatDate(post.publishedAt)}
                </time>
                {updatedLabel && <time dateTime={post.updatedAt} className="flex items-center gap-1.5">수정 {updatedLabel}</time>}
                <span className="flex items-center gap-1.5"><Clock size={14} />약 {readingTime}분 읽기</span>
                {post.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Tag size={14} />
                    {post.tags.map((tag) => (
                      (tagCounts.get(tag) ?? 0) >= 2 ? (
                        <a key={tag} href={`/blog/tag/${encodeURIComponent(tag)}`} className="hover:text-blue-600">#{tag}</a>
                      ) : <span key={tag}>#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </header>

            {post.coverImage && (
              <div className="mb-8 rounded-[11px] overflow-hidden border border-line">
                <Image src={post.coverImage} alt={post.coverImageAlt || post.title} width={900} height={500} className="w-full h-auto object-cover" priority />
              </div>
            )}

            {post.summary && (
              <div className="info-box mb-8">
                <div className="info-box-title"><span>📌</span> 이 글의 핵심 요약</div>
                <p className="text-amber-900 text-sm leading-relaxed">{post.summary}</p>
                {post.keyPoints && post.keyPoints.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {post.keyPoints.map((point, i) => (
                      <li key={i} className="text-sm text-amber-800 flex items-start gap-2"><span className="text-amber-500 mt-0.5">✓</span>{point}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="blog-content" dangerouslySetInnerHTML={{ __html: contentTop }} />
            {inlineRelated.length > 0 && (
              <aside className="my-8 rounded-[18px] border border-[#cfe6d8] bg-[linear-gradient(135deg,#f4fbf6,#e6f5ec)] px-5 py-4" aria-label="함께 읽으면 좋은 글">
                <p className="text-[12px] font-bold tracking-[.02em] text-teal mb-2">함께 읽으면 좋은 글</p>
                <ul className="space-y-1.5">
                  {inlineRelated.map((r) => (
                    <li key={r.slug}>
                      <a href={`/blog/${r.slug}`} className="text-[15px] font-semibold leading-[1.5] text-ink hover:text-teal transition-colors">→ {r.title}</a>
                    </li>
                  ))}
                </ul>
              </aside>
            )}
            {contentRest && <div className="blog-content" dangerouslySetInnerHTML={{ __html: contentRest }} />}

            {post.faqItems && post.faqItems.length > 0 && (
              <section className="mt-12" aria-label="자주 묻는 질문">
                <h2 className="text-xl font-bold text-gray-900 mb-4">자주 묻는 질문</h2>
                <div className="space-y-3">
                  {post.faqItems.map((faq, idx) => (
                    <details key={idx} className="faq-block group">
                      <summary className="faq-question list-none flex items-center justify-between">
                        <span>{faq.question}</span><span className="text-gray-400 group-open:rotate-180 transition-transform">▾</span>
                      </summary>
                      <div className="faq-answer"><p>{faq.answer}</p></div>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {post.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 mb-3">태그</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    (tagCounts.get(tag) ?? 0) >= 2 ? (
                      <a key={tag} href={`/blog/tag/${encodeURIComponent(tag)}`} className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors">#{tag}</a>
                    ) : <span key={tag} className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full">#{tag}</span>
                  ))}
                </div>
              </div>
            )}

            <ShareButtons url={`${SITE_URL}/blog/${post.slug}`} title={post.title} />
            <PostNavigation prev={prev} next={next} />
          </article>

          <aside className="hidden xl:block w-64 flex-shrink-0">
            <div className="sticky top-8 space-y-4">
              <TableOfContents content={post.content} />
              {/* 사이드바 배너 */}
              <a
                href="http://evaw-pet-grooming.co.kr/"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Image
                  src="/sidebar-banner.png"
                  alt="애견미용 상담문의"
                  width={256}
                  height={200}
                  className="w-full h-auto rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                />
              </a>
            </div>
          </aside>
        </div>

        <GiscusComments />

        {relatedPosts.length > 0 && (
          <section className="mt-12 pt-8 border-t border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">관련 글</h2>
            <RelatedPosts posts={relatedPosts} />
          </section>
        )}
      </div>
    </>
  );
}
