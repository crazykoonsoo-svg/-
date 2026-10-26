"use client";
// 메인 상단: 그루밍노트식 히어로 + 이바우펫 본사이트의 과목·커리큘럼·비용 영역
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./academy-top.css";

const SITE = "https://evaw-pet-grooming.co.kr";
const PHONE = "010-3766-1620";
const KAKAO = "http://pf.kakao.com/_xaNjrn/chat";
const NAVER = "http://talk.naver.com/W5IPUB";

// 그루밍노트식 주제 바로가기
const ENTRIES = [
  { no: "01", title: "미용·털 관리", desc: "셀프미용, 미용 주기와 종류", href: "/search?q=" + encodeURIComponent("미용"),
    icon: <><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="m8 8 12 12M8 16 20 4" /></> },
  { no: "02", title: "목욕·홈케어", desc: "우리 강아지의 관리 습관", href: "/search?q=" + encodeURIComponent("목욕"),
    icon: <><path d="M12 3s-7 8-7 12a7 7 0 0 0 14 0c0-4-7-12-7-12Z" /><path d="M9 16a3 3 0 0 0 3 3" /></> },
  { no: "03", title: "자격증·진로", desc: "자격증부터 취업·창업까지", href: "/blog/category/" + encodeURIComponent("자격증"),
    icon: <><rect x="4" y="3" width="16" height="14" rx="2" /><circle cx="12" cy="11" r="3" /><path d="m9 14-1 7 4-2 4 2-1-7M8 6h8" /></> },
  { no: "04", title: "애견미용학원", desc: "지역별 위치와 수업 안내", href: "/blog/category/" + encodeURIComponent("애견미용학원"),
    icon: <><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></> },
];

const COURSES = [
  { icon: "✂️", name: ["애견미용", "자격증"], tone: "blue" },
  { icon: "🍖", name: ["펫푸드", "레시피"], tone: "peach" },
  { icon: "🐾", name: ["반려동물", "행동교정사"], tone: "mint" },
  { icon: "🕊️", name: ["반려동물", "장례지도사"], tone: "lavender" },
  { icon: "🌿", name: ["아로마", "테라피"], tone: "sage" },
  { icon: "💼", name: ["취업연계", "창업컨설팅"], tone: "gold" },
];

const CURRICULUM = [
  { num: "1", name: "기초과정", sub: "입문 ~ 기본 그루밍", tag: "입문", tone: "blue" },
  { num: "2", name: "자격증 취득반", sub: "애견미용자격증 3급 · 2급", tag: "자격증", tone: "green" },
  { num: "3", name: "실견 심화반", sub: "가정견 실습 집중과정", tag: "실습", tone: "gold" },
  { num: "4", name: "취업·창업반", sub: "실무 완성 + 취업 연계", tag: "취업", tone: "red" },
  { num: "🔥", name: "종합·심화반", sub: "교육지원으로 합리적인 선택", tag: "추천", tone: "hit" },
  { num: "+", name: "스페셜 특강", sub: "행동교정 · 펫푸드 · 아로마", tag: "특강", tone: "purple" },
];

const ENROLL = [
  { title: "수강료·도구", icon: <><ellipse cx="12" cy="6" rx="8" ry="3" /><path d="M4 6v6c0 4 16 4 16 0V6M4 12v6c0 4 16 4 16 0v-6" /></>, body: <>동일 과정 기준 수강료와 도구 제공 조건은 전 지점 공통입니다. 선택 과정의 포함 항목과 별도 비용을 함께 확인하세요.</> },
  { title: "수업·상담 시간", icon: <><circle cx="12" cy="12" r="9" /><path d="M12 6v6l4 2" /></>, body: <>월~금 <strong>11:00~21:30</strong><br />토요일 <strong>11:00~15:00</strong></> },
  { title: "교육기간", icon: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 7h6m-6 5h6m-6 5h4" /></>, body: <>선택 과정과 출석 빈도, 개인 진도에 따라 달라집니다. 목표와 참여 가능한 일정을 기준으로 학습 계획을 안내드립니다.</> },
  { title: "출석 방식", icon: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4m10-4v4M3 10h18m-14 5h3m4 0h3" /></>, body: <>본인의 일정에 맞춰 수강하는 선택 수업제입니다. 희망 과정의 실습 일정과 출석 방식은 상담으로 확인하세요.</> },
  { title: "교육지원", icon: <><circle cx="12" cy="7" r="3" /><path d="M6 21v-4a6 6 0 0 1 12 0v4M4 6a3 3 0 0 0 0 6m16-6a3 3 0 0 1 0 6M2 20v-3m20 3v-3" /></>, body: <>사단법인 한국유기견구호연맹의 전문가 양성 목적 교육지원입니다. 적용 여부와 혜택은 심사 후 확정됩니다.</> },
];

function track(label: string) {
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", "click_cta", { button: label });
  }
}

export default function AcademyTop() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const go = (q: string) => { if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`); };
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [start, setStart] = useState(0);
  const [perView, setPerView] = useState(3);

  // 비용·일정 카드: 화면 폭에 따라 1·2·3장씩
  useEffect(() => {
    const calc = () => setPerView(window.innerWidth <= 600 ? 1 : window.innerWidth <= 900 ? 2 : 3);
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  const maxStart = Math.max(0, ENROLL.length - perView);
  const s = Math.min(start, maxStart);

  useEffect(() => {
    if (!phoneOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPhoneOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phoneOpen]);

  return (
    <div className="at">
      {/* ── HERO (그루밍노트 디자인) ── */}
      <section className="gn-hero" aria-labelledby="gn-hero-title">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="gn-hero-image" src="/hero-banner.png" width={2172} height={724} alt="밝은 공간에서 함께 있는 슈나우저, 골든리트리버, 포메라니안, 비숑" fetchPriority="high" />
        <div className="gn-hero-veil" />
        <div className="gn-wrap gn-hero-content">
          <p className="gn-eyebrow"><span />애견미용학원 모든 정보</p>
          <h1 id="gn-hero-title">전국 애견미용학원<br /><em>비용과 기간, 위치, 혜택까지</em> 찾아보세요.</h1>
          <p className="gn-hero-desc">국비지원/교육지원/애견미용자격증/취업/창업 까지!</p>
          <form className="gn-search" role="search" onSubmit={(e) => { e.preventDefault(); go(query); }}>
            <label className="sr-only" htmlFor="gn-search">애견미용학원 정보 검색</label>
            <svg className="gn-search-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="7.2" /><path d="m16 16 5 5" /></svg>
            <input id="gn-search" type="search" placeholder="국비지원, 기간, 비용" autoComplete="off" maxLength={100}
              value={query} onChange={(e) => setQuery(e.target.value)} />
            <button type="submit">검색</button>
          </form>
          <div className="gn-quick"><span>바로찾기</span>
            <button type="button" onClick={() => document.getElementById("recommended-posts")?.scrollIntoView({ behavior: "smooth", block: "start" })}>추천게시물</button>
          </div>

          {/* 추가: 상담 버튼 + 신뢰 지표 */}
          <div className="gn-contact">
            <button type="button" className="gn-cbtn gn-cbtn-phone" onClick={() => { track("전화상담_blog"); setPhoneOpen(true); }}>📞 전화상담</button>
            <a href={KAKAO} target="_blank" rel="noopener noreferrer" className="gn-cbtn gn-cbtn-kakao" onClick={() => track("카톡문의_blog")}>💬 카톡문의</a>
            <a href={NAVER} target="_blank" rel="noopener noreferrer" className="gn-cbtn gn-cbtn-naver" onClick={() => track("네이버문의_blog")}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="white" aria-hidden="true"><path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" /></svg>
              네이버문의
            </a>
          </div>
          <div className="gn-trust" role="list">
            <div role="listitem"><strong>전국 20개</strong><span>직영 캠퍼스 운영</span></div>
            <div role="listitem"><strong>5,600+명</strong><span>누적 수강생</span></div>
            <div role="listitem"><strong>100%</strong><span>가정견 실견수업</span></div>
          </div>
        </div>
        <span className="gn-hero-caption">ALL ABOUT PET GROOMING / 함께 배우는 반려견 관리</span>
      </section>

      <div className="gn-wrap">
        <section className="gn-entry-section" aria-label="관심 주제 바로 찾기">
          {ENTRIES.map((en) => (
            <a key={en.no} className="gn-entry" href={en.href}>
              <span className="gn-entry-number">{en.no}</span>
              <div><h2>{en.title}</h2><p>{en.desc}</p></div>
              <svg viewBox="0 0 24 24" aria-hidden="true">{en.icon}</svg>
            </a>
          ))}
        </section>
      </div>

      <div className="at-wrap">
        <div className="at-courses">
          {COURSES.map((c) => (
            <a key={c.icon} href={`${SITE}/curriculum/`} target="_blank" rel="noopener noreferrer" className={`at-course at-cc-${c.tone}`}>
              <span className="at-cc-icon">{c.icon}</span>
              <span className="at-cc-name">{c.name[0]}<br />{c.name[1]}</span>
            </a>
          ))}
        </div>
      </div>

      {/* ── 커리큘럼 ── */}
      <section className="at-curr" aria-labelledby="at-curr-h">
        <div className="at-wrap">
          <div className="at-sec-head">
            <div className="at-sec-tag">📚 커리큘럼</div>
            <h2 className="at-sec-title" id="at-curr-h">수강 과정 안내</h2>
            <div className="at-divider" />
            <p className="at-sec-desc">초보부터 프로까지, 목표에 맞는 과정 선택</p>
          </div>
          <div className="at-curr-grid">
            {CURRICULUM.map((c) => (
              <a key={c.name} href={`${SITE}/curriculum/`} target="_blank" rel="noopener noreferrer" className={`at-curr-card${c.tone === "hit" ? " hit" : ""}`}>
                <span className="at-curr-left">
                  <span className={`at-curr-num${c.tone === "hit" ? " hit" : ""}`}>{c.num}</span>
                  <span>
                    <span className="at-curr-name">{c.name}</span>
                    <span className="at-curr-sub">{c.sub}</span>
                  </span>
                </span>
                <span className={`at-tag at-tag-${c.tone}`}>{c.tag}</span>
              </a>
            ))}
          </div>
          <a href={`${SITE}/curriculum/`} target="_blank" rel="noopener noreferrer" className="at-btn at-btn-primary at-btn-wide" onClick={() => track("커리큘럼_blog")}>
            📚 커리큘럼 알아보기
          </a>
        </div>
      </section>

      {/* ── 비용과 일정 ── */}
      <section className="at-enroll" aria-labelledby="at-enroll-h">
        <div className="at-wrap">
          <div className="at-sec-head">
            <h2 className="at-sec-title" id="at-enroll-h">비용과 일정을 확인하세요</h2>
            <div className="at-divider" />
          </div>
          <div className="at-carousel" role="region" aria-label="수강 비용과 일정 카드">
            <button type="button" className="at-arrow" aria-label="이전 비용·일정 카드" disabled={s === 0} onClick={() => setStart(Math.max(0, s - 1))}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
            </button>
            <div className="at-enroll-grid" aria-live="polite" style={{ gridTemplateColumns: `repeat(${perView},minmax(0,1fr))` }}>
              {ENROLL.slice(s, s + perView).map((c) => (
                <article key={c.title} className="at-enroll-card">
                  <div className="at-enroll-icon" aria-hidden="true"><svg viewBox="0 0 24 24">{c.icon}</svg></div>
                  <h3>{c.title}</h3>
                  <p>{c.body}</p>
                </article>
              ))}
            </div>
            <button type="button" className="at-arrow" aria-label="다음 비용·일정 카드" disabled={s >= maxStart} onClick={() => setStart(Math.min(maxStart, s + 1))}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
            </button>
          </div>
          <p className="at-enroll-note">희망 과정과 출석 가능한 요일·시간을 알려주시면 교육기간과 비용을 함께 안내드립니다.</p>
          <a href={`${SITE}/#consult`} target="_blank" rel="noopener noreferrer" className="at-btn at-btn-primary at-btn-wide" onClick={() => track("비용일정_상담신청_blog")}>
            내 일정에 맞는 과정·비용 상담 신청
          </a>
          <div className="at-enroll-links">
            <a href={`${SITE}/guide/cost/`} target="_blank" rel="noopener noreferrer">비용 구성 자세히 보기</a>
            <a href={`${SITE}/guide/support/`} target="_blank" rel="noopener noreferrer">교육지원 자세히 보기</a>
          </div>
        </div>
      </section>

      {/* ── 전화상담 팝업 ── */}
      {phoneOpen && (
        <div className="at-phone-bg" onClick={() => setPhoneOpen(false)} role="dialog" aria-modal="true" aria-label="전화 상담">
          <div className="at-phone" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="at-phone-x" onClick={() => setPhoneOpen(false)} aria-label="닫기">✕</button>
            <div className="at-phone-tit">📞 전화 상담</div>
            <div className="at-phone-num">{PHONE}</div>
            <p className="at-phone-desc">월~금 11:00~21:30 · 토 11:00~15:00</p>
            <a href={`tel:${PHONE}`} className="at-btn at-btn-gold at-btn-wide" onClick={() => setPhoneOpen(false)}>바로 전화하기</a>
          </div>
        </div>
      )}
    </div>
  );
}
