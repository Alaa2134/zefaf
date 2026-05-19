import Link from "next/link";
import { redirect } from "next/navigation";
import { Eye, Heart, Send, Calendar } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getCurrentUser } from "@/lib/auth";
import { listOrdersByUser } from "@/lib/orders";
import { getTemplate } from "@/lib/templates";
import { hasSupabase } from "@/lib/supabase";
import { formatEgp, arabicNumber, formatArabicDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // If Supabase isn't configured yet, show the legacy "look up by link" view
  if (!hasSupabase()) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="font-display text-3xl font-bold text-ink-900 sm:text-5xl">دعوتي</h1>
          <p className="mt-3 text-ink-600">
            تسجيل الدخول هيشتغل بعد ما يتم إعداد قاعدة البيانات.
            <br />
            في الوقت ده، لو دعوتك اتفعلت، اللينك بصيغة <code dir="ltr" className="text-gold-700">/i/&lt;slug&gt;</code>
          </p>
          <Link
            href="/templates"
            className="mt-8 inline-block rounded-full bg-gold-gradient px-6 py-3 font-bold text-ink-900"
          >
            صمم دعوة جديدة
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard");

  const orders = await listOrdersByUser(user.id);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gold-50/30 to-rose-50/20">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-ink-900 sm:text-4xl">
              أهلاً {user.name || user.email}
            </h1>
            <p className="mt-1 text-sm text-ink-600">دعواتك وضيوفك في مكان واحد</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/templates"
              className="rounded-full bg-gradient-to-l from-gold-600 to-rose-600 px-5 py-2 text-sm font-bold text-white shadow"
            >
              + دعوة جديدة
            </Link>
            <form action="/api/auth/login" method="post">
              <button
                formMethod="delete"
                className="rounded-full bg-ink-100 px-4 py-2 text-sm hover:bg-ink-200"
                type="submit"
              >
                خروج
              </button>
            </form>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="mx-auto mt-12 max-w-md rounded-3xl bg-white p-10 text-center shadow-md ring-1 ring-gold-100">
            <Heart className="mx-auto h-12 w-12 text-rose-400 animate-heart-beat" />
            <h2 className="mt-4 font-display text-2xl font-bold text-ink-900">
              لسه ما صممتش دعوة
            </h2>
            <p className="mt-2 text-sm text-ink-600">
              اختار قالب وارفع صورك واعمل دعوتك في ٥ دقايق
            </p>
            <Link
              href="/templates"
              className="mt-6 inline-block rounded-full bg-gold-gradient px-8 py-3 font-bold text-ink-900"
            >
              ابدأ دلوقتي
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {orders.map((o) => {
              const t = getTemplate(o.templateId);
              const attending = o.rsvps.filter((r) => r.attending).reduce((s, r) => s + r.guests, 0);
              return (
                <div key={o.id} className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-gold-100">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-display text-xl font-bold text-ink-900">
                        {o.invitation.groomName} ❤ {o.invitation.brideName}
                      </div>
                      <div className="mt-1 text-xs text-ink-500">
                        {t?.nameAr} • {formatArabicDate(new Date(o.invitation.date))}
                      </div>
                    </div>
                    <StatusBadge status={o.status} />
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded-xl bg-ink-50 p-2">
                      <Eye className="mx-auto h-4 w-4 text-ink-500" />
                      <div className="mt-1 font-bold">{arabicNumber(o.views || 0)}</div>
                      <div className="text-ink-500">مشاهدة</div>
                    </div>
                    <div className="rounded-xl bg-emerald-50 p-2">
                      <Heart className="mx-auto h-4 w-4 text-emerald-600 fill-current" />
                      <div className="mt-1 font-bold text-emerald-700">{arabicNumber(attending)}</div>
                      <div className="text-emerald-600">حضور</div>
                    </div>
                    <div className="rounded-xl bg-gold-50 p-2">
                      <Send className="mx-auto h-4 w-4 text-gold-600" />
                      <div className="mt-1 font-bold text-gold-700">{arabicNumber(o.rsvps.length)}</div>
                      <div className="text-gold-600">ردود</div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {o.status === "paid" ? (
                      <Link
                        href={`/i/${o.slug}`}
                        target="_blank"
                        className="flex-1 rounded-xl bg-ink-900 px-4 py-2 text-center text-sm font-bold text-white hover:bg-ink-800"
                      >
                        افتح دعوتي
                      </Link>
                    ) : o.status === "pending_payment" ? (
                      <Link
                        href={`/checkout/${o.id}`}
                        className="flex-1 rounded-xl bg-gradient-to-l from-gold-600 to-rose-600 px-4 py-2 text-center text-sm font-bold text-white"
                      >
                        أكمل الدفع — {formatEgp(o.price)}
                      </Link>
                    ) : o.status === "pending_review" ? (
                      <div className="flex-1 rounded-xl bg-amber-100 px-4 py-2 text-center text-sm font-bold text-amber-800">
                        قيد المراجعة
                      </div>
                    ) : (
                      <div className="flex-1 rounded-xl bg-rose-100 px-4 py-2 text-center text-sm font-bold text-rose-800">
                        تم الرفض
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string; label: string }> = {
    paid: { bg: "bg-emerald-100", text: "text-emerald-700", label: "مفعّلة" },
    pending_payment: { bg: "bg-amber-100", text: "text-amber-700", label: "في انتظار الدفع" },
    pending_review: { bg: "bg-blue-100", text: "text-blue-700", label: "قيد المراجعة" },
    rejected: { bg: "bg-rose-100", text: "text-rose-700", label: "مرفوضة" },
  };
  const s = styles[status] || styles.pending_payment;
  return <span className={`rounded-full ${s.bg} ${s.text} px-2 py-0.5 text-xs font-bold`}>{s.label}</span>;
}
