import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SITE } from "@/lib/config";

export const metadata = {
  title: "سياسة الخصوصية",
  description: "كيف نحمي بياناتك على منصة زفاف",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-display text-3xl font-bold text-ink-900 sm:text-4xl">سياسة الخصوصية</h1>
        <p className="mt-2 text-sm text-ink-500">آخر تحديث: مايو ٢٠٢٦</p>

        <article className="prose mt-8 space-y-6 text-ink-700">
          <Section title="١. البيانات اللي بنجمعها">
            <ul className="list-inside list-disc space-y-1">
              <li>اسم العريس والعروسة</li>
              <li>تاريخ ومكان الفرح</li>
              <li>الصور التي ترفعها (تخزن في Supabase Storage المشفر)</li>
              <li>رقم الواتساب للتواصل (اختياري)</li>
              <li>صورة إيصال الدفع</li>
            </ul>
          </Section>

          <Section title="٢. كيف نستخدم بياناتك">
            <p>
              نستخدم بياناتك <strong>فقط</strong> لتشغيل خدمتك:
            </p>
            <ul className="list-inside list-disc space-y-1">
              <li>إنشاء دعوة الفرح وعرضها للضيوف</li>
              <li>التواصل معك لتأكيد التفعيل أو في حالة وجود مشكلة في الدفع</li>
              <li>إدارة طلبات الـ RSVP من الضيوف</li>
            </ul>
            <p>
              <strong>لا نبيع بياناتك ولا نشاركها مع أي طرف ثالث</strong> لأغراض تسويقية.
            </p>
          </Section>

          <Section title="٣. حماية البيانات">
            <ul className="list-inside list-disc space-y-1">
              <li>كل البيانات مخزنة على Supabase مع تشفير في الراحة والنقل</li>
              <li>كلمات سر الأدمن مشفرة بـ bcrypt</li>
              <li>لينكات الدعوة فيها slug عشوائي صعب التخمين</li>
              <li>صور الإيصالات تظهر فقط للأدمن، لا تظهر للضيوف</li>
            </ul>
          </Section>

          <Section title="٤. ملفات الكوكيز">
            <p>
              نستخدم كوكيز ضرورية فقط:
            </p>
            <ul className="list-inside list-disc space-y-1">
              <li>كوكي للحفاظ على جلسة الأدمن</li>
              <li>تخزين محلي (localStorage) للحفاظ على مسودة دعوتك أثناء التصميم</li>
            </ul>
            <p>لا نستخدم كوكيز تتبع إعلانية من أطراف ثالثة.</p>
          </Section>

          <Section title="٥. حقوقك">
            <ul className="list-inside list-disc space-y-1">
              <li>الحق في الاطلاع على بياناتك</li>
              <li>الحق في طلب تعديل أو حذف بياناتك</li>
              <li>الحق في الحصول على نسخة من دعوتك</li>
            </ul>
            <p>للممارسة أي من هذه الحقوق، تواصل معنا على {SITE.contact.email}.</p>
          </Section>

          <Section title="٦. مدة الاحتفاظ بالبيانات">
            <p>
              نحتفظ ببيانات الدعوة والـ RSVP لمدة عام واحد بعد تاريخ الفرح. ممكن تطلب حذف دعوتك في
              أي وقت.
            </p>
          </Section>

          <Section title="٧. التواصل">
            <p>
              لأي استفسار عن الخصوصية:
              <br />
              ✉️ {SITE.contact.email}
              <br />
              📱 {SITE.contact.phone}
            </p>
          </Section>
        </article>
      </div>
      <Footer />
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl font-bold text-ink-900">{title}</h2>
      <div className="mt-2 leading-relaxed">{children}</div>
    </section>
  );
}
