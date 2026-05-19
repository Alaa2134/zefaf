import { notFound } from "next/navigation";
import { getOrderBySlug, incrementViews } from "@/lib/orders";
import { getTemplate } from "@/lib/templates";
import { InvitationView } from "@/components/InvitationView";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const order = await getOrderBySlug(slug);
  if (!order) return { title: "دعوة فرح" };
  return {
    title: `فرح ${order.invitation.groomName} و ${order.invitation.brideName}`,
    description: order.invitation.message,
    openGraph: {
      title: `فرح ${order.invitation.groomName} و ${order.invitation.brideName}`,
      description: order.invitation.message,
      images: order.invitation.couplePhoto ? [{ url: order.invitation.couplePhoto }] : undefined,
    },
  };
}

export default async function InvitationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const order = await getOrderBySlug(slug);
  if (!order) notFound();
  if (order.status !== "paid") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gold-50 to-rose-50 p-4">
        <div className="rounded-3xl bg-white p-10 text-center shadow-xl">
          <h1 className="font-display text-2xl font-bold">الدعوة قيد التفعيل</h1>
          <p className="mt-2 text-ink-600">
            تم استلام دفع العريس وفي انتظار التفعيل من الإدارة. حاول بعد قليل.
          </p>
        </div>
      </main>
    );
  }
  incrementViews(slug).catch(() => {});
  const template = getTemplate(order.templateId);
  if (!template) notFound();
  return <InvitationView order={JSON.parse(JSON.stringify(order))} template={template} />;
}
