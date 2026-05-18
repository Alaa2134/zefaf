import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getTemplate } from "@/lib/templates";
import { TemplateDetailClient } from "@/components/TemplateDetailClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = getTemplate(id);
  if (!t) return { title: "قالب غير موجود" };
  return {
    title: `${t.nameAr} — قالب دعوة فرح | زفاف`,
    description: `صمّم دعوة فرحك على قالب ${t.nameAr} بـ ٥٠ ج فقط`,
  };
}

export default async function TemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const template = getTemplate(id);
  if (!template) notFound();

  return (
    <main className="min-h-screen">
      <Navbar />
      <TemplateDetailClient template={template} />
      <Footer />
    </main>
  );
}
