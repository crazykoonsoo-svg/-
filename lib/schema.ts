// lib/schema.ts
import { Post } from "@/types/post";
import { SITE_URL, SITE_NAME, AUTHOR_NAME, getPostAuthor, getPostImage } from "./seo";

export function getArticleSchema(post: Post) {
  const authorName = getPostAuthor(post);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    image: [getPostImage(post)],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: authorName === "이바우펫 애견미용학원" || authorName === AUTHOR_NAME
      ? { "@type": "Organization", name: authorName, url: "https://evaw-pet-grooming.co.kr/" }
      : { "@type": "Person", name: authorName },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
    url: `${SITE_URL}/blog/${post.slug}`,
    keywords: post.tags.join(", "),
    articleSection: post.category,
    wordCount: post.content.replace(/<[^>]+>/g, "").split(/\s+/).length,
    inLanguage: "ko",
  };
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: "ko",
  };
}

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "이바우펫 애견미용학원",
    url: "https://evaw-pet-grooming.co.kr/",
    logo: `${SITE_URL}/icon.png`,
    sameAs: [
      "https://www.evawpet.com",
      "https://www.evaw-pet-grooming.com",
      "https://evaw-pet-grooming.co.kr/",
    ],
  };
}

export function getHowToSchema(title: string, steps: { name: string; text: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: title,
    step: steps.map((step, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

export function serializeSchema(schema: object): string {
  return JSON.stringify(schema);
}
