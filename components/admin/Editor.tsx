"use client";

import { useEditor, EditorContent, NodeViewWrapper, ReactNodeViewRenderer, NodeViewProps } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import BaseImage from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { mergeAttributes } from "@tiptap/core";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Youtube from "@tiptap/extension-youtube";
import Highlight from "@tiptap/extension-highlight";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import CharacterCount from "@tiptap/extension-character-count";
import { createLowlight, common } from "lowlight";
import { useEffect, useCallback, useRef, useState } from "react";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, Quote, Minus, Link2, ImageIcon, Youtube as YoutubeIcon,
  Code2, Table as TableIcon, AlignLeft, AlignCenter, AlignRight,
  Undo2, Redo2, Highlighter, Palette, Rows3, Columns3, Trash2,
} from "lucide-react";

// Preserve the existing rounded CTA button design when pasting article HTML.
const ArticleLink = Link.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      ctaButton: {
        default: false,
        parseHTML: (element: HTMLElement) => element.classList.contains("cta-btn"),
        renderHTML: (attributes: Record<string, unknown>) => attributes.ctaButton ? {
          class: "cta-btn",
          style: "display:inline-flex;align-items:center;justify-content:center;gap:8px;max-width:100%;box-sizing:border-box;padding:15px 28px;border-radius:999px;background:#1e4b3b;color:#fff;text-decoration:none;font-weight:700;font-size:16px;line-height:1.4;box-shadow:0 6px 18px rgba(23,58,62,.18);",
        } : {},
      },
    };
  },
});

const lowlight = createLowlight(common);

interface Props {
  value: string;
  onChange: (html: string) => void;
}

// 링크 + 크기조절 + 정렬을 지원하는 커스텀 Image 확장
const LinkedImage = BaseImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      href: { default: null },
      width: {
        default: null,
        parseHTML: (element: HTMLElement) => element.style.width || null,
      },
      align: {
        default: "center",
        parseHTML: (element: HTMLElement) => element.getAttribute("data-align") || "center",
      },
    };
  },
  parseHTML() {
    // 예전엔 "img[src]"(전체 매칭)와 "a > img[src]"(링크로 감싸인 경우) 두 개 규칙을
    // 따로 뒀는데, 순서상 앞의 범용 규칙이 항상 먼저 매칭돼서 <a>로 감싸인 이미지여도
    // href를 못 읽어왔습니다. 그 결과 이미지에 링크를 걸어도 에디터가 내용을 다시
    // 동기화하는 순간(글 작성 중 계속 일어나는 정상적인 과정) href가 사라지는
    // 버그가 있었습니다. 규칙 하나로 합치고 getAttrs 안에서 부모가 <a>인지 직접
    // 확인하도록 고쳐서, 항상 이 규칙만 타면서 href를 놓치지 않도록 합니다.
    return [
      {
        tag: "img[src]",
        getAttrs: (node) => {
          const img = node as HTMLImageElement;
          const a = img.closest("a");
          return {
            src: img.getAttribute("src"),
            alt: img.getAttribute("alt"),
            href: a?.getAttribute("href") || null,
            width: img.style.width || null,
            align: img.getAttribute("data-align") || "center",
          };
        },
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    const { href, width, align, ...imgAttrs } = HTMLAttributes;
    const styleParts: string[] = [];
    if (width) styleParts.push(`width:${width}`);
    if (align === "left") styleParts.push("margin-left:0", "margin-right:auto");
    else if (align === "right") styleParts.push("margin-left:auto", "margin-right:0");
    else styleParts.push("margin-left:auto", "margin-right:auto");

    const finalImgAttrs = mergeAttributes(imgAttrs, {
      style: styleParts.join(";"),
      "data-align": align || "center",
    });

    if (href) {
      return [
        "a",
        { href, target: "_blank", rel: "noopener noreferrer", class: "inline-block" },
        ["img", finalImgAttrs],
      ];
    }
    return ["img", finalImgAttrs];
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
});

function ImageNodeView({ node, updateAttributes, selected }: NodeViewProps) {
  const { src, alt, width, align } = node.attrs as {
    src: string; alt: string | null; width: string | null; align: "left" | "center" | "right" | "full";
  };
  const wrapRef = useRef<HTMLSpanElement>(null);
  const resizing = useRef(false);

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    resizing.current = true;
    const startX = e.clientX;
    const startWidth = wrapRef.current?.offsetWidth ?? 300;
    const parentWidth = wrapRef.current?.parentElement?.offsetWidth ?? startWidth;

    const onMove = (ev: MouseEvent) => {
      if (!resizing.current) return;
      const delta = ev.clientX - startX;
      const newWidth = Math.max(80, startWidth + delta);
      const pct = Math.min(100, Math.max(10, Math.round((newWidth / parentWidth) * 100)));
      updateAttributes({ width: `${pct}%`, align: pct >= 98 ? "full" : align === "full" ? "center" : align });
    };
    const onUp = () => {
      resizing.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const justify = align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center";

  return (
    <NodeViewWrapper as="span" style={{ display: "flex", justifyContent: justify, width: "100%" }}>
      <span
        ref={wrapRef}
        style={{
          position: "relative",
          display: "inline-block",
          width: width || (align === "full" ? "100%" : "auto"),
          maxWidth: "100%",
        }}
        className={selected ? "ring-2 ring-blue-500 rounded-lg" : ""}
      >
        <img
          src={src}
          alt={alt || ""}
          draggable={false}
          style={{ width: "100%", display: "block", borderRadius: 8, margin: 0 }}
        />
        {selected && (
          <>
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-0.5 bg-white border border-gray-200 rounded-lg shadow-md p-1 z-10 whitespace-nowrap">
              <button type="button" title="왼쪽 정렬"
                onClick={() => updateAttributes({ align: "left" })}
                className={`p-1.5 rounded ${align === "left" ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-600"}`}>
                <AlignLeft size={13} />
              </button>
              <button type="button" title="가운데 정렬"
                onClick={() => updateAttributes({ align: "center" })}
                className={`p-1.5 rounded ${align === "center" ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-600"}`}>
                <AlignCenter size={13} />
              </button>
              <button type="button" title="오른쪽 정렬"
                onClick={() => updateAttributes({ align: "right" })}
                className={`p-1.5 rounded ${align === "right" ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-600"}`}>
                <AlignRight size={13} />
              </button>
              <button type="button" title="너비 100%"
                onClick={() => updateAttributes({ align: "full", width: "100%" })}
                className={`px-2 text-[11px] font-medium rounded ${align === "full" ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-600"}`}>
                꽉차게
              </button>
            </div>
            <div
              onMouseDown={startResize}
              title="드래그해서 크기 조절"
              className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-blue-600 rounded-sm border border-white cursor-se-resize"
            />
          </>
        )}
      </span>
    </NodeViewWrapper>
  );
}

const HIGHLIGHT_COLORS = [
  { label: "노랑", value: "#fef08a" },
  { label: "초록", value: "#bbf7d0" },
  { label: "분홍", value: "#fbcfe8" },
  { label: "파랑", value: "#bfdbfe" },
];

// 빈 줄에 유튜브 링크만 붙여넣으면 영상으로, 그 외 링크는 미리보기 카드로 자동 변환
const YOUTUBE_URL_RE = /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)[\w-]{6,}/i;
const BARE_URL_RE = /^https?:\/\/\S+$/i;

interface LinkPreviewData {
  title: string;
  description: string;
  image: string;
  siteName: string;
  url: string;
}

function buildLinkCardHtml(preview: LinkPreviewData): string {
  return `<div style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;margin:16px 0;display:flex;max-width:100%;background:#fff;text-decoration:none;" class="link-card">
  ${preview.image ? `<div style="width:160px;min-width:160px;overflow:hidden;"><img src="${preview.image}" alt="${preview.title}" style="width:100%;height:100%;object-fit:cover;" loading="lazy"/></div>` : ""}
  <div style="padding:16px;flex:1;min-width:0;">
    <p style="font-size:11px;color:#9ca3af;margin:0 0 6px;">${preview.siteName}</p>
    <a href="${preview.url}" target="_blank" rel="noopener noreferrer" style="font-size:15px;font-weight:600;color:#111827;text-decoration:none;display:block;margin-bottom:6px;">${preview.title}</a>
    ${preview.description ? `<p style="font-size:13px;color:#6b7280;margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${preview.description}</p>` : ""}
  </div>
</div>`;
}

export default function Editor({ value, onChange }: Props) {
  const dropRef = useRef<HTMLDivElement>(null);
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);

  // useEditor는 최초 렌더링 시 한 번만 editorProps를 만들기 때문에,
  // 그 안에서 항상 최신 상태의 insertLinkCardOrEmbed를 쓸 수 있도록 ref로 감싸둠
  const insertLinkCardOrEmbedRef = useRef<(url: string) => Promise<void>>(async () => {});

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: "plaintext",
        HTMLAttributes: { class: "hljs" },
      }),
      LinkedImage.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg my-4",
          loading: "lazy",
        },
      }),
      ArticleLink.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline",
          rel: "noopener noreferrer",
        },
      }),
      Youtube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: { class: "rounded-lg my-6 mx-auto" },
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Placeholder.configure({
        placeholder: "본문을 작성해 주세요...",
      }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Table.configure({ resizable: false, HTMLAttributes: { class: "border-collapse w-full my-4" } }),
      TableRow,
      TableHeader,
      TableCell,
      CharacterCount,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "blog-content focus:outline-none min-h-96",
      },
      // ProseMirror의 기본 붙여넣기(자동 링크화)보다 먼저 실행되는 훅.
      // 여기서 true를 반환하면 기본 붙여넣기 동작을 완전히 막을 수 있음.
      handlePaste: (view, event) => {
        const text = event.clipboardData?.getData("text/plain")?.trim() ?? "";
        if (!BARE_URL_RE.test(text)) return false;

        // 커서가 있는 줄이 비어있을 때만 카드/임베드로 변환
        const { $from } = view.state.selection;
        if ($from.parent.textContent.trim().length > 0) return false;

        event.preventDefault();
        insertLinkCardOrEmbedRef.current(text);
        return true;
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [editor, value]);

  // 이미지 업로드 함수
  const uploadImage = useCallback(async (file: File): Promise<string | null> => {
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return null;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("10MB 이하 이미지만 업로드 가능합니다.");
      return null;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("업로드 실패");
      const { url } = await res.json();
      return url;
    } catch {
      alert("이미지 업로드에 실패했습니다.");
      return null;
    }
  }, []);

  // 이미지 삽입 (링크 포함 가능)
  const insertImage = useCallback(async (file: File, href?: string) => {
    if (!editor) return;
    const url = await uploadImage(file);
    if (url) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (editor.chain().focus() as any).setImage({
        src: url,
        alt: file.name.replace(/\.[^.]+$/, ""),
        href: href || null,
      }).run();
    }
  }, [editor, uploadImage]);

  // 드래그앤드롭
  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      el.style.outline = "2px dashed #2563eb";
      el.style.outlineOffset = "-2px";
    };
    const handleDragLeave = () => {
      el.style.outline = "";
      el.style.outlineOffset = "";
    };
    const handleDrop = async (e: DragEvent) => {
      e.preventDefault();
      el.style.outline = "";
      el.style.outlineOffset = "";
      const files = Array.from(e.dataTransfer?.files ?? []).filter((f) => f.type.startsWith("image/"));
      for (const file of files) await insertImage(file);
    };
    el.addEventListener("dragover", handleDragOver);
    el.addEventListener("dragleave", handleDragLeave);
    el.addEventListener("drop", handleDrop);
    return () => {
      el.removeEventListener("dragover", handleDragOver);
      el.removeEventListener("dragleave", handleDragLeave);
      el.removeEventListener("drop", handleDrop);
    };
  }, [insertImage]);

  // 빈 줄에 링크만 붙여넣으면 자동으로 카드(또는 유튜브 영상)로 변환
  const insertLinkCardOrEmbed = useCallback(async (url: string) => {
    if (!editor) return;

    if (YOUTUBE_URL_RE.test(url)) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
      return;
    }

    // 불러오는 동안 자리표시자를 넣어두고, 결과가 오면 그 자리를 카드로 교체
    const insertPos = editor.state.selection.from;
    editor.chain().focus().insertContent("<p>🔗 링크 미리보기를 불러오는 중...</p>").run();
    const endPos = editor.state.selection.to;

    try {
      const res = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      editor.chain().focus()
        .deleteRange({ from: insertPos, to: endPos })
        .insertContentAt(insertPos, buildLinkCardHtml(data))
        .run();
    } catch {
      // 미리보기를 못 가져오면 일반 링크 텍스트로 대체
      editor.chain().focus()
        .deleteRange({ from: insertPos, to: endPos })
        .insertContentAt(insertPos, `<p><a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a></p>`)
        .run();
    }
  }, [editor]);

  // handlePaste(editorProps)에서 항상 최신 콜백을 참조하도록 유지
  useEffect(() => {
    insertLinkCardOrEmbedRef.current = insertLinkCardOrEmbed;
  }, [insertLinkCardOrEmbed]);

  // 클립보드 붙여넣기 — 이미지 (링크 자동 카드 변환은 editorProps.handlePaste에서 처리)
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = Array.from(e.clipboardData?.items ?? []);
      const imageItem = items.find((item) => item.type.startsWith("image/"));
      if (imageItem) {
        e.preventDefault();
        const file = imageItem.getAsFile();
        if (file) await insertImage(file);
      }
    };
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [insertImage]);

  // 파일 선택 버튼 — 링크 URL도 함께 입력 가능
  const handleImageButton = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = async () => {
      const files = Array.from(input.files ?? []);
      for (const file of files) {
        const href = window.prompt("이미지 클릭 시 이동할 링크 URL\n(없으면 취소 또는 빈칸으로 확인)") || undefined;
        await insertImage(file, href);
      }
    };
    input.click();
  }, [insertImage]);

  const setLink = useCallback(() => {
    const url = window.prompt("링크 URL을 입력하세요");
    if (!url || !editor) return;
    editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  const insertYoutube = useCallback(() => {
    const url = window.prompt("유튜브 영상 URL을 입력하세요");
    if (!url || !editor) return;
    editor.commands.setYoutubeVideo({ src: url });
  }, [editor]);

  const setFontColor = useCallback((color: string) => {
    editor?.chain().focus().setColor(color).run();
  }, [editor]);

  if (!editor) return null;

  const charCount = editor.storage.characterCount.characters();
  const readMinutes = Math.max(1, Math.round(charCount / 500));

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
      {/* 툴바 */}
      <div className="sticky top-16 z-30 border-b border-gray-100 bg-white/95 backdrop-blur px-3 py-2 flex flex-wrap items-center gap-0.5">
        {([1, 2, 3] as const).map((level) => (
          <ToolButton key={level} active={editor.isActive("heading", { level })}
            onClick={() => editor.chain().focus().toggleHeading({ level }).run()} title={`제목 ${level}`}>
            <span className="text-[11px] font-bold">H{level}</span>
          </ToolButton>
        ))}
        <Divider />
        <ToolButton active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="굵게">
          <Bold size={15} />
        </ToolButton>
        <ToolButton active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="기울임">
          <Italic size={15} />
        </ToolButton>
        <ToolButton active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} title="밑줄">
          <UnderlineIcon size={15} />
        </ToolButton>
        <ToolButton active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} title="취소선">
          <Strikethrough size={15} />
        </ToolButton>

        <div className="relative">
          <ToolButton active={editor.isActive("highlight")} onClick={() => setShowHighlightMenu((v) => !v)} title="형광펜">
            <Highlighter size={15} />
          </ToolButton>
          {showHighlightMenu && (
            <div className="absolute top-full left-0 mt-1 flex gap-1 bg-white border border-gray-200 rounded-lg shadow-md p-1.5 z-20">
              {HIGHLIGHT_COLORS.map((c) => (
                <button key={c.value} type="button" title={c.label}
                  onClick={() => { editor.chain().focus().toggleHighlight({ color: c.value }).run(); setShowHighlightMenu(false); }}
                  className="w-5 h-5 rounded-full border border-gray-300"
                  style={{ background: c.value }} />
              ))}
              <button type="button" title="지우기"
                onClick={() => { editor.chain().focus().unsetHighlight().run(); setShowHighlightMenu(false); }}
                className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-[10px] text-gray-400">
                ×
              </button>
            </div>
          )}
        </div>

        <label className="relative flex items-center justify-center w-7 h-7 rounded-md hover:bg-gray-100 cursor-pointer" title="글자 색">
          <Palette size={15} className="text-gray-600" />
          <input type="color" className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => setFontColor(e.target.value)} />
        </label>

        <Divider />
        <ToolButton active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="글머리 목록">
          <List size={15} />
        </ToolButton>
        <ToolButton active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="번호 목록">
          <ListOrdered size={15} />
        </ToolButton>
        <ToolButton active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="인용구">
          <Quote size={15} />
        </ToolButton>
        <ToolButton active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()} title="코드 블록">
          <Code2 size={15} />
        </ToolButton>
        <ToolButton active={false} onClick={() => editor.chain().focus().setHorizontalRule().run()} title="구분선">
          <Minus size={15} />
        </ToolButton>

        <Divider />
        <ToolButton active={editor.isActive("link")} onClick={setLink} title="링크">
          <Link2 size={15} />
        </ToolButton>
        <ToolButton active={false} onClick={handleImageButton} title="이미지">
          <ImageIcon size={15} />
        </ToolButton>
        <ToolButton active={false} onClick={insertYoutube} title="유튜브 영상 삽입">
          <YoutubeIcon size={15} />
        </ToolButton>

        <Divider />
        {(["left", "center", "right"] as const).map((align) => (
          <ToolButton key={align} active={editor.isActive({ textAlign: align })}
            onClick={() => editor.chain().focus().setTextAlign(align).run()} title={`${align} 정렬`}>
            {align === "left" ? <AlignLeft size={15} /> : align === "center" ? <AlignCenter size={15} /> : <AlignRight size={15} />}
          </ToolButton>
        ))}

        <Divider />
        <ToolButton active={editor.isActive("table")} onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="표 삽입">
          <TableIcon size={15} />
        </ToolButton>
        <ToolButton active={false} onClick={() => editor.chain().focus().addColumnAfter().run()} title="열 추가">
          <Columns3 size={15} />
        </ToolButton>
        <ToolButton active={false} onClick={() => editor.chain().focus().addRowAfter().run()} title="행 추가">
          <Rows3 size={15} />
        </ToolButton>
        <ToolButton active={false} onClick={() => editor.chain().focus().deleteTable().run()} title="표 삭제">
          <Trash2 size={15} />
        </ToolButton>

        <Divider />
        <ToolButton active={false} onClick={() => editor.chain().focus().undo().run()} title="실행취소">
          <Undo2 size={15} />
        </ToolButton>
        <ToolButton active={false} onClick={() => editor.chain().focus().redo().run()} title="다시실행">
          <Redo2 size={15} />
        </ToolButton>
      </div>

      {/* 에디터 본문 */}
      <div ref={dropRef} className="bg-white">
        <EditorContent editor={editor} className="px-8 py-6 max-w-[720px] mx-auto" />
      </div>

      {/* 하단 안내 + 통계 */}
      <div className="border-t border-gray-100 px-4 py-2 bg-gray-50 flex items-center justify-between text-xs text-gray-400">
        <span>이미지는 드래그앤드롭 · Ctrl+V 붙여넣기 · 크기조절 가능 · 빈 줄에 링크만 붙여넣으면 카드/영상으로 자동 변환돼요</span>
        <span>{charCount.toLocaleString()}자 · 약 {readMinutes}분 읽기</span>
      </div>
    </div>
  );
}

function ToolButton({ children, onClick, active, title }: {
  children: React.ReactNode; onClick: () => void; active: boolean; title: string;
}) {
  return (
    <button type="button" onClick={onClick} title={title}
      className={`flex items-center justify-center w-7 h-7 rounded-md transition-colors ${
        active ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
      }`}>
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-gray-200 mx-1.5 self-center" />;
}
