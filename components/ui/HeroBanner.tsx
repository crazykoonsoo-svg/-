"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const slides = [
  { src: "/slide-1.png", alt: "이바우펫 애견미용학원 자격증취득 보장반" },
  { src: "/slide-2.png", alt: "이바우펫 애견미용학원 종합반" },
  { src: "/slide-3.png", alt: "이바우펫 애견미용학원 펫미용반" },
  { src: "/slide-4.png", alt: "이바우펫 애견미용학원 적성파악 클래스" },
];

const LINK = "http://evaw-pet-grooming.co.kr/";
const INTERVAL = 2000; // 2초마다 자동 슬라이드

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // 자동 슬라이드
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 슬라이드 이미지 */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, idx) => (
          <a
            key={idx}
            href={LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-full flex-shrink-0 cursor-pointer"
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              width={1920}
              height={600}
              className="w-full h-auto"
              priority={idx === 0}
            />
          </a>
        ))}
      </div>

      {/* 이전 버튼 */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors z-10"
        aria-label="이전 슬라이드"
      >
        ‹
      </button>

      {/* 다음 버튼 */}
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors z-10"
        aria-label="다음 슬라이드"
      >
        ›
      </button>

      {/* 하단 점 네비게이션 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              idx === current
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`${idx + 1}번 슬라이드`}
          />
        ))}
      </div>
    </div>
  );
}
