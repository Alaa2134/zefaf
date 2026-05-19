import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { isAdmin } from "@/lib/admin";
import { getOrder } from "@/lib/orders";
import { listGuests } from "@/lib/guests";
import { getTemplate } from "@/lib/templates";
import { Logo } from "@/components/Logo";
import { GuestListManager } from "@/components/GuestListManager";
import { arabicNumber, formatEgp, formatArabicDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();
  const template = getTemplate(order.templateId);
  const guests = await listGuests(id);

  const attended = order.rsvps.filter((r) => r.attending);
  const declined = order.rsvps.filter((r) => !r.attending);
  const totalGuestsAttending = attended.reduce((s, r) => s + r.guests, 0);

  return (
    <main className="min-h-screen bg-ink-50">
      <header className="border-b border-ink-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Logo size="sm" />
          <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-ink-600 hover:text-ink-900">
            <ChevronLeft className="h-4 w-4 rotate-180" />
            لوحة الإدارة
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="font-display text-3xl font-bold text-ink-900">
          {order.invitation.groomName} ❤ {order.invitation.brideName}
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          {template?.nameAr} • {formatArabicDate(new Date(order.invitation.date))} • {order.invitation.venue}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="الباقة" value={order.tier || "basic"} />
          <StatCard label="الإيراد" value={formatEgp(order.price)} accent />
          <StatCard label="مشاهدات" value={arabicNumber(order.views || 0)} />
          <StatCard label="الحالة" value={order.status} />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* RSVPs */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-ink-900">
              ردود الضيوف ({arabicNumber(order.rsvps.length)})
            </h2>
            <div className="mb-3 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-emerald-50 p-3 text-center">
                <div className="font-bold text-emerald-700">
                  {arabicNumber(attended.length)} هيحضروا
                </div>
                <div className="text-xs text-emerald-600">
                  إجمالي ضيوف: {arabicNumber(totalGuestsAttending)}
                </div>
              </div>
              <div className="rounded-xl bg-rose-50 p-3 text-center">
                <div className="font-bold text-rose-700">
                  {arabicNumber(declined.length)} معتذرين
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink-100">
              <table className="w-full text-sm">
                <thead className="bg-ink-50 text-xs uppercase text-ink-500">
                  <tr>
                    <th className="px-3 py-2 text-right">الاسم</th>
                    <th className="px-3 py-2 text-right">الرد</th>
                    <th className="px-3 py-2 text-right">عدد</th>
                    <th className="px-3 py-2 text-right">رسالة</th>
                  </tr>
                </thead>
                <tbody>
                  {order.rsvps.map((r) => (
                    <tr key={r.id} className="border-t border-ink-100">
                      <td className="px-3 py-2 font-bold">
                        {r.name}
                        {r.phone && (
                          <div className="text-xs font-normal text-ink-500">{r.phone}</div>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {r.attending ? (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
                            هيحضر
                          </span>
                        ) : (
                          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs text-rose-700">
                            معتذر
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {r.attending ? arabicNumber(r.guests) : "—"}
                      </td>
                      <td className="px-3 py-2 text-xs text-ink-600">{r.message || "—"}</td>
                    </tr>
                  ))}
                  {order.rsvps.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-3 py-8 text-center text-ink-500">
                        لسه مفيش ردود
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Guest list manager */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-ink-900">
              قائمة المدعوين ({arabicNumber(guests.length)})
            </h2>
            <p className="mb-3 text-xs text-ink-500">
              لكل ضيف لينك شخصي. لو فتحه نقدر نعرف.
            </p>
            <GuestListManager orderId={id} initialGuests={guests} invitationSlug={order.slug} />
          </section>
        </div>
      </div>
    </main>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className={`rounded-2xl p-4 shadow-sm ring-1 ${
        accent ? "bg-gold-50 ring-gold-200" : "bg-white ring-ink-100"
      }`}
    >
      <div className="text-xs text-ink-500">{label}</div>
      <div className={`mt-1 font-display text-2xl font-bold ${accent ? "text-gold-700" : "text-ink-900"}`}>
        {value}
      </div>
    </div>
  );
}
