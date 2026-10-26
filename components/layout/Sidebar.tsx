// components/layout/Sidebar.tsx
import Link from "next/link";
import Image from "next/image";
import PostCard from "@/components/blog/PostCard";
import { Category, Tag, Post } from "@/types/post";
import EducationPopup from "@/components/ui/EducationPopup";

interface Props {
  categories: Category[];
  popularPosts: Post[];
  tags: Tag[];
}
export default function Sidebar({ categories, popularPosts, tags }: Props) {
  return (
    <aside className="w-full lg:w-72 flex-shrink-0 space-y-6">
      {/* 카테고리 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm">
          <span className="text-blue-500">■</span> 카테고리
        </h2>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/blog/category/${cat.slug}`}
                className="flex items-center justify-between text-sm text-gray-600 hover:text-blue-600 transition-colors group"
              >
                <span className="group-hover:translate-x-0.5 transition-transform">
                  {cat.name}
                </span>
                <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full group-hover:bg-blue-100 group-hover:text-blue-500 transition-colors">
                  {cat.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 교육과정 알아보기 팝업 버튼 */}
      <EducationPopup />

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
          width={288}
          height={200}
          className="w-full h-auto rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
        />
      </a>

      {/* 인기글 */}
      {popularPosts.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm">
            <span className="text-amber-500">🔥</span> 인기글
          </h2>
          <div>
            {popularPosts.map((post) => (
              <PostCard key={post.slug} post={post} variant="compact" />
            ))}
          </div>
        </div>
      )}

      {/* 태그 클라우드 */}
      {tags.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm">
            <span className="text-green-500">#</span> 태그
          </h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/blog/tag/${tag.slug}`}
                className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors"
              >
                #{tag.name}
                <span className="ml-1 text-gray-400">{tag.count}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
