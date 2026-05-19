"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-gold-100/60 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Logo />
        <nav className="hidden items-center gap-5 lg:flex">
          <Link href="/templates" className="text-sm font-medium text-ink-700 hover:text-gold-700">
            القوالب
          </Link>
          <Link href="/pricing" className="text-sm font-medium text-ink-700 hover:text-gold-700">
            الأسعار
          </Link>
          <Link href="/dashboard" className="text-sm font-medium text-ink-700 hover:text-gold-700">
            دعوتي
          </Link>
          <Link href="/login" className="text-sm font-medium text-ink-700 hover:text-gold-700">
            دخول
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-gradient-to-l from-gold-600 to-rose-600 px-5 py-2 text-sm font-bold text-white shadow-md transition hover:shadow-lg"
          >
            اعمل حساب
          </Link>
        </nav>
        <button
          className="rounded-full p-2 lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="القائمة"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-gold-100 bg-white lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            <Link onClick={() => setOpen(false)} href="/templates" className="rounded-lg p-2 hover:bg-gold-50">
              القوالب
            </Link>
            <Link onClick={() => setOpen(false)} href="/pricing" className="rounded-lg p-2 hover:bg-gold-50">
              الأسعار
            </Link>
            <Link onClick={() => setOpen(false)} href="/dashboard" className="rounded-lg p-2 hover:bg-gold-50">
              دعوتي
            </Link>
            <Link onClick={() => setOpen(false)} href="/login" className="rounded-lg p-2 hover:bg-gold-50">
              دخول
            </Link>
            <Link
              onClick={() => setOpen(false)}
              href="/signup"
              className="rounded-lg bg-gradient-to-l from-gold-600 to-rose-600 p-2 text-center font-bold text-white"
            >
              اعمل حساب
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
