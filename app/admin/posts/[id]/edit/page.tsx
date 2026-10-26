"use client";
import { useState } from "react";

export default function LoginPage() {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // 이전에는 비밀번호를 브라우저 코드 안에서 직접 비교했습니다 — 즉 누구나
  // 개발자도구로 소스를 보면 비밀번호가 그대로 보이는 상태였습니다.
  // 이제는 서버(/api/admin/login)로 보내 서버에서만 비교합니다.
  const handleLogin = async () => {
    if (!pw.trim() || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        window.location.href = "/admin";
      } else {
        setError(true);
        setPw("");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "#f3f4f6"
    }}>
      <div style={{
        background: "#fff", padding: "40px 36px", borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.10)", width: "340px"
      }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>🔐</div>
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#111827", margin: 0 }}>관리자 로그인</h1>
          <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "6px" }}>비밀번호를 입력하세요</p>
        </div>

        <input
          type="password"
          value={pw}
          onChange={(e) => { setPw(e.target.value); setError(false); }}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          placeholder="비밀번호"
          autoFocus
          style={{
            display: "block", width: "100%", padding: "12px 14px",
            fontSize: "15px", border: error ? "1.5px solid #ef4444" : "1.5px solid #d1d5db",
            borderRadius: "8px", outline: "none", marginBottom: "10px",
            boxSizing: "border-box", color: "#111827"
          }}
        />

        {error && (
          <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "10px", textAlign: "center" }}>
            ❌ 비밀번호가 틀렸습니다.
          </p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            display: "block", width: "100%", padding: "13px",
            fontSize: "15px", fontWeight: 600, background: "#2563eb",
            color: "#fff", border: "none", borderRadius: "8px",
            cursor: loading ? "default" : "pointer", marginTop: "4px",
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? "확인 중..." : "로그인"}
        </button>
      </div>
    </div>
  );
}
