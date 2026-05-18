"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    setSubmitting(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setSubmitting(false);
    if (res.ok) router.push("/admin");
    // default password (dev): zefaf2026 — change via ADMIN_PASSWORD env var
    else setError("كلمة السر مش صح");
  }

  return (
    <div className="mt-6 space-y-3">
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="كلمة السر"
        className="w-full rounded-xl border border-ink-700 bg-ink-900 px-3 py-3 text-white focus:border-gold-400 focus:outline-none"
      />
      {error && <p className="text-sm text-rose-400">{error}</p>}
      <button
        onClick={submit}
        disabled={submitting}
        className="w-full rounded-xl bg-gold-gradient px-6 py-3 font-bold text-ink-900 shadow-lg disabled:opacity-50"
      >
        {submitting ? "..." : "دخول"}
      </button>
    </div>
  );
}
