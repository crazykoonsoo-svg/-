import type { FAQItem } from "@/types/post";

// Omitted fields must stay omitted: ordinary admin edits do not send these.
// Use an empty string / empty array to explicitly clear a field.
export function getPostExtraFields(body: Record<string, unknown>) {
  const fields: { summary?: string; key_points?: string[]; faq_items?: FAQItem[] } = {};
  if (Object.prototype.hasOwnProperty.call(body, "summary")) {
    if (typeof body.summary !== "string") throw new TypeError("summary는 문자열이어야 합니다.");
    fields.summary = body.summary;
  }
  if (Object.prototype.hasOwnProperty.call(body, "keyPoints")) {
    if (!Array.isArray(body.keyPoints) || !body.keyPoints.every((point) => typeof point === "string")) {
      throw new TypeError("keyPoints는 문자열 배열이어야 합니다.");
    }
    fields.key_points = body.keyPoints;
  }
  if (Object.prototype.hasOwnProperty.call(body, "faqItems")) {
    if (!Array.isArray(body.faqItems) || !body.faqItems.every((item) =>
      item !== null && typeof item === "object" &&
      typeof item.question === "string" && typeof item.answer === "string"
    )) {
      throw new TypeError("faqItems는 question과 answer 문자열을 가진 배열이어야 합니다.");
    }
    fields.faq_items = body.faqItems.map(({ question, answer }) => ({ question, answer }));
  }
  return fields;
}
