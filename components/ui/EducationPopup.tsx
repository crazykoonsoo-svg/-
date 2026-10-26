"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  variant?: "sidebar" | "header" | "mobile";
}

export default function EducationPopup({ variant = "sidebar" }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const buttonStyle = {
    sidebar: "w-full py-3 bg-teal-dark hover:bg-teal text-white text-sm font-bold rounded-lg transition-colors",
    header: "text-[13px] font-semibold text-teal-dark bg-white border border-[#b8cbc7] px-3.5 py-[7px] rounded-md hover:bg-wash transition-colors whitespace-nowrap",
    mobile: "block text-sm font-medium text-gray-700 py-1",
  };

  const buttonLabel = {
    sidebar: "📚 교육과정 알아보기",
    header: "교육과정 알아보기",
    mobile: "교육과정 알아보기",
  };

  return (
    <>
      {/* 버튼 */}
      <button
        onClick={() => setIsOpen(true)}
        className={buttonStyle[variant]}
      >
        {buttonLabel[variant]}
      </button>

      {/* 팝업 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={() => setIsOpen(false)}
              className="sticky top-3 left-full mr-3 z-10 float-right bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md text-gray-600 hover:text-gray-900 font-bold text-lg"
            >
              ✕
            </button>

            {/* 이미지들 */}
            <div className="flex flex-col">
              <Image
                src="/edu-1.png"
                alt="애견미용 교육과정 1"
                width={500}
                height={900}
                className="w-full h-auto"
              />
              <Image
                src="/edu-2.png"
                alt="애견미용 교육과정 2"
                width={500}
                height={900}
                className="w-full h-auto"
              />
              <Image
                src="/edu-3.jpg"
                alt="애견미용 교육과정 3"
                width={500}
                height={900}
                className="w-full h-auto"
              />
              {/* 마지막 이미지 — 클릭 시 상담 링크 이동 */}
              <a
                href="http://evaw-pet-grooming.co.kr/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/edu-4.jpg"
                  alt="애견미용 상담문의"
                  width={500}
                  height={200}
                  className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
