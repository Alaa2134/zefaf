"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Template } from "@/lib/templates";
import { TemplateOrnament, CornerOrnaments, GoldFoilOverlay } from "./TemplateOrnament";
import { TemplateAnimation } from "./TemplateAnimation";
import { formatArabicDate } from "@/lib/utils";
import { pickCouplePhoto, pickGroomPhoto, pickBridePhoto, pickFloral } from "@/lib/stock-photos";

export interface InvitationContent {
  groomName: string;
  brideName: string;
  date: Date;
  venue: string;
  time: string;
  message?: string;
  groomPhoto?: string;
  bridePhoto?: string;
  couplePhoto?: string;
}

const SAMPLE: InvitationContent = {
  groomName: "أحمد",
  brideName: "نور",
  date: new Date(2026, 8, 18),
  venue: "قاعة الفخامة - القاهرة",
  time: "9:00 مساءً",
  message: "بسم الله الرحمن الرحيم ، يسعدنا أن ندعوكم لحضور حفل زفافنا",
};

export function TemplatePreview({
  template,
  size = "full",
  sample = false,
  content,
  watermark = false,
  animated = true,
}: {
  template: Template;
  size?: "card" | "full";
  sample?: boolean;
  content?: Partial<InvitationContent>;
  watermark?: boolean;
  animated?: boolean;
}) {
  // When in sample mode (gallery cards, demo), populate with real photos
  // so users see a believable preview instead of placeholder text.
  const sampled: Partial<InvitationContent> = sample
    ? {
        couplePhoto: pickCouplePhoto(template.id),
        groomPhoto: pickGroomPhoto(template.id),
        bridePhoto: pickBridePhoto(template.id),
      }
    : {};

  const c: InvitationContent = { ...SAMPLE, ...sampled, ...(content ?? {}) };
  const p = template.palette;
  const isDark = ["midnight-rose", "obsidian-gold"].includes(template.paletteId);

  // Base layout selection
  const Layout = LAYOUTS[template.layout];

  return (
    <div
      className="relative h-full w-full overflow-hidden font-display"
      style={{ background: p.bg, color: p.text }}
      dir="rtl"
    >
      {animated && <TemplateAnimation style={template.animation} color={p.accent} />}

      <Layout template={template} content={c} sample={sample} isDark={isDark} />

      {watermark && (
        <>
          <div className="watermark-grid pointer-events-none absolute inset-0 z-30" />
          <div className="watermark-text pointer-events-none absolute inset-0 z-30" />
          <div className="pointer-events-none absolute inset-0 z-30 bg-white/5 backdrop-blur-[1px]" />
        </>
      )}
    </div>
  );
}

// -------- Layout components --------

interface LayoutProps {
  template: Template;
  content: InvitationContent;
  sample?: boolean;
  isDark: boolean;
}

const LAYOUTS: Record<Template["layout"], React.FC<LayoutProps>> = {
  centered: CenteredLayout,
  split: SplitLayout,
  framed: FramedLayout,
  stacked: StackedLayout,
  card: CardLayout,
};

function CenteredLayout({ template, content }: LayoutProps) {
  const p = template.palette;
  const photo = content.couplePhoto || content.groomPhoto || content.bridePhoto;
  return (
    <div className="relative z-10 flex h-full flex-col items-center justify-center p-4 text-center">
      {/* Floral backdrop tint */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${pickFloral(template.id)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.18,
          mixBlendMode: "multiply",
        }}
      />
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center p-2 text-center">
        <TemplateOrnament style={template.decorativeStyle} color={p.primary} position="top" />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="my-2 text-xs uppercase tracking-[0.3em]"
          style={{ color: p.muted }}
        >
          دعوة زفاف
        </motion.div>
        {photo && (
          <div
            className="my-2 h-24 w-24 overflow-hidden rounded-full ring-4 sm:h-28 sm:w-28"
            style={{ boxShadow: `0 0 0 3px ${p.accent}, 0 8px 24px rgba(0,0,0,0.15)` }}
          >
            <img src={photo} alt="couple" className="h-full w-full object-cover" />
          </div>
        )}
        <CoupleNames content={content} palette={p} />
        <Divider color={p.accent} />
        <EventDetails content={content} palette={p} />
        <TemplateOrnament style={template.decorativeStyle} color={p.primary} position="bottom" />
      </div>
    </div>
  );
}

function SplitLayout({ template, content }: LayoutProps) {
  const p = template.palette;
  const photo = content.couplePhoto || content.groomPhoto || content.bridePhoto;
  return (
    <div className="relative z-10 grid h-full grid-cols-2">
      <div className="relative overflow-hidden">
        {photo ? (
          <>
            <img
              src={photo}
              alt="couple"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ filter: "saturate(1.1) contrast(1.05)" }}
            />
            {/* Cinematic gradient */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(${p.primary}55, transparent 40%, ${p.primary}77)`,
              }}
            />
            {/* Vignette */}
            <div
              className="absolute inset-0"
              style={{
                boxShadow: `inset 0 0 80px ${p.primary}66`,
              }}
            />
          </>
        ) : (
          <div className="absolute inset-0" style={{ background: p.primary }} />
        )}
        {/* Side label */}
        <div
          className="absolute bottom-3 right-3 text-[10px] uppercase tracking-[0.3em] text-white opacity-90"
          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
        >
          {formatArabicDate(content.date).split(" ").slice(0, 2).join(" ")}
        </div>
      </div>
      <div
        className="relative flex flex-col items-center justify-center p-4 text-center"
        style={{
          background: `linear-gradient(135deg, ${p.bg}, ${p.surface})`,
        }}
      >
        <div className="pointer-events-none absolute right-2 top-2">
          <svg viewBox="0 0 60 60" className="h-10 w-10" fill="none" stroke={p.accent} strokeWidth="1">
            <path d="M 5 5 L 25 5 L 5 25 Z" />
          </svg>
        </div>
        <div className="pointer-events-none absolute bottom-2 left-2 rotate-180">
          <svg viewBox="0 0 60 60" className="h-10 w-10" fill="none" stroke={p.accent} strokeWidth="1">
            <path d="M 5 5 L 25 5 L 5 25 Z" />
          </svg>
        </div>
        <TemplateOrnament style={template.decorativeStyle} color={p.primary} position="top" small />
        <CoupleNames content={content} palette={p} compact />
        <Divider color={p.accent} />
        <EventDetails content={content} palette={p} />
      </div>
    </div>
  );
}

function FramedLayout({ template, content }: LayoutProps) {
  const p = template.palette;
  const photo = content.couplePhoto || content.groomPhoto || content.bridePhoto;
  return (
    <div className="relative z-10 h-full p-3">
      {/* Floral backdrop tint */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${pickFloral(template.id)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.18,
          mixBlendMode: "multiply",
        }}
      />
      {/* Double frame for elite feel */}
      <div
        className="relative h-full p-1.5"
        style={{
          background: `linear-gradient(135deg, ${p.primary}, ${p.accent}, ${p.primary})`,
          boxShadow: `0 8px 30px ${p.primary}33`,
        }}
      >
        <div
          className="relative flex h-full flex-col items-center justify-center overflow-hidden p-3 text-center"
          style={{
            background: p.bg + "f5",
            border: `1px solid ${p.accent}`,
            backdropFilter: "blur(2px)",
          }}
        >
          <CornerOrnaments color={p.primary} />
          <GoldFoilOverlay />
          <TemplateOrnament style={template.decorativeStyle} color={p.primary} position="top" />
          {photo && (
            <div className="relative my-2">
              <div
                className="h-24 w-24 overflow-hidden rounded-full sm:h-32 sm:w-32"
                style={{
                  boxShadow: `0 0 0 3px ${p.bg}, 0 0 0 5px ${p.primary}, 0 0 0 7px ${p.accent}, 0 10px 30px rgba(0,0,0,0.25)`,
                }}
              >
                <img src={photo} alt="couple" className="h-full w-full object-cover" />
              </div>
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  boxShadow: `inset 0 0 30px ${p.primary}44`,
                }}
              />
            </div>
          )}
          <CoupleNames content={content} palette={p} />
          <Divider color={p.accent} />
          <EventDetails content={content} palette={p} />
          <TemplateOrnament style={template.decorativeStyle} color={p.primary} position="bottom" />
        </div>
      </div>
    </div>
  );
}

function StackedLayout({ template, content }: LayoutProps) {
  const p = template.palette;
  const photo = content.couplePhoto || content.groomPhoto || content.bridePhoto;
  return (
    <div className="relative z-10 flex h-full flex-col">
      <div className="relative flex-1 overflow-hidden">
        {photo ? (
          <>
            <img
              src={photo}
              alt="couple"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ filter: "saturate(1.15) contrast(1.05)" }}
            />
            {/* Dramatic top-down gradient */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, ${p.primary}44 0%, transparent 30%, transparent 50%, ${p.bg} 100%)`,
              }}
            />
            {/* Magazine-style overlay text */}
            <div className="absolute inset-0 flex items-start justify-center pt-6">
              <div
                className="rounded-full bg-black/30 px-4 py-1 text-[10px] uppercase tracking-[0.4em] text-white backdrop-blur-sm"
                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
              >
                ✦ دعوة زفاف ✦
              </div>
            </div>
          </>
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, ${p.primary} 0%, ${p.accent} 100%)`,
            }}
          />
        )}
      </div>
      <div className="relative flex flex-1 flex-col items-center justify-center p-4 text-center">
        <GoldFoilOverlay />
        <CoupleNames content={content} palette={p} />
        <Divider color={p.accent} />
        <EventDetails content={content} palette={p} />
      </div>
    </div>
  );
}

function CardLayout({ template, content }: LayoutProps) {
  const p = template.palette;
  const photo = content.couplePhoto || content.groomPhoto || content.bridePhoto;
  return (
    <div className="relative z-10 flex h-full items-center justify-center p-2">
      {/* Outer shadow shell */}
      <div className="relative w-full max-w-md">
        {/* Card */}
        <div
          className="relative flex flex-col overflow-hidden rounded-3xl"
          style={{
            background: p.surface,
            boxShadow: `0 25px 50px -12px ${p.primary}44, 0 0 0 1px ${p.accent}, 0 0 0 4px ${p.bg}`,
          }}
        >
          {/* Photo header with wedding details overlay */}
          {photo && (
            <div className="relative h-40 overflow-hidden sm:h-48">
              <img
                src={photo}
                alt="couple"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ filter: "saturate(1.1) contrast(1.05)" }}
              />
              {/* Bottom gradient fade */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, ${p.primary}22 0%, transparent 50%, ${p.surface} 100%)`,
                }}
              />
              {/* Vignette */}
              <div
                className="absolute inset-0"
                style={{
                  boxShadow: `inset 0 0 60px ${p.primary}55`,
                }}
              />
              {/* Date stamp */}
              <div className="absolute right-3 top-3">
                <div
                  className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm"
                  style={{ background: p.primary + "cc" }}
                >
                  Save the date
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col items-center p-5 pt-3 text-center">
            <TemplateOrnament style={template.decorativeStyle} color={p.primary} position="top" small />
            <CoupleNames content={content} palette={p} />
            <Divider color={p.accent} />
            <EventDetails content={content} palette={p} />
          </div>
        </div>
        {/* Decorative tag */}
        <div
          className="absolute -top-3 right-6 rotate-3 rounded-md px-3 py-1 text-[9px] font-bold uppercase tracking-widest shadow-md"
          style={{ background: p.accent, color: p.bg }}
        >
          ✦ Wedding ✦
        </div>
      </div>
    </div>
  );
}

// -------- Shared sub-components --------

function PhotoBubble({
  content,
  palette,
  large = false,
}: {
  content: InvitationContent;
  palette: Template["palette"];
  large?: boolean;
}) {
  const size = large ? "h-32 w-32 sm:h-40 sm:w-40" : "h-20 w-20 sm:h-24 sm:w-24";
  const photo = content.couplePhoto || content.groomPhoto || content.bridePhoto;
  return (
    <motion.div
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative ${size} mb-2 rounded-full bg-white/30 ring-4 backdrop-blur`}
      style={{ boxShadow: `0 0 0 4px ${palette.accent}, 0 8px 24px rgba(0,0,0,0.15)` }}
    >
      {photo ? (
        <Image src={photo} alt="couple" fill className="rounded-full object-cover" />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center rounded-full text-3xl"
          style={{ background: palette.accent + "33", color: palette.primary }}
        >
          ♥
        </div>
      )}
    </motion.div>
  );
}

function CoupleNames({
  content,
  palette,
  compact = false,
}: {
  content: InvitationContent;
  palette: Template["palette"];
  compact?: boolean;
}) {
  const nameSize = compact ? "text-xl sm:text-3xl" : "text-3xl sm:text-5xl";
  const ampSize = compact ? "text-2xl sm:text-4xl" : "text-4xl sm:text-6xl";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4 }}
      className="my-2 font-display font-bold leading-tight"
      style={{ color: palette.primary }}
    >
      <div className={nameSize} style={{ letterSpacing: "0.02em" }}>
        {content.groomName}
      </div>
      <div
        className={`${ampSize} my-0.5 font-script italic`}
        style={{
          color: palette.accent,
          fontWeight: 400,
          textShadow: `0 1px 2px ${palette.primary}22`,
        }}
      >
        &amp;
      </div>
      <div className={nameSize} style={{ letterSpacing: "0.02em" }}>
        {content.brideName}
      </div>
    </motion.div>
  );
}

function EventDetails({
  content,
  palette,
}: {
  content: InvitationContent;
  palette: Template["palette"];
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.7 }}
      className="font-sans text-xs sm:text-sm"
      style={{ color: palette.text }}
    >
      <div className="font-bold">{formatArabicDate(content.date)}</div>
      <div style={{ color: palette.muted }}>{content.time}</div>
      <div className="mt-1 text-[10px] sm:text-xs">{content.venue}</div>
    </motion.div>
  );
}

function Divider({ color }: { color: string }) {
  return (
    <div className="my-2 flex w-3/4 items-center gap-2" style={{ color }}>
      <div className="h-px flex-1 bg-current opacity-50" />
      <span className="text-lg">❀</span>
      <div className="h-px flex-1 bg-current opacity-50" />
    </div>
  );
}
