// lib/content.ts
// 글 본문 HTML을 화면에 내보내기 전에 다듬는 도우미

/**
 * 본문 이미지는 첫 장만 바로 불러오고, 나머지는 화면에 가까워질 때 불러옵니다(lazy).
 * 글 데이터는 그대로 두고 화면에 내보낼 때만 속성을 더합니다.
 */
export function lazyContentImages(html: string): string {
  if (!html) return html;
  let index = 0;
  return html.replace(/<img\b([^>]*?)\s*\/?>/gi, (_tag, rawAttrs: string) => {
    let attrs = rawAttrs;
    if (!/\sloading=/i.test(attrs)) attrs += index === 0 ? ' loading="eager"' : ' loading="lazy"';
    if (!/\sdecoding=/i.test(attrs)) attrs += ' decoding="async"';
    index++;
    return `<img${attrs} />`;
  });
}

/** 본문을 n번째 소제목(h2) 앞에서 둘로 나눕니다. 소제목이 부족하면 [전체, ""]를 돌려줍니다. */
export function splitBeforeHeading(html: string, n = 3): [string, string] {
  let idx = -1;
  let from = 0;
  for (let k = 0; k < n; k++) {
    idx = html.indexOf("<h2", from);
    if (idx < 0) return [html, ""];
    from = idx + 3;
  }
  return [html.slice(0, idx), html.slice(idx)];
}

/** 본문은 글 제목 H1 아래에서 시작하므로 하위 단계가 건너뛰는 곳만 보정합니다. */
export function normalizeArticleHeadings(html: string): string {
  let previous = 1;
  return html.replace(/<h([2-6])(\b[^>]*)>([\s\S]*?)<\/h\1>/gi, (_tag, level, attrs, body) => {
    const current = Math.min(Number(level), previous + 1);
    previous = current;
    return `<h${current}${attrs}>${body}</h${current}>`;
  });
}

const academyHomeLink = /<a\b([^>]*\shref\s*=\s*(["'])https?:\/\/(?:www\.)?evaw-pet-grooming\.co\.kr\/?\2[^>]*)>(\s*(?:<img\b[^>]*>\s*)+)<\/a>/gi;

const seoulCommuteGuide = `
<p>서울에서 일을 마치고 수업에 가려면, 직장과 집에서 각각 출발해 보세요. 퇴근 직후의 환승 시간과 수업을 마친 뒤 귀가 시간을 확인하면 출석 가능한 캠퍼스를 좁힐 수 있습니다.</p>
<h2>평일 저녁과 토요일 출발지를 따로 정해 보세요</h2>
<p>평일에는 회사에서 나올 수 있는 가장 늦은 시간으로, 토요일에는 집에서 나오는 시간으로 경로를 계산하세요. 환승역에서 걷는 시간과 역 출구에서 교실까지 가는 시간도 더합니다.</p>
<p>강남·신림·종로·노원·천호 중 어느 곳이 편한지는 출발지에 따라 달라집니다. 역 이름을 정한 뒤 실제 수업 장소와 운영시간을 확인하세요.</p>
<h2>상담할 때는 가능한 수업 시간과 변경 조건을 같이 물어보세요</h2>
<ul>
<li>희망 요일의 시작 시간과 남은 수업 자리를 확인합니다.</li>
<li>야근으로 지각하거나 수업을 놓치면 연습 순서나 보강 일정이 어떻게 바뀌는지 묻습니다.</li>
<li>위그 연습과 실견수업의 예약 방법, 지도받는 시간, 준비물을 각 과정에 맞춰 확인합니다.</li>
</ul>
<h2>첫 달에 출석할 수 있는 날짜를 적어 가세요</h2>
<p>월간 일정에 출석 가능한 날짜를 표시하고, 실제 참석할 횟수로 비용과 진도를 비교하세요. 자격증 준비가 목적이라면 필기·실기 준비 순서와 실기 피드백이 언제 들어가는지, 수강료에 도구와 응시료가 포함되는지도 함께 물어보세요.</p>
<p><a href="https://evaw-pet-grooming.co.kr/branches/seoul/">이바우펫 서울 캠퍼스와 통학 안내 보기</a></p>
<p><a href="https://evaw-pet-grooming.co.kr/curriculum/">이바우펫 교육과정 확인하기</a></p>
`;

/** Keep published HTML and RSS aligned when correcting legacy copy. */
export function preparePublishedArticle(html: string, slug: string): string {
  if (slug === "pet-grooming-20260516-746" &&
      html.includes("교육 선택 전 확인할 실제 준비 항목") &&
      html.includes("실견수업과 애견미용자격증 과정의 차이")) {
    return seoulCommuteGuide;
  }

  if (slug === "petgrooming-20260615-007") {
    html = html.replace(/(전체 예상 부담은 약\s*)670만\s*~\s*710만 원/g, (_match, prefix: string) => `${prefix}570만~610만 원`);
  }

  const supportParagraphs = new Set<string>();
  html = html.replace(
    /<p\b[^>]*>(이바우펫이 안내하는 사단법인 한국유기견구호연맹의 전문가 양성 목적 교육지원은 국비지원과 별개이며,[^<]*)<\/p>/g,
    (paragraph, copy: string) => {
      const key = copy.replace(/\s+/g, " ").trim();
      if (supportParagraphs.has(key)) return "";
      supportParagraphs.add(key);
      return paragraph;
    }
  );

  return html.replace(academyHomeLink, (_anchor, attrs: string, _quote, images: string) => {
    const secureAttrs = attrs.replace(
      /(\shref\s*=\s*["'])http:\/\//i, "$1https://"
    );
    return `<a${secureAttrs}>${images}<span style="display:block;margin-top:.25rem">이바우펫 공식 홈페이지 보기</span></a>`;
  });
}
