"use client";

import { useState } from "react";
import { Heart, X } from "lucide-react";
import { ColorPalette } from "@/lib/templates";

export function RsvpForm({ slug, palette }: { slug: string; palette: ColorPalette }) {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [attending, setAttending] = useState<boolean | null>(null);
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    if (!name.trim() || attending === null) {
      alert("اكتب اسمك وقولنا هتحضر ولا لأ");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/rsvp/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, attending, guests, message }),
      });
      if (res.ok) setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div
        className="rounded-3xl bg-white p-8 text-center shadow-xl ring-1 ring-ink-100"
        style={{ color: palette.text }}
      >
        <Heart className="mx-auto h-12 w-12 animate-heart-beat" style={{ color: palette.primary }} />
        <h3 className="mt-3 font-display text-2xl font-bold">شكراً يا {name} 🤍</h3>
        <p className="mt-2 text-sm" style={{ color: palette.muted }}>
          {attending ? "في انتظارك في الفرح" : "نشكرك على الرد، نتمنى لقاءك في فرحة قريبة"}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-ink-100" style={{ color: palette.text }}>
      <h3 className="font-display text-2xl font-bold">شرّفنا برسالتك</h3>
      <p className="mt-1 text-sm" style={{ color: palette.muted }}>
        قولنا هتحضر ولا لأ علشان نجهز قاعتنا
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="اسمك"
          className="rounded-xl border border-ink-100 px-3 py-2.5 text-sm focus:outline-none"
          style={{ borderColor: palette.muted + "40" }}
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="رقم تواصل (اختياري)"
          dir="ltr"
          className="rounded-xl border border-ink-100 px-3 py-2.5 text-sm focus:outline-none"
          style={{ borderColor: palette.muted + "40" }}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          onClick={() => setAttending(true)}
          className={`flex items-center justify-center gap-2 rounded-xl border-2 p-3 text-sm font-bold transition ${
            attending === true ? "shadow-md" : ""
          }`}
          style={{
            borderColor: attending === true ? palette.primary : palette.muted + "40",
            background: attending === true ? palette.primary + "15" : "transparent",
            color: attending === true ? palette.primary : palette.text,
          }}
        >
          <Heart className="h-4 w-4" /> هحضر بإذن الله
        </button>
        <button
          onClick={() => setAttending(false)}
          className={`flex items-center justify-center gap-2 rounded-xl border-2 p-3 text-sm font-bold transition ${
            attending === false ? "shadow-md" : ""
          }`}
          style={{
            borderColor: attending === false ? palette.muted : palette.muted + "40",
            background: attending === false ? palette.muted + "20" : "transparent",
            color: attending === false ? palette.text : palette.text,
          }}
        >
          <X className="h-4 w-4" /> مش هقدر للأسف
        </button>
      </div>

      {attending && (
        <div className="mt-4">
          <label className="block text-sm font-bold">عدد الضيوف معاك</label>
          <div className="mt-2 flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setGuests(n)}
                className={`h-10 w-10 rounded-full font-bold transition ${
                  guests === n ? "scale-110 shadow-md" : "bg-ink-50"
                }`}
                style={{
                  background: guests === n ? palette.primary : palette.bg,
                  color: guests === n ? "#fff" : palette.text,
                }}
              >
                {n.toLocaleString("ar-EG")}
              </button>
            ))}
          </div>
        </div>
      )}

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={2}
        placeholder="كلمة من القلب (اختياري)"
        className="mt-4 w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none"
        style={{ borderColor: palette.muted + "40" }}
      />

      <button
        onClick={submit}
        disabled={submitting}
        className="mt-5 w-full rounded-2xl px-6 py-3 font-bold text-white shadow-lg disabled:opacity-50"
        style={{ background: `linear-gradient(135deg, ${palette.primary}, ${palette.accent})` }}
      >
        {submitting ? "..." : "أرسل ردّك"}
      </button>
    </div>
  );
}
