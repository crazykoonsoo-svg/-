-- ─────────────────────────────────────────────
-- Supabase 연결 가이드 & SQL 스키마
-- ─────────────────────────────────────────────
-- 1. supabase.com 에서 프로젝트 생성
-- 2. SQL Editor에서 아래 쿼리 실행
-- 3. .env.local 에 환경변수 추가
-- 4. lib/posts.ts 를 아래 Supabase 버전으로 교체
-- ─────────────────────────────────────────────

-- posts 테이블 생성
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT DEFAULT '',
  content TEXT DEFAULT '',
  category TEXT DEFAULT '일반',
  tags TEXT[] DEFAULT '{}',
  cover_image TEXT DEFAULT '',
  cover_image_alt TEXT DEFAULT '',
  author TEXT DEFAULT '관리자',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),

  -- SEO 메타데이터
  meta_title TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  canonical_url TEXT DEFAULT '',
  og_image TEXT DEFAULT '',

  -- GEO/AEO
  faq_items JSONB DEFAULT '[]',
  summary TEXT DEFAULT '',
  key_points TEXT[] DEFAULT '{}',

  reading_time INTEGER DEFAULT 1,
  views INTEGER DEFAULT 0
);

-- 인덱스 (검색 성능)
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);

-- 업데이트 시 updated_at 자동 갱신
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS(Row Level Security) 설정
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 발행된 글은 누구나 읽기 가능
CREATE POLICY "public_read_published" ON posts
  FOR SELECT USING (status = 'published');

-- 서비스 키로는 모든 작업 가능
CREATE POLICY "service_all" ON posts
  USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────────
-- Supabase Storage 설정 (이미지 업로드)
-- ─────────────────────────────────────────────
-- 1. Storage > New bucket > 이름: blog-images
-- 2. Public 버킷으로 설정
-- 3. 아래 Policy 추가:

-- INSERT (업로드 허용 - service key 사용)
-- SELECT (공개 읽기)

-- ─────────────────────────────────────────────
-- lib/supabase-posts.ts (교체용 파일)
-- ─────────────────────────────────────────────

/*
import { createClient } from '@supabase/supabase-js'
import { Post } from '@/types/post'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

// 퍼블릭 클라이언트 (읽기 전용)
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function getAllPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
  
  if (error) throw error
  return (data ?? []).map(toCamelCase)
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error || !data) return null
  return toCamelCase(data)
}

export async function createPost(post: Omit<Post, 'id'>): Promise<Post> {
  const { data, error } = await supabase
    .from('posts')
    .insert(toSnakeCase(post))
    .select()
    .single()
  
  if (error) throw error
  return toCamelCase(data)
}

export async function updatePost(id: string, data: Partial<Post>): Promise<Post> {
  const { data: updated, error } = await supabase
    .from('posts')
    .update(toSnakeCase(data))
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return toCamelCase(updated)
}

export async function deletePost(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)
  
  return !error
}

export async function incrementViews(slug: string): Promise<void> {
  await supabase.rpc('increment_views', { post_slug: slug })
}

// snake_case ↔ camelCase 변환 헬퍼
function toCamelCase(row: any): Post {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category,
    tags: row.tags,
    coverImage: row.cover_image,
    coverImageAlt: row.cover_image_alt,
    author: row.author,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
    status: row.status,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    canonicalUrl: row.canonical_url,
    ogImage: row.og_image,
    faqItems: row.faq_items,
    summary: row.summary,
    keyPoints: row.key_points,
    readingTime: row.reading_time,
    views: row.views,
  }
}

function toSnakeCase(post: Partial<Post>): Record<string, any> {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    category: post.category,
    tags: post.tags,
    cover_image: post.coverImage,
    cover_image_alt: post.coverImageAlt,
    author: post.author,
    published_at: post.publishedAt,
    status: post.status,
    meta_title: post.metaTitle,
    meta_description: post.metaDescription,
    canonical_url: post.canonicalUrl,
    og_image: post.ogImage,
    faq_items: post.faqItems,
    summary: post.summary,
    key_points: post.keyPoints,
    reading_time: post.readingTime,
  }
}
*/
