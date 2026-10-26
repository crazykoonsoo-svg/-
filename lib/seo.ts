// lib/seo.ts
import { Post } from "@/types/post";
import { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.evaw-pet-grooming.com";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "애견미용 관련 모든정보";
const SITE_DESCRIPTION = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "애견미용학원 자격증·비용·국비지원·취업·창업·추천 정보를 한곳에서 확인하세요. 3급·2급 동시취득, 가정견 실습, 취업 연계까지 2026년 최신 정보. 서울·인천·부산·대구·광주·대전·수원·노원·강남 등 전국 지역 정보 제공.";
const AUTHOR_NAME = process.env.NEXT_PUBLIC_AUTHOR_NAME || "이바우펫 애견미용학원";

export function getDefaultMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: { absolute: SITE_NAME },
    description: SITE_DESCRIPTION,
    keywords: ["애견미용학원", "애견미용자격증", "애견미용사", "국비지원", "펫미용", "반려견미용", "애견미용학원추천"],
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
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      images: [{ url: `${SITE_URL}/hero-banner.png`, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      images: [`${SITE_URL}/hero-banner.png`],
    },
    alternates: {
      canonical: SITE_URL,
      types: {
        "application/rss+xml": `${SITE_URL}/rss.xml`,
      },
    },
  };
}

export function getPostMetadata(post: Post): Metadata {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt;
  const image = post.ogImage || post.coverImage || `${SITE_URL}/hero-banner.png`;
  const canonical = post.canonicalUrl || url;

  return {
    title,
    description,
    keywords: post.tags,
    authors: [{ name: AUTHOR_NAME }],
    openGraph: {
      type: "article",
      locale: "ko_KR",
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: post.coverImageAlt || title }],
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [AUTHOR_NAME],
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
    robots: { index: true, follow: true },
  };
}

// 카테고리별 맞춤 설명
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "국비지원": "애견미용학원 국비지원(내일배움카드·KAPP) 정보를 한곳에서 확인하세요. 지역별 국비지원 조건, 신청 방법, 비용 절감 방법까지 2026년 최신 정보 제공. 서울·분당·일산·대전·광주·인천·대구·노원·부천·천호·평택·강남·창원·부산·천안·서면 전국 애견미용학원 국비지원 안내.",
  "애견미용학원": "전국 애견미용학원 정보를 한곳에서 확인하세요. 실견수업·가정견 실습·자격증 취득까지 꼭 확인해야 할 선택 기준을 현실적으로 정리했습니다. 서울·분당·일산·대전·광주·인천·대구·노원·부천·천호·평택·강남·창원·부산·천안·서면 전국 애견미용학원 추천.",
  "취업·창업": "애견미용사 취업·창업 준비 정보를 한곳에서 확인하세요. 포트폴리오 제작, 취업 연계, 창업 컨설팅까지 2026년 최신 현실 가이드 제공. 서울·분당·일산·대전·광주·인천·대구·노원·부천·천호·평택·강남·창원·부산·천안·서면 전국 애견미용 취업·창업 정보.",
  "비용": "애견미용학원 비용·수강료 정보를 한곳에서 확인하세요. 국비지원·KAPP 교육비지원으로 비용을 낮추는 방법과 지역별 수강료 비교 정보를 제공합니다. 서울·분당·일산·대전·광주·인천·대구·노원·부천·천호·평택·강남·창원·부산·천안·서면 전국 애견미용학원 비용 안내.",
  "교육": "애견미용 교육과정·커리큘럼 정보를 한곳에서 확인하세요. 3급·2급 자격증 취득, 실견수업, 가정견 실습까지 단계별 교육 정보를 제공합니다. 서울·분당·일산·대전·광주·인천·대구·노원·부천·천호·평택·강남·창원·부산·천안·서면 전국 애견미용 교육 정보.",
};

export function getCategoryMetadata(category: string, count: number): Metadata {
  const title = `${category} 관련 글 ${count}개`;
  const description = CATEGORY_DESCRIPTIONS[category] ||
    `애견미용 ${category} 관련 정보 ${count}개를 한곳에서 확인하세요. 2026년 최신 정보를 현실적으로 정리했습니다.`;

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
    robots: { index: false, follow: true },
  };
}

export { SITE_URL, SITE_NAME, SITE_DESCRIPTION, AUTHOR_NAME };
