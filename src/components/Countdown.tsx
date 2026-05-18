"use client";

import { useEffect, useState } from "react";
import { arabicNumber } from "@/lib/utils";

export function Countdown({ date, accent }: { date: Date; accent: string }) {
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, date.getTime() - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (diff === 0) {
    return (
      <div className="my-4 text-3xl font-bold" style={{ color: accent }}>
        الفرح بدأ 🤍
      </div>
    );
  }

  return (
    <div className="my-3 grid grid-cols-4 gap-2 sm:gap-4">
      <Cell n={days} label="يوم" accent={accent} />
      <Cell n={hours} label="ساعة" accent={accent} />
      <Cell n={minutes} label="دقيقة" accent={accent} />
      <Cell n={seconds} label="ثانية" accent={accent} />
    </div>
  );
}

function Cell({ n, label, accent }: { n: number; label: string; accent: string }) {
  return (
    <div className="rounded-2xl bg-gradient-to-b from-white to-ink-50 p-3 shadow-sm ring-1 ring-ink-100">
      <div className="font-mono text-3xl font-bold sm:text-4xl" style={{ color: accent }}>
        {arabicNumber(n)}
      </div>
      <div className="text-xs text-ink-500">{label}</div>
    </div>
  );
}
