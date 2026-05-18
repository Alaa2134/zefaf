"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { Template } from "@/lib/templates";
import { formatEgp, arabicNumber } from "@/lib/utils";
import { TemplatePreview } from "./TemplatePreview";

export function TemplateCard({ template, index = 0 }: { template: Template; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.03, 0.4) }}
      className="group"
    >
      <Link href={`/templates/${template.id}`} className="block">
        <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-ink-100 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:ring-gold-300">
          <div className="relative aspect-[3/4] overflow-hidden">
            <TemplatePreview template={template} size="card" sample />
            {template.featured && (
              <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-gold-gradient px-3 py-1 text-xs font-bold text-white shadow-lg">
                <Sparkles className="h-3 w-3" />
                مميّز
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="text-xs text-white">
                <span className="inline-flex items-center gap-1">
                  <Heart className="h-3 w-3 fill-rose-400 text-rose-400" />
                  {arabicNumber(template.popularity)} عريس اشترى
                </span>
              </div>
            </div>
          </div>
          <div className="p-3 text-center">
            <div className="font-bold text-ink-900">{template.nameAr}</div>
            <div className="mt-1 flex items-center justify-between text-sm">
              <span className="text-ink-400">{template.id}</span>
              <span className="font-bold text-gold-600">{formatEgp(template.price)}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
