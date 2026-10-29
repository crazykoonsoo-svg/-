"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import EducationPopup from "@/components/ui/EducationPopup";

const LOGO_URL = "/icon.png";

const NAV = [
  { href: "/", label: "홈" },
  { href: "/blog/category/자격증", label: "자격증" },
  { href: "/blog/category/애견미용학원", label: "애견미용학원" },
  { href: "/blog/category/취업·창업", label: "취업·창업" },
  { href: "/blog/category/비용", label: "비용" },
  { href: "/blog/category/국비지원", label: "국비지원" },
  { href: "/search", label: "검색" },
];

function ContactButtons() {
  const circle = "flex h-12 w-12 shrink-0 flex-col items-center justify-center gap-0.5 rounded-full text-[10px] font-bold leading-none shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal";
  return (
    <nav className="flex items-center gap-2" aria-label="빠른 상담">
      <a href="tel:010-3766-1620" aria-label="전화 상담 010-3766-1620" title="010-3766-1620" className={`${circle} bg-teal-dark text-white`}>
        <Phone size={17} aria-hidden="true" /><span>전화</span>
      </a>
      <a href="https://pf.kakao.com/_xaNjrn/chat" target="_blank" rel="noopener noreferrer" aria-label="카카오톡 상담 (새 창)" className={`${circle} bg-[#FEE500] text-[#191919]`}>
        <MessageCircle size={18} fill="currentColor" aria-hidden="true" /><span>카톡</span>
      </a>
      <a href="https://talk.naver.com/W5IPUB" target="_blank" rel="noopener noreferrer" aria-label="네이버 톡톡 상담 (새 창)" className={`${circle} bg-[#03C75A] text-[#00391B]`}>
        <span className="text-[19px] font-black" aria-hidden="true">N</span><span>네이버</span>
      </a>
    </nav>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = usePathname() === "/";

  return (
    <header className="sticky top-0 z-50 bg-[#fbfdf8]/[.86] border-b border-line/80 backdrop-blur-xl">
      <div className="max-w-[1160px] mx-auto px-5 lg:px-6">
        <div className="flex items-center gap-3 sm:gap-6 min-h-[64px] sm:min-h-[72px] lg:min-h-[84px]">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 hover:opacity-90 transition-opacity">
            <Image src={LOGO_URL} alt="애견미용 관련 모든정보" width={40} height={40}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] object-cover" />
            <span className="leading-tight">
              <span className="block text-[17px] sm:text-[19px] lg:text-[21px] font-bold tracking-[-1px] text-ink whitespace-nowrap">
                애견미용 관련 <span className="text-coral">모든정보</span>
              </span>
              <small className="block text-[9px] sm:text-[10px] tracking-[1.6px] sm:tracking-[2px] mt-1 font-medium text-muted">ALL ABOUT PET GROOMING</small>
            </span>
          </Link>

          {/* 데스크탑 네비게이션 */}
          <nav className="hidden lg:flex items-center gap-6 ml-4 text-[15px] font-medium text-ink" aria-label="주요 메뉴">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="py-2 hover:text-teal transition-colors whitespace-nowrap">
                {n.label}
              </Link>
            ))}
          </nav>

          {/* 우측 CTA */}
          <div className="ml-auto flex items-center gap-1.5 shrink-0">
            <div className="hidden sm:block">
              {isHome ? <ContactButtons /> : <EducationPopup variant="header" />}
            </div>
            <a href="https://evaw-pet-grooming.co.kr/" target="_blank" rel="noopener noreferrer"
              className="hidden sm:inline-block text-[13px] font-bold text-white bg-[linear-gradient(125deg,#3f9a6f,#24664a)] hover:brightness-110 px-4 py-2.5 rounded-full shadow-[0_8px_20px_rgba(47,125,92,.22)] transition whitespace-nowrap">
              상담문의
            </a>
            <button className="lg:hidden p-2 ml-1 text-ink"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isHome && (
          <div className="flex justify-end pb-3 sm:hidden">
            <ContactButtons />
          </div>
        )}

        {/* 모바일 메뉴 */}
        {menuOpen && (
          <div className="lg:hidden border-t border-line py-3">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="block text-[15px] font-medium text-ink py-2.5 border-b border-gray-100 last:border-0"
                onClick={() => setMenuOpen(false)}>
                {n.label}
              </Link>
            ))}
            {!isHome && (
              <div className="py-2.5" onClick={() => setMenuOpen(false)}>
                <EducationPopup variant="mobile" />
              </div>
            )}
            <Link href="/admin" className="block text-sm text-muted py-2" onClick={() => setMenuOpen(false)}>관리자</Link>
          </div>
        )}
      </div>
    </header>
  );
}
