import Link from "next/link";
import { Heart, Phone, Send } from "lucide-react";
import { Logo } from "./Logo";
import { SITE } from "@/lib/config";
import { arabicNumber } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="border-t border-gold-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-3 text-sm text-ink-600">{SITE.description}</p>
          </div>
          <div>
            <h4 className="font-bold text-ink-900">المنصة</h4>
            <ul className="mt-3 space-y-2 text-sm text-ink-600">
              <li><Link href="/templates" className="hover:text-gold-700">القوالب ({arabicNumber(SITE.totalTemplates)})</Link></li>
              <li><Link href="/dashboard" className="hover:text-gold-700">دعوتي</Link></li>
              <li><Link href="/admin/login" className="hover:text-gold-700">دخول الأدمن</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-ink-900">اتواصل معانا</h4>
            <ul className="mt-3 space-y-2 text-sm text-ink-600">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> {SITE.contact.phone}
              </li>
              <li>
                <a
                  href={`https://wa.me/${SITE.contact.whatsapp}`}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2 hover:text-gold-700"
                >
                  <Send className="h-4 w-4" /> واتساب مباشر
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-ink-900">طرق الدفع</h4>
            <ul className="mt-3 space-y-2 text-sm text-ink-600">
              <li>📱 فودافون كاش: {SITE.payment.vodafoneCash}</li>
              <li>💳 إنستا باي: {SITE.payment.instapayHandle}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-gold-100 pt-6 sm:flex-row">
          <p className="text-xs text-ink-500">
            صنع بحب <Heart className="inline h-3 w-3 fill-rose-500 text-rose-500" /> في مصر — © {new Date().getFullYear()} {SITE.name}
          </p>
          <div className="flex gap-4 text-xs text-ink-500">
            <Link href="/terms" className="hover:text-gold-700">الشروط</Link>
            <Link href="/privacy" className="hover:text-gold-700">الخصوصية</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
