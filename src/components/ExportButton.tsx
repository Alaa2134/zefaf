"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import type { ColorPalette } from "@/lib/templates";

interface Props {
  groomName: string;
  brideName: string;
  palette: ColorPalette;
}

export function ExportButton({ groomName, brideName, palette }: Props) {
  const [busy, setBusy] = useState(false);

  async function exportPng() {
    setBusy(true);
    try {
      // Capture the entire document body as a PNG (browser-side)
      const { toPng } = await import("html-to-image");
      const node = document.body;
      const dataUrl = await toPng(node, {
        pixelRatio: 1.6,
        cacheBust: true,
        backgroundColor: palette.bg,
        filter: (n) => {
          // Skip the floating controls and the export button itself
          if (n instanceof HTMLElement) {
            return !n.dataset?.exportSkip;
          }
          return true;
        },
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `zefaf-${groomName}-${brideName}.png`;
      a.click();
    } catch (e) {
      alert("حصلت مشكلة في التحميل، حاول تاني");
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={exportPng}
      disabled={busy}
      data-export-skip
      className="rounded-full p-3 shadow-2xl backdrop-blur transition hover:scale-110 disabled:opacity-50"
      style={{ background: palette.surface, color: palette.primary }}
      aria-label="تحميل الدعوة كصورة"
    >
      {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
    </button>
  );
}
