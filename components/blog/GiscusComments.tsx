"use client";

export default function GiscusComments() {
  return (
    <div className="mt-12">
      <a
        href="https://evaw-pet-grooming.co.kr/"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full rounded-2xl border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 p-8 text-center group"
      >
        <div className="text-3xl mb-3">🐾</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          애견미용학원 궁금하신가요?
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          자격증 · 비용 · 국비지원 · 취업 · 창업 한번에
        </p>
        <span className="inline-flex items-center gap-2 bg-blue-600 group-hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-full transition-colors text-sm">
          무료 상담 신청하기
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </span>
      </a>
    </div>
  );
}
