"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, X, Copy, Check, Download } from "lucide-react";
import type { ColorPalette } from "@/lib/templates";
import QRCode from "qrcode";

interface Props {
  url: string;
  groomName: string;
  brideName: string;
  date: string;
  palette: ColorPalette;
  showQr: boolean;
}

export function ShareButtons({ url, groomName, brideName, date, palette, showQr }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    if (!showQr) return;
    QRCode.toDataURL(url, {
      width: 480,
      margin: 2,
      color: { dark: palette.primary, light: palette.surface },
    })
      .then(setQrDataUrl)
      .catch(() => {});
  }, [url, palette.primary, palette.surface, showQr]);

  function copy() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const message = `🤍 يسعدنا دعوتكم لحضور حفل زفاف ${groomName} و ${brideName}\n📅 ${date}\n🔗 ${url}`;
  const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(message)}`;
  const smsUrl = `sms:?body=${encodeURIComponent(message)}`;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-full p-3 shadow-2xl backdrop-blur transition hover:scale-110"
        style={{ background: palette.surface, color: palette.primary }}
        aria-label="شارك الدعوة"
      >
        <Share2 className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-3xl p-6 shadow-2xl"
              style={{ background: palette.surface, color: palette.text }}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute left-3 top-3 rounded-full p-1 transition hover:bg-black/5"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="font-display text-xl font-bold" style={{ color: palette.primary }}>
                شارك الدعوة
              </h3>

              {showQr && qrDataUrl && (
                <div className="mt-4 flex flex-col items-center">
                  <div className="rounded-2xl p-3" style={{ background: palette.bg }}>
                    <img src={qrDataUrl} alt="QR" className="h-40 w-40" />
                  </div>
                  <a
                    href={qrDataUrl}
                    download={`zefaf-${groomName}-${brideName}.png`}
                    className="mt-2 inline-flex items-center gap-1 text-xs"
                    style={{ color: palette.muted }}
                  >
                    <Download className="h-3 w-3" /> حمّل QR للطباعة على الكروت
                  </a>
                </div>
              )}

              <div className="mt-4 grid grid-cols-3 gap-2">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener"
                  className="flex flex-col items-center gap-1 rounded-2xl p-3 text-xs font-bold transition hover:scale-105"
                  style={{ background: "#25d36633", color: "#0e8a4a" }}
                >
                  <span className="text-2xl">📱</span>
                  واتساب
                </a>
                <a
                  href={tgUrl}
                  target="_blank"
                  rel="noopener"
                  className="flex flex-col items-center gap-1 rounded-2xl p-3 text-xs font-bold transition hover:scale-105"
                  style={{ background: "#0088cc33", color: "#0066aa" }}
                >
                  <span className="text-2xl">✈️</span>
                  تليجرام
                </a>
                <a
                  href={smsUrl}
                  className="flex flex-col items-center gap-1 rounded-2xl p-3 text-xs font-bold transition hover:scale-105"
                  style={{ background: palette.accent + "33", color: palette.primary }}
                >
                  <span className="text-2xl">💬</span>
                  رسالة
                </a>
              </div>

              <button
                onClick={copy}
                className="mt-3 flex w-full items-center justify-between gap-2 rounded-2xl border-2 p-3 text-sm font-mono"
                style={{ borderColor: palette.accent + "55" }}
              >
                <span className="truncate text-xs" style={{ color: palette.muted }}>
                  {url}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold" style={{ color: palette.primary }}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "تم" : "انسخ"}
                </span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
