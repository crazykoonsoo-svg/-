import { NextRequest, NextResponse } from "next/server";

// 관리자 로그인은 여기, 서버에서만 처리합니다.
// 비밀번호는 브라우저로 절대 내려가지 않고, 쿠키에는 비밀번호 자체가 아니라
// 별도의 세션 토큰(ADMIN_SESSION_TOKEN)만 저장합니다.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  const adminPassword = process.env.ADMIN_PASSWORD;
  const sessionToken = process.env.ADMIN_SESSION_TOKEN;

  if (!adminPassword || !sessionToken) {
    return NextResponse.json(
      { error: "서버에 ADMIN_PASSWORD / ADMIN_SESSION_TOKEN 환경변수가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  if (password !== adminPassword) {
    return NextResponse.json({ error: "비밀번호가 틀렸습니다." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_auth", sessionToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24시간
  });
  return res;
}
