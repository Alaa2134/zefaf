import type { Metadata } from "next";
import { Cairo, Amiri, Aref_Ruqaa } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  variable: "--font-amiri",
  weight: ["400", "700"],
  display: "swap",
});

const aref = Aref_Ruqaa({
  subsets: ["arabic"],
  variable: "--font-aref",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zefaf.online"),
  title: {
    default: "زفاف • منصة دعوات الأفراح الإلكترونية",
    template: "%s — زفاف",
  },
  description:
    "صمّم دعوة فرحك في دقائق — ٥٠٠ قالب فاخر، صور حقيقية، أنيميشن وموسيقى، ولينك خاص بدعوتك تشاركه مع كل أحبابك. على zefaf.online",
  keywords: [
    "دعوة فرح",
    "دعوة فرح إلكترونية",
    "كروت أفراح",
    "دعوة زفاف",
    "زفاف",
    "زفة",
    "zefaf",
    "wedding invitation",
    "Egypt wedding",
    "دعوة زفاف مصر",
  ],
  alternates: {
    canonical: "https://zefaf.online",
  },
  openGraph: {
    title: "زفاف • دعوة فرحك بشكل يليق بفرحتك",
    description: "٥٠٠ قالب راقي • أنيميشن • موسيقى • RSVP • ٥٠ ج فقط",
    type: "website",
    locale: "ar_EG",
    url: "https://zefaf.online",
    siteName: "زفاف",
  },
  twitter: {
    card: "summary_large_image",
    title: "زفاف • منصة دعوات الأفراح الإلكترونية",
    description: "٥٠٠ قالب راقي • أنيميشن • موسيقى • RSVP • ٥٠ ج فقط",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${amiri.variable} ${aref.variable}`}>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
