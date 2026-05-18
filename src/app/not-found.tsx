import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gold-50 to-rose-50 p-4">
      <div className="rounded-3xl bg-white p-10 text-center shadow-xl">
        <Logo />
        <h1 className="mt-6 font-display text-4xl font-bold text-ink-900">٤٠٤</h1>
        <p className="mt-2 text-ink-600">الصفحة دي مش موجودة</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-gold-gradient px-6 py-3 font-bold text-ink-900"
        >
          ارجع للرئيسية
        </Link>
      </div>
    </main>
  );
}
