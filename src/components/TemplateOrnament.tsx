"use client";

import { BaseTemplate } from "@/lib/templates";

export function CornerOrnaments({ color }: { color: string }) {
  // Decorative corners — gold leaf style flourishes
  const corner = (
    <svg viewBox="0 0 80 80" className="absolute h-12 w-12 sm:h-16 sm:w-16" fill="none">
      <defs>
        <linearGradient id={`co-grad-${color.replace(/[^a-z0-9]/gi, "")}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <g stroke={`url(#co-grad-${color.replace(/[^a-z0-9]/gi, "")})`} strokeWidth="1.5" strokeLinecap="round">
        <path d="M 5 5 L 35 5" />
        <path d="M 5 5 L 5 35" />
        <path d="M 10 10 L 30 10" opacity="0.6" />
        <path d="M 10 10 L 10 30" opacity="0.6" />
        <circle cx="5" cy="5" r="2.5" fill={color} />
      </g>
      <g fill={color}>
        <circle cx="20" cy="5" r="1.2" />
        <circle cx="5" cy="20" r="1.2" />
        <path d="M 12 12 Q 22 18 28 28 Q 24 24 14 24 Q 22 16 12 12 Z" opacity="0.5" />
      </g>
    </svg>
  );
  return (
    <>
      <div className="pointer-events-none absolute right-2 top-2">{corner}</div>
      <div className="pointer-events-none absolute left-2 top-2 scale-x-[-1]">{corner}</div>
      <div className="pointer-events-none absolute right-2 bottom-2 scale-y-[-1]">{corner}</div>
      <div className="pointer-events-none absolute left-2 bottom-2 scale-x-[-1] scale-y-[-1]">{corner}</div>
    </>
  );
}

export function GoldFoilOverlay() {
  // A subtle gold-foil shimmer effect via gradient
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-20"
      style={{
        background:
          "linear-gradient(135deg, transparent 0%, rgba(245,224,138,0.4) 25%, transparent 50%, rgba(212,150,28,0.3) 75%, transparent 100%)",
        mixBlendMode: "overlay",
      }}
    />
  );
}

export function TemplateOrnament({
  style,
  color,
  position,
  small = false,
}: {
  style: BaseTemplate["decorativeStyle"];
  color: string;
  position: "top" | "bottom";
  small?: boolean;
}) {
  const flip = position === "bottom" ? "rotate-180" : "";
  const size = small ? "h-8 w-32" : "h-12 w-48";

  switch (style) {
    case "ornament":
      return (
        <svg viewBox="0 0 200 50" className={`${size} ${flip}`} fill="none" stroke={color} strokeWidth="1.5">
          <path d="M0 25 Q 50 5, 100 25 T 200 25" />
          <circle cx="100" cy="25" r="6" fill={color} />
          <circle cx="80" cy="25" r="2" fill={color} />
          <circle cx="120" cy="25" r="2" fill={color} />
          <path d="M100 25 L 90 12 M100 25 L 110 12" />
        </svg>
      );
    case "arch":
      return (
        <svg viewBox="0 0 200 60" className={`${size} ${flip}`} fill="none" stroke={color} strokeWidth="2">
          <path d="M20 50 Q 100 0 180 50" />
          <path d="M30 50 Q 100 10 170 50" opacity="0.5" />
          <circle cx="100" cy="20" r="3" fill={color} />
        </svg>
      );
    case "wreath":
      return (
        <svg viewBox="0 0 200 60" className={`${size} ${flip}`} fill={color}>
          <g opacity="0.9">
            <circle cx="60" cy="30" r="6" />
            <circle cx="75" cy="22" r="4" />
            <circle cx="75" cy="38" r="4" />
            <circle cx="100" cy="30" r="7" />
            <circle cx="125" cy="22" r="4" />
            <circle cx="125" cy="38" r="4" />
            <circle cx="140" cy="30" r="6" />
            <path d="M50 30 Q 100 50 150 30" fill="none" stroke={color} strokeWidth="1" />
          </g>
        </svg>
      );
    case "geometric":
      return (
        <svg viewBox="0 0 200 30" className={`${size} ${flip}`} fill="none" stroke={color} strokeWidth="1.5">
          <path d="M0 15 L 30 15 L 40 5 L 50 15 L 60 25 L 70 15 L 100 15 L 110 5 L 120 15 L 130 25 L 140 15 L 200 15" />
          <circle cx="100" cy="15" r="3" fill={color} />
        </svg>
      );
    case "calligraphy":
      return (
        <div className={`${size} flex items-center justify-center font-display`} style={{ color }}>
          <span className="text-2xl">۞</span>
          <span className="mx-2 h-px w-16 bg-current opacity-50" />
          <span className="text-xl">❁</span>
          <span className="mx-2 h-px w-16 bg-current opacity-50" />
          <span className="text-2xl">۞</span>
        </div>
      );
    default:
      return null;
  }
}
