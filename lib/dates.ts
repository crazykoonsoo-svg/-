const koreaDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit",
});

export function formatPostDate(value: string | null | undefined, long = false): string {
  if (!value) return "";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  const parts = koreaDate.formatToParts(date);
  const part = (name: string) => parts.find(p => p.type === name)?.value || "";
  const year = part("year"), month = part("month"), day = part("day");
  return long ? `${year}년 ${Number(month)}월 ${Number(day)}일` : `${year}.${month}.${day}`;
}

// datetime-local has no timezone; the editor explicitly uses Korea Standard Time.
export function toKoreaDateTimeInput(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  return new Date(date.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 23);
}
