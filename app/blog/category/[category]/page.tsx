export const dynamicParams = true;
export const revalidate = 60;

import { getAllPosts, getCategories } from "@/lib/posts";
import { CATEGORY_INFO, SEARCH_CATEGORY, getCategoryMetadata } from "@/lib/seo";
import PostCard from "@/components/blog/PostCard";
import type { Metadata } from "next";
import { getBreadcrumbSchema, serializeSchema } from "@/lib/schema";
import { SITE_URL } from "@/lib/seo";

export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.map((c) => ({ category: c.name }));
}

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const name = decodeURIComponent(params.category);
  const posts = (await getAllPosts()).filter((p) => p.category === name);
  return getCategoryMetadata(name, posts.length);
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const category = decodeURIComponent(params.category);
  const posts = (await getAllPosts()).filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );

  const info = CATEGORY_INFO[category];
  const isCostGuide = category === SEARCH_CATEGORY && posts.length > 0;

  const breadcrumb = getBreadcrumbSchema([
    { name: "홈", url: SITE_URL },
    { name: category, url: `${SITE_URL}/blog/category/${encodeURIComponent(category)}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(breadcrumb) }} />
      <header className="bg-wash border-b border-line">
        <div className="max-w-[1160px] mx-auto px-5 lg:px-6 py-12 lg:py-14">
          <p className="flex items-center gap-2 text-[13px] font-semibold tracking-[.7px] text-teal mb-3">
            <span className="block w-4 h-px bg-teal" />CATEGORY
          </p>
          <h1 className="text-[30px] lg:text-[38px] font-bold tracking-[-1.5px] leading-[1.35] text-ink">{info?.title ?? category}</h1>
          {info && <p className="text-muted mt-3 leading-relaxed">{info.description}</p>}
          <p className="text-muted mt-2 text-[15px]">총 {posts.length}개의 글</p>
        </div>
      </header>
      <div className="max-w-[1160px] mx-auto px-5 lg:px-6 py-12">
        {isCostGuide && (
          <section className="mb-9 max-w-3xl rounded-xl border border-line bg-white p-5 sm:p-7">
            <h2 className="mb-3 text-xl font-bold text-ink">상담 전에 총비용을 확인하는 순서</h2>
            <ol className="ml-5 list-decimal space-y-2 text-[15px] leading-relaxed text-muted">
              <li>같은 과정과 수강 기간을 기준으로 수강료 총액을 비교하세요.</li>
              <li>도구, 위그·소모품, 시험 응시료가 포함인지 별도인지 나눠 적으세요.</li>
              <li>지원 적용 조건과 중도 변경, 보강, 기간 연장의 비용을 각각 확인하세요.</li>
            </ol>
          </section>
        )}
        <h2 className="sr-only">카테고리 글 목록</h2>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post) => <PostCard key={post.slug} post={post} />)}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-16">{category === "견종" ? "견종별 관리와 미용 가이드를 준비하고 있습니다." : "이 카테고리에 글이 없습니다."}</p>
        )}
      </div>
    </>
  );
}
