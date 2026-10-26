import Link from "next/link";
import { Post } from "@/types/post";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  prev: Post | null;
  next: Post | null;
}

export default function PostNavigation({ prev, next }: Props) {
  if (!prev && !next) return null;

  return (
    <nav aria-label="이전글 다음글" className="mt-10 pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {prev ? (
        <Link href={`/blog/${prev.slug}`} className="group flex flex-col gap-1 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors">
          <span className="text-xs text-gray-400 flex items-center gap-1"><ChevronLeft size={12} /> 이전 글</span>
          <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700 line-clamp-2">{prev.title}</span>
        </Link>
      ) : <div />}
      {next ? (
        <Link href={`/blog/${next.slug}`} className="group flex flex-col gap-1 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors text-right">
          <span className="text-xs text-gray-400 flex items-center gap-1 justify-end">다음 글 <ChevronRight size={12} /></span>
          <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700 line-clamp-2">{next.title}</span>
        </Link>
      ) : <div />}
    </nav>
  );
}
