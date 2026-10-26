import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_KEYWORDS } from "@/lib/seo";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingContactButton from "@/components/ui/FloatingContactButton";
import { getWebsiteSchema, getOrganizationSchema, serializeSchema } from "@/lib/schema";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.evaw-pet-grooming.com"),
  title: {
    default: "애견미용 자격증·국비지원·학원 정보 | 애견미용 관련 모든정보",
    template: "%s | 애견미용 관련 모든정보",
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: "이바우펫 애견미용학원" }],
  creator: "이바우펫 애견미용학원",
  publisher: "애견미용 관련 모든정보",
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
    url: "https://www.evaw-pet-grooming.com",
    siteName: "애견미용 관련 모든정보",
    title: "애견미용 자격증·국비지원·학원 정보 | 애견미용 관련 모든정보",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/hero-banner.png",
        width: 1200,
        height: 600,
        alt: "애견미용 관련 모든정보 - 자격증·국비지원·학원 정보",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "애견미용 자격증·국비지원·학원 정보 | 애견미용 관련 모든정보",
    description: SITE_DESCRIPTION,
    images: ["/hero-banner.png"],
  },
  alternates: {
    canonical: "https://www.evaw-pet-grooming.com",
    types: { "application/rss+xml": "https://www.evaw-pet-grooming.com/rss.xml" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={notoSansKR.variable}>
      <head>
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeSchema(getWebsiteSchema()) }} />
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeSchema(getOrganizationSchema()) }} />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Do+Hyeon&display=swap" />
        <link rel="alternate" type="application/rss+xml" title="RSS Feed" href="/rss.xml" />
        <meta name="naver-site-verification" content="2747403c6e2b7697f5df7e70fbf3ada5e1f10ed9" />
        <meta name="google-site-verification" content="kFyDHbCYTSIaQYr7Nlrg9pf9xodn26bUoEznMPpN__o" />
      </head>
      <body className="font-sans bg-white text-ink antialiased">
        <Header />
        <main id="main-content" className="min-h-screen">{children}</main>
        <Footer />
        <FloatingContactButton />
        {/* 네이버 애널리틱스 */}
        <script type="text/javascript" src="//wcs.pstatic.net/wcslog.js" async />
        <script type="text/javascript" dangerouslySetInnerHTML={{ __html: `if(!wcs_add) var wcs_add = {}; wcs_add["wa"] = "5e3f2c594f78d8"; if(window.wcs) { wcs_do(); }` }} />
      </body>
    </html>
  );
}
