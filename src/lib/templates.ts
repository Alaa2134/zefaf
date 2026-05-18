// =============================================================
// Zefaf — Template Catalog Engine
// Generates 500 templates from base templates × variants
// =============================================================

export type TemplateCategory =
  | "classic"
  | "modern"
  | "floral"
  | "royal"
  | "minimal"
  | "islamic"
  | "pharaonic"
  | "garden"
  | "vintage"
  | "luxury";

export type AnimationStyle =
  | "petals"
  | "hearts"
  | "sparkle"
  | "fade"
  | "curtain"
  | "fireworks";

export interface ColorPalette {
  id: string;
  name: string;
  bg: string;
  surface: string;
  primary: string;
  accent: string;
  text: string;
  muted: string;
}

export interface BaseTemplate {
  id: string;
  nameAr: string;
  category: TemplateCategory;
  layout: "centered" | "split" | "framed" | "stacked" | "card";
  decorativeStyle: "ornament" | "arch" | "wreath" | "geometric" | "calligraphy";
  defaultAnimation: AnimationStyle;
}

export interface Template {
  id: string;
  slug: string;
  baseId: string;
  paletteId: string;
  animation: AnimationStyle;
  nameAr: string;
  category: TemplateCategory;
  layout: BaseTemplate["layout"];
  decorativeStyle: BaseTemplate["decorativeStyle"];
  palette: ColorPalette;
  price: number;
  featured?: boolean;
  popularity: number;
}

// ============================================================
// 25 Base templates
// ============================================================
export const BASE_TEMPLATES: BaseTemplate[] = [
  { id: "amira", nameAr: "أميرة", category: "royal", layout: "framed", decorativeStyle: "arch", defaultAnimation: "sparkle" },
  { id: "yasmeen", nameAr: "ياسمين", category: "floral", layout: "centered", decorativeStyle: "wreath", defaultAnimation: "petals" },
  { id: "nour", nameAr: "نور", category: "minimal", layout: "stacked", decorativeStyle: "calligraphy", defaultAnimation: "fade" },
  { id: "lulu", nameAr: "لؤلؤة", category: "luxury", layout: "framed", decorativeStyle: "ornament", defaultAnimation: "sparkle" },
  { id: "warda", nameAr: "وردة", category: "floral", layout: "card", decorativeStyle: "wreath", defaultAnimation: "petals" },
  { id: "amir", nameAr: "أمير", category: "royal", layout: "split", decorativeStyle: "arch", defaultAnimation: "curtain" },
  { id: "habibi", nameAr: "حبيبي", category: "modern", layout: "split", decorativeStyle: "geometric", defaultAnimation: "fade" },
  { id: "qamar", nameAr: "قمر", category: "classic", layout: "centered", decorativeStyle: "ornament", defaultAnimation: "hearts" },
  { id: "salma", nameAr: "سلمى", category: "minimal", layout: "centered", decorativeStyle: "calligraphy", defaultAnimation: "fade" },
  { id: "layla", nameAr: "ليلى", category: "vintage", layout: "framed", decorativeStyle: "ornament", defaultAnimation: "fade" },
  { id: "noor-eddin", nameAr: "نور الدين", category: "islamic", layout: "centered", decorativeStyle: "arch", defaultAnimation: "sparkle" },
  { id: "kahramana", nameAr: "كهرمانة", category: "luxury", layout: "framed", decorativeStyle: "ornament", defaultAnimation: "sparkle" },
  { id: "jana", nameAr: "جنى", category: "garden", layout: "card", decorativeStyle: "wreath", defaultAnimation: "petals" },
  { id: "rumi", nameAr: "رومي", category: "vintage", layout: "stacked", decorativeStyle: "calligraphy", defaultAnimation: "fade" },
  { id: "zahra", nameAr: "زهرة", category: "floral", layout: "framed", decorativeStyle: "wreath", defaultAnimation: "petals" },
  { id: "anwar", nameAr: "أنوار", category: "modern", layout: "card", decorativeStyle: "geometric", defaultAnimation: "sparkle" },
  { id: "hena", nameAr: "حِنّة", category: "vintage", layout: "framed", decorativeStyle: "ornament", defaultAnimation: "fade" },
  { id: "shams", nameAr: "شمس", category: "pharaonic", layout: "centered", decorativeStyle: "geometric", defaultAnimation: "sparkle" },
  { id: "barakah", nameAr: "بركة", category: "islamic", layout: "framed", decorativeStyle: "arch", defaultAnimation: "fade" },
  { id: "fairouz", nameAr: "فيروز", category: "classic", layout: "split", decorativeStyle: "ornament", defaultAnimation: "curtain" },
  { id: "malak", nameAr: "ملاك", category: "royal", layout: "stacked", decorativeStyle: "arch", defaultAnimation: "fireworks" },
  { id: "samar", nameAr: "سمر", category: "garden", layout: "centered", decorativeStyle: "wreath", defaultAnimation: "petals" },
  { id: "asalah", nameAr: "أصالة", category: "classic", layout: "framed", decorativeStyle: "ornament", defaultAnimation: "hearts" },
  { id: "tarab", nameAr: "طرب", category: "vintage", layout: "card", decorativeStyle: "calligraphy", defaultAnimation: "fade" },
  { id: "izz", nameAr: "عز", category: "pharaonic", layout: "split", decorativeStyle: "geometric", defaultAnimation: "sparkle" },
];

// ============================================================
// 20 Color palettes
// ============================================================
export const PALETTES: ColorPalette[] = [
  { id: "gold-ivory", name: "ذهبي عاجي", bg: "#faf6ee", surface: "#fffaf0", primary: "#b67616", accent: "#d4961c", text: "#3c2c14", muted: "#8d7a55" },
  { id: "rose-blush", name: "وردي فاتح", bg: "#fef2f4", surface: "#fff7f8", primary: "#b11d47", accent: "#e64d72", text: "#4a1126", muted: "#9e6878" },
  { id: "burgundy-cream", name: "نبيتي وكريمي", bg: "#fdf6f0", surface: "#fffaf5", primary: "#7a1f2e", accent: "#a52a3a", text: "#3a0e15", muted: "#7d5560" },
  { id: "emerald-gold", name: "زمردي وذهبي", bg: "#f3f8f4", surface: "#fafdf9", primary: "#1f6e4a", accent: "#d4961c", text: "#0e3622", muted: "#5d7a6a" },
  { id: "navy-gold", name: "كحلي وذهبي", bg: "#f5f6f9", surface: "#fbfcfe", primary: "#1d3060", accent: "#d4961c", text: "#0b1530", muted: "#5e6580" },
  { id: "dusty-pink", name: "وردي مغبر", bg: "#faf3f1", surface: "#fdf8f6", primary: "#9d5a5a", accent: "#c08585", text: "#3d201f", muted: "#8d6a6a" },
  { id: "champagne", name: "شامبانيا", bg: "#fbf6ec", surface: "#fdfaf2", primary: "#a7894d", accent: "#cdb47b", text: "#3d2e15", muted: "#8a785a" },
  { id: "mauve", name: "موڤ", bg: "#f6f1f6", surface: "#faf7fa", primary: "#7a4a78", accent: "#a47ba2", text: "#2c172b", muted: "#7d6280" },
  { id: "sage-green", name: "أخضر زيتي", bg: "#f3f6ee", surface: "#fafdf3", primary: "#5a7842", accent: "#88a06a", text: "#27361b", muted: "#677a55" },
  { id: "blush-gold", name: "خدري وذهبي", bg: "#fdf3ef", surface: "#fffaf6", primary: "#b67616", accent: "#e8a48b", text: "#3a1a0f", muted: "#a87c66" },
  { id: "ivory-black", name: "عاجي وأسود", bg: "#fafaf7", surface: "#ffffff", primary: "#1a1c20", accent: "#b67616", text: "#1a1c20", muted: "#6c6f76" },
  { id: "lavender", name: "لافندر", bg: "#f4f0fa", surface: "#fbf9fe", primary: "#5e4a90", accent: "#9a8bc7", text: "#1e1442", muted: "#73698d" },
  { id: "terracotta", name: "تيراكوتا", bg: "#fbf2ec", surface: "#fdf8f3", primary: "#a64a2a", accent: "#d68864", text: "#3e1408", muted: "#9c6e58" },
  { id: "teal-cream", name: "تركواز وكريمي", bg: "#eef7f7", surface: "#f7fbfb", primary: "#1f6868", accent: "#5fa6a6", text: "#0a2828", muted: "#5d8080" },
  { id: "peach-gold", name: "خوخي وذهبي", bg: "#fef5ec", surface: "#fffaf3", primary: "#c97a3e", accent: "#f0b27a", text: "#3a1c0a", muted: "#a87b5e" },
  { id: "midnight-rose", name: "أرجواني عميق", bg: "#1a1228", surface: "#231836", primary: "#e64d72", accent: "#f5e08a", text: "#faf6ee", muted: "#9a8bb0" },
  { id: "obsidian-gold", name: "أوبسيديان وذهبي", bg: "#101317", surface: "#1b1f25", primary: "#f5e08a", accent: "#d4961c", text: "#fdf9ed", muted: "#9aa0a8" },
  { id: "cream-copper", name: "كريمي ونحاسي", bg: "#fbf5ec", surface: "#fefaf3", primary: "#b06b3a", accent: "#e09d6b", text: "#3a200c", muted: "#a08365" },
  { id: "pearl-silver", name: "لؤلؤي وفضي", bg: "#f4f5f8", surface: "#fbfbfd", primary: "#5e6d80", accent: "#aab4c4", text: "#1f2937", muted: "#6c7a90" },
  { id: "royal-purple", name: "أرجواني ملكي", bg: "#f6f0fa", surface: "#fbf7fd", primary: "#5a1f7a", accent: "#a16fc7", text: "#22063a", muted: "#7d6a90" },
];

// ============================================================
// Animation styles
// ============================================================
export const ANIMATIONS: AnimationStyle[] = ["petals", "hearts", "sparkle", "fade", "curtain", "fireworks"];

// ============================================================
// Generate the 500-template catalog deterministically
// ============================================================
function seededAnimation(baseId: string, paletteIndex: number, defaultAnim: AnimationStyle): AnimationStyle {
  // Mix things up but keep 'default' as the most common.
  if (paletteIndex % 5 === 0) return defaultAnim;
  return ANIMATIONS[(paletteIndex + baseId.charCodeAt(0)) % ANIMATIONS.length];
}

export const TEMPLATES: Template[] = (() => {
  const list: Template[] = [];
  let counter = 1;

  for (const base of BASE_TEMPLATES) {
    PALETTES.forEach((palette, pIdx) => {
      const id = `t${String(counter).padStart(3, "0")}`;
      const animation = seededAnimation(base.id, pIdx, base.defaultAnimation);
      const featured = counter % 17 === 0;
      const popularity = ((counter * 37) % 500) + 50;
      list.push({
        id,
        slug: `${base.id}-${palette.id}`,
        baseId: base.id,
        paletteId: palette.id,
        animation,
        nameAr: `${base.nameAr} • ${palette.name}`,
        category: base.category,
        layout: base.layout,
        decorativeStyle: base.decorativeStyle,
        palette,
        price: 50,
        featured,
        popularity,
      });
      counter++;
    });
  }

  return list;
})();

export const CATEGORIES: { id: TemplateCategory | "all"; nameAr: string; icon: string }[] = [
  { id: "all", nameAr: "الكل", icon: "✦" },
  { id: "classic", nameAr: "كلاسيك", icon: "❀" },
  { id: "modern", nameAr: "مودرن", icon: "◈" },
  { id: "floral", nameAr: "زهور", icon: "❁" },
  { id: "royal", nameAr: "ملكي", icon: "♛" },
  { id: "minimal", nameAr: "بسيط", icon: "◯" },
  { id: "islamic", nameAr: "إسلامي", icon: "☪" },
  { id: "pharaonic", nameAr: "فرعوني", icon: "𓂀" },
  { id: "garden", nameAr: "حديقة", icon: "❀" },
  { id: "vintage", nameAr: "ڤينتاج", icon: "✿" },
  { id: "luxury", nameAr: "فاخر", icon: "♦" },
];

export function getTemplate(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

export function getTemplateBySlug(slug: string): Template | undefined {
  return TEMPLATES.find((t) => t.slug === slug);
}

export function getBaseTemplate(baseId: string): BaseTemplate | undefined {
  return BASE_TEMPLATES.find((b) => b.id === baseId);
}

export function filterTemplates(opts: {
  category?: TemplateCategory | "all";
  search?: string;
  paletteId?: string;
}): Template[] {
  return TEMPLATES.filter((t) => {
    if (opts.category && opts.category !== "all" && t.category !== opts.category) return false;
    if (opts.paletteId && t.paletteId !== opts.paletteId) return false;
    if (opts.search) {
      const q = opts.search.toLowerCase();
      if (!t.nameAr.toLowerCase().includes(q) && !t.slug.toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

export const TOTAL_TEMPLATES = TEMPLATES.length; // 500
