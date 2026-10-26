import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 로그인 페이지는 통과
  if (pathname === "/admin/login") return NextResponse.next();

  // admin 페이지 접근 시 쿠키 확인
  // 이제는 서버 환경변수(ADMIN_SESSION_TOKEN)와 비교하며, 이 값은
  // 브라우저로 절대 내려가지 않고(httpOnly 쿠키) 소스코드에도 없습니다.
  if (pathname.startsWith("/admin")) {
    const auth = req.cookies.get("admin_auth");
    const expected = process.env.ADMIN_SESSION_TOKEN;
    if (!expected || auth?.value !== expected) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // 관리자용 API 보호: 글 작성·수정·삭제, 이미지 업로드, 링크 미리보기, 관리자 목록 조회는
  // 로그인 쿠키가 있어야만 허용합니다. (공개 글 조회·검색 GET은 그대로 누구나 가능)
  if (pathname.startsWith("/api/")) {
    const isPublicRead =
      req.method === "GET" &&
      pathname.startsWith("/api/posts") &&
      req.nextUrl.searchParams.get("admin") !== "true";
    const needsAuth =
      pathname === "/api/upload" ||
      pathname === "/api/link-preview" ||
      (pathname.startsWith("/api/posts") && !isPublicRead);
    if (needsAuth) {
      const auth = req.cookies.get("admin_auth");
      const expected = process.env.ADMIN_SESSION_TOKEN;
      if (!expected || auth?.value !== expected) {
        return NextResponse.json({ error: "관리자 로그인이 필요합니다." }, { status: 401 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
