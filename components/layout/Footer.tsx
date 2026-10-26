import Link from "next/link";
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-teal-dark text-[#e6efeb] mt-20 pt-11 pb-5 text-[13px] leading-[1.7]">
      <div className="max-w-[1160px] mx-auto px-5 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-[1.25fr_1fr_.8fr] gap-10 md:gap-[60px]">
          <div>
            <Link href="/" className="block text-[22px] font-bold tracking-[-1px] leading-tight text-white">
              애견미용 관련 <span className="text-coral-light">모든정보</span>
              <small className="block text-[10px] tracking-[2px] mt-2 font-medium text-[#a6beba]">ALL ABOUT PET GROOMING</small>
            </Link>
            <p className="mt-[18px] text-[#a6beba] leading-[1.8]">
              애견미용 자격증·국비지원·비용·취업·창업 정보를 한곳에 모았습니다.<br />
              서울·분당·일산·대전·광주·인천·대구·노원·부천·천호·평택·강남·창원·부산·천안·서면 전국 애견미용학원 정보 이바우펫
            </p>
          </div>
          <nav className="grid grid-cols-2 gap-x-6 gap-y-2.5 content-start" aria-label="바로가기">
            <Link href="/" className="hover:text-[#c9ece3]">홈</Link>
            <Link href="/search" className="hover:text-[#c9ece3]">검색</Link>
            <Link href="/blog/category/자격증" className="hover:text-[#c9ece3]">자격증</Link>
            <Link href="/blog/category/애견미용학원" className="hover:text-[#c9ece3]">애견미용학원</Link>
            <Link href="/blog/category/취업·창업" className="hover:text-[#c9ece3]">취업·창업</Link>
            <Link href="/blog/category/국비지원" className="hover:text-[#c9ece3]">국비지원</Link>
            <Link href="/about" className="hover:text-[#c9ece3]">블로그 소개</Link>
            <Link href="/rss.xml" className="hover:text-[#c9ece3]">RSS 피드</Link>
          </nav>
          <div className="flex flex-wrap content-start gap-2.5">
            <span className="w-full text-[#a6beba]">교육·상담 문의</span>
            <a href="https://evaw-pet-grooming.co.kr/" target="_blank" rel="noopener noreferrer"
              className="border border-[#527371] rounded-[5px] px-[11px] py-[7px] whitespace-nowrap hover:text-[#c9ece3]">이바우펫 애견미용학원</a>
            <Link href="/sitemap.xml" className="border border-[#527371] rounded-[5px] px-[11px] py-[7px] whitespace-nowrap hover:text-[#c9ece3]">사이트맵</Link>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-x-5 gap-y-1.5 border-t border-[#456664] mt-[34px] pt-3.5 text-[11px] text-[#a6beba]">
          <p>© {year} 애견미용 관련 모든정보. All rights reserved.</p>
          <a href="https://www.evaw-pet-grooming.com" className="hover:text-[#c9ece3]">www.evaw-pet-grooming.com</a>
        </div>
      </div>
    </footer>
  );
}
