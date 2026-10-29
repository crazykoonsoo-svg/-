// tailwind.config.ts

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Pretendard", "var(--font-noto)", "Noto Sans KR", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      colors: {
        // 파스텔 그린 팔레트 (evawpet-education 디자인 요소 참고): 딥 그린 + 코랄 포인트
        ink: "#1f3a30",
        muted: "#5d7268",
        line: "#dfece4",
        wash: "#f2faf5",
        sand: "#e4f3ea",
        coral: { DEFAULT: "#ae583e", light: "#e1a58d" },
        teal: {
          DEFAULT: "#2f7d5c", dark: "#1e4b3b",
          50: "#eef8f2", 100: "#dcf1e4", 200: "#bde4cc", 300: "#96d2ae", 400: "#64b689",
          500: "#3f9a6f", 600: "#2f7d5c", 700: "#27684d", 800: "#1e4b3b", 900: "#173b2f",
        },
        // 기존 blue/indigo/sky 클래스가 전부 그루밍노트 틸 계열로 보이도록 덮어씀
        blue: {
          50: "#eef8f2", 100: "#dcf1e4", 200: "#bde4cc", 300: "#96d2ae", 400: "#64b689",
          500: "#3f9a6f", 600: "#2f7d5c", 700: "#27684d", 800: "#1e4b3b", 900: "#173b2f",
        },
        indigo: {
          50: "#f2faf5", 100: "#e4f3ea", 200: "#cfe6d8", 300: "#a9d9bd", 400: "#6fb68f",
          500: "#3f9a6f", 600: "#2f7d5c", 700: "#27684d", 800: "#1e4b3b", 900: "#173b2f",
        },
        sky: {
          50: "#eef8f2", 100: "#dcf1e4", 200: "#bde4cc", 300: "#96d2ae", 400: "#64b689",
          500: "#3f9a6f", 600: "#2f7d5c", 700: "#27684d", 800: "#1e4b3b", 900: "#173b2f",
        },
        // 노란 강조(amber)는 그루밍노트 코랄 톤으로
        amber: {
          50: "#fbf4f0", 100: "#f6e6de", 200: "#ecccbd", 300: "#e1a58d", 400: "#c87a5e",
          500: "#ae583e", 600: "#974a33", 700: "#7f3d2a", 800: "#6a3323", 900: "#552a1d",
        },
        // 회색도 그루밍노트처럼 살짝 청록빛이 도는 회색으로
        gray: {
          50: "#f2faf5", 100: "#e4f3ea", 200: "#dfece4", 300: "#c8dccf", 400: "#8ea398",
          500: "#5d7268", 600: "#4b6357", 700: "#385046", 800: "#294236", 900: "#1f3a30",
        },
        primary: {
          DEFAULT: "#2f7d5c",
          50: "#eef8f2",
          100: "#dcf1e4",
          500: "#3f9a6f",
          600: "#2f7d5c",
          700: "#27684d",
          800: "#1e4b3b",
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "#374151",
            lineHeight: "1.9",
            "word-break": "keep-all",
          },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
