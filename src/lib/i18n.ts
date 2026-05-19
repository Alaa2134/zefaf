// Lightweight i18n — Arabic default, English as alternative.
// Switches via URL query (?lang=en) or path prefix /en/...

export type Locale = "ar" | "en";

export interface Strings {
  hero: { titleA: string; titleB: string; pitch: string; ctaPrimary: string; ctaSecondary: string };
  nav: { templates: string; pricing: string; dashboard: string; start: string };
  features: { title: string; subtitle: string };
  pricing: { title: string; subtitle: string };
}

export const AR: Strings = {
  hero: {
    titleA: "دعوة فرحك",
    titleB: "بشكل يليق بفرحتك",
    pitch: "ارفع صورتك مع عروستك واختار من بين ٥٠٠ قالب راقي. شوف دعوتك بشكلها النهائي قبل ما تشتري.",
    ctaPrimary: "ابدأ صمم دعوتك",
    ctaSecondary: "شوف دعوة كاملة",
  },
  nav: { templates: "القوالب", pricing: "الأسعار", dashboard: "دعوتي", start: "ابدأ دلوقتي" },
  features: { title: "فرحتك تستاهل اللي يليق بيها", subtitle: "كل اللي محتاجه لدعوة فرح إلكترونية ساحرة" },
  pricing: { title: "باقات تليق بفرحك", subtitle: "سعر واحد، دفعة واحدة، دعوة مدى الحياة" },
};

export const EN: Strings = {
  hero: {
    titleA: "Your wedding invitation",
    titleB: "as beautiful as your day",
    pitch: "Upload your photos, pick from 500 luxurious templates, and preview the invitation before you pay.",
    ctaPrimary: "Design my invitation",
    ctaSecondary: "See a full demo",
  },
  nav: { templates: "Templates", pricing: "Pricing", dashboard: "My invitation", start: "Start now" },
  features: { title: "Your joy deserves the best", subtitle: "Everything you need for a stunning digital wedding invite" },
  pricing: { title: "Plans that fit your wedding", subtitle: "One price, one payment, lifetime access" },
};

export function getStrings(locale: Locale = "ar"): Strings {
  return locale === "en" ? EN : AR;
}
