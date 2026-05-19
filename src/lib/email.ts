// Resend integration — silently no-ops without RESEND_API_KEY.
// Sign up free at resend.com → API Keys → create one (3000 emails/month free).

import type { Order } from "./orders-types";
import { SITE } from "./config";

const FROM = process.env.RESEND_FROM || `Zefaf <noreply@${SITE.domain}>`;

async function send(to: string, subject: string, html: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key || !to) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    });
  } catch (e) {
    console.error("Resend send failed", e);
  }
}

function shell(content: string): string {
  return `
  <div dir="rtl" style="font-family:'Cairo',Tahoma,sans-serif;background:#faf6ee;padding:24px;">
    <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:18px;padding:32px;box-shadow:0 8px 24px rgba(0,0,0,0.08);">
      <h1 style="background:linear-gradient(135deg,#d4961c,#e64d72);-webkit-background-clip:text;background-clip:text;color:transparent;text-align:center;font-size:28px;margin:0 0 8px;">زفاف</h1>
      <p style="text-align:center;color:#8d7a55;margin:0 0 24px;font-size:13px;">دعوة فرحك بشكل يليق بفرحتك</p>
      ${content}
      <div style="margin-top:32px;text-align:center;color:#9ca3af;font-size:12px;border-top:1px solid #eee;padding-top:16px;">
        <a href="https://${SITE.domain}" style="color:#b67616;text-decoration:none;">${SITE.domain}</a>
        — صنع بحب في مصر
      </div>
    </div>
  </div>`;
}

export async function emailOrderReceived(order: Order): Promise<void> {
  if (!order.customer.email) return;
  await send(
    order.customer.email,
    `استلمنا طلب دعوتك يا ${order.invitation.groomName} 🤍`,
    shell(`
      <p style="color:#333;font-size:16px;">أهلاً ${order.customer.name || "بيك"} 🤍</p>
      <p style="color:#555;line-height:1.8;">
        استلمنا طلبك لدعوة فرحك مع ${order.invitation.brideName}.<br/>
        المبلغ المطلوب: <strong>${order.price} ج.م</strong>
      </p>
      <p style="color:#555;line-height:1.8;">
        من فضلك حوّل المبلغ على فودافون كاش <strong dir="ltr">${SITE.payment.vodafoneCash}</strong>
        أو إنستا باي <strong dir="ltr">${SITE.payment.instapayHandle}</strong>،
        وارفع لقطة من الإيصال على الموقع.
      </p>
      <div style="text-align:center;margin:24px 0;">
        <a href="https://${SITE.domain}/checkout/${order.id}" style="display:inline-block;background:linear-gradient(135deg,#d4961c,#e64d72);color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:bold;">
          أكمل الدفع
        </a>
      </div>
    `)
  );
}

export async function emailOrderActivated(order: Order): Promise<void> {
  if (!order.customer.email) return;
  const link = `https://${SITE.domain}/i/${order.slug}`;
  await send(
    order.customer.email,
    `🎉 دعوتك مفعّلة — مبروك يا ${order.invitation.groomName}!`,
    shell(`
      <p style="color:#333;font-size:18px;text-align:center;">🎉 ألف مبروك!</p>
      <p style="color:#555;line-height:1.8;text-align:center;">
        دعوتك بقت لايف! دلوقتي تقدر تشاركها مع كل اللي تحبهم.
      </p>
      <div style="background:#faf6ee;border:1px solid #f5e08a;border-radius:12px;padding:16px;margin:16px 0;text-align:center;">
        <div style="font-size:12px;color:#8d7a55;">لينك دعوتك</div>
        <div style="font-family:monospace;font-weight:bold;color:#b67616;margin-top:4px;direction:ltr;">${link}</div>
      </div>
      <div style="text-align:center;margin:24px 0;">
        <a href="${link}" style="display:inline-block;background:linear-gradient(135deg,#d4961c,#e64d72);color:#fff;padding:12px 32px;border-radius:999px;text-decoration:none;font-weight:bold;">
          افتح دعوتي
        </a>
      </div>
    `)
  );
}
