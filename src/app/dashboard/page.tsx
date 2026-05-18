import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function DashboardPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl font-bold text-ink-900 sm:text-5xl">دعوتي</h1>
        <p className="mt-3 text-ink-600">دور على دعوتك برقم الطلب أو اللينك المرسل لك</p>

        <div className="mx-auto mt-8 max-w-md rounded-3xl bg-white p-6 shadow-xl ring-1 ring-gold-100">
          <p className="text-sm text-ink-600">
            لو عندك رقم طلب، ادخل على لينك التشيك آوت اللي وصلك.
            <br />
            لو دعوتك اتفعلت، اللينك الخاص بيها بصيغة:
          </p>
          <code dir="ltr" className="mt-3 block rounded-xl bg-ink-50 p-3 text-sm">
            /i/&lt;slug&gt;
          </code>
          <Link
            href="/templates"
            className="mt-6 inline-block rounded-full bg-gold-gradient px-6 py-3 font-bold text-ink-900"
          >
            صمم دعوة جديدة
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
