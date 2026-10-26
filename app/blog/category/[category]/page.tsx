export const dynamicParams = true;
export const revalidate = 60;

import { getAllPosts, getCategories } from "@/lib/posts";
import { getCategoryMetadata } from "@/lib/seo";
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
          <h1 className="text-[30px] lg:text-[38px] font-bold tracking-[-1.5px] leading-[1.35] text-ink">{category}</h1>
          <p className="text-muted mt-2 text-[15px]">총 {posts.length}개의 글</p>
        </div>
      </header>
      <div className="max-w-[1160px] mx-auto px-5 lg:px-6 py-12">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post) => <PostCard key={post.slug} post={post} />)}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-16">이 카테고리에 글이 없습니다.</p>
        )}
      </div>
    </>
  );
}
