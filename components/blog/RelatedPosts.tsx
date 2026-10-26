import Image from "next/image";
import Link from "next/link";
import { Post } from "@/types/post";

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  } catch {
    return "";
  }
}

export default function RelatedPosts({ posts }: { posts: Post[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {posts.map((post) => (
        <article key={post.slug} className="group bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <Link href={`/blog/${post.slug}`}>
            {post.coverImage ? (
              <Image src={post.coverImage} alt={post.coverImageAlt || post.title} width={400} height={220}
                className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
            ) : (
              <div className="w-full h-36 bg-gradient-to-br from-gray-100 to-gray-200" />
            )}
          </Link>
          <div className="p-4">
            <span className="text-xs text-blue-600 font-medium">{post.category}</span>
            <Link href={`/blog/${post.slug}`}>
              <h3 className="text-sm font-semibold text-gray-900 mt-1 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                {post.title}
              </h3>
            </Link>
            <p className="text-xs text-gray-400">{formatDate(post.publishedAt)}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
