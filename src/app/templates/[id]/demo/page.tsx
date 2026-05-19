import { notFound } from "next/navigation";
import { getTemplate } from "@/lib/templates";
import { InvitationView } from "@/components/InvitationView";
import type { Order } from "@/lib/orders";

export const dynamic = "force-static";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = getTemplate(id);
  if (!t) return { title: "معاينة قالب" };
  return {
    title: `معاينة قالب ${t.nameAr}`,
    description: `شوف دعوة فرحك بشكلها الكامل على قالب ${t.nameAr}`,
    robots: { index: false, follow: false },
  };
}

export default async function DemoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const template = getTemplate(id);
  if (!template) notFound();

  const sampleOrder: Order = {
    id: "demo",
    slug: "demo",
    templateId: template.id,
    createdAt: new Date().toISOString(),
    status: "paid",
    price: template.price,
    invitation: {
      groomName: "أستاذ أحمد",
      brideName: "آنسة نور",
      date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      venue: "قاعة الفخامة الكبرى — التجمع الخامس، القاهرة",
      time: "٩:٠٠ مساءً",
      message:
        "ندعوكم لمشاركتنا فرحتنا في حفل زفافنا، ويسعدنا حضوركم لتشاركونا أجمل لحظات حياتنا",
      enableMusic: true,
      musicChoice: "oud",
    },
    customer: {},
    rsvps: [],
    views: 0,
    removeBranding: false,
  };

  return <InvitationView order={sampleOrder} template={template} />;
}
