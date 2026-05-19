"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Upload, Lock, ChevronRight, X, Heart, Send, Crown, Star, Wand2, Mic, Square } from "lucide-react";
import { Template } from "@/lib/templates";
import { TemplatePreview } from "./TemplatePreview";
import { useDraft } from "@/lib/store";
import { Logo } from "./Logo";
import { formatEgp, arabicNumber } from "@/lib/utils";
import { SITE, TIER_LIST, TIERS, type TierId } from "@/lib/config";
import { compressImage } from "@/lib/compress";
import { MUSIC_LIBRARY } from "@/lib/music";
import { VoiceRecorder } from "./VoiceRecorder";

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
  const [tierId, setTierId] = useState<TierId>("basic");
  const [submitting, setSubmitting] = useState(false);

  const tier = TIERS[tierId];
  const unlocked = tier.unlocks;
  const removeBranding = unlocked.removeBranding ?? false;
  const basePrice = tier.price;

  const [coupon, setCoupon] = useState("");
  const [couponState, setCouponState] = useState<
    | { valid: true; discount: number; finalPrice: number; description: string }
    | { valid: false; reason: string }
    | null
  >(null);

  const totalPrice = couponState?.valid ? couponState.finalPrice : basePrice;

  async function validateCoupon() {
    if (!coupon.trim()) {
      setCouponState(null);
      return;
    }
    const res = await fetch("/api/coupon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: coupon, tier: tierId }),
    });
    const data = await res.json();
    if (data.valid) {
      setCouponState({
        valid: true,
        discount: data.discount,
        finalPrice: data.finalPrice,
        description: data.description,
      });
    } else {
      setCouponState({ valid: false, reason: data.reason });
    }
  }

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

  async function handlePhoto(field: "groomPhoto" | "bridePhoto" | "couplePhoto", file?: File) {
    if (!file) return;
    if (file.size > 12 * 1024 * 1024) {
      alert("الصورة كبيرة جداً، يرجى صورة أقل من ١٢ ميجا");
      return;
    }
    try {
      const compressed = await compressImage(file, 1600, 0.82);
      setField(field, compressed);
    } catch {
      // Fallback to raw read on compression failure
      const reader = new FileReader();
      reader.onload = () => setField(field, reader.result as string);
      reader.readAsDataURL(file);
    }
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
          tier: tierId,
          invitation: {
            groomName: fullGroomName,
            brideName: fullBrideName,
            date: draft.date,
            venue: draft.venue || "سيتم الإعلان قريباً",
            venueMapUrl: draft.venueMapUrl,
            time: draft.time || "بعد العشاء",
            message: draft.message,
            groomPhoto: draft.groomPhoto,
            bridePhoto: draft.bridePhoto,
            couplePhoto: draft.couplePhoto,
            gallery: unlocked.gallery ? draft.gallery ?? [] : [],
            groomFatherName: unlocked.parents ? draft.groomFatherName : undefined,
            brideFatherName: unlocked.parents ? draft.brideFatherName : undefined,
            groomMotherName: unlocked.parents ? draft.groomMotherName : undefined,
            brideMotherName: unlocked.parents ? draft.brideMotherName : undefined,
            storyTitle: unlocked.story ? draft.storyTitle : undefined,
            storyText: unlocked.story ? draft.storyText : undefined,
            voiceNote: draft.voiceNote,
            backgroundVideo: draft.backgroundVideo,
            enableMusic: draft.enableMusic,
            musicChoice: draft.musicChoice,
            musicUrl: unlocked.customMusic ? draft.musicUrl : undefined,
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
            <Input
              value={draft.venueMapUrl ?? ""}
              onChange={(v) => setField("venueMapUrl", v)}
              placeholder="(اختياري) لينك خرايط جوجل للقاعة"
            />
          </Section>

          <Section title="كلمة من القلب">
            <textarea
              value={draft.message}
              onChange={(e) => setField("message", e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-ink-100 bg-white px-3 py-2.5 text-sm focus:border-gold-400 focus:outline-none"
              placeholder="بسم الله الرحمن الرحيم، يسعدنا أن ندعوكم..."
            />
            <AiTextGenerator
              groomName={draft.groomName || "العريس"}
              brideName={draft.brideName || "العروسة"}
              onPick={(text) => setField("message", text)}
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

          {/* Premium-only sections — unlocked by tier */}
          {unlocked.parents && (
            <Section title="👨‍👩‍👧‍👦 أسماء الأهل (اختياري)">
              <div className="grid gap-2 sm:grid-cols-2">
                <Input value={draft.groomFatherName ?? ""} onChange={(v) => setField("groomFatherName", v)} placeholder="والد العريس" />
                <Input value={draft.brideFatherName ?? ""} onChange={(v) => setField("brideFatherName", v)} placeholder="والد العروسة" />
                <Input value={draft.groomMotherName ?? ""} onChange={(v) => setField("groomMotherName", v)} placeholder="والدة العريس" />
                <Input value={draft.brideMotherName ?? ""} onChange={(v) => setField("brideMotherName", v)} placeholder="والدة العروسة" />
              </div>
            </Section>
          )}

          {unlocked.story && (
            <Section title="💕 قصتنا (اختياري)">
              <Input
                value={draft.storyTitle ?? ""}
                onChange={(v) => setField("storyTitle", v)}
                placeholder="عنوان (مثلاً: لقاؤنا الأول)"
              />
              <textarea
                value={draft.storyText ?? ""}
                onChange={(e) => setField("storyText", e.target.value)}
                rows={3}
                className="mt-2 w-full rounded-xl border border-ink-100 bg-white px-3 py-2.5 text-sm focus:border-gold-400 focus:outline-none"
                placeholder="احكي قصة لقاؤكم وحياتكم سوا — هتظهر في قسم خاص بدعوتكم"
              />
            </Section>
          )}

          {unlocked.gallery && (
            <Section title="🖼️ معرض صور (اختياري — حتى ١٢ صورة)">
              <GallerySlots
                items={draft.gallery ?? []}
                onChange={(items) => setField("gallery", items)}
                onAdd={async (file) => {
                  if (!file) return;
                  if (file.size > 12 * 1024 * 1024) return alert("الصورة كبيرة جداً");
                  try {
                    const c = await compressImage(file, 1400, 0.78);
                    const list = draft.gallery ?? [];
                    if (list.length >= 12) return alert("الحد الأقصى ١٢ صورة");
                    setField("gallery", [...list, c]);
                  } catch {}
                }}
              />
            </Section>
          )}

          {/* Tier picker */}
          <Section title="💎 اختار الباقة">
            <div className="grid gap-2">
              {TIER_LIST.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTierId(t.id)}
                  className={`relative rounded-2xl border-2 p-4 text-right transition ${
                    tierId === t.id
                      ? "border-gold-500 bg-gold-50 shadow-md"
                      : "border-ink-100 bg-white hover:border-ink-200"
                  }`}
                >
                  {t.highlighted && (
                    <span className="absolute -top-2 right-3 rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white">
                      الأكثر طلباً
                    </span>
                  )}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1 font-bold text-ink-900">
                        {t.id === "vip" && <Crown className="h-4 w-4 text-gold-600" />}
                        {t.id === "premium" && <Star className="h-4 w-4 text-rose-600 fill-rose-600" />}
                        {t.nameAr}
                      </div>
                      <div className="text-xs text-ink-500">{t.tagline}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-2xl font-bold text-gold-700">{formatEgp(t.price)}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-ink-500">
              تقدر تغيّر الباقة في أي وقت قبل الدفع — تفاصيل كل باقة في صفحة الأسعار
            </p>
          </Section>

          <Section title="🎁 كود خصم (اختياري)">
            <div className="flex gap-2">
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                placeholder="مثلاً: FARHET10"
                className="flex-1 rounded-xl border border-ink-100 bg-white px-3 py-2.5 text-sm font-mono uppercase focus:border-gold-400 focus:outline-none"
              />
              <button
                onClick={validateCoupon}
                className="rounded-xl bg-ink-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-ink-800"
              >
                تطبيق
              </button>
            </div>
            {couponState?.valid && (
              <div className="mt-2 rounded-xl bg-emerald-50 p-3 text-sm">
                <div className="font-bold text-emerald-700">✓ تم تطبيق الكود</div>
                <div className="text-xs text-emerald-600">
                  {couponState.description} — وفّرت {formatEgp(couponState.discount)}
                </div>
              </div>
            )}
            {couponState && !couponState.valid && (
              <div className="mt-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
                ✗ {couponState.reason}
              </div>
            )}
          </Section>

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
              <>
                <select
                  value={draft.musicChoice}
                  onChange={(e) => setField("musicChoice", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-ink-100 bg-white px-3 py-2.5 text-sm focus:border-gold-400 focus:outline-none"
                >
                  {MUSIC_LIBRARY.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nameAr}
                    </option>
                  ))}
                </select>
                {unlocked.customMusic && (
                  <Input
                    value={draft.musicUrl ?? ""}
                    onChange={(v) => setField("musicUrl", v)}
                    placeholder="(VIP) لينك موسيقى مخصصة بصيغة mp3"
                  />
                )}
              </>
            )}
          </Section>

          <Section title="🎙️ رسالة صوتية للضيوف (اختياري)">
            <VoiceRecorder
              value={draft.voiceNote}
              onChange={(v) => setField("voiceNote", v)}
            />
            <p className="mt-1 text-xs text-ink-500">
              سجّل كلمة قصيرة من القلب، هتظهر في الدعوة بزرار تشغيل
            </p>
          </Section>

          <Section title="🎬 فيديو خلفية (اختياري)">
            <label className="flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-ink-200 bg-ink-50 transition hover:border-gold-400 hover:bg-gold-50">
              {draft.backgroundVideo ? (
                <video src={draft.backgroundVideo} controls className="h-full w-full object-cover" />
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-6 w-6 text-ink-400" />
                  <div className="mt-2 text-xs font-medium text-ink-600">
                    ارفع فيديو قصير (لحظات مميزة) — حتى ١٥ ميجا
                  </div>
                </div>
              )}
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  if (f.size > 15 * 1024 * 1024) return alert("الفيديو كبير، خليه أقل من ١٥ ميجا");
                  const r = new FileReader();
                  r.onload = () => setField("backgroundVideo", r.result as string);
                  r.readAsDataURL(f);
                }}
              />
            </label>
            {draft.backgroundVideo && (
              <button
                onClick={() => setField("backgroundVideo", undefined)}
                className="mt-2 text-xs text-rose-600 hover:underline"
              >
                إزالة الفيديو
              </button>
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
              <div className="text-xs text-ink-500">الباقة: {tier.nameAr}</div>
              <div className="font-display text-4xl font-bold text-gold-700">{formatEgp(totalPrice)}</div>
              <div className="mt-1 text-xs text-rose-600">{tier.tagline}</div>
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

function AiTextGenerator({
  groomName,
  brideName,
  onPick,
}: {
  groomName: string;
  brideName: string;
  onPick: (text: string) => void;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  async function gen(tone: string) {
    setBusy(tone);
    try {
      const res = await fetch("/api/ai/invitation-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groomName, brideName, tone }),
      });
      const data = await res.json();
      if (data?.text) onPick(data.text);
    } finally {
      setBusy(null);
    }
  }
  const tones: { id: string; label: string }[] = [
    { id: "classic", label: "كلاسيك" },
    { id: "modern", label: "عصري" },
    { id: "romantic", label: "رومانسي" },
    { id: "elegant", label: "فخم" },
    { id: "friendly", label: "ودود" },
  ];
  return (
    <div className="mt-2">
      <p className="mb-1 inline-flex items-center gap-1 text-xs text-ink-500">
        <Wand2 className="h-3 w-3" /> هل عايز نولّد نص دعوة على الذوق:
      </p>
      <div className="flex flex-wrap gap-1.5">
        {tones.map((t) => (
          <button
            key={t.id}
            onClick={() => gen(t.id)}
            disabled={busy !== null}
            className="rounded-full bg-gold-50 px-3 py-1 text-xs font-medium text-gold-700 ring-1 ring-gold-200 transition hover:bg-gold-100 disabled:opacity-50"
          >
            {busy === t.id ? "..." : t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function GallerySlots({
  items,
  onAdd,
  onChange,
}: {
  items: string[];
  onAdd: (file?: File) => void;
  onChange: (items: string[]) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {items.map((src, i) => (
        <div key={i} className="group relative aspect-square overflow-hidden rounded-xl border border-ink-100 bg-ink-50">
          <img src={src} alt={`gallery-${i}`} className="h-full w-full object-cover" />
          <button
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
            aria-label="حذف"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
      {items.length < 12 && (
        <label className="flex aspect-square cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-ink-200 bg-ink-50 transition hover:border-gold-400 hover:bg-gold-50">
          <Upload className="h-5 w-5 text-ink-400" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onAdd(e.target.files?.[0])}
          />
        </label>
      )}
    </div>
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
