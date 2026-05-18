"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { TEMPLATES, CATEGORIES, PALETTES, TemplateCategory } from "@/lib/templates";
import { TemplateCard } from "./TemplateCard";

export function TemplatesGallery() {
  const [category, setCategory] = useState<TemplateCategory | "all">("all");
  const [palette, setPalette] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(24);

  const filtered = useMemo(() => {
    return TEMPLATES.filter((t) => {
      if (category !== "all" && t.category !== category) return false;
      if (palette !== "all" && t.paletteId !== palette) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!t.nameAr.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [category, palette, search]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      {/* Filters */}
      <div className="sticky top-[64px] z-30 -mx-4 mb-6 border-b border-gold-100 bg-white/90 px-4 py-3 backdrop-blur">
        <div className="relative mb-3">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث باسم القالب..."
            className="w-full rounded-full border border-ink-100 bg-white py-2.5 pr-10 pl-4 text-sm shadow-sm focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200"
          />
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id as TemplateCategory | "all")}
              className={`flex-none rounded-full px-4 py-1.5 text-sm font-medium transition ${
                category === c.id
                  ? "bg-ink-900 text-white shadow-md"
                  : "bg-white text-ink-700 ring-1 ring-ink-100 hover:bg-gold-50"
              }`}
            >
              <span className="ml-1">{c.icon}</span>
              {c.nameAr}
            </button>
          ))}
        </div>
        <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setPalette("all")}
            className={`flex-none rounded-full px-3 py-1 text-xs transition ${
              palette === "all" ? "bg-gold-600 text-white" : "bg-white text-ink-600 ring-1 ring-ink-100"
            }`}
          >
            كل الألوان
          </button>
          {PALETTES.map((p) => (
            <button
              key={p.id}
              onClick={() => setPalette(p.id)}
              className={`flex flex-none items-center gap-1.5 rounded-full px-3 py-1 text-xs transition ${
                palette === p.id ? "bg-gold-600 text-white" : "bg-white text-ink-600 ring-1 ring-ink-100"
              }`}
            >
              <span className="h-3 w-3 rounded-full" style={{ background: p.primary }} />
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 text-sm text-ink-500">
        النتائج: <strong>{filtered.length.toLocaleString("ar-EG")}</strong> قالب
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.slice(0, visible).map((t, i) => (
          <TemplateCard key={t.id} template={t} index={i} />
        ))}
      </div>

      {visible < filtered.length && (
        <div className="mt-10 text-center">
          <button
            onClick={() => setVisible((v) => v + 24)}
            className="rounded-full bg-ink-900 px-8 py-3 font-bold text-white shadow-lg transition hover:bg-ink-800"
          >
            عرض المزيد ({(filtered.length - visible).toLocaleString("ar-EG")} متبقي)
          </button>
        </div>
      )}
    </section>
  );
}
