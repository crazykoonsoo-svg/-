export const dynamicParams = true;
export const revalidate = 60;

import { getAllPosts, getTags } from "@/lib/posts";
import { getTagMetadata } from "@/lib/seo";
import PostCard from "@/components/blog/PostCard";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const tags = await getTags();
  return tags.map((t) => ({ tag: t.name }));
}

export async function generateMetadata({ params }: { params: { tag: string } }): Promise<Metadata> {
  const name = decodeURIComponent(params.tag);
  const posts = (await getAllPosts()).filter((p) => p.tags.some((tag) => tag.toLowerCase() === name.toLowerCase()));
  return getTagMetadata(name, posts.length);
}

export default async function TagPage({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag);
  const posts = (await getAllPosts()).filter(
    (p) => p.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );

  if (posts.length === 0) notFound();

  return (
    <>
    <header className="bg-wash border-b border-line">
      <div className="max-w-[1160px] mx-auto px-5 lg:px-6 py-12 lg:py-14">
        <p className="flex items-center gap-2 text-[13px] font-semibold tracking-[.7px] text-teal mb-3">
          <span className="block w-4 h-px bg-teal" />TAG
        </p>
        <h1 className="text-[30px] lg:text-[38px] font-bold tracking-[-1.5px] leading-[1.35] text-ink">#{tag}</h1>
        <p className="text-muted mt-2 text-[15px]">총 {posts.length}개의 글</p>
      </div>
    </header>
    <div className="max-w-[1160px] mx-auto px-5 lg:px-6 py-12">
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => <PostCard key={post.slug} post={post} />)}
        </div>
      ) : (
        <p className="text-center text-gray-400 py-16">이 태그에 글이 없습니다.</p>
      )}
    </div>
    </>
  );
}
