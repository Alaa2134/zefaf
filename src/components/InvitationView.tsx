"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Heart, Music, MapPin, Calendar, Clock, Sparkles, ChevronDown, Camera, Users } from "lucide-react";
import { ShareButtons } from "./ShareButtons";
import { ExportButton } from "./ExportButton";
import { formatArabicDate as fmt } from "@/lib/utils";
import { TIERS } from "@/lib/config";
import { Template } from "@/lib/templates";
import { Order } from "@/lib/orders";
import { TemplateAnimation } from "./TemplateAnimation";
import { TemplateOrnament } from "./TemplateOrnament";
import { Countdown } from "./Countdown";
import { RsvpForm } from "./RsvpForm";
import { LogoMark } from "./Logo";
import { formatArabicDate, arabicNumber } from "@/lib/utils";
import { SITE } from "@/lib/config";

export function InvitationView({ order, template }: { order: Order; template: Template }) {
  const p = template.palette;
  const isDark = ["midnight-rose", "obsidian-gold"].includes(template.paletteId);
  const eventDate = new Date(order.invitation.date);
  const heroPhoto = order.invitation.couplePhoto || order.invitation.groomPhoto || order.invitation.bridePhoto;

  const [musicOn, setMusicOn] = useState(false);
  const [opened, setOpened] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const tier = TIERS[order.tier || "basic"];
  const showQr = Boolean(tier.unlocks.qrCode);

  const [pageUrl, setPageUrl] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") setPageUrl(window.location.href);
  }, []);

  // Hero parallax
  const heroRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroProgress, [0, 1], ["0%", "30%"]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);

  function toggleMusic() {
    if (!audioRef.current) return;
    if (musicOn) audioRef.current.pause();
    else audioRef.current.play().catch(() => {});
    setMusicOn((v) => !v);
  }

  // Auto-open music after envelope opens
  useEffect(() => {
    if (opened && order.invitation.enableMusic && audioRef.current) {
      audioRef.current.play().catch(() => {});
      setMusicOn(true);
    }
  }, [opened, order.invitation.enableMusic]);

  return (
    <main
      className="relative overflow-x-hidden font-display"
      style={{ background: p.bg, color: p.text }}
      dir="rtl"
    >
      {/* Background ambient animation across the whole page */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-60">
        <TemplateAnimation style={template.animation} color={p.accent} />
      </div>

      {/* Floating controls */}
      <div data-export-skip className="fixed bottom-6 left-4 z-50 flex flex-col gap-2">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5 }}
        >
          <ShareButtons
            url={pageUrl}
            groomName={order.invitation.groomName}
            brideName={order.invitation.brideName}
            date={fmt(eventDate)}
            palette={p}
            showQr={showQr}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.6 }}
        >
          <ExportButton
            groomName={order.invitation.groomName}
            brideName={order.invitation.brideName}
            palette={p}
          />
        </motion.div>
        {order.invitation.enableMusic && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.7 }}
            onClick={toggleMusic}
            className="rounded-full p-3 shadow-2xl backdrop-blur transition hover:scale-110"
            style={{ background: p.surface, color: p.primary }}
            aria-label="موسيقى"
          >
            <Music className={`h-5 w-5 ${musicOn ? "animate-pulse" : "opacity-50"}`} />
          </motion.button>
        )}
      </div>

      {/* Audio — uses custom URL if VIP set one, else the picked library track */}
      {order.invitation.enableMusic && (
        <audio ref={audioRef} loop>
          <source
            src={order.invitation.musicUrl || `/music/${order.invitation.musicChoice}.mp3`}
            type="audio/mpeg"
          />
        </audio>
      )}

      {/* ENVELOPE — first thing the guest sees, taps to open */}
      <AnimatePresence>
        {!opened && (
          <Envelope
            order={order}
            palette={p}
            template={template}
            onOpen={() => setOpened(true)}
          />
        )}
      </AnimatePresence>

      {/* ====== INVITATION SECTIONS ====== */}

      {/* HERO — Big cinematic intro */}
      <section ref={heroRef} className="relative z-10 flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
        <motion.div
          style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
          className="absolute inset-0"
        >
          {order.invitation.backgroundVideo ? (
            <>
              <video
                src={order.invitation.backgroundVideo}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
                style={{ filter: "brightness(0.55) saturate(1.15)" }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, ${p.primary}66 0%, transparent 40%, ${p.bg} 100%)`,
                }}
              />
            </>
          ) : heroPhoto ? (
            <>
              <img
                src={heroPhoto}
                alt="couple"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ filter: "brightness(0.55) saturate(1.15)" }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, ${p.primary}66 0%, transparent 40%, ${p.bg} 100%)`,
                }}
              />
            </>
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at 50% 30%, ${p.accent}55, ${p.primary}33 50%, ${p.bg} 100%)`,
              }}
            />
          )}
        </motion.div>

        <div className="relative z-10 text-center" style={{ color: heroPhoto ? "#fff" : p.text }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <TemplateOrnament style={template.decorativeStyle} color={heroPhoto ? "#fff" : p.primary} position="top" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-4 text-xs uppercase tracking-[0.4em] opacity-80"
          >
            دعوة زفاف
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-6 font-display text-5xl font-bold leading-tight drop-shadow-lg sm:text-7xl"
          >
            {order.invitation.groomName}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.2, type: "spring" }}
            className="my-4 inline-flex items-center justify-center"
          >
            <span className="font-script text-5xl sm:text-6xl" style={{ color: heroPhoto ? "#fff" : p.accent }}>
              &amp;
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="font-display text-5xl font-bold leading-tight drop-shadow-lg sm:text-7xl"
          >
            {order.invitation.brideName}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2 }}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2 backdrop-blur-md"
          >
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-bold">{formatArabicDate(eventDate)}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.5 }}
            className="absolute -bottom-2 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="rounded-full p-2"
            >
              <ChevronDown className="h-6 w-6 opacity-70" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* BISMILLAH / Welcome */}
      <Section bg={p.surface}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9 }}
          className="text-center"
        >
          <TemplateOrnament style={template.decorativeStyle} color={p.primary} position="top" />
          <p className="mt-6 font-script text-3xl leading-loose sm:text-4xl" style={{ color: p.primary }}>
            بسم الله الرحمن الرحيم
          </p>
          <p className="mt-4 text-base leading-relaxed sm:text-lg" style={{ color: p.muted }}>
            وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا
            <br />
            وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
          </p>
          <TemplateOrnament style={template.decorativeStyle} color={p.primary} position="bottom" />
        </motion.div>
      </Section>

      {/* COUPLE photos side by side */}
      {(order.invitation.groomPhoto || order.invitation.bridePhoto) && (
        <Section bg={p.bg}>
          <SectionTitle palette={p}>العريس والعروسة</SectionTitle>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <PhotoCard
              photo={order.invitation.groomPhoto}
              name={order.invitation.groomName}
              role="العريس"
              palette={p}
              fromLeft
            />
            <PhotoCard
              photo={order.invitation.bridePhoto}
              name={order.invitation.brideName}
              role="العروسة"
              palette={p}
            />
          </div>
        </Section>
      )}

      {/* PARENTS */}
      {(order.invitation.groomFatherName || order.invitation.brideFatherName) && (
        <Section bg={p.surface}>
          <SectionTitle palette={p}>بحضور الأهل الكرام</SectionTitle>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <FamilyCard
              role="عائلة العريس"
              father={order.invitation.groomFatherName}
              mother={order.invitation.groomMotherName}
              palette={p}
              side="right"
            />
            <FamilyCard
              role="عائلة العروسة"
              father={order.invitation.brideFatherName}
              mother={order.invitation.brideMotherName}
              palette={p}
              side="left"
            />
          </div>
        </Section>
      )}

      {/* STORY */}
      {order.invitation.storyText && (
        <Section bg={p.bg}>
          <SectionTitle palette={p}>{order.invitation.storyTitle || "قصتنا"}</SectionTitle>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="mt-6 rounded-3xl p-6 text-center font-display text-lg leading-loose shadow ring-1 backdrop-blur"
            style={{ background: p.surface, color: p.text, borderColor: p.accent + "33" }}
          >
            {order.invitation.storyText}
          </motion.div>
        </Section>
      )}

      {/* GALLERY */}
      {order.invitation.gallery && order.invitation.gallery.length > 0 && (
        <Section bg={p.surface}>
          <SectionTitle palette={p}>لحظات من حياتنا</SectionTitle>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {order.invitation.gallery.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (i % 6) * 0.06 }}
                className="aspect-square overflow-hidden rounded-2xl shadow-lg"
              >
                <img src={src} alt={`memory-${i}`} className="h-full w-full object-cover transition-transform duration-700 hover:scale-110" />
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {/* COUNTDOWN */}
      <Section bg={p.surface}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <SectionTitle palette={p}>متبقى على فرحنا</SectionTitle>
          <div className="mt-6">
            <Countdown date={eventDate} accent={p.primary} />
          </div>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold"
            style={{ background: p.primary + "15", color: p.primary }}
          >
            <Heart className="h-4 w-4 fill-current" />
            في انتظاركم
          </motion.div>
        </motion.div>
      </Section>

      {/* VOICE NOTE from the groom */}
      {order.invitation.voiceNote && (
        <Section bg={p.bg}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7 }}
            className="rounded-3xl p-6 text-center shadow-xl ring-1"
            style={{ background: p.surface, borderColor: p.accent + "33" }}
          >
            <div className="text-xs uppercase tracking-widest" style={{ color: p.muted }}>
              رسالة صوتية من العريس
            </div>
            <p className="mt-2 font-display text-lg" style={{ color: p.primary }}>
              🎙️ اضغط شغّل
            </p>
            <audio src={order.invitation.voiceNote} controls className="mx-auto mt-3 w-full max-w-md" />
          </motion.div>
        </Section>
      )}

      {/* MESSAGE / invitation text */}
      <Section bg={p.bg}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9 }}
          className="text-center"
        >
          <Sparkles className="mx-auto h-8 w-8" style={{ color: p.accent }} />
          <p
            className="mx-auto mt-6 max-w-xl font-display text-xl leading-loose sm:text-2xl"
            style={{ color: p.text }}
          >
            {order.invitation.message}
          </p>
          <div className="ornament-divider mx-auto mt-8 max-w-xs" style={{ color: p.primary }}>
            <span className="text-2xl">❀</span>
          </div>
          <p className="mt-4 font-display text-lg" style={{ color: p.primary }}>
            ندعوكم لمشاركتنا أجمل لحظات حياتنا
          </p>
        </motion.div>
      </Section>

      {/* EVENT DETAILS */}
      <Section bg={p.surface}>
        <SectionTitle palette={p}>تفاصيل الحفل</SectionTitle>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <DetailCard
            icon={<Calendar className="h-6 w-6" />}
            label="التاريخ"
            value={formatArabicDate(eventDate)}
            palette={p}
            delay={0}
          />
          <DetailCard
            icon={<Clock className="h-6 w-6" />}
            label="الموعد"
            value={order.invitation.time}
            palette={p}
            delay={0.15}
          />
          <DetailCard
            icon={<MapPin className="h-6 w-6" />}
            label="المكان"
            value={order.invitation.venue}
            palette={p}
            delay={0.3}
          />
        </div>

        {/* Embedded Google Map (premium+) */}
        {order.invitation.venueMapUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="mt-6 overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/10"
            style={{ height: 280 }}
          >
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(order.invitation.venue)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full border-0"
              title="map"
            />
          </motion.div>
        )}

        <motion.a
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          href={
            order.invitation.venueMapUrl ||
            `https://maps.google.com/?q=${encodeURIComponent(order.invitation.venue)}`
          }
          target="_blank"
          rel="noopener"
          className="mt-6 flex items-center justify-center gap-2 rounded-2xl px-6 py-4 font-bold text-white shadow-xl transition hover:scale-[1.02]"
          style={{
            background: `linear-gradient(135deg, ${p.primary}, ${p.accent})`,
          }}
        >
          <MapPin className="h-5 w-5" />
          افتح الموقع على الخريطة
        </motion.a>

        <motion.a
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          href={`/api/calendar/${order.slug}`}
          className="mt-3 flex items-center justify-center gap-2 rounded-2xl border-2 px-6 py-4 font-bold shadow transition hover:scale-[1.02]"
          style={{ borderColor: p.accent + "66", color: p.primary, background: p.surface }}
        >
          <Calendar className="h-5 w-5" />
          أضف الفرح لتقويمي
        </motion.a>
      </Section>

      {/* RSVP */}
      <Section bg={p.bg}>
        <SectionTitle palette={p}>شرّفنا برسالتك</SectionTitle>
        <div className="mt-6">
          <RsvpForm slug={order.slug} palette={p} />
        </div>
      </Section>

      {/* Closing */}
      <Section bg={p.surface}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Heart className="mx-auto h-12 w-12 fill-current" style={{ color: p.primary }} />
          </motion.div>
          <p className="mt-6 font-display text-2xl sm:text-3xl" style={{ color: p.primary }}>
            في انتظار حضوركم لمشاركتنا أحلى يوم في حياتنا
          </p>
          <p className="mt-4 font-script text-3xl sm:text-4xl" style={{ color: p.accent }}>
            {order.invitation.groomName} &amp; {order.invitation.brideName}
          </p>
        </motion.div>
      </Section>

      {/* Made by Zefaf footer */}
      {!order.removeBranding && (
        <footer className="relative z-10 border-t border-black/5 bg-white/60 backdrop-blur">
          <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-2 px-4 py-5 text-xs text-ink-500 sm:flex-row">
            <div className="flex items-center gap-2">
              <span>صُنع بواسطة</span>
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-1 font-bold transition hover:text-gold-700"
              >
                <LogoMark className="h-4 w-4" />
                <span className="bg-gradient-to-l from-gold-600 to-rose-600 bg-clip-text text-transparent">
                  {SITE.name}
                </span>
              </Link>
              <span className="text-ink-300">•</span>
              <Link href="/" target="_blank" className="hover:text-gold-700">
                صمّم دعوة فرحك
              </Link>
            </div>
          </div>
        </footer>
      )}
    </main>
  );
}

// ===== Sub-components =====

function Section({ bg, children }: { bg: string; children: React.ReactNode }) {
  return (
    <section className="relative z-10 px-4 py-16 sm:py-24" style={{ background: bg }}>
      <div className="mx-auto max-w-3xl">{children}</div>
    </section>
  );
}

function SectionTitle({ children, palette }: { children: React.ReactNode; palette: Template["palette"] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <div className="ornament-divider mx-auto max-w-sm" style={{ color: palette.accent }}>
        <span className="text-xl">❀</span>
      </div>
      <h2 className="mt-3 font-display text-2xl font-bold sm:text-4xl" style={{ color: palette.primary }}>
        {children}
      </h2>
    </motion.div>
  );
}

function PhotoCard({
  photo,
  name,
  role,
  palette,
  fromLeft,
}: {
  photo?: string;
  name: string;
  role: string;
  palette: Template["palette"];
  fromLeft?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: fromLeft ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8 }}
      className="overflow-hidden rounded-3xl shadow-2xl"
      style={{ background: palette.surface }}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        {photo ? (
          <img src={photo} alt={name} className="h-full w-full object-cover" />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-6xl"
            style={{ background: palette.accent + "33", color: palette.primary }}
          >
            <Camera className="h-12 w-12 opacity-50" />
          </div>
        )}
        <div
          className="absolute inset-x-0 bottom-0 h-1/2"
          style={{
            background: `linear-gradient(180deg, transparent, ${palette.primary}cc)`,
          }}
        />
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <p className="text-xs uppercase tracking-widest opacity-80">{role}</p>
          <p className="mt-1 font-display text-2xl font-bold drop-shadow-md sm:text-3xl">{name}</p>
        </div>
      </div>
    </motion.div>
  );
}

function FamilyCard({
  role,
  father,
  mother,
  palette,
  side,
}: {
  role: string;
  father?: string;
  mother?: string;
  palette: Template["palette"];
  side: "right" | "left";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === "right" ? 40 : -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7 }}
      className="rounded-2xl p-6 text-center shadow-lg"
      style={{ background: palette.surface, border: `1px solid ${palette.accent}33` }}
    >
      <Users className="mx-auto h-6 w-6" style={{ color: palette.primary }} />
      <div className="mt-3 text-xs uppercase tracking-widest" style={{ color: palette.muted }}>
        {role}
      </div>
      {father && (
        <div className="mt-2 font-display text-lg font-bold" style={{ color: palette.text }}>
          {father}
        </div>
      )}
      {mother && (
        <div className="font-display text-base" style={{ color: palette.muted }}>
          {mother}
        </div>
      )}
    </motion.div>
  );
}

function DetailCard({
  icon,
  label,
  value,
  palette,
  delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  palette: Template["palette"];
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      className="rounded-2xl p-5 text-center shadow-lg"
      style={{ background: palette.bg, border: `1px solid ${palette.accent}33` }}
    >
      <div
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
        style={{ background: `linear-gradient(135deg, ${palette.primary}, ${palette.accent})`, color: "#fff" }}
      >
        {icon}
      </div>
      <p className="mt-3 text-xs uppercase tracking-wider" style={{ color: palette.muted }}>
        {label}
      </p>
      <p className="mt-1 font-bold" style={{ color: palette.text }}>
        {value}
      </p>
    </motion.div>
  );
}

function Envelope({
  order,
  palette,
  template,
  onOpen,
}: {
  order: Order;
  palette: Template["palette"];
  template: Template;
  onOpen: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-6"
      style={{
        background: `radial-gradient(circle at 50% 50%, ${palette.primary}, ${palette.text})`,
      }}
    >
      <TemplateAnimation style={template.animation} color={palette.accent} />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.5, opacity: 0, rotateX: -90 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-sm"
      >
        <div
          className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-2xl"
          style={{
            background: `linear-gradient(135deg, ${palette.surface}, ${palette.bg})`,
            border: `2px solid ${palette.accent}`,
          }}
        >
          {/* Envelope flap */}
          <motion.div
            initial={{ clipPath: "polygon(0 0, 100% 0, 50% 50%)" }}
            className="absolute inset-x-0 top-0 h-1/2"
            style={{
              background: `linear-gradient(180deg, ${palette.primary}, ${palette.accent})`,
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            }}
          />

          {/* Wax seal */}
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2"
          >
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full text-white shadow-2xl"
              style={{ background: `radial-gradient(circle at 30% 30%, ${palette.accent}, ${palette.primary})` }}
            >
              <span className="font-display text-3xl">ز</span>
            </div>
          </motion.div>

          {/* Names + CTA */}
          <div className="absolute inset-x-0 bottom-0 p-6 text-center">
            <p className="text-xs uppercase tracking-widest" style={{ color: palette.muted }}>
              لديك دعوة من
            </p>
            <p className="mt-2 font-display text-2xl font-bold" style={{ color: palette.primary }}>
              {order.invitation.groomName}
            </p>
            <p className="font-script text-xl" style={{ color: palette.accent }}>
              &amp;
            </p>
            <p className="font-display text-2xl font-bold" style={{ color: palette.primary }}>
              {order.invitation.brideName}
            </p>

            <motion.button
              onClick={onOpen}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 w-full rounded-full px-6 py-3 font-bold text-white shadow-xl"
              style={{ background: `linear-gradient(135deg, ${palette.primary}, ${palette.accent})` }}
            >
              ✨ افتح الدعوة
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
