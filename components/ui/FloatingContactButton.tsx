"use client";

export default function FloatingContactButton() {
  return (
    <a
      href="http://evaw-pet-grooming.co.kr/"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-teal-dark hover:bg-teal text-white text-sm font-bold px-5 py-3 rounded-full shadow-[0_10px_24px_#1e4b3b33] hover:shadow-xl transition-all hover:-translate-y-0.5"
      aria-label="상담 문의하기"
    >
      <span>💬</span>
      <span>상담 문의</span>
    </a>
  );
}
