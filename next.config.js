// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 이미지 최적화 설정
  images: {
    formats: ["image/avif", "image/webp"],
    // 외부 이미지 도메인 허용 (필요 시 추가)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // 이미지 최적화 품질
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 압축
  compress: true,

  // PoweredByHeader 제거
  poweredByHeader: false,

  // trailing slash 정책
  trailingSlash: false,

  // Preserve the original Incheon article URL after its slug was renamed.
  async redirects() {
    return [{
      source: "/blog/%EC%9D%B8%EC%B2%9C%EC%95%A0%EA%B2%AC%EB%AF%B8%EC%9A%A9%ED%95%99%EC%9B%90-20260515-020",
      destination: "/blog/petgrooming-20260515-020",
      statusCode: 301,
    }];
  },

  // 보안 헤더
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      // 업로드 파일 캐싱
      {
        source: "/uploads/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Vercel 배포 시 빌드 최적화
  output: "standalone",
};

module.exports = nextConfig;
