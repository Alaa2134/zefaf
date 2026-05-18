"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export function UrgencyBar() {
  const [hours, setHours] = useState(23);
  const [minutes, setMinutes] = useState(59);
  const [seconds, setSeconds] = useState(59);

  useEffect(() => {
    const tick = () => {
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const diff = end.getTime() - new Date().getTime();
      if (diff <= 0) return;
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setHours(h);
      setMinutes(m);
      setSeconds(s);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-gradient-to-l from-ink-900 via-ink-800 to-ink-900 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm">
        <Sparkles className="h-4 w-4 text-gold-400" />
        <span>
          عرض اليوم: <strong className="text-gold-400">٥٠ ج فقط</strong> لكل قالب — ينتهي خلال
        </span>
        <span className="font-mono font-bold text-gold-400">
          {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
