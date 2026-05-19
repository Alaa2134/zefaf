import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SignupForm } from "@/components/SignupForm";

export const metadata = {
  title: "حساب جديد",
  description: "اعمل حساب على زفاف وابدأ صمم دعوتك",
};

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gold-50/30 to-rose-50/30">
      <Navbar />
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-12">
        <div className="w-full rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gold-100">
          <h1 className="font-display text-3xl font-bold text-ink-900">أهلاً بيك في زفاف 🤍</h1>
          <p className="mt-1 text-sm text-ink-600">
            اعمل حسابك في دقيقة، احفظ دعواتك واتابع ضيوفك من أي حتة
          </p>

          <SignupForm />

          <p className="mt-6 text-center text-sm text-ink-600">
            عندك حساب بالفعل؟{" "}
            <Link href="/login" className="font-bold text-gold-700 hover:text-gold-800">
              سجّل دخول
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
