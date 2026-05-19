import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// AI-generated invitation messages. Activates when ANTHROPIC_API_KEY is set.
// Falls back to a small library of curated messages when no key is configured.

const FALLBACK_MESSAGES: { tone: string; text: string }[] = [
  {
    tone: "classic",
    text: "بسم الله الرحمن الرحيم، وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا. يسعدنا ويشرفنا دعوتكم لمشاركتنا فرحة العمر، وأن تكونوا في استقبالنا لتكتمل سعادتنا بحضوركم.",
  },
  {
    tone: "modern",
    text: "في يوم مميز من حياتنا، يسعدنا أن نكتب أحلى فصول قصتنا بحضوركم. ندعوكم لمشاركتنا أجمل لحظات حياتنا، حضوركم هو الهدية الأغلى.",
  },
  {
    tone: "romantic",
    text: "حين تلتقي القلوب وتتحد الأرواح، تكتمل فرحتنا بكم. ندعو من نحب لمشاركتنا حفل زفافنا، لتكون ذكرى لا تنسى نحملها في قلوبنا.",
  },
  {
    tone: "elegant",
    text: "بحفظ الله ورعايته، ودعوة من القلب، يسرنا أن نشارككم فرحة زفافنا. حضوركم شرف لنا وذكرى نعتز بها مدى الحياة.",
  },
  {
    tone: "friendly",
    text: "بعد طول انتظار، جاء يومنا الكبير! يا ريت تكونوا معانا تشاركونا الفرحة وتحلوها بحضوركم. وعدًا منا بليلة لا تُنسى.",
  },
];

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const groomName = String(body?.groomName || "");
  const brideName = String(body?.brideName || "");
  const tone = String(body?.tone || "classic");

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    const match = FALLBACK_MESSAGES.find((m) => m.tone === tone) || FALLBACK_MESSAGES[0];
    return NextResponse.json({ text: match.text, ai: false });
  }

  try {
    const client = new Anthropic({ apiKey: key });
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      messages: [
        {
          role: "user",
          content: `اكتب نص دعوة زفاف باللغة العربية الفصحى (لكن مفهومة للمصريين) للعريس "${groomName}" والعروسة "${brideName}". النص يكون ${tone === "classic" ? "كلاسيكي وفيه آية قرآنية" : tone === "modern" ? "عصري وراقي" : tone === "romantic" ? "رومانسي وعاطفي" : tone === "elegant" ? "أنيق وفخم" : "ودود وبسيط"}.

الشروط:
- النص بين ٤٠-٧٠ كلمة
- يبدأ بمقدمة جميلة
- يدعو الضيوف للحضور
- لا تكتب أي توضيحات أو تنسيقات، فقط النص نفسه
- لا تستخدم أسماء غير "${groomName}" و "${brideName}"`,
        },
      ],
    });

    const text =
      response.content[0]?.type === "text" ? response.content[0].text.trim() : "";

    return NextResponse.json({ text, ai: true });
  } catch (e) {
    console.error("Anthropic call failed", e);
    const match = FALLBACK_MESSAGES.find((m) => m.tone === tone) || FALLBACK_MESSAGES[0];
    return NextResponse.json({ text: match.text, ai: false });
  }
}
