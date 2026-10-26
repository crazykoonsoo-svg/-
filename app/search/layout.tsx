import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "글 검색",
  robots: {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  },
  alternates: { canonical: `${SITE_URL}/search` },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
