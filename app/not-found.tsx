import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없어요",
  robots: { index: false, follow: true },
};

const LINKS = [
  { href: "/blog/category/애견미용학원", label: "애견미용학원" },
  { href: "/blog/category/자격증", label: "자격증" },
  { href: "/blog/category/비용", label: "비용" },
  { href: "/blog/category/취업·창업", label: "취업·창업" },
];

export default function NotFound() {
  return (
    <section className="max-w-[640px] mx-auto px-5 py-24 text-center break-keep">
      <p className="text-[13px] font-bold tracking-[.12em] text-teal">404</p>
      <h1 className="mt-3 text-[28px] sm:text-[34px] font-extrabold tracking-[-0.04em] text-ink">찾으시는 페이지가 없어요</h1>
      <p className="mt-3 text-[15px] leading-[1.7] text-muted">주소가 바뀌었거나 삭제된 글일 수 있어요.<br />아래에서 원하는 정보를 다시 찾아보세요.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-2.5">
        <Link href="/" className="rounded-full bg-[linear-gradient(125deg,#3f9a6f,#24664a)] px-6 py-3 text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(47,125,92,.22)]">홈으로 가기</Link>
        <Link href="/search" className="rounded-full border border-[#cfe6d8] bg-white px-6 py-3 text-[15px] font-semibold text-ink hover:bg-wash">글 검색하기</Link>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="rounded-full border border-line bg-white px-4 py-1.5 text-[13px] text-muted hover:border-[#a9d9bd] hover:text-teal">#{l.label}</Link>
        ))}
      </div>
    </section>
  );
}
