import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "블로그 소개",
  description: "애견미용 자격증, 국비지원, 학원 비용, 추천 정보를 전문적으로 다루는 블로그입니다. 실제 수강생 관점에서 현실적인 정보를 제공합니다.",
  alternates: { canonical: "https://www.evaw-pet-grooming.com/about" },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">블로그 소개</h1>
      <p className="text-gray-500 mb-10">애견미용 관련 모든정보 운영 안내</p>

      <div className="space-y-10">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">이 블로그는 무엇인가요?</h2>
          <p className="text-gray-700 leading-relaxed">
            <strong>애견미용 관련 모든정보</strong>는 애견미용을 배우고 싶은 분, 자격증 취득을 준비하는 분,
            학원 선택을 고민하는 분들을 위한 전문 정보 블로그입니다.
            국비지원, 사단법인한국유기견구호연맹지원, 비용 비교, 지역별 학원 정보 등
            실제 수강생 관점에서 현실적인 정보를 제공합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">주요 다루는 정보</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: "🎓", title: "애견미용 자격증", desc: "3급·2급·1급 취득 과정과 현실적인 준비 방법" },
              { icon: "💰", title: "국비지원·교육비 절감", desc: "내일배움카드, 사단법인한국유기견구호연맹지원 활용 가이드" },
              { icon: "🏫", title: "지역별 학원 정보", desc: "전국 주요 지역 애견미용학원 비교 및 선택 기준" },
              { icon: "💼", title: "취업·창업 준비", desc: "자격증 취득 후 취업 연계, 펫샵 창업 현실 정보" },
            ].map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">운영 원칙</h2>
          <ul className="space-y-2">
            {[
              "과장 없이 현실적인 정보만 제공합니다.",
              "불확실한 정보는 '약', '보통', '일반적으로' 등 완화 표현을 사용합니다.",
              "실제 수강생이 궁금해하는 내용을 중심으로 작성합니다.",
              "정기적으로 최신 정보를 업데이트합니다.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-blue-500 mt-0.5">✓</span>{item}
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h2 className="text-lg font-bold text-gray-900 mb-2">상담 문의</h2>
          <p className="text-sm text-gray-600 mb-4">
            애견미용 학원 선택, 자격증 취득, 국비지원 등 궁금한 점이 있으시면 아래 버튼으로 문의해 주세요.
          </p>
          <a
            href="http://evaw-pet-grooming.co.kr/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-6 py-3 rounded-lg transition-colors"
          >
            💬 무료 상담 문의하기
          </a>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">사이트 정보</h2>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100">
              {[
                ["사이트명", "애견미용 관련 모든정보"],
                ["도메인", "www.evaw-pet-grooming.com"],
                ["운영", "PETgpt"],
                ["개설", "2026년 5월"],
                ["주제", "애견미용 자격증·국비지원·학원·비용·취업·창업"],
              ].map(([label, value]) => (
                <tr key={label}>
                  <td className="py-2.5 pr-4 text-gray-500 w-24">{label}</td>
                  <td className="py-2.5 text-gray-900">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
