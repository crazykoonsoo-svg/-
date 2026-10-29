import Link from "next/link";
import { getAllPosts, getCategories, getPopularPosts, getTags } from "@/lib/posts";
import PostCard from "@/components/blog/PostCard";
import AcademyTop from "@/components/home/AcademyTop";
import PostPager from "@/components/home/PostPager";
import type { Metadata } from "next";
import { getDefaultMetadata } from "@/lib/seo";

export const metadata: Metadata = getDefaultMetadata();
export const revalidate = 60;

const WRAP = "max-w-[1160px] mx-auto px-5 lg:px-6";

export default async function HomePage() {
  const posts = await getAllPosts();
  const categories = await getCategories();
  const popularPosts = await getPopularPosts(5);
  const tags = (await getTags()).slice(0, 14);

  return (
    <div className="text-ink break-keep">
      {/* ── 상단: 첫 화면 → 글 목록 → 커리큘럼 → 비용과 일정 ── */}
      <AcademyTop>
        {/* ── 글 목록 ── */}
        <section id="recommended-posts" className={`${WRAP} py-[72px] scroll-mt-24`}>
          <div className="flex flex-wrap items-end justify-between gap-6 mb-7">
            <div>
              <p className="text-[11px] tracking-[1.65px] font-semibold text-teal mb-2.5">THE PET GROOMING LIBRARY</p>
              <h2 className="text-[23px] sm:text-[26px] lg:text-[29px] font-bold tracking-[-1px] leading-[1.4]">궁금한 주제부터, 가볍게 읽어보세요.</h2>
            </div>
            <p className="text-[13px] text-muted leading-[1.6] md:text-right">
              예비 애견미용사와 보호자를 위한<br className="hidden md:block" /> 주제별 정보 모음
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex gap-2 flex-wrap">
              <Link href="/" className="px-[17px] py-[7px] rounded-full text-sm bg-teal-dark border border-teal-dark text-white">전체</Link>
              {categories.map((cat) => (
                <Link key={cat.slug} href={`/blog/category/${cat.slug}`}
                  className="px-[17px] py-[7px] rounded-full text-sm bg-white border border-line text-muted hover:bg-wash hover:border-[#a9d9bd] transition-colors whitespace-nowrap">
                  {cat.name}
                </Link>
              ))}
            </div>
            <span className="text-xs text-muted whitespace-nowrap">총 {posts.length}개의 글</span>
          </div>

          {posts.length > 0 ? (
            <PostPager perPage={6}>
              {posts.map((post) => <PostCard key={post.slug} post={post} />)}
            </PostPager>
          ) : posts.length === 0 ? (
            <div className="text-center py-14 px-6 border border-dashed border-[#c8dccf] rounded-[10px]">
              <h3 className="text-[21px] font-bold">아직 등록된 글이 없습니다.</h3>
              <p className="text-muted mt-3">곧 새로운 정보로 찾아올게요.</p>
            </div>
          ) : null}
        </section>
      </AcademyTop>

      {/* ── 많이 읽은 글 · 태그 ── */}
      {(popularPosts.length > 0 || tags.length > 0) && (
        <section className="bg-wash py-[72px]">
          <div className={`${WRAP} grid lg:grid-cols-[1.4fr_1fr] gap-12`}>
            {popularPosts.length > 0 && (
              <div>
                <p className="text-[11px] tracking-[1.65px] font-semibold text-teal mb-2.5">MOST READ</p>
                <h2 className="text-[26px] font-bold tracking-[-1px] leading-[1.4] mb-6">많이 읽은 글</h2>
                <ol className="bg-white border border-line rounded-[11px] divide-y divide-[#edf1f0]">
                  {popularPosts.map((p, i) => (
                    <li key={p.slug}>
                      <Link href={`/blog/${p.slug}`} className="group flex items-center gap-4 px-5 py-4">
                        <span className="text-[13px] font-semibold text-coral w-5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                        <span className="flex-1 min-w-0 text-[15px] font-semibold leading-[1.5] group-hover:text-teal transition-colors line-clamp-1">{p.title}</span>
                        <span className="hidden sm:block text-xs text-muted shrink-0">{p.category}</span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {tags.length > 0 && (
              <div>
                <p className="text-[11px] tracking-[1.65px] font-semibold text-teal mb-2.5">KEYWORDS</p>
                <h2 className="text-[26px] font-bold tracking-[-1px] leading-[1.4] mb-6">자주 찾는 키워드</h2>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Link key={tag.slug} href={`/blog/tag/${tag.slug}`}
                      className="text-[13px] px-3.5 py-1.5 bg-white border border-line rounded-full text-ink hover:border-[#a9d9bd] hover:text-teal transition-colors">
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── 진로 CTA ── */}
      <section className={`${WRAP} py-[72px]`}>
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-8 items-center relative overflow-hidden rounded-[28px] border border-[#cfe6d8] p-8 md:p-12 bg-[radial-gradient(520px_320px_at_92%_10%,#c6e9d4_0%,transparent_70%),linear-gradient(125deg,#f4fbf6_0%,#dff3e7_100%)] shadow-[0_24px_60px_-28px_rgba(30,75,59,.35)]">
          <div>
            <p className="text-[11px] tracking-[1.65px] font-semibold text-teal mb-2.5">YOUR FIRST STEP</p>
            <h2 className="text-[26px] lg:text-[29px] font-bold tracking-[-1px] leading-[1.4]">애견미용사, 어디서부터 시작할까요?</h2>
            <p className="mt-3 text-[15px] text-muted leading-[1.7]">
              과정별 수업 구성과 비용, 가까운 지점까지 한 번에 확인해보세요.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2.5 md:justify-self-end">
            <a href="https://evaw-pet-grooming.co.kr/" target="_blank" rel="noopener noreferrer"
              className="w-full text-center py-3 px-6 text-sm font-semibold text-teal-dark bg-white border border-[#b9d8c6] rounded-lg hover:bg-wash transition-colors whitespace-nowrap">
              무료 상담 신청
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
