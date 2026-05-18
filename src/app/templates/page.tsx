import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TemplatesGallery } from "@/components/TemplatesGallery";
import { TEMPLATES } from "@/lib/templates";

export const metadata = {
  title: "كل القوالب — زفاف",
  description: "تصفّح ٥٠٠ قالب دعوة فرح إلكترونية فاخرة",
};

export default function TemplatesPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="border-b border-gold-100 bg-gradient-to-b from-gold-50/40 to-transparent py-10">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="font-display text-3xl font-bold text-ink-900 sm:text-5xl">
            اختار قالب فرحك
          </h1>
          <p className="mt-3 text-ink-600">
            {TEMPLATES.length.toLocaleString("ar-EG")} قالب أنيق — ٥٠ ج فقط للقالب الواحد
          </p>
        </div>
      </div>
      <TemplatesGallery />
      <Footer />
    </main>
  );
}
