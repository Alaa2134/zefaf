"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check, Upload, ChevronLeft, Phone, CreditCard, Sparkles } from "lucide-react";
import { Logo } from "./Logo";
import { SITE } from "@/lib/config";
import { Order } from "@/lib/orders";
import { formatEgp } from "@/lib/utils";
import { compressImage } from "@/lib/compress";

export function CheckoutClient({ orderId, order }: { orderId: string; order: Order }) {
  const router = useRouter();
  const [copied, setCopied] = useState<string | null>(null);
  const [method, setMethod] = useState<"vodafone_cash" | "instapay">("vodafone_cash");
  const [receiptImage, setReceiptImage] = useState<string | undefined>();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(order.status === "pending_review" || order.status === "paid");

  function copy(text: string, k: string) {
    navigator.clipboard.writeText(text);
    setCopied(k);
    setTimeout(() => setCopied(null), 1500);
  }

  async function onReceipt(file?: File) {
    if (!file) return;
    if (file.size > 12 * 1024 * 1024) return alert("الصورة كبيرة جداً، اعمل ضغط للصورة وارفعها تاني");
    try {
      const compressed = await compressImage(file, 1400, 0.85);
      setReceiptImage(compressed);
    } catch {
      const r = new FileReader();
      r.onload = () => setReceiptImage(r.result as string);
      r.readAsDataURL(file);
    }
  }

  async function submit() {
    if (!receiptImage) return alert("ارفع صورة إيصال الدفع الأول");
    if (!name.trim() || !phone.trim()) return alert("اكتب اسمك ورقمك علشان نقدر نوصلك");
    setSubmitting(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/receipt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method, image: receiptImage, note, name, phone, email }),
      });
      if (res.ok) setSubmitted(true);
      else alert("حصلت مشكلة، حاول تاني");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gold-50 to-rose-50/40">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <Logo />
          <div className="mt-10 rounded-3xl bg-white p-10 shadow-xl ring-1 ring-gold-100">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-rose-500 text-4xl text-white shadow-xl">
              ✓
            </div>
            <h1 className="mt-6 font-display text-3xl font-bold text-ink-900">استلمنا طلبك 🤍</h1>
            <p className="mt-3 text-ink-600">
              هنراجع إيصال الدفع وهنفعّل دعوتك في أقرب وقت.
              <br />
              هنتواصل معاك على واتساب: <strong>{phone || order.customer.phone}</strong>
            </p>
            <div className="mt-8 rounded-2xl bg-ink-50 p-4 text-right">
              <div className="text-xs text-ink-500">رقم الطلب</div>
              <div className="font-mono font-bold text-ink-900">{orderId}</div>
            </div>
            <button
              onClick={() => router.push("/dashboard")}
              className="mt-6 rounded-full bg-gold-gradient px-6 py-3 font-bold text-ink-900 shadow-lg"
            >
              متابعة دعوتي
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gold-50 to-rose-50/40">
      <header className="border-b border-gold-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Logo size="sm" />
          <button onClick={() => router.back()} className="text-sm text-ink-500 hover:text-ink-700">
            <ChevronLeft className="inline h-4 w-4 rotate-180" /> رجوع
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-3xl bg-gradient-to-l from-gold-50 to-rose-50 p-5 ring-1 ring-gold-200">
          <p className="font-display text-lg font-bold text-ink-900">
            أهلاً بيك يا عريس 🤍 خطوة واحدة وفرحك جاهز
          </p>
          <p className="mt-1 text-sm text-ink-700">
            حوّل المبلغ على فودافون كاش أو إنستا باي، صوّر الإيصال وارفعه — هنفعّل دعوتك في خلال ساعات.
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Summary k="القالب" v={order.invitation.groomName + " و " + order.invitation.brideName} />
          <Summary k="الإجمالي" v={formatEgp(order.price)} accent />
          <Summary k="رقم الطلب" v={orderId} mono />
        </div>

        {/* Payment methods */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => setMethod("vodafone_cash")}
            className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-right transition ${
              method === "vodafone_cash"
                ? "border-rose-500 bg-rose-50 shadow-md"
                : "border-ink-100 bg-white hover:border-ink-200"
            }`}
          >
            <Phone className="h-6 w-6 text-rose-600" />
            <div>
              <div className="font-bold text-ink-900">فودافون كاش</div>
              <div className="text-xs text-ink-500">حوّل من المحفظة مباشرة</div>
            </div>
          </button>
          <button
            onClick={() => setMethod("instapay")}
            className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-right transition ${
              method === "instapay"
                ? "border-gold-500 bg-gold-50 shadow-md"
                : "border-ink-100 bg-white hover:border-ink-200"
            }`}
          >
            <CreditCard className="h-6 w-6 text-gold-600" />
            <div>
              <div className="font-bold text-ink-900">إنستا باي</div>
              <div className="text-xs text-ink-500">من البنك مباشرة</div>
            </div>
          </button>
        </div>

        <div className="mt-4 rounded-2xl bg-white p-5 shadow-md ring-1 ring-gold-100">
          {method === "vodafone_cash" ? (
            <div>
              <div className="text-sm text-ink-500">حوّل المبلغ على رقم فودافون كاش</div>
              <div className="mt-2 flex items-center justify-between rounded-xl bg-rose-50 p-3">
                <div className="font-mono text-xl font-bold text-rose-700">{SITE.payment.vodafoneCash}</div>
                <button
                  onClick={() => copy(SITE.payment.vodafoneCash, "vc")}
                  className="rounded-full bg-rose-600 px-4 py-1.5 text-xs font-bold text-white"
                >
                  {copied === "vc" ? <Check className="h-4 w-4" /> : <><Copy className="ml-1 inline h-3 w-3" /> انسخ</>}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-sm text-ink-500">حوّل عبر إنستا باي على</div>
              <div className="mt-2 flex items-center justify-between rounded-xl bg-gold-50 p-3">
                <div className="font-mono text-base font-bold text-gold-800">{SITE.payment.instapayHandle}</div>
                <button
                  onClick={() => copy(SITE.payment.instapayHandle, "ip")}
                  className="rounded-full bg-gold-700 px-4 py-1.5 text-xs font-bold text-white"
                >
                  {copied === "ip" ? <Check className="h-4 w-4" /> : <><Copy className="ml-1 inline h-3 w-3" /> انسخ</>}
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-ink-50 p-3 text-sm">
            <div>
              <div className="text-xs text-ink-500">المبلغ المطلوب</div>
              <div className="font-bold text-gold-700">{formatEgp(order.price)}</div>
            </div>
            <div>
              <div className="text-xs text-ink-500">حوّل بنفس المبلغ تماماً</div>
              <div className="text-xs text-ink-600">عشان نلاقي تحويلك بسهولة</div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="mt-6 space-y-4 rounded-3xl bg-white p-5 shadow-md ring-1 ring-gold-100">
          <h3 className="font-bold text-ink-900">بياناتك للتواصل</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="اسمك"
              className="rounded-xl border border-ink-100 px-3 py-2.5 text-sm focus:border-gold-400 focus:outline-none"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="رقم واتساب للتواصل"
              dir="ltr"
              className="rounded-xl border border-ink-100 px-3 py-2.5 text-sm focus:border-gold-400 focus:outline-none"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="إيميلك (اختياري — هنبعتلك تأكيد)"
              type="email"
              dir="ltr"
              className="rounded-xl border border-ink-100 px-3 py-2.5 text-sm focus:border-gold-400 focus:outline-none sm:col-span-2"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-ink-800">📸 صورة إيصال التحويل</label>
            <label className="mt-2 flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-ink-200 bg-ink-50 transition hover:border-gold-400">
              {receiptImage ? (
                <img src={receiptImage} alt="receipt" className="h-full w-full object-contain" />
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-ink-400" />
                  <div className="mt-2 text-sm font-medium text-ink-600">ارفع لقطة الشاشة لإيصال التحويل</div>
                  <div className="text-xs text-ink-400">JPG أو PNG حتى ٥ ميجا</div>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onReceipt(e.target.files?.[0])} />
            </label>
          </div>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="ملاحظات (اختياري) — رقم المرجع، آخر ٤ أرقام من رقم التحويل، إلخ"
            className="w-full rounded-xl border border-ink-100 px-3 py-2.5 text-sm focus:border-gold-400 focus:outline-none"
          />

          <button
            onClick={submit}
            disabled={submitting}
            className="w-full rounded-2xl bg-gradient-to-l from-gold-600 to-rose-600 px-8 py-4 font-bold text-white shadow-xl disabled:opacity-50"
          >
            {submitting ? "..." : "تأكيد الدفع وإرسال الإيصال"}
            <Sparkles className="ml-2 inline h-4 w-4" />
          </button>
          <p className="text-center text-xs text-ink-500">
            هنبعتلك رسالة واتساب على رقمك بمجرد ما نفعّل الدعوة (في خلال ساعات)
          </p>
        </div>
      </div>
    </main>
  );
}

function Summary({ k, v, mono, accent }: { k: string; v: string; mono?: boolean; accent?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 ring-1 ${accent ? "bg-gold-50 ring-gold-200" : "bg-white ring-ink-100"}`}>
      <div className="text-xs text-ink-500">{k}</div>
      <div className={`mt-1 truncate font-bold ${mono ? "font-mono" : ""} ${accent ? "text-gold-700" : "text-ink-900"}`}>
        {v}
      </div>
    </div>
  );
}
