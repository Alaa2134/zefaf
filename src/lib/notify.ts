// Telegram bot notifier — only active when TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID env vars are set.
// Free, instant. Setup:
// 1) Open Telegram, message @BotFather, send /newbot → follow prompts → get TELEGRAM_BOT_TOKEN
// 2) Open Telegram, message your new bot once (say "hi"), then visit
//    https://api.telegram.org/bot<TOKEN>/getUpdates → copy your chat id
// 3) Add both to Vercel env vars and redeploy.

import type { Order } from "./orders-types";
import { SITE } from "./config";

function escape(s: string | undefined | null): string {
  if (!s) return "";
  return s.replace(/[_*\[\]()~`>#+=|{}.!-]/g, (m) => "\\" + m);
}

export async function notifyTelegram(text: string, opts?: { buttons?: { text: string; url: string }[] }): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  try {
    const body: Record<string, unknown> = {
      chat_id: chatId,
      text,
      parse_mode: "MarkdownV2",
      disable_web_page_preview: true,
    };
    if (opts?.buttons?.length) {
      body.reply_markup = {
        inline_keyboard: [opts.buttons.map((b) => ({ text: b.text, url: b.url }))],
      };
    }
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (e) {
    console.error("Telegram notify failed", e);
  }
}

export async function notifyNewOrder(order: Order): Promise<void> {
  const lines = [
    "🆕 *طلب جديد*",
    `👰‍♂️ ${escape(order.invitation.groomName)} ❤ ${escape(order.invitation.brideName)}`,
    `🆔 \`${escape(order.id)}\``,
    `💰 ${escape(String(order.price))} ج`,
    `📋 القالب: ${escape(order.templateId)}`,
  ];
  await notifyTelegram(lines.join("\n"));
}

export async function notifyReceiptUploaded(order: Order): Promise<void> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || SITE.url;
  const lines = [
    "💳 *إيصال دفع جديد — يحتاج مراجعة*",
    `👰‍♂️ ${escape(order.invitation.groomName)} ❤ ${escape(order.invitation.brideName)}`,
    `🆔 \`${escape(order.id)}\``,
    `📱 ${escape(order.customer.phone)}`,
    `💰 ${escape(String(order.price))} ج`,
    `💳 ${escape(order.receipt?.method === "instapay" ? "إنستا باي" : "فودافون كاش")}`,
  ];
  if (order.receipt?.note) lines.push(`📝 ${escape(order.receipt.note)}`);
  await notifyTelegram(lines.join("\n"), {
    buttons: [{ text: "افتح لوحة الأدمن", url: `${base}/admin` }],
  });
}

export async function notifyOrderActivated(order: Order): Promise<void> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || SITE.url;
  const lines = [
    "✅ *دعوة مفعّلة*",
    `👰‍♂️ ${escape(order.invitation.groomName)} ❤ ${escape(order.invitation.brideName)}`,
    `🔗 ${escape(base)}/i/${escape(order.slug)}`,
  ];
  await notifyTelegram(lines.join("\n"));
}
