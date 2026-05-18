"use client";

import { BaseTemplate } from "@/lib/templates";

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
