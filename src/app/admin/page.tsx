import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/admin";
import { listOrders, getStats } from "@/lib/orders";
import { getTemplate } from "@/lib/templates";
import { formatEgp, arabicNumber } from "@/lib/utils";
import { AdminOrderActions } from "@/components/AdminOrderActions";
import { Logo } from "@/components/Logo";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  const orders = listOrders();
  const stats = getStats();
  const pending = orders.filter((o) => o.status === "pending_review");
  const paid = orders.filter((o) => o.status === "paid");
  const pendingPayment = orders.filter((o) => o.status === "pending_payment");

  return (
    <main className="min-h-screen bg-ink-50">
      <header className="border-b border-ink-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Logo size="sm" />
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-ink-600 hover:text-ink-900">عرض الموقع</Link>
            <form action="/api/admin/login" method="post" className="contents">
              <button
                formMethod="delete"
                formAction="/api/admin/login"
                className="rounded-full bg-ink-100 px-4 py-1.5 text-sm hover:bg-ink-200"
                type="submit"
              >
                خروج
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="font-display text-3xl font-bold text-ink-900">لوحة الإدارة</h1>

        {/* Stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="إجمالي الإيرادات" value={formatEgp(stats.revenue)} accent />
          <StatCard label="دعوات مفعّلة" value={arabicNumber(stats.paidOrders)} />
          <StatCard label="تنتظر مراجعة" value={arabicNumber(stats.pendingOrders)} alert={stats.pendingOrders > 0} />
          <StatCard label="مسودات" value={arabicNumber(pendingPayment.length)} />
          <StatCard label="ردود RSVP" value={arabicNumber(stats.totalRsvps)} />
        </div>

        {/* Pending Review */}
        <section className="mt-10">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-ink-900">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-sm text-rose-700">
              {arabicNumber(pending.length)}
            </span>
            طلبات تحتاج مراجعة
          </h2>
          {pending.length === 0 ? (
            <p className="rounded-2xl bg-white p-6 text-center text-ink-500 shadow-sm">
              مفيش طلبات في انتظار المراجعة
            </p>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {pending.map((o) => {
                const t = getTemplate(o.templateId);
                return (
                  <div key={o.id} className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-rose-200">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-bold text-ink-900">
                          {o.invitation.groomName} ❤ {o.invitation.brideName}
                        </div>
                        <div className="text-xs text-ink-500">
                          القالب: {t?.nameAr ?? o.templateId}
                        </div>
                        <div className="text-xs text-ink-500">
                          العميل: {o.customer.name} • {o.customer.phone}
                        </div>
                        <div className="text-xs text-ink-500">رقم: {o.id}</div>
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-gold-700">{formatEgp(o.price)}</div>
                        <div className="text-xs text-ink-500">
                          {o.receipt?.method === "vodafone_cash" ? "فودافون كاش" : "إنستا باي"}
                        </div>
                      </div>
                    </div>

                    {o.receipt?.image && (
                      <details className="mt-3">
                        <summary className="cursor-pointer text-sm text-ink-600">شاهد الإيصال</summary>
                        <img
                          src={o.receipt.image}
                          alt="receipt"
                          className="mt-2 max-h-80 rounded-xl border border-ink-100"
                        />
                      </details>
                    )}
                    {o.receipt?.note && (
                      <div className="mt-2 rounded-xl bg-ink-50 p-2 text-xs text-ink-600">
                        ملاحظة العميل: {o.receipt.note}
                      </div>
                    )}

                    <AdminOrderActions orderId={o.id} />

                    <a
                      href={`https://wa.me/${o.customer.phone?.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener"
                      className="mt-2 inline-block text-xs text-emerald-700 hover:underline"
                    >
                      📱 افتح واتساب العميل
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Active invitations */}
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-ink-900">
            الدعوات المفعّلة ({arabicNumber(paid.length)})
          </h2>
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink-100">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 text-right text-xs uppercase text-ink-500">
                <tr>
                  <th className="px-3 py-2">العريس والعروسة</th>
                  <th className="px-3 py-2">القالب</th>
                  <th className="px-3 py-2">الإيراد</th>
                  <th className="px-3 py-2">RSVP</th>
                  <th className="px-3 py-2">مشاهدات</th>
                  <th className="px-3 py-2">اللينك</th>
                </tr>
              </thead>
              <tbody>
                {paid.map((o) => {
                  const t = getTemplate(o.templateId);
                  return (
                    <tr key={o.id} className="border-t border-ink-100">
                      <td className="px-3 py-2 font-bold text-ink-900">
                        {o.invitation.groomName} ❤ {o.invitation.brideName}
                      </td>
                      <td className="px-3 py-2 text-ink-600">{t?.nameAr}</td>
                      <td className="px-3 py-2 text-gold-700">{formatEgp(o.price)}</td>
                      <td className="px-3 py-2">{arabicNumber(o.rsvps.length)}</td>
                      <td className="px-3 py-2">{arabicNumber(o.views || 0)}</td>
                      <td className="px-3 py-2">
                        <Link href={`/i/${o.slug}`} target="_blank" className="text-gold-700 hover:underline">
                          /i/{o.slug}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {paid.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-8 text-center text-ink-500">
                      لسه مفيش دعوات مفعّلة
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  accent,
  alert,
}: {
  label: string;
  value: string;
  accent?: boolean;
  alert?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-4 shadow-sm ring-1 ${
        accent
          ? "bg-gradient-to-br from-gold-50 to-rose-50 ring-gold-200"
          : alert
          ? "bg-rose-50 ring-rose-200"
          : "bg-white ring-ink-100"
      }`}
    >
      <div className="text-xs text-ink-500">{label}</div>
      <div className={`mt-1 font-display text-2xl font-bold ${accent ? "text-gold-700" : "text-ink-900"}`}>
        {value}
      </div>
    </div>
  );
}
