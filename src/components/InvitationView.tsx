"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Send, Share2, Music, MusicIcon, X } from "lucide-react";
import { Template } from "@/lib/templates";
import { Order } from "@/lib/orders";
import { TemplatePreview } from "./TemplatePreview";
import { Countdown } from "./Countdown";
import { RsvpForm } from "./RsvpForm";
import { LogoMark } from "./Logo";
import { formatArabicDate } from "@/lib/utils";
import { SITE } from "@/lib/config";

export function InvitationView({ order, template }: { order: Order; template: Template }) {
  const [playing, setPlaying] = useState(false);
  const eventDate = new Date(order.invitation.date);

  function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      navigator.share({
        title: `فرح ${order.invitation.groomName} و ${order.invitation.brideName}`,
        text: "ندعوكم لحضور فرحنا 🤍",
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("تم نسخ اللينك");
    }
  }

  return (
    <main className="min-h-screen" style={{ background: template.palette.bg }}>
      {/* Floating share + music */}
      <div className="fixed bottom-6 left-4 z-40 flex flex-col gap-2">
        <button
          onClick={share}
          className="rounded-full bg-white p-3 shadow-xl ring-1 ring-ink-100 transition hover:scale-105"
          aria-label="شارك الدعوة"
        >
          <Share2 className="h-5 w-5 text-ink-700" />
        </button>
        {order.invitation.enableMusic && (
          <button
            onClick={() => setPlaying((p) => !p)}
            className="rounded-full bg-white p-3 shadow-xl ring-1 ring-ink-100 transition hover:scale-105"
            aria-label="موسيقى"
          >
            <Music className={`h-5 w-5 ${playing ? "text-gold-600 animate-pulse" : "text-ink-400"}`} />
          </button>
        )}
      </div>

      {/* Hero: full template preview */}
      <section className="relative">
        <div className="mx-auto max-w-md">
          <div className="relative aspect-[3/4] overflow-hidden shadow-2xl sm:rounded-b-[3rem]">
            <TemplatePreview
              template={template}
              size="full"
              content={{
                groomName: order.invitation.groomName,
                brideName: order.invitation.brideName,
                date: eventDate,
                venue: order.invitation.venue,
                time: order.invitation.time,
                message: order.invitation.message,
                groomPhoto: order.invitation.groomPhoto,
                bridePhoto: order.invitation.bridePhoto,
                couplePhoto: order.invitation.couplePhoto,
              }}
            />
          </div>
        </div>
      </section>

      {/* Countdown */}
      <section className="mx-auto max-w-4xl px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-white p-6 text-center shadow-xl ring-1 ring-ink-100"
        >
          <div className="text-sm" style={{ color: template.palette.muted }}>
            متبقى على الفرح
          </div>
          <Countdown date={eventDate} accent={template.palette.primary} />
          <div className="mt-3 text-sm font-bold" style={{ color: template.palette.text }}>
            {formatArabicDate(eventDate)} • {order.invitation.time}
          </div>
          <div className="text-sm" style={{ color: template.palette.muted }}>
            {order.invitation.venue}
          </div>
        </motion.div>
      </section>

      {/* Message */}
      {order.invitation.message && (
        <section className="mx-auto max-w-2xl px-4 py-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-white/70 p-6 text-center font-display text-lg leading-relaxed shadow ring-1 ring-ink-100 backdrop-blur"
            style={{ color: template.palette.text }}
          >
            {order.invitation.message}
          </motion.div>
        </section>
      )}

      {/* RSVP */}
      <section className="mx-auto max-w-2xl px-4 py-10">
        <RsvpForm slug={order.slug} palette={template.palette} />
      </section>

      {/* Map button (whatsapp/google) */}
      <section className="mx-auto max-w-2xl px-4 pb-10">
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(order.invitation.venue)}`}
          target="_blank"
          rel="noopener"
          className="block rounded-2xl p-4 text-center font-bold text-white shadow-lg"
          style={{ background: template.palette.primary }}
        >
          📍 طريقك للقاعة
        </a>
      </section>

      {/* Made by Zefaf footer (can be removed for 300 EGP) */}
      {!order.removeBranding && (
        <footer className="border-t border-black/5 bg-white/60 backdrop-blur">
          <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-1 px-4 py-4 text-xs text-ink-500 sm:flex-row sm:gap-2">
            <div className="flex items-center gap-2">
              <span>صُنع بواسطة</span>
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-1 font-bold text-ink-800 hover:text-gold-700"
              >
                <LogoMark className="h-4 w-4" />
                <span className="bg-gradient-to-l from-gold-600 to-rose-600 bg-clip-text text-transparent">
                  {SITE.name}
                </span>
              </Link>
              <span className="text-ink-300">•</span>
              <Link href="/" target="_blank" className="hover:text-gold-700">
                صمّم فرحك
              </Link>
            </div>
          </div>
        </footer>
      )}
    </main>
  );
}
