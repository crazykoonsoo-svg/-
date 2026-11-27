const addedOn = "2026-11-27T01:44:34Z";

const articleLinks = new Map(Object.entries({
  "petgrooming-20260512-353": {
    target: "dog-grooming-academy-education-support-conditions",
    label: "연맹 교육지원 상담에서 확인할 조건",
    context: "지원 대상과 견적을 확인한 뒤에는 교육지원이 적용되는 과정과 별도 부담 항목을 함께 물어보세요.",
  },
  "petgrooming-20260515-167": {
    target: "dog-grooming-academy-extra-costs",
    label: "등록 후 발생할 수 있는 추가 비용",
    context: "학원별 견적을 비교할 때는 도구비·재료비·응시료가 포함되는지 같은 기준으로 적어 보세요.",
  },
  "kapp-20260611-490": {
    target: "dog-grooming-certification-grade-3-to-2-readiness",
    label: "3급에서 2급 준비로 넘어가기 전 점검 항목",
    context: "급수별 준비 내용을 비교했다면 현재 연습에서 혼자 마칠 수 있는 작업과 더 지도받아야 할 작업을 나눠 보세요.",
  },
  "petgrooming-20260609-682": {
    target: "dog-grooming-practical-exam-practice-time",
    label: "실기 준비 시간을 나누는 방법",
    context: "시험 일정과 통학 시간을 정한 뒤에는 반복 연습과 전체 과제 점검을 주간 계획에 배치해 보세요.",
  },
  "petgrooming-20260608-357": {
    target: "dog-grooming-academy-first-class-supplies",
    label: "첫 수업 전 도구 구입과 준비물 확인",
    context: "도구비를 계산할 때는 첫날 필요한 물품과 진도에 맞춰 준비할 물품을 따로 적어 보세요.",
  },
  "EVAWpet-20260713-555": {
    target: "dog-grooming-academy-first-live-dog-practice",
    label: "첫 실견수업에서 확인할 작업 범위",
    context: "실견수업 상담 전에는 초반에 관찰하는 작업과 직접 맡을 수 있는 작업을 구분해 질문을 준비하세요.",
  },
  "pet-grooming-20260516-954": {
    target: "dog-grooming-academy-consultation-records",
    label: "학원 방문 상담에서 받아둘 안내",
    context: "실습과 비용 조건을 비교한 뒤에는 상담에서 받은 견적과 출석·보강 안내를 한곳에 기록해 보세요.",
  },
  "pet-job-20260515-711": {
    target: "sillim-grooming-academy-shift-work-plan",
    label: "신림에서 교대근무와 수업 일정을 맞추는 방법",
    context: "교대근무 중이라면 근무표가 바뀌는 주의 수업 예약과 진도 확인 방법을 함께 살펴보세요.",
  },
  "pet-grooming-20260516-746": {
    target: "jongno-grooming-academy-review-between-classes",
    label: "종로에서 수업 사이 간격이 길 때 복습하는 법",
    context: "종로로 통학할 계획이라면 수업 가능한 요일과 함께 다음 수업까지 복습할 과제를 확인해 보세요.",
  },
  "pet-grooming-20260515-838": {
    target: "ilsan-grooming-academy-absence-return-lesson-gap",
    label: "일산에서 결석 뒤 수업 진도를 이어가는 방법",
    context: "직업 교육을 준비하며 출석 계획을 짤 때는 결석 후 어떤 과제부터 다시 확인하는지도 물어보세요.",
  },
}));

export function addArticleLink(html: string, slug: string): string {
  const link = articleLinks.get(slug);
  if (!link || !html) return html;

  const href = `/blog/${link.target}`;
  if (html.includes(`href="${href}"`) || html.includes(`href='${href}'`)) return html;

  return `${html}\n<p>${link.context} <a href="${href}">${link.label}</a></p>`;
}

export function articleLinkModifiedAt(slug: string, updatedAt: string): string {
  if (!articleLinks.has(slug) || Date.parse(updatedAt ?? "") >= Date.parse(addedOn)) return updatedAt;
  return addedOn;
}
