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
        // 그루밍노트(groomingnote.co.kr) 팔레트: 딥 틸 + 코랄 포인트
        ink: "#203638",
        muted: "#617173",
        line: "#e0e8e7",
        wash: "#f3f7f7",
        sand: "#e8f0ee",
        coral: { DEFAULT: "#ae583e", light: "#e1a58d" },
        teal: {
          DEFAULT: "#176968", dark: "#173a3e",
          50: "#ecf4f3", 100: "#d6e8e5", 200: "#b0d1cc", 300: "#84b5ae", 400: "#4f938b",
          500: "#2a7b77", 600: "#176968", 700: "#145655", 800: "#173a3e", 900: "#122e31",
        },
        // 기존 blue/indigo/sky 클래스가 전부 그루밍노트 틸 계열로 보이도록 덮어씀
        blue: {
          50: "#ecf4f3", 100: "#d6e8e5", 200: "#b0d1cc", 300: "#84b5ae", 400: "#4f938b",
          500: "#2a7b77", 600: "#176968", 700: "#145655", 800: "#173a3e", 900: "#122e31",
        },
        indigo: {
          50: "#f3f7f7", 100: "#e8f0ee", 200: "#cfddda", 300: "#a9c8c3", 400: "#6fa39b",
          500: "#2a7b77", 600: "#176968", 700: "#145655", 800: "#173a3e", 900: "#122e31",
        },
        sky: {
          50: "#ecf4f3", 100: "#d6e8e5", 200: "#b0d1cc", 300: "#84b5ae", 400: "#4f938b",
          500: "#2a7b77", 600: "#176968", 700: "#145655", 800: "#173a3e", 900: "#122e31",
        },
        // 노란 강조(amber)는 그루밍노트 코랄 톤으로
        amber: {
          50: "#fbf4f0", 100: "#f6e6de", 200: "#ecccbd", 300: "#e1a58d", 400: "#c87a5e",
          500: "#ae583e", 600: "#974a33", 700: "#7f3d2a", 800: "#6a3323", 900: "#552a1d",
        },
        // 회색도 그루밍노트처럼 살짝 청록빛이 도는 회색으로
        gray: {
          50: "#f3f7f7", 100: "#e8f0ee", 200: "#e0e8e7", 300: "#cad7d4", 400: "#8fa09d",
          500: "#617173", 600: "#4f6464", 700: "#3a5052", 800: "#2a4144", 900: "#203638",
        },
        primary: {
          DEFAULT: "#176968",
          50: "#ecf4f3",
          100: "#d6e8e5",
          500: "#2a7b77",
          600: "#176968",
          700: "#145655",
          800: "#173a3e",
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
