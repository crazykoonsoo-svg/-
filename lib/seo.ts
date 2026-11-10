// lib/seo.ts
import { Post } from "@/types/post";
import { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.evaw-pet-grooming.com";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "애견미용 관련 모든정보";
const SITE_DESCRIPTION = "이바우펫 애견미용학원의 지역별 위치와 교육과정, 수강 비용·기간을 확인하세요. 3급·2급 애견미용자격증 준비부터 가정견 실습, 취업·창업과 국비지원·교육지원 조건까지 안내합니다.";
const SITE_KEYWORDS = ["애견미용학원", "애견미용", "이바우펫", "애견미용사", "애견미용자격증", "가정견실습", "애견미용창업", "애견미용교육", "애견미용취업", "반려동물행동교정", "강남애견미용학원", "서울애견미용학원", "종로애견미용학원", "신림애견미용학원", "천호애견미용학원", "인천애견미용학원", "부천애견미용학원", "일산애견미용학원", "분당애견미용학원", "수원애견미용학원", "평택애견미용학원", "대전애견미용학원", "천안애견미용학원", "광주애견미용학원", "창원애견미용학원", "부산애견미용학원", "대구애견미용학원", "국비지원", "펫미용", "반려견미용", "애견미용학원추천"];
// 메인 페이지 검색 제목 (검색어가 들어가도록)
const HOME_TITLE = "애견미용학원 비용·기간·자격증·취업 정보 | 애견미용 관련 모든정보";
const AUTHOR_NAME = process.env.NEXT_PUBLIC_AUTHOR_NAME || "이바우펫 애견미용학원";

export function getDefaultMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: { absolute: HOME_TITLE },
    description: SITE_DESCRIPTION,
    keywords: SITE_KEYWORDS,
    authors: [{ name: AUTHOR_NAME }],
    creator: AUTHOR_NAME,
    publisher: SITE_NAME,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      url: SITE_URL,
      siteName: SITE_NAME,
      title: HOME_TITLE,
      description: SITE_DESCRIPTION,
      images: [{ url: `${SITE_URL}/og-main.jpg`, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: HOME_TITLE,
      description: SITE_DESCRIPTION,
      images: [`${SITE_URL}/og-main.jpg`],
    },
    alternates: {
      canonical: SITE_URL,
      types: {
        "application/rss+xml": `${SITE_URL}/rss.xml`,
      },
    },
  };
}

export function getPostAuthor(post: Post): string {
  return post.author && post.author !== "관리자" ? post.author : AUTHOR_NAME;
}

const LANDSCAPE_COVERS = new Set([
  "pet-20260618-006",
  "pet-grooming-20260528-853",
  "gwangju-pet-grooming-school-guide",
]);

export function getPostImage(post: Post): string {
  if (LANDSCAPE_COVERS.has(post.slug)) return `${SITE_URL}/og/${post.slug}.jpg`;
  return post.ogImage || post.coverImage || `${SITE_URL}/hero-banner.png`;
}

export function getPostMetadata(post: Post): Metadata {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt;
  const image = getPostImage(post);
  const author = getPostAuthor(post);
  const canonical = post.canonicalUrl || url;

  return {
    title,
    description,
    keywords: post.tags,
    authors: [{ name: author }],
    openGraph: {
      type: "article",
      locale: "ko_KR",
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [{
        url: image,
        ...(LANDSCAPE_COVERS.has(post.slug) ? { width: 1200, height: 675 } : {}),
        alt: post.coverImageAlt || title,
      }],
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [author],
      section: post.category,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    alternates: { canonical },
    robots: { index: true, follow: true, "max-image-preview": "large" },
  };
}

export const SEARCH_CATEGORY = "비용";

export const CATEGORY_INFO: Record<string, { title: string; description: string }> = {
  "견종": { title: "견종별 미용과 털 관리", description: "견종에 따라 달라지는 털 빠짐, 빗질, 목욕과 미용 방법을 살펴보세요." },
  "교육": { title: "애견미용 교육과정과 실습 준비", description: "기초 도구, 실견수업과 강사 피드백 등 수업에서 확인할 항목을 정리했습니다." },
  "애견미용학원": { title: "지역별 애견미용학원과 상담 기준", description: "가까운 교육기관을 찾을 때 실견 실습, 출석 일정과 상담에서 확인할 기준을 살펴보세요." },
  "자격증": { title: "애견미용 자격증 준비와 실기 연습", description: "민간자격의 종류, 3급·2급 준비와 필기·실기 확인 방법을 안내합니다." },
  "취업·창업": { title: "애견미용사 취업과 미용실 창업 준비", description: "구직, 포트폴리오, 첫 근무와 미용실 운영을 준비할 때 확인할 내용을 살펴보세요." },
  "비용": { title: "애견미용학원 비용과 별도 지출 확인 기준", description: "애견미용학원 수강료와 도구비, 재료비, 시험 응시료를 나눠 확인하고 과정별 총비용을 비교하는 기준을 정리했습니다." },
  "이바우펫": { title: "이바우펫 애견미용학원 과정과 지점 안내", description: "이바우펫의 수업과 지점별 통학, 방문상담 전 확인할 내용을 살펴보세요." },
  "국비지원": { title: "애견미용학원 국비지원과 자부담 확인", description: "고용24 과정의 국비지원 조건과 자부담을 확인하고, 학원 교육지원과 구분해 살펴보세요." },
};

export function getCategoryMetadata(category: string, count: number): Metadata {
  const { title, description } = CATEGORY_INFO[category] ?? {
    title: `애견미용 ${category} 정보`,
    description: `${category}에 관한 애견미용 정보를 살펴보세요.`,
  };
  const index = category === SEARCH_CATEGORY && count > 0;

  return {
    title,
    description,
    openGraph: {
      type: "website",
      locale: "ko_KR",
      siteName: SITE_NAME,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: { canonical: `${SITE_URL}/blog/category/${encodeURIComponent(category)}` },
    robots: { index, follow: true, googleBot: { index, follow: true } },
  };
}

export function getTagMetadata(tag: string, count: number): Metadata {
  const title = `#${tag} 태그 글 ${count}개`;
  const description = `${tag} 관련 애견미용 정보 ${count}개를 한곳에서 확인하세요. 자격증, 국비지원, 비용, 학원 추천까지 2026년 최신 정보 제공.`;

  return {
    title,
    description,
    openGraph: {
      type: "website",
      locale: "ko_KR",
      siteName: SITE_NAME,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: { canonical: `${SITE_URL}/blog/tag/${encodeURIComponent(tag)}` },
    // 태그 페이지는 보통 글 1~2개만 모아 보여주는 "옅은(thin)" 목록 페이지라
    // 실제 글 본문과 내용이 거의 겹칩니다. 검색엔진에 둘 다 색인시키면
    // 같은 키워드를 두 페이지가 나눠 가지면서 서로 경쟁(키워드 카니발라이제이션)해서,
    // 정작 알맹이가 있는 글 대신 이 목록 페이지가 검색결과에 노출되는 문제가
    // 생겼습니다. index: false로 태그 페이지 자체는 검색결과에서 빼고,
    // follow: true로 내부 링크(글로 이어지는 경로)는 계속 따라가게 둡니다.
    robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
  };
}

export { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SITE_KEYWORDS, AUTHOR_NAME };
