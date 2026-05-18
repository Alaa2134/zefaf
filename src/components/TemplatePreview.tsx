"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Template } from "@/lib/templates";
import { TemplateOrnament } from "./TemplateOrnament";
import { TemplateAnimation } from "./TemplateAnimation";
import { formatArabicDate } from "@/lib/utils";

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
  const c: InvitationContent = { ...SAMPLE, ...(content ?? {}) };
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
  return (
    <div className="relative z-10 flex h-full flex-col items-center justify-center p-6 text-center">
      <TemplateOrnament style={template.decorativeStyle} color={p.primary} position="top" />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="my-4 text-xs uppercase tracking-[0.3em]"
        style={{ color: p.muted }}
      >
        دعوة زفاف
      </motion.div>
      <PhotoBubble content={content} palette={p} />
      <CoupleNames content={content} palette={p} />
      <Divider color={p.accent} />
      <EventDetails content={content} palette={p} />
      <TemplateOrnament style={template.decorativeStyle} color={p.primary} position="bottom" />
    </div>
  );
}

function SplitLayout({ template, content }: LayoutProps) {
  const p = template.palette;
  return (
    <div className="relative z-10 grid h-full grid-cols-2">
      <div className="flex items-center justify-center" style={{ background: p.primary }}>
        <PhotoBubble content={content} palette={p} large />
      </div>
      <div className="flex flex-col items-center justify-center p-4 text-center">
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
  return (
    <div className="relative z-10 h-full p-4">
      <div
        className="relative flex h-full flex-col items-center justify-center p-4 text-center"
        style={{
          border: `2px solid ${p.primary}`,
          boxShadow: `inset 0 0 0 1px ${p.accent}, 0 0 0 4px ${p.bg}, 0 0 0 5px ${p.primary}`,
        }}
      >
        <TemplateOrnament style={template.decorativeStyle} color={p.primary} position="top" />
        <PhotoBubble content={content} palette={p} />
        <CoupleNames content={content} palette={p} />
        <Divider color={p.accent} />
        <EventDetails content={content} palette={p} />
        <TemplateOrnament style={template.decorativeStyle} color={p.primary} position="bottom" />
      </div>
    </div>
  );
}

function StackedLayout({ template, content }: LayoutProps) {
  const p = template.palette;
  return (
    <div className="relative z-10 flex h-full flex-col">
      <div
        className="flex flex-1 items-center justify-center"
        style={{
          background: `linear-gradient(180deg, ${p.primary} 0%, ${p.accent} 100%)`,
        }}
      >
        <PhotoBubble content={content} palette={p} large />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
        <CoupleNames content={content} palette={p} />
        <Divider color={p.accent} />
        <EventDetails content={content} palette={p} />
      </div>
    </div>
  );
}

function CardLayout({ template, content }: LayoutProps) {
  const p = template.palette;
  return (
    <div className="relative z-10 flex h-full items-center justify-center p-4">
      <div
        className="relative flex w-full max-w-md flex-col items-center rounded-2xl p-6 text-center shadow-2xl"
        style={{ background: p.surface, border: `1px solid ${p.accent}` }}
      >
        <TemplateOrnament style={template.decorativeStyle} color={p.primary} position="top" small />
        <PhotoBubble content={content} palette={p} />
        <CoupleNames content={content} palette={p} />
        <Divider color={p.accent} />
        <EventDetails content={content} palette={p} />
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
  const size = compact ? "text-lg sm:text-2xl" : "text-2xl sm:text-4xl";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4 }}
      className="my-2 font-display font-bold leading-tight"
      style={{ color: palette.primary }}
    >
      <div className={size}>{content.groomName}</div>
      <div className="my-1 text-xl" style={{ color: palette.accent }}>
        &amp;
      </div>
      <div className={size}>{content.brideName}</div>
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
