"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Copy, X, Check, Send } from "lucide-react";
import type { Guest } from "@/lib/guests";
import { SITE } from "@/lib/config";

export function GuestListManager({
  orderId,
  initialGuests,
  invitationSlug,
}: {
  orderId: string;
  initialGuests: Guest[];
  invitationSlug: string;
}) {
  const router = useRouter();
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [adding, setAdding] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  function guestUrl(token: string) {
    return `${SITE.url}/i/${invitationSlug}?g=${token}`;
  }

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }

  async function add() {
    if (!name.trim()) return;
    setAdding(true);
    try {
      const res = await fetch(`/api/guests/${orderId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      const data = await res.json();
      if (data.guest) {
        setGuests([...guests, data.guest]);
        setName("");
        setPhone("");
      }
    } finally {
      setAdding(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("حذف الضيف؟")) return;
    await fetch(`/api/guests/${orderId}/${id}`, { method: "DELETE" });
    setGuests(guests.filter((g) => g.id !== id));
  }

  function whatsappLink(g: Guest) {
    if (!g.phone) return undefined;
    const phone = g.phone.replace(/\D/g, "");
    const message = `أهلاً ${g.name} 🤍\nيسعدنا دعوتكم لحضور حفل زفافنا.\nاضغط اللينك تشوف الدعوة كاملة:\n${guestUrl(g.token)}`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink-100">
      {/* Add guest form */}
      <div className="grid gap-2 sm:grid-cols-[1fr_140px_auto]">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="اسم الضيف"
          className="rounded-xl border border-ink-100 px-3 py-2 text-sm focus:border-gold-400 focus:outline-none"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="رقم تليفون (اختياري)"
          dir="ltr"
          className="rounded-xl border border-ink-100 px-3 py-2 text-sm focus:border-gold-400 focus:outline-none"
        />
        <button
          onClick={add}
          disabled={!name.trim() || adding}
          className="inline-flex items-center justify-center gap-1 rounded-xl bg-ink-900 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> أضف
        </button>
      </div>

      <ul className="mt-4 space-y-2">
        {guests.map((g) => (
          <li key={g.id} className="flex flex-wrap items-center gap-2 rounded-xl bg-ink-50 p-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-ink-900">{g.name}</span>
                {g.openedAt ? (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] text-emerald-700">
                    ✓ فتح الدعوة
                  </span>
                ) : (
                  <span className="rounded-full bg-ink-200 px-2 py-0.5 text-[10px] text-ink-600">
                    لم يفتح
                  </span>
                )}
              </div>
              {g.phone && <div className="text-xs text-ink-500" dir="ltr">{g.phone}</div>}
              <div className="mt-1 truncate font-mono text-[10px] text-ink-500" dir="ltr">
                {guestUrl(g.token)}
              </div>
            </div>
            <button
              onClick={() => copy(guestUrl(g.token), g.id)}
              className="rounded-lg bg-white px-2 py-1 text-xs font-bold text-ink-700 ring-1 ring-ink-200 hover:bg-gold-50"
              title="انسخ اللينك"
            >
              {copied === g.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </button>
            {whatsappLink(g) && (
              <a
                href={whatsappLink(g)!}
                target="_blank"
                rel="noopener"
                className="rounded-lg bg-emerald-600 px-2 py-1 text-xs font-bold text-white hover:bg-emerald-700"
                title="ابعت واتساب"
              >
                <Send className="h-3 w-3" />
              </a>
            )}
            <button
              onClick={() => remove(g.id)}
              className="rounded-lg bg-white px-2 py-1 text-xs text-rose-600 ring-1 ring-rose-200 hover:bg-rose-50"
              title="حذف"
            >
              <X className="h-3 w-3" />
            </button>
          </li>
        ))}
        {guests.length === 0 && (
          <li className="rounded-xl bg-ink-50 p-6 text-center text-sm text-ink-500">
            مفيش ضيوف لسه. ابدأ بإضافة أول مدعو.
          </li>
        )}
      </ul>
    </div>
  );
}
