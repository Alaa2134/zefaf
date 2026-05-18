"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Upload, Lock, ChevronRight, X, Heart, Send } from "lucide-react";
import { Template } from "@/lib/templates";
import { TemplatePreview } from "./TemplatePreview";
import { useDraft } from "@/lib/store";
import { Logo } from "./Logo";
import { formatEgp, arabicNumber } from "@/lib/utils";
import { SITE } from "@/lib/config";

const TITLES_GROOM = ["", "أستاذ", "مهندس", "دكتور", "كابتن", "الحاج", "المهندس"];
const TITLES_BRIDE = ["", "آنسة", "مهندسة", "دكتورة", "الحاجة"];

export function EditorClient({ template }: { template: Template }) {
  const router = useRouter();
  const draft = useDraft((s) => s.draft);
  const setField = useDraft((s) => s.setField);
  const setTemplate = useDraft((s) => s.setTemplate);
  const hydrated = useDraft((s) => s.hydrated);

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [titleGroom, setTitleGroom] = useState("أستاذ");
  const [titleBride, setTitleBride] = useState("آنسة");
  const [removeBranding, setRemoveBranding] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const totalPrice = template.price + (removeBranding ? SITE.brandingRemovalPrice : 0);

  useEffect(() => {
    if (hydrated && draft.templateId !== template.id) setTemplate(template.id);
  }, [hydrated, draft.templateId, template.id, setTemplate]);

  // Exit-intent (desktop)
  useEffect(() => {
    let shown = false;
    function onLeave(e: MouseEvent) {
      if (e.clientY < 10 && !shown) {
        shown = true;
        setShowExitIntent(true);
      }
    }
    document.addEventListener("mouseleave", onLeave);
    return () => document.removeEventListener("mouseleave", onLeave);
  }, []);

  function handlePhoto(field: "groomPhoto" | "bridePhoto" | "couplePhoto", file?: File) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("الصورة كبيرة، يرجى صورة أقل من ٥ ميجا");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setField(field, reader.result as string);
    reader.readAsDataURL(file);
  }

  const fullGroomName = `${titleGroom ? titleGroom + " " : ""}${draft.groomName || "العريس"}`;
  const fullBrideName = `${titleBride ? titleBride + " " : ""}${draft.brideName || "العروسة"}`;

  const canCheckout = draft.groomName.trim() && draft.brideName.trim() && draft.date;

  async function startCheckout() {
    if (!canCheckout) {
      alert("اكتب اسم العريس والعروسة وميعاد الفرح الأول");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: template.id,
          invitation: {
            groomName: fullGroomName,
            brideName: fullBrideName,
            date: draft.date,
            venue: draft.venue || "سيتم الإعلان قريباً",
            time: draft.time || "بعد العشاء",
            message: draft.message,
            groomPhoto: draft.groomPhoto,
            bridePhoto: draft.bridePhoto,
            couplePhoto: draft.couplePhoto,
            enableMusic: draft.enableMusic,
            musicChoice: draft.musicChoice,
          },
          price: totalPrice,
          removeBranding,
        }),
      });
      const data = await res.json();
      if (data?.id) router.push(`/checkout/${data.id}`);
      else alert("حصلت مشكلة، حاول تاني");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gold-50/40 to-rose-50/30">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-gold-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3">
          <Logo size="sm" />
          <div className="hidden text-sm sm:block">
            <span className="text-ink-500">القالب:</span>{" "}
            <strong className="text-ink-900">{template.nameAr}</strong>
          </div>
          <button
            onClick={() => setShowCheckoutModal(true)}
            disabled={!canCheckout || submitting}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-gold-600 to-rose-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50"
          >
            <Lock className="h-4 w-4" />
            احجز دعوتك بـ {formatEgp(totalPrice)}
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[1fr_1.1fr]">
        {/* FORM */}
        <div className="space-y-4 rounded-3xl bg-white p-5 shadow-md ring-1 ring-gold-100 sm:p-6">
          <div className="rounded-xl bg-gradient-to-l from-gold-50 to-rose-50 p-3 text-sm">
            <p className="font-bold text-ink-900">
              {draft.groomName ? `أهلاً ${titleGroom} ${draft.groomName} 🤍` : "أهلاً بيك يا عريس 🤍"}
            </p>
            <p className="text-ink-600">
              املأ بياناتك وشوف دعوتك بتتحوّل لتحفة فنية على اليمين
            </p>
          </div>

          <Section title="اسم العريس">
            <div className="grid grid-cols-[110px_1fr] gap-2">
              <select
                value={titleGroom}
                onChange={(e) => setTitleGroom(e.target.value)}
                className="rounded-xl border border-ink-100 bg-white px-3 py-2.5 text-sm focus:border-gold-400 focus:outline-none"
              >
                {TITLES_GROOM.map((t) => (
                  <option key={t} value={t}>
                    {t || "(بدون لقب)"}
                  </option>
                ))}
              </select>
              <Input
                value={draft.groomName}
                onChange={(v) => setField("groomName", v)}
                placeholder="مثال: أحمد"
              />
            </div>
          </Section>

          <Section title="اسم العروسة">
            <div className="grid grid-cols-[110px_1fr] gap-2">
              <select
                value={titleBride}
                onChange={(e) => setTitleBride(e.target.value)}
                className="rounded-xl border border-ink-100 bg-white px-3 py-2.5 text-sm focus:border-gold-400 focus:outline-none"
              >
                {TITLES_BRIDE.map((t) => (
                  <option key={t} value={t}>
                    {t || "(بدون لقب)"}
                  </option>
                ))}
              </select>
              <Input
                value={draft.brideName}
                onChange={(v) => setField("brideName", v)}
                placeholder="مثال: نور"
              />
            </div>
            <p className="mt-1 text-xs text-ink-500">
              لو سيبت اللقب فاضي، هنحط الافتراضي: العريس &quot;أستاذ&quot; والعروسة &quot;آنسة&quot;
            </p>
          </Section>

          <div className="grid gap-3 sm:grid-cols-2">
            <Section title="تاريخ الفرح">
              <input
                type="date"
                value={draft.date}
                onChange={(e) => setField("date", e.target.value)}
                className="w-full rounded-xl border border-ink-100 bg-white px-3 py-2.5 text-sm focus:border-gold-400 focus:outline-none"
              />
            </Section>
            <Section title="ميعاد الفرح">
              <Input value={draft.time} onChange={(v) => setField("time", v)} placeholder="٩ مساءً" />
            </Section>
          </div>

          <Section title="مكان الفرح">
            <Input value={draft.venue} onChange={(v) => setField("venue", v)} placeholder="قاعة الفخامة - القاهرة" />
          </Section>

          <Section title="كلمة من القلب">
            <textarea
              value={draft.message}
              onChange={(e) => setField("message", e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-ink-100 bg-white px-3 py-2.5 text-sm focus:border-gold-400 focus:outline-none"
              placeholder="بسم الله الرحمن الرحيم، يسعدنا أن ندعوكم..."
            />
          </Section>

          <Section title="📸 صور العريس والعروسة">
            <div className="grid grid-cols-3 gap-2">
              <PhotoSlot
                label="العريس"
                value={draft.groomPhoto}
                onChange={(f) => handlePhoto("groomPhoto", f)}
                onClear={() => setField("groomPhoto", undefined)}
              />
              <PhotoSlot
                label="العروسة"
                value={draft.bridePhoto}
                onChange={(f) => handlePhoto("bridePhoto", f)}
                onClear={() => setField("bridePhoto", undefined)}
              />
              <PhotoSlot
                label="معاً"
                value={draft.couplePhoto}
                onChange={(f) => handlePhoto("couplePhoto", f)}
                onClear={() => setField("couplePhoto", undefined)}
              />
            </div>
          </Section>

          <div className="rounded-2xl border-2 border-gold-200 bg-gradient-to-l from-gold-50 to-rose-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-bold text-ink-900">⭐ شيل توقيع &quot;صُنع بواسطة زفاف&quot;</div>
                <p className="mt-1 text-xs text-ink-600">
                  تظهر دعوتك بالكامل بدون أي إشارة للمنصة. ضيوفك يشوفوها كأنها مصممة خصيصاً لكم بس
                </p>
                <div className="mt-2 text-sm font-bold text-gold-700">
                  +{formatEgp(SITE.brandingRemovalPrice)}
                </div>
              </div>
              <button
                onClick={() => setRemoveBranding((v) => !v)}
                className={`relative h-6 w-12 flex-none rounded-full transition ${
                  removeBranding ? "bg-gold-500" : "bg-ink-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                    removeBranding ? "right-0.5" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          </div>

          <Section title="🎵 موسيقى الدعوة">
            <div className="flex items-center justify-between rounded-xl bg-ink-50 p-3">
              <span className="text-sm text-ink-700">موسيقى خلفية في الدعوة</span>
              <button
                onClick={() => setField("enableMusic", !draft.enableMusic)}
                className={`relative h-6 w-12 rounded-full transition ${
                  draft.enableMusic ? "bg-gold-500" : "bg-ink-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                    draft.enableMusic ? "right-0.5" : "left-0.5"
                  }`}
                />
              </button>
            </div>
            {draft.enableMusic && (
              <select
                value={draft.musicChoice}
                onChange={(e) => setField("musicChoice", e.target.value)}
                className="mt-2 w-full rounded-xl border border-ink-100 bg-white px-3 py-2.5 text-sm focus:border-gold-400 focus:outline-none"
              >
                <option value="oud">عود هادئ</option>
                <option value="piano">بيانو رومانسي</option>
                <option value="zaffa">زفّة شعبية (طبل وزمر)</option>
                <option value="quran">قراءة قرآن</option>
                <option value="instrumental">موسيقى آلية</option>
              </select>
            )}
          </Section>

          <div className="pt-2">
            <button
              onClick={() => setShowCheckoutModal(true)}
              disabled={!canCheckout || submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-gold-600 to-rose-600 px-8 py-4 text-base font-bold text-white shadow-xl transition hover:scale-[1.01] disabled:opacity-50"
            >
              {submitting ? "..." : `احجز دعوتك دلوقتي بـ ${formatEgp(totalPrice)}`}
              <ChevronRight className="h-5 w-5 rotate-180" />
            </button>
            <p className="mt-2 text-center text-xs text-ink-500">
              ✓ هتشوف اللينك بعد ما الدفع يوصلنا — كل التعديلات بعدها مجاناً
            </p>
          </div>
        </div>

        {/* PREVIEW */}
        <div className="sticky top-20 self-start">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-rose-700">
              <Lock className="h-3 w-3" /> معاينة مقفولة
            </span>
            <span className="text-ink-500">شكل دعوتك النهائي</span>
          </div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-ink-100">
            <TemplatePreview
              template={template}
              size="full"
              watermark
              content={{
                groomName: fullGroomName,
                brideName: fullBrideName,
                date: draft.date ? new Date(draft.date) : new Date(),
                venue: draft.venue || "سيتم الإعلان قريباً",
                time: draft.time || "بعد العشاء",
                message: draft.message,
                groomPhoto: draft.groomPhoto,
                bridePhoto: draft.bridePhoto,
                couplePhoto: draft.couplePhoto,
              }}
            />
          </div>
          <div className="mt-3 rounded-xl bg-white p-3 text-xs text-ink-600 shadow ring-1 ring-gold-100">
            <p className="flex items-center gap-1 font-bold text-ink-900">
              <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
              المعاينة عليها علامة مائية
            </p>
            <p>بمجرد تأكيد الدفع، الدعوة بتتحول لشكلها النهائي بدون أي علامات</p>
          </div>
        </div>
      </div>

      {/* CHECKOUT MODAL */}
      <AnimatePresence>
        {showCheckoutModal && (
          <Modal onClose={() => setShowCheckoutModal(false)}>
            <h3 className="font-display text-2xl font-bold text-ink-900">
              مبروك يا {titleGroom} {draft.groomName || "عريس"} 🤍
            </h3>
            <p className="mt-2 text-sm text-ink-600">
              متبقى خطوة واحدة بس وفرحك يبقى جاهز للنشر
            </p>
            <div className="my-5 rounded-2xl bg-gold-50 p-4 text-center">
              <div className="text-xs text-ink-500">الإجمالي</div>
              <div className="font-display text-4xl font-bold text-gold-700">{formatEgp(totalPrice)}</div>
              {removeBranding && (
                <div className="mt-1 text-xs text-ink-600">
                  ٥٠ ج قالب + {arabicNumber(SITE.brandingRemovalPrice)} ج إزالة التوقيع
                </div>
              )}
              {!removeBranding && (
                <div className="mt-1 text-xs text-rose-600">عرض اليوم — وفّرت ١٠٠ ج</div>
              )}
            </div>
            <ul className="space-y-2 text-sm text-ink-700">
              <li>✓ لينك خاص بدعوتك</li>
              <li>✓ RSVP وعدّاد ضيوف</li>
              <li>✓ تعديلات مجانية بعد الدفع</li>
            </ul>
            <button
              onClick={startCheckout}
              disabled={submitting}
              className="mt-5 w-full rounded-2xl bg-gradient-to-l from-gold-600 to-rose-600 px-6 py-4 font-bold text-white shadow-lg disabled:opacity-50"
            >
              {submitting ? "..." : "أكمّل وادفع"}
            </button>
          </Modal>
        )}
      </AnimatePresence>

      {/* EXIT INTENT */}
      <AnimatePresence>
        {showExitIntent && (
          <Modal onClose={() => setShowExitIntent(false)}>
            <h3 className="font-display text-2xl font-bold text-ink-900">متخرجش لسه يا عريس 🤍</h3>
            <p className="mt-2 text-sm text-ink-600">
              صورك ودعوتك محفوظة، تقدر ترجع لها في أي وقت. وقبل ما تروح خد معاك العرض ده:
            </p>
            <div className="my-4 rounded-2xl bg-rose-50 p-4 text-center">
              <div className="text-sm font-bold text-rose-700">كود خصم: FARHET10</div>
              <div className="text-xs text-rose-600">خصم ١٠ ج إضافية لو خلّصت الدفع خلال ساعة</div>
            </div>
            <button
              onClick={() => setShowExitIntent(false)}
              className="w-full rounded-2xl bg-ink-900 px-6 py-3 font-bold text-white"
            >
              تمام، هكمّل
            </button>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold text-ink-800">{title}</label>
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-ink-100 bg-white px-3 py-2.5 text-sm focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-100"
    />
  );
}

function PhotoSlot({
  label,
  value,
  onChange,
  onClear,
}: {
  label: string;
  value?: string;
  onChange: (file?: File) => void;
  onClear: () => void;
}) {
  return (
    <label className="group relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-ink-200 bg-ink-50 transition hover:border-gold-400 hover:bg-gold-50">
      {value ? (
        <>
          <img src={value} alt={label} className="h-full w-full object-cover" />
          <button
            onClick={(e) => {
              e.preventDefault();
              onClear();
            }}
            className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
          >
            <X className="h-3 w-3" />
          </button>
          <div className="absolute bottom-1 right-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
            {label}
          </div>
        </>
      ) : (
        <div className="text-center">
          <Upload className="mx-auto h-5 w-5 text-ink-400" />
          <div className="mt-1 text-xs font-medium text-ink-600">{label}</div>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0])}
      />
    </label>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute left-3 top-3 rounded-full p-1 text-ink-400 hover:bg-ink-50 hover:text-ink-700"
        >
          <X className="h-5 w-5" />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}
