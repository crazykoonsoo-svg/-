// components/blog/ShareButtons.tsx
"use client";

interface Props {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: Props) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const share = (platform: string) => {
    const links: Record<string, string> = {
      kakao: `https://story.kakao.com/share?url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      naver: `https://share.naver.com/web/shareView?url=${encodedUrl}&title=${encodedTitle}`,
    };
    window.open(links[platform], "_blank", "width=600,height=400");
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    alert("링크가 복사되었습니다!");
  };

  return (
    <div className="mt-10 pt-6 border-t border-gray-100">
      <h3 className="text-sm font-semibold text-gray-500 mb-3">이 글 공유하기</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => share("kakao")}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-yellow-400 text-yellow-900 rounded-lg hover:bg-yellow-500 transition-colors"
        >
          카카오톡
        </button>
        <button
          onClick={() => share("naver")}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          네이버 블로그
        </button>
        <button
          onClick={() => share("facebook")}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Facebook
        </button>
        <button
          onClick={() => share("twitter")}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
        >
          X (Twitter)
        </button>
        <button
          onClick={copyLink}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
        >
          🔗 링크 복사
        </button>
      </div>
    </div>
  );
}
