type Publication = { status: string; published_at: string | null };

// A draft's creation time is never its public publication time.
export function publicationTime(
  current: Publication | null,
  nextStatus: string | undefined,
  correction: unknown,
  now: string,
): string | null {
  const status = nextStatus ?? current?.status ?? "draft";
  if (status !== "published") return current?.published_at ?? null;
  if (!current || current.status !== "published") return now;
  if (correction === undefined) return current.published_at || now;
  if (typeof correction !== "string" || !/T.*(?:Z|[+-]\d{2}:\d{2})$/.test(correction)) {
    throw new TypeError("발행 시각에는 시간대가 포함된 날짜를 입력해 주세요.");
  }
  const date = new Date(correction);
  if (!Number.isFinite(date.getTime()) || date.getTime() > new Date(now).getTime()) {
    throw new TypeError("실제 공개된 과거 또는 현재 발행 시각을 입력해 주세요.");
  }
  return date.toISOString();
}
