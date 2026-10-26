import { Post, Category, Tag } from "@/types/post";

// 목록/집계용 조회에서는 글 본문(content)처럼 무거운 컬럼을 빼고 가져옵니다.
// content를 매번 select("*")로 통째로 가져오면 홈페이지·사이트맵·카테고리 집계 등
// 여러 곳에서 반복 호출될 때마다 큰 트래픽(Egress)이 발생해 Supabase 무료 플랜의
// Egress 한도를 초과시키는 주된 원인이 되었습니다. 목록 카드에는 본문이 필요 없으므로
// 가벼운 컬럼만 선택합니다. (개별 글 상세는 getPostBySlug에서 계속 select("*")로 가져옵니다.)
const LIST_COLUMNS =
  "id, title, slug, excerpt, category, tags, cover_image, cover_image_alt, author, published_at, updated_at, status, reading_time, views";

// Supabase 클라이언트는 내부적으로 fetch()를 사용하는데, Next.js가 서버 코드의
// fetch() 호출을 자동으로 캐싱해버리는 경우가 있습니다. sitemap.ts에 dynamic =
// 'force-dynamic'을 걸어놔도 이 라이브러리 내부 fetch까지는 무시되지 않아서,
// 예전 응답(글이 비어있던 시점 등)이 캐시로 박제되어 계속 재사용되는 문제가 있었습니다.
// 처음엔 cache: "no-store"로 강제했는데, 이건 정적으로 미리 빌드되는 카테고리/태그
// 페이지들과 충돌해서 빌드 중 "Dynamic server usage" 에러를 일으켰습니다(no-store는
// "이 요청은 절대 캐시하지 마"라는 뜻이라 빌드 시점의 정적 생성과 아예 양립이 안 됨).
// 대신 홈페이지와 같은 60초 주기로 캐시를 새로고침하도록(next.revalidate) 바꿔서,
// 정적 빌드와 충돌 없이도 오래된 응답이 영원히 박제되는 일은 없게 합니다.
function freshFetch(input: any, init?: any) {
  return fetch(input, { ...init, next: { revalidate: 60 } });
}

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  const { createClient } = require("@supabase/supabase-js");
  return createClient(url, key, { global: { fetch: freshFetch } });
}

function toPost(row: any): Post {
  return {
    id: row.id, title: row.title, slug: row.slug,
    excerpt: row.excerpt ?? "", content: row.content ?? "",
    category: row.category ?? "일반", tags: row.tags ?? [],
    coverImage: row.cover_image ?? "", coverImageAlt: row.cover_image_alt ?? "",
    author: row.author ?? "관리자", publishedAt: row.published_at,
    updatedAt: row.updated_at, status: row.status,
    metaTitle: row.meta_title ?? "", metaDescription: row.meta_description ?? "",
    canonicalUrl: row.canonical_url ?? "", ogImage: row.og_image ?? "",
    faqItems: row.faq_items ?? [], summary: row.summary ?? "",
    keyPoints: row.key_points ?? [], readingTime: row.reading_time ?? 1,
    views: row.views ?? 0,
  };
}

export async function getAllPosts(): Promise<Post[]> {
  const supabase = getSupabase();
  if (!supabase) {
    console.error("[getAllPosts] SUPABASE_URL / SUPABASE_SERVICE_KEY 환경변수가 없어서 Supabase 클라이언트를 만들지 못했습니다.");
    return [];
  }
  const { data, error } = await supabase.from("posts").select(LIST_COLUMNS).eq("status", "published").order("published_at", { ascending: false });
  if (error) {
    // 여기서 에러를 그냥 삼키면 사이트맵/홈페이지가 조용히 빈 목록을 반환해서 원인 파악이 어려웠습니다.
    console.error("[getAllPosts] Supabase 조회 실패:", JSON.stringify(error));
  }
  return (data ?? []).map(toPost);
}

export async function getAllPostsAdmin(): Promise<Post[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data } = await supabase.from("posts").select("*").order("published_at", { ascending: false });
  return (data ?? []).map(toPost);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data } = await supabase.from("posts").select("*").eq("slug", slug).single();
  if (!data) return null;
  return toPost(data);
}

export async function getRelatedPosts(post: Post, limit = 3): Promise<Post[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data } = await supabase.from("posts").select(LIST_COLUMNS).eq("status", "published").eq("category", post.category).neq("slug", post.slug).limit(limit);
  return (data ?? []).map(toPost);
}

export async function getAdjacentPosts(slug: string): Promise<{ prev: Post | null; next: Post | null }> {
  const posts = await getAllPosts();
  const idx = posts.findIndex((p) => p.slug === slug);
  return {
    prev: idx < posts.length - 1 ? posts[idx + 1] : null,
    next: idx > 0 ? posts[idx - 1] : null,
  };
}

export async function getCategories(posts?: Post[]): Promise<Category[]> {
  // posts를 넘겨주면 재조회하지 않음 (홈페이지 등에서 중복 쿼리 방지)
  const list = posts ?? (await getAllPosts());
  const map: Record<string, number> = {};
  list.forEach((p) => { map[p.category] = (map[p.category] ?? 0) + 1; });
  return Object.entries(map).map(([name, count]) => ({ name, slug: encodeURIComponent(name), count }));
}

export async function getTags(posts?: Post[]): Promise<Tag[]> {
  // posts를 넘겨주면 재조회하지 않음 (홈페이지 등에서 중복 쿼리 방지)
  const list = posts ?? (await getAllPosts());
  const map: Record<string, number> = {};
  list.forEach((p) => p.tags.forEach((t) => { map[t] = (map[t] ?? 0) + 1; }));
  return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, slug: encodeURIComponent(name), count }));
}

export async function getPopularPosts(limit = 5): Promise<Post[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data } = await supabase.from("posts").select(LIST_COLUMNS).eq("status", "published").order("views", { ascending: false }).limit(limit);
  return (data ?? []).map(toPost);
}

export async function searchPosts(query: string): Promise<Post[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data } = await supabase.from("posts").select(LIST_COLUMNS).eq("status", "published").or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`);
  return (data ?? []).map(toPost);
}

export async function createPost(post: Post): Promise<Post> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase 미연결");
  const { data, error } = await supabase.from("posts").insert({
    title: post.title, slug: post.slug, excerpt: post.excerpt,
    content: post.content, category: post.category, tags: post.tags,
    cover_image: post.coverImage, cover_image_alt: post.coverImageAlt,
    author: post.author, published_at: post.publishedAt, status: post.status,
    meta_title: post.metaTitle, meta_description: post.metaDescription,
    canonical_url: post.canonicalUrl, og_image: post.ogImage,
    faq_items: post.faqItems, summary: post.summary,
    key_points: post.keyPoints, reading_time: post.readingTime, views: 0,
  }).select().single();
  if (error) throw error;
  return toPost(data);
}

export async function updatePost(id: string, data: Partial<Post>): Promise<Post | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data: updated, error } = await supabase.from("posts").update({
    title: data.title, slug: data.slug, excerpt: data.excerpt,
    content: data.content, category: data.category, tags: data.tags,
    cover_image: data.coverImage, status: data.status,
    meta_title: data.metaTitle, meta_description: data.metaDescription,
    updated_at: new Date().toISOString(),
  }).eq("id", id).select().single();
  if (error) return null;
  return toPost(updated);
}

export async function deletePost(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  const { error } = await supabase.from("posts").delete().eq("id", id);
  return !error;
}

export async function incrementViews(slug: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  await supabase.rpc("increment_views", { post_slug: slug });
}
