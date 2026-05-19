export const SITE = {
  name: "زفاف",
  nameEn: "Zefaf",
  domain: "zefaf.online",
  url: "https://zefaf.online",
  tagline: "دعوة فرحك بشكل يليق بفرحتك",
  description: "منصة دعوات الأفراح الإلكترونية الأنيقة — ٥٠٠ قالب، صور، أنيميشن، وموسيقى",
  pricePerInvite: 50,
  brandingRemovalPrice: 300,
  totalTemplates: 500,
  payment: {
    vodafoneCash: "01065316500",
    instapay: "01065316500",
    instapayHandle: "alaa00saber@instapay",
    instapayUsername: "alaa00saber",
  },
  contact: {
    whatsapp: "201065316500",
    phone: "01065316500",
    email: "hello@zefaf.online",
  },
};

// ============================================================
// Pricing tiers — Phase 4
// ============================================================

export type TierId = "basic" | "premium" | "vip";

export interface PricingTier {
  id: TierId;
  nameAr: string;
  tagline: string;
  price: number;
  highlighted?: boolean;
  features: { ar: string; included: boolean }[];
  unlocks: {
    parents?: boolean;
    story?: boolean;
    gallery?: boolean;
    removeBranding?: boolean;
    customMusic?: boolean;
    qrCode?: boolean;
    embeddedMap?: boolean;
    rsvpReminders?: boolean;
  };
}

export const TIERS: Record<TierId, PricingTier> = {
  basic: {
    id: "basic",
    nameAr: "الأساسي",
    tagline: "كل ما يحتاجه عريس",
    price: 50,
    features: [
      { ar: "وصول لكل الـ ٥٠٠ قالب", included: true },
      { ar: "٣ صور (عريس + عروسة + معاً)", included: true },
      { ar: "موسيقى خلفية", included: true },
      { ar: "أنيميشن متحرك", included: true },
      { ar: "RSVP + عدّاد ضيوف", included: true },
      { ar: "لينك دعوة + خريطة", included: true },
      { ar: "أسماء الأهل", included: false },
      { ar: "قصتنا (الـ Timeline)", included: false },
      { ar: "معرض صور إضافي (حتى ١٢ صورة)", included: false },
      { ar: "إزالة توقيع زفاف", included: false },
    ],
    unlocks: {
      embeddedMap: true,
    },
  },
  premium: {
    id: "premium",
    nameAr: "بريميام",
    tagline: "الأكثر طلباً",
    price: 120,
    highlighted: true,
    features: [
      { ar: "كل مميزات الأساسي", included: true },
      { ar: "أسماء أهل العريس والعروسة", included: true },
      { ar: "قصتنا (timeline لحظات الحب)", included: true },
      { ar: "معرض صور (حتى ١٢ صورة)", included: true },
      { ar: "QR Code للدعوة", included: true },
      { ar: "خريطة Google Maps مدمجة", included: true },
      { ar: "إزالة توقيع زفاف", included: false },
      { ar: "موسيقى مخصصة", included: false },
    ],
    unlocks: {
      parents: true,
      story: true,
      gallery: true,
      qrCode: true,
      embeddedMap: true,
    },
  },
  vip: {
    id: "vip",
    nameAr: "VIP",
    tagline: "تجربة كاملة بدون حدود",
    price: 300,
    features: [
      { ar: "كل مميزات بريميام", included: true },
      { ar: "إزالة توقيع زفاف نهائياً", included: true },
      { ar: "موسيقى مخصصة من اختيارك", included: true },
      { ar: "تذكير تلقائي للضيوف قبل الفرح", included: true },
      { ar: "أولوية في التفعيل (أقل من ساعة)", included: true },
      { ar: "تعديلات غير محدودة بعد الإطلاق", included: true },
    ],
    unlocks: {
      parents: true,
      story: true,
      gallery: true,
      removeBranding: true,
      customMusic: true,
      qrCode: true,
      embeddedMap: true,
      rsvpReminders: true,
    },
  },
};

export const TIER_LIST: PricingTier[] = [TIERS.basic, TIERS.premium, TIERS.vip];

export function getTier(id: TierId | string | undefined): PricingTier {
  if (!id) return TIERS.basic;
  return TIERS[(id as TierId)] || TIERS.basic;
}
