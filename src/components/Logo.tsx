"use client";

import Link from "next/link";

export function Logo({ size = "md", linked = true }: { size?: "sm" | "md" | "lg"; linked?: boolean }) {
  const dim = size === "sm" ? "h-8 w-8" : size === "lg" ? "h-12 w-12" : "h-10 w-10";
  const text = size === "sm" ? "text-lg" : size === "lg" ? "text-3xl" : "text-2xl";

  const inner = (
    <span className="inline-flex items-center gap-2">
      <span className={`relative ${dim}`}>
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <defs>
            <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4961c" />
              <stop offset="50%" stopColor="#f5e08a" />
              <stop offset="100%" stopColor="#b67616" />
            </linearGradient>
            <linearGradient id="logo-rose" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e64d72" />
              <stop offset="100%" stopColor="#b11d47" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="30" fill="url(#logo-grad)" />
          <circle cx="32" cy="32" r="26" fill="#1a1c20" />
          {/* Z shape inspired by زفاف */}
          <path
            d="M20 22 L 44 22 L 24 42 L 44 42"
            stroke="url(#logo-grad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="32" cy="46" r="2.5" fill="url(#logo-rose)" />
          <path d="M16 50 Q 32 56 48 50" stroke="url(#logo-grad)" strokeWidth="1" fill="none" opacity="0.6" />
          <circle cx="20" cy="18" r="1" fill="#f5e08a" />
          <circle cx="44" cy="18" r="1" fill="#f5e08a" />
          <circle cx="48" cy="32" r="1" fill="#f5e08a" />
        </svg>
      </span>
      <span className={`font-display font-bold ${text}`}>
        <span className="bg-gradient-to-l from-gold-600 to-rose-600 bg-clip-text text-transparent">
          زفاف
        </span>
      </span>
    </span>
  );

  if (!linked) return inner;
  return <Link href="/" className="inline-flex items-center">{inner}</Link>;
}

export function LogoMark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className}>
      <defs>
        <linearGradient id="logomark-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4961c" />
          <stop offset="100%" stopColor="#b67616" />
        </linearGradient>
      </defs>
      <path
        d="M20 22 L 44 22 L 24 42 L 44 42"
        stroke="url(#logomark-grad)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
