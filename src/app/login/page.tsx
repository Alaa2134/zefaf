import { Suspense } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LoginForm } from "@/components/LoginForm";

export const metadata = {
  title: "تسجيل دخول",
  description: "ادخل على حساب زفاف بتاعك",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gold-50/30 to-rose-50/30">
      <Navbar />
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-12">
        <div className="w-full rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gold-100">
          <h1 className="font-display text-3xl font-bold text-ink-900">أهلاً بعودتك</h1>
          <p className="mt-1 text-sm text-ink-600">ادخل تشوف دعواتك وتدير ضيوفك</p>

          <Suspense fallback={<div className="mt-6 h-40" />}>
            <LoginForm />
          </Suspense>

          <p className="mt-6 text-center text-sm text-ink-600">
            ما عندكش حساب؟{" "}
            <Link href="/signup" className="font-bold text-gold-700 hover:text-gold-800">
              اعمل حساب جديد
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
