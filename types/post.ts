// types/post.ts

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML 형태로 저장
  category: string;
  tags: string[];
  coverImage: string;
  coverImageAlt: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  status: "draft" | "published";

  // SEO 메타데이터
  metaTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
  ogImage?: string;

  // GEO/AEO
  faqItems?: FAQItem[];
  summary?: string; // AI가 인용할 핵심 요약
  keyPoints?: string[]; // 핵심 포인트 목록

  readingTime?: number; // 읽기 예상 시간 (분)
  views?: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Category {
  name: string;
  slug: string;
  count: number;
}

export interface Tag {
  name: string;
  slug: string;
  count: number;
}

export interface PostFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  coverImage: string;
  coverImageAlt: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogImage: string;
  status: "draft" | "published";
  faqItems: FAQItem[];
  summary: string;
  keyPoints: string[];
}
