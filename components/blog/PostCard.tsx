// components/blog/PostCard.tsx

import Image from "next/image";
import Link from "next/link";
import { Post } from "@/types/post";

interface PostCardProps {
  post: Post;
  variant?: "default" | "featured" | "compact";
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  } catch {
    return "";
  }
}

function isNew(dateStr: string): boolean {
  const d = new Date(dateStr).getTime();
  return !isNaN(d) && Date.now() - d < 14 * 24 * 60 * 60 * 1000;
}

export default function PostCard({ post, variant = "default" }: PostCardProps) {
  const readingTime = post.readingTime ?? Math.ceil(
    (post.content || "").replace(/<[^>]+>/g, "").split(/\s+/).length / 300
  );
  const date = formatDate(post.publishedAt);
  const fresh = isNew(post.publishedAt);

  if (variant === "featured") {
    return (
      <article className="group bg-white rounded-[11px] border border-line overflow-hidden transition-all duration-200 hover:-translate-y-[3px] hover:border-[#96b9b3] hover:shadow-[0_10px_22px_#1b42430a]">
        <Link href={`/blog/${post.slug}`} className="grid md:grid-cols-[1.1fr_1fr]">
          {post.coverImage && (
            <div className="overflow-hidden bg-wash">
              <Image src={post.coverImage} alt={post.coverImageAlt || post.title} width={720} height={450}
                className="w-full h-60 md:h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" priority />
            </div>
          )}
          <div className="p-6 md:p-9 flex flex-col">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-teal">
              <span className="px-2 py-1 rounded bg-teal-50">{post.category}</span>
              {fresh && <span className="text-coral text-[10px] tracking-[1px]">NEW</span>}
            </div>
            <h3 className="mt-4 text-[22px] md:text-[26px] leading-[1.45] font-bold tracking-[-0.8px] text-ink group-hover:text-teal transition-colors">
              {post.title}
            </h3>
            <p className="mt-3 mb-6 text-[15px] text-muted leading-[1.7] line-clamp-3">{post.excerpt}</p>
            <div className="mt-auto pt-3.5 flex items-center justify-between text-xs text-muted border-t border-[#edf1f0]">
              <span>{date}{date && " · "}{readingTime}분 읽기</span>
              <span className="font-semibold text-teal">읽어보기 →</span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group flex gap-3 py-3 border-b border-gray-100 last:border-0">
        {post.coverImage && (
          <Link href={`/blog/${post.slug}`} className="flex-shrink-0">
            <Image src={post.coverImage} alt={post.coverImageAlt || post.title} width={72} height={72}
              className="w-16 h-16 object-cover rounded-lg" loading="lazy" />
          </Link>
        )}
        <div className="min-w-0 flex-1">
          <Link href={`/blog/${post.slug}`}>
            <h3 className="text-sm font-semibold text-ink group-hover:text-teal transition-colors line-clamp-2 leading-snug">{post.title}</h3>
          </Link>
          {date && <p className="text-xs text-muted mt-1">{date}</p>}
        </div>
      </article>
    );
  }

  return (
    <article className="group bg-white rounded-[11px] border border-line overflow-hidden flex flex-col break-keep transition-all duration-200 hover:-translate-y-[3px] hover:border-[#96b9b3] hover:shadow-[0_10px_22px_#1b42430a]">
      <Link href={`/blog/${post.slug}`} className="block overflow-hidden bg-wash" tabIndex={-1} aria-hidden="true">
        {post.coverImage ? (
          <Image src={post.coverImage} alt="" width={600} height={340}
            className="w-full aspect-[16/9] object-cover group-hover:scale-[1.03] transition-transform duration-300" loading="lazy" />
        ) : (
          <div className="w-full aspect-[16/9] bg-sand" />
        )}
      </Link>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-teal leading-normal">
          <Link href={`/blog/category/${encodeURIComponent(post.category)}`}
            className="px-2 py-1 rounded bg-teal-50 hover:bg-teal-100 transition-colors">
            {post.category}
          </Link>
          {fresh && <span className="text-coral text-[10px] tracking-[1px]">NEW</span>}
        </div>
        <Link href={`/blog/${post.slug}`}>
          <h3 className="mt-4 text-[18px] leading-[1.55] font-semibold tracking-[-0.5px] text-ink group-hover:text-teal transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        <p className="mt-2.5 mb-5 text-sm text-muted leading-[1.65] line-clamp-2">{post.excerpt}</p>
        <div className="mt-auto flex items-center justify-between gap-2.5 text-xs text-muted border-t border-[#edf1f0] pt-3.5">
          <span>{date}{date && " · "}{readingTime}분 읽기</span>
          <Link href={`/blog/${post.slug}`} className="font-semibold text-teal">읽어보기</Link>
        </div>
      </div>
    </article>
  );
}
