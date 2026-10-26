import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { getAllPosts, getPostBySlug, getRelatedPosts, getAdjacentPosts } from "@/lib/posts";
import { getPostMetadata } from "@/lib/seo";
import { getArticleSchema, getBreadcrumbSchema, getFAQSchema, serializeSchema } from "@/lib/schema";
import TableOfContents from "@/components/blog/TableOfContents";
import RelatedPosts from "@/components/blog/RelatedPosts";
import PostNavigation from "@/components/blog/PostNavigation";
import ShareButtons from "@/components/blog/ShareButtons";
import { SITE_URL } from "@/lib/seo";
import { Clock, Calendar, Folder, Tag } from "lucide-react";

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

  const relatedPosts = await getRelatedPosts(post);
  const { prev, next } = await getAdjacentPosts(params.slug);

  const readingTime = post.readingTime ?? Math.ceil((post.content || "").replace(/<[^>]+>/g, "").split(/\s+/).length / 300);
  const articleSchema = getArticleSchema(post);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "홈", url: SITE_URL },
    { name: post.category, url: `${SITE_URL}/blog/category/${encodeURIComponent(post.category)}` },
    { name: post.title, url: `${SITE_URL}/blog/${post.slug}` },
  ]);
  const faqSchema = post.faqItems && post.faqItems.length > 0 ? getFAQSchema(post.faqItems) : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(faqSchema) }} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <a href={`/blog/category/${encodeURIComponent(post.category)}`} className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100">
                  <Folder size={12} />{post.category}
                </a>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">{post.title}</h1>
              {post.excerpt && <p className="text-lg text-gray-600 leading-relaxed mb-4 font-light">{post.excerpt}</p>}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 border-t border-b border-gray-100 py-3">
                <time dateTime={post.publishedAt} className="flex items-center gap-1.5">
                  <Calendar size={14} />{formatDate(post.publishedAt)}
                </time>
                <span className="flex items-center gap-1.5"><Clock size={14} />약 {readingTime}분 읽기</span>
                {post.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Tag size={14} />
                    {post.tags.map((tag) => (
                      <a key={tag} href={`/blog/tag/${encodeURIComponent(tag)}`} className="hover:text-blue-600">#{tag}</a>
                    ))}
                  </div>
                )}
              </div>
            </header>

            {post.coverImage && (
              <div className="mb-8 rounded-xl overflow-hidden shadow-sm">
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

            <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />

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
                    <a key={tag} href={`/blog/tag/${encodeURIComponent(tag)}`} className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors">#{tag}</a>
                  ))}
                </div>
              </div>
            )}

            <ShareButtons url={`${SITE_URL}/blog/${post.slug}`} title={post.title} />
            <PostNavigation prev={prev} next={next} />
          </article>

          <aside className="hidden xl:block w-64 flex-shrink-0">
            <div className="sticky top-8">
              <TableOfContents content={post.content} />
            </div>
          </aside>
        </div>

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
