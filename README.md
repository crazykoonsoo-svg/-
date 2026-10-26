# 📝 SEO 블로그 CMS

**Next.js 14 (App Router) + Tiptap + Tailwind CSS**로 제작된
한글 원고 기반 SEO 최적화 블로그 CMS입니다.

---

## 🗂️ 전체 폴더 구조

```
my-seo-blog/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # 루트 레이아웃 (JSON-LD, 폰트)
│   ├── page.tsx                  # 블로그 메인 페이지
│   ├── globals.css               # 글로벌 스타일 (blog-content 등)
│   ├── sitemap.ts                # 자동 사이트맵 생성
│   ├── robots.ts                 # robots.txt 생성
│   ├── blog/
│   │   ├── [slug]/page.tsx       # 글 상세 페이지
│   │   ├── category/[category]/  # 카테고리별 목록
│   │   └── tag/[tag]/            # 태그별 목록
│   ├── admin/
│   │   ├── page.tsx              # 관리자 대시보드
│   │   └── posts/new/page.tsx    # 새 글 작성 (에디터)
│   ├── api/
│   │   ├── posts/route.ts        # 포스트 CRUD API
│   │   ├── posts/[id]/route.ts   # 개별 포스트 수정/삭제
│   │   └── upload/route.ts       # 이미지 업로드 API
│   ├── search/page.tsx           # 검색 페이지
│   └── rss.xml/route.ts          # RSS 피드 (네이버 SEO)
│
├── components/
│   ├── blog/
│   │   ├── PostCard.tsx          # 카드 UI (featured, default, compact)
│   │   ├── TableOfContents.tsx   # 자동 목차 생성
│   │   ├── RelatedPosts.tsx      # 관련 글
│   │   ├── PostNavigation.tsx    # 이전/다음 글
│   │   └── ShareButtons.tsx      # SNS 공유 버튼
│   ├── admin/
│   │   ├── Editor.tsx            # Tiptap 리치 텍스트 에디터
│   │   └── ImageUpload.tsx       # 이미지 업로드 (drag & drop)
│   ├── layout/
│   │   ├── Header.tsx            # 헤더 (반응형)
│   │   ├── Footer.tsx            # 푸터
│   │   └── Sidebar.tsx           # 사이드바 (카테고리/인기글/태그)
│   └── ui/
│       └── SearchBox.tsx         # 검색창
│
├── lib/
│   ├── posts.ts                  # 포스트 데이터 레이어 (JSON → Supabase 교체 가능)
│   ├── seo.ts                    # SEO 메타데이터 생성
│   └── schema.ts                 # JSON-LD 구조화 데이터
│
├── types/
│   └── post.ts                   # TypeScript 타입 정의
│
├── data/
│   └── posts.json                # 포스트 저장소 (파일 기반)
│
├── public/
│   └── uploads/                  # 업로드된 이미지 저장
│
├── docs/
│   └── supabase-schema.sql       # Supabase 연결 가이드
│
├── .env.local                    # 환경변수
├── next.config.js                # Next.js 설정
├── tailwind.config.ts            # Tailwind 설정
├── tsconfig.json                 # TypeScript 설정
└── package.json
```

---

## 🚀 설치 및 실행

### 1단계: 프로젝트 설정

```bash
# 프로젝트 디렉토리로 이동
cd my-seo-blog

# 의존성 설치
npm install

# 또는 yarn
yarn install
```

### 2단계: 환경변수 설정

`.env.local` 파일을 열고 실제 값으로 수정:

```bash
NEXT_PUBLIC_SITE_URL=https://yourdomain.com    # 실제 도메인
NEXT_PUBLIC_SITE_NAME=내 블로그               # 블로그 이름
NEXT_PUBLIC_SITE_DESCRIPTION=설명             # 블로그 설명
NEXT_PUBLIC_AUTHOR_NAME=홍길동               # 작성자 이름
```

### 3단계: 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

---

## 📋 주요 URL

| URL | 설명 |
|-----|------|
| `/` | 블로그 메인 (글 목록) |
| `/blog/[slug]` | 글 상세 페이지 |
| `/blog/category/[category]` | 카테고리별 글 목록 |
| `/blog/tag/[tag]` | 태그별 글 목록 |
| `/search?q=키워드` | 검색 페이지 |
| `/admin` | 관리자 대시보드 |
| `/admin/posts/new` | 새 글 작성 |
| `/sitemap.xml` | 사이트맵 |
| `/rss.xml` | RSS 피드 (네이버 SEO) |
| `/robots.txt` | 크롤러 설정 |

---

## ✍️ 글 작성 방법 (한글 원고 → HTML 렌더링)

1. `/admin/posts/new` 접속
2. 제목 입력 → 슬러그 자동 생성
3. 에디터에서 한글 원고 작성 또는 붙여넣기
4. 에디터 도구바로 H2/H3 제목, 목록, 인용구 등 포맷 지정
5. 카테고리, 태그, 대표 이미지 설정
6. SEO 설정 (메타 제목, 설명 자동 채우기)
7. GEO 설정 (핵심 요약, 키포인트)
8. AEO 설정 (FAQ 항목)
9. "발행하기" 버튼 클릭

---

## 🔍 SEO 구현 목록

### 구글 SEO
- [x] `<title>` 자동 생성 (`{글제목} | {사이트명}`)
- [x] `<meta description>` 자동 설정
- [x] Canonical URL
- [x] Open Graph 태그 (Facebook 공유 최적화)
- [x] Twitter Card
- [x] JSON-LD Article Schema
- [x] JSON-LD BreadcrumbList Schema
- [x] JSON-LD FAQ Schema (AEO)
- [x] JSON-LD WebSite Schema (SearchAction)
- [x] robots.txt 자동 생성
- [x] sitemap.xml 자동 생성
- [x] slug 기반 SEO URL 구조
- [x] 이미지 alt 속성
- [x] Lazy Loading 이미지
- [x] 시맨틱 HTML (article, header, nav, aside, section)
- [x] H1/H2/H3 계층 구조
- [x] 모바일 반응형

### 네이버 SEO
- [x] RSS 피드 (`/rss.xml`)
- [x] 카테고리 페이지
- [x] 태그 페이지
- [x] `word-break: keep-all` (한글 줄바꿈 최적화)
- [x] 목차 자동 생성 (체류시간 증가)
- [x] 관련 글 노출
- [x] 가독성 최적화 본문 폭

### GEO (AI 검색 최적화)
- [x] 핵심 요약 박스 (AI 인용 최적화)
- [x] 핵심 포인트 목록
- [x] 자연어 기반 문단 구조
- [x] 질문형 소제목 지원 (H2/H3)

### AEO (답변 엔진 최적화)
- [x] FAQ 구조 (`<details>/<summary>`)
- [x] FAQ Schema JSON-LD
- [x] Featured Snippet 대응 (blockquote, summary 박스)

---

## ☁️ Vercel 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel

# 또는 GitHub 연결 후 자동 배포
# 1. github.com 에 저장소 push
# 2. vercel.com 에서 Import Project
# 3. 환경변수 설정 (Settings > Environment Variables)
# 4. 자동 배포 완료
```

### Vercel 환경변수 설정 (필수)
```
NEXT_PUBLIC_SITE_URL = https://yourdomain.vercel.app
NEXT_PUBLIC_SITE_NAME = 내 블로그
NEXT_PUBLIC_SITE_DESCRIPTION = 블로그 설명
NEXT_PUBLIC_AUTHOR_NAME = 작성자명
```

### 주의: Vercel 파일시스템
Vercel은 읽기 전용 파일시스템이라 `data/posts.json` 방식이 작동하지 않습니다.
**반드시 Supabase로 교체하세요** (아래 가이드 참조).

---

## 🗄️ Supabase 연결 (Vercel 배포 시 필수)

### 1. Supabase 프로젝트 생성
1. [supabase.com](https://supabase.com) 가입 및 프로젝트 생성
2. SQL Editor에서 `docs/supabase-schema.sql` 실행
3. Storage > `blog-images` 버킷 생성 (Public)

### 2. 환경변수 추가
```bash
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. 의존성 설치
```bash
npm install @supabase/supabase-js
```

### 4. lib/posts.ts 교체
`docs/supabase-schema.sql` 하단의 주석 처리된 `lib/supabase-posts.ts` 코드를
`lib/posts.ts`에 복사하여 교체하세요.

---

## 🛠️ 자주 묻는 질문

### Q: 카테고리를 추가하려면?
`app/admin/posts/new/page.tsx`의 `CATEGORIES` 배열에 추가하세요.

### Q: 관리자 페이지에 비밀번호를 걸고 싶어요
Next.js Middleware를 사용하여 `/admin` 경로에 인증을 추가하세요.
또는 Supabase Auth를 연동하세요.

### Q: 이미지를 외부 서비스에 저장하고 싶어요
`app/api/upload/route.ts`를 수정하여 Cloudinary, S3, Supabase Storage 등과 연동하세요.

### Q: 댓글 기능은 어떻게 추가하나요?
[giscus.app](https://giscus.app) (GitHub Discussions 기반) 또는
utterances를 글 상세 페이지에 추가하세요.

---

## 📊 SEO 체크리스트

배포 후 다음을 확인하세요:

- [ ] Google Search Console 등록
- [ ] 사이트맵 제출 (`/sitemap.xml`)
- [ ] Naver Search Advisor 등록
- [ ] RSS 피드 네이버 블로그 연결
- [ ] Google Analytics 또는 Clarity 설치
- [ ] 페이지스피드 인사이트 점수 확인
- [ ] Open Graph 태그 테스트 (ogp.me)
- [ ] 모바일 친화성 테스트 (Google Mobile Test)

---

제작: SEO 블로그 CMS v1.0
기술: Next.js 14 · React 18 · TypeScript · Tailwind CSS · Tiptap
