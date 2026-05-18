"use client";

import { motion } from "framer-motion";
import { TEMPLATES } from "@/lib/templates";
import { TemplatePreview } from "./TemplatePreview";

export function HeroPreview() {
  // 3 hand-picked variety
  const samples = [
    TEMPLATES.find((t) => t.baseId === "amira" && t.paletteId === "gold-ivory")!,
    TEMPLATES.find((t) => t.baseId === "yasmeen" && t.paletteId === "rose-blush")!,
    TEMPLATES.find((t) => t.baseId === "noor-eddin" && t.paletteId === "emerald-gold")!,
  ];

  return (
    <div className="relative mx-auto h-[480px] w-[340px] sm:h-[560px] sm:w-[400px]">
      {samples.map((t, i) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, y: 30, rotate: 0 }}
          animate={{
            opacity: 1,
            y: 0,
            rotate: i === 0 ? -8 : i === 2 ? 8 : 0,
            x: i === 0 ? -40 : i === 2 ? 40 : 0,
            scale: i === 1 ? 1 : 0.92,
          }}
          transition={{ duration: 0.8, delay: i * 0.2, ease: "easeOut" }}
          whileHover={{ y: -8, scale: i === 1 ? 1.04 : 0.96 }}
          className="absolute inset-0 overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-ink-100"
          style={{ zIndex: i === 1 ? 10 : 5 }}
        >
          <TemplatePreview template={t} size="card" sample />
        </motion.div>
      ))}

      {/* Floating badges */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9 }}
        className="absolute -bottom-4 right-0 z-20 rounded-2xl bg-white px-4 py-3 shadow-xl ring-1 ring-gold-200"
      >
        <div className="text-xs text-ink-500">معاينة فورية</div>
        <div className="font-bold text-gold-700">قبل ما تدفع</div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.1 }}
        className="absolute -top-2 left-0 z-20 rounded-full bg-gradient-to-l from-gold-500 to-rose-500 px-4 py-2 text-xs font-bold text-white shadow-xl"
      >
        ✨ ٥٠٠ قالب
      </motion.div>
    </div>
  );
}
