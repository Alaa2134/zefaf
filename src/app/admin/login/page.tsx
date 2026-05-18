import { AdminLoginForm } from "@/components/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink-900 p-4 text-white">
      <div className="w-full max-w-sm rounded-3xl bg-ink-800 p-8 shadow-2xl ring-1 ring-gold-500/30">
        <h1 className="font-display text-2xl font-bold">
          دخول <span className="text-gold-400">الأدمن</span>
        </h1>
        <p className="mt-2 text-sm text-ink-300">لإدارة الطلبات وتفعيل الدعوات</p>
        <AdminLoginForm />
      </div>
    </main>
  );
}
