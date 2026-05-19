"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Phone, Loader2 } from "lucide-react";

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(data.error || "حصلت مشكلة");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-3">
      <div className="relative">
        <User className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="اسمك"
          required
          className="w-full rounded-xl border border-ink-100 bg-white py-3 pr-10 pl-3 text-sm focus:border-gold-400 focus:outline-none"
        />
      </div>
      <div className="relative">
        <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="الإيميل"
          required
          dir="ltr"
          className="w-full rounded-xl border border-ink-100 bg-white py-3 pr-10 pl-3 text-sm focus:border-gold-400 focus:outline-none"
        />
      </div>
      <div className="relative">
        <Phone className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="رقم تليفون (اختياري)"
          dir="ltr"
          className="w-full rounded-xl border border-ink-100 bg-white py-3 pr-10 pl-3 text-sm focus:border-gold-400 focus:outline-none"
        />
      </div>
      <div className="relative">
        <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="كلمة سر (٦ حروف على الأقل)"
          required
          minLength={6}
          dir="ltr"
          className="w-full rounded-xl border border-ink-100 bg-white py-3 pr-10 pl-3 text-sm focus:border-gold-400 focus:outline-none"
        />
      </div>
      {error && <p className="rounded-xl bg-rose-50 p-2 text-sm text-rose-700">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-gold-600 to-rose-600 px-6 py-3 font-bold text-white shadow-xl disabled:opacity-50"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "اعمل حسابي"}
      </button>
      <p className="text-center text-xs text-ink-500">
        بإنشاء الحساب، أنت توافق على شروط الاستخدام وسياسة الخصوصية
      </p>
    </form>
  );
}
