import { NextRequest, NextResponse } from "next/server";
import { getOrderBySlug } from "@/lib/orders";
import { SITE } from "@/lib/config";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatUtc(d: Date) {
  return (
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

function esc(s: string) {
  return s.replace(/[\\,;]/g, (m) => "\\" + m).replace(/\n/g, "\\n");
}

export async function GET(_: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const order = await getOrderBySlug(slug);
  if (!order || order.status !== "paid") {
    return new NextResponse("Not found", { status: 404 });
  }

  const start = new Date(order.invitation.date);
  // Default to 8 PM local if no time specified
  start.setHours(20, 0, 0, 0);
  const end = new Date(start.getTime() + 4 * 60 * 60 * 1000); // 4 hours

  const title = `فرح ${order.invitation.groomName} و ${order.invitation.brideName}`;
  const description = `${order.invitation.message}\n\nالموعد: ${order.invitation.time}\nاللينك: ${SITE.url}/i/${order.slug}`;

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${SITE.name}//${SITE.domain}//AR`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${order.slug}@${SITE.domain}`,
    `DTSTAMP:${formatUtc(new Date())}`,
    `DTSTART:${formatUtc(start)}`,
    `DTEND:${formatUtc(end)}`,
    `SUMMARY:${esc(title)}`,
    `DESCRIPTION:${esc(description)}`,
    `LOCATION:${esc(order.invitation.venue)}`,
    `URL:${SITE.url}/i/${order.slug}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="zefaf-${order.slug}.ics"`,
    },
  });
}
