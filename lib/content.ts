// lib/content.ts
// 글 본문 HTML을 화면에 내보내기 전에 다듬는 도우미

/**
 * 본문 이미지는 첫 장만 바로 불러오고, 나머지는 화면에 가까워질 때 불러옵니다(lazy).
 * 글 데이터는 그대로 두고 화면에 내보낼 때만 속성을 더합니다.
 */
export function lazyContentImages(html: string): string {
  if (!html) return html;
  let index = 0;
  return html.replace(/<img\b([^>]*?)\s*\/?>/gi, (_tag, rawAttrs: string) => {
    let attrs = rawAttrs;
    if (!/\sloading=/i.test(attrs)) attrs += index === 0 ? ' loading="eager"' : ' loading="lazy"';
    if (!/\sdecoding=/i.test(attrs)) attrs += ' decoding="async"';
    index++;
    return `<img${attrs} />`;
  });
}

/** 본문을 n번째 소제목(h2) 앞에서 둘로 나눕니다. 소제목이 부족하면 [전체, ""]를 돌려줍니다. */
export function splitBeforeHeading(html: string, n = 3): [string, string] {
  let idx = -1;
  let from = 0;
  for (let k = 0; k < n; k++) {
    idx = html.indexOf("<h2", from);
    if (idx < 0) return [html, ""];
    from = idx + 3;
  }
  return [html.slice(0, idx), html.slice(idx)];
}
