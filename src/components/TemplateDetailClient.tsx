"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Sparkles, ChevronLeft, Music, Image as ImageIcon, Send, Star, Eye } from "lucide-react";
import { Template } from "@/lib/templates";
import { TemplatePreview } from "./TemplatePreview";
import { useDraft } from "@/lib/store";
import { arabicNumber, formatEgp } from "@/lib/utils";

export function TemplateDetailClient({ template }: { template: Template }) {
  const router = useRouter();
  const setTemplate = useDraft((s) => s.setTemplate);

  function startDesign() {
    setTemplate(template.id);
    router.push(`/editor/${template.id}`);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link href="/templates" className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-700">
        <ChevronLeft className="h-4 w-4 rotate-180" /> رجوع للقوالب
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="aspect-[3/4] overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-ink-100">
            <TemplatePreview template={template} size="full" sample />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 fill-rose-500 text-rose-500 animate-heart-beat" />
            <span className="text-sm text-rose-600">
              {arabicNumber(template.popularity)} عريس اختار ده الشهر ده
            </span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold text-ink-900 sm:text-5xl">
            {template.nameAr}
          </h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge>{template.category}</Badge>
            <Badge>{template.palette.name}</Badge>
            <Badge>أنيميشن: {template.animation}</Badge>
          </div>

          <div className="mt-6 flex items-end gap-3">
            <div>
              <div className="text-sm text-ink-500">السعر</div>
              <div className="font-display text-5xl font-bold text-gold-600">{formatEgp(template.price)}</div>
            </div>
            <div className="text-ink-400 line-through">١٥٠ ج.م</div>
            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-700">
              خصم ٦٧٪
            </span>
          </div>

          <button
            onClick={startDesign}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-gold-600 to-rose-600 px-8 py-5 text-lg font-bold text-white shadow-xl transition hover:scale-[1.02]"
          >
            ابدأ صمّم دعوتك بصورك
            <Sparkles className="h-5 w-5" />
          </button>

          <Link
            href={`/templates/${template.id}/demo`}
            target="_blank"
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-gold-300 bg-white px-8 py-3 text-base font-bold text-gold-700 shadow transition hover:bg-gold-50"
          >
            <Eye className="h-5 w-5" />
            شوف الدعوة الكاملة (معاينة حية)
          </Link>

          <p className="mt-3 text-center text-xs text-ink-500">
            ✓ معاينة فورية قبل الدفع — لا يخصم منك شيء قبل ما توافق على شكل الدعوة
          </p>

          <ul className="mt-8 space-y-3">
            <Feature icon={<ImageIcon className="h-4 w-4" />} text="ارفع صورة العريس والعروسة" />
            <Feature icon={<Sparkles className="h-4 w-4" />} text={`أنيميشن ${template.animation} حركي`} />
            <Feature icon={<Music className="h-4 w-4" />} text="موسيقى خلفية اختيارية" />
            <Feature icon={<Send className="h-4 w-4" />} text="لينك خاص بدعوتك مع RSVP وعدّاد ضيوف" />
            <Feature icon={<Star className="h-4 w-4" />} text="مدى الحياة — مفيش انتهاء صلاحية" />
          </ul>
        </div>
      </div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-gold-50 px-3 py-1 text-xs font-medium text-gold-800 ring-1 ring-gold-200">
      {children}
    </span>
  );
}

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <li className="flex items-center gap-3 text-sm text-ink-700">
      <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-gold-100 text-gold-700">
        {icon}
      </span>
      {text}
    </li>
  );
}
