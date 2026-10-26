// components/admin/ImageUpload.tsx
"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";

interface Props {
  value: string;
  altValue: string;
  onImageChange: (url: string) => void;
  onAltChange: (alt: string) => void;
  label?: string;
}

export default function ImageUpload({
  value,
  altValue,
  onImageChange,
  onAltChange,
  label = "대표 이미지",
}: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 이미지 업로드 처리
  const handleUpload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 업로드 가능합니다.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert("10MB 이하 이미지만 업로드 가능합니다.");
        return;
      }

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("업로드 실패");

        const { url } = await res.json();
        onImageChange(url);

        // 파일명을 기본 alt로 설정
        if (!altValue) {
          onAltChange(file.name.replace(/\.[^.]+$/, "").replace(/-_/g, " "));
        }
      } catch (err) {
        alert("이미지 업로드에 실패했습니다.");
        console.error(err);
      } finally {
        setUploading(false);
      }
    },
    [onImageChange, onAltChange, altValue]
  );

  // 드래그 앤 드롭
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleUpload(file);
    },
    [handleUpload]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>

      {/* 업로드 영역 */}
      {!value ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-blue-600">업로드 중...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="text-gray-400" size={32} />
              <p className="text-sm font-medium text-gray-600">
                이미지를 드래그하거나 클릭해서 업로드
              </p>
              <p className="text-xs text-gray-400">
                JPG, PNG, WebP, GIF · 최대 10MB
              </p>
            </div>
          )}
        </div>
      ) : (
        /* 미리보기 */
        <div className="relative rounded-xl overflow-hidden border border-gray-200">
          <div className="relative aspect-video bg-gray-100">
            <Image
              src={value}
              alt={altValue || "미리보기"}
              fill
              className="object-cover"
            />
          </div>
          <button
            type="button"
            onClick={() => onImageChange("")}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow"
            aria-label="이미지 삭제"
          >
            <X size={14} />
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-2 right-2 px-3 py-1.5 bg-white text-gray-700 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-50 shadow"
          >
            이미지 변경
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      {/* URL 직접 입력 */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">또는 이미지 URL 직접 입력</label>
        <input
          type="url"
          value={value}
          onChange={(e) => onImageChange(e.target.value)}
          placeholder="https://..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Alt 텍스트 */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">
          이미지 설명 (alt) <span className="text-blue-500">— SEO에 중요!</span>
        </label>
        <input
          type="text"
          value={altValue}
          onChange={(e) => onAltChange(e.target.value)}
          placeholder="이미지를 설명하는 텍스트를 입력하세요"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}
