import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SITE } from "@/lib/config";

export const metadata = {
  title: "شروط الاستخدام",
  description: "شروط استخدام منصة زفاف لدعوات الأفراح الإلكترونية",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-display text-3xl font-bold text-ink-900 sm:text-4xl">شروط الاستخدام</h1>
        <p className="mt-2 text-sm text-ink-500">آخر تحديث: مايو ٢٠٢٦</p>

        <article className="prose mt-8 space-y-6 text-ink-700">
          <Section title="١. قبول الشروط">
            <p>
              باستخدامك لمنصة {SITE.name} ({SITE.domain})، فإنك توافق على الالتزام بهذه الشروط
              والأحكام. لو مش موافق على أي بند، يرجى عدم استخدام المنصة.
            </p>
          </Section>

          <Section title="٢. الخدمة">
            <p>
              {SITE.name} منصة إلكترونية لتصميم وإرسال دعوات الأفراح الرقمية. نقدم {SITE.totalTemplates} قالب
              فاخر بأسعار تبدأ من {SITE.pricePerInvite} ج.م للدعوة الواحدة.
            </p>
          </Section>

          <Section title="٣. الدفع">
            <p>
              الدفع يتم يدوياً عبر فودافون كاش أو إنستا باي. يتم تفعيل الدعوة بعد التأكد من وصول
              المبلغ ومراجعة إيصال الدفع، عادةً في خلال ساعات قليلة.
            </p>
            <p>
              <strong>جميع المدفوعات نهائية وغير قابلة للاسترداد</strong> بعد تفعيل الدعوة، حيث إنها
              منتج رقمي مخصص.
            </p>
          </Section>

          <Section title="٤. المحتوى والصور">
            <p>
              المستخدم مسؤول عن المحتوى والصور التي يرفعها. يجب أن يكون له الحق القانوني في
              استخدام هذه الصور والمعلومات.
            </p>
            <p>
              يحتفظ المستخدم بكامل حقوق الملكية لصوره ومعلوماته. {SITE.name} لا تستخدم بياناتك
              لأي غرض غير تشغيل الخدمة.
            </p>
          </Section>

          <Section title="٥. الاستخدام الممنوع">
            <ul className="list-inside list-disc space-y-1">
              <li>رفع محتوى مخل بالآداب العامة أو يخالف القانون المصري</li>
              <li>إنشاء دعوات وهمية أو احتيالية</li>
              <li>محاولة اختراق المنصة أو تعطيل خدمتها</li>
              <li>استخدام المنصة لأغراض غير الأفراح والمناسبات الاجتماعية المماثلة</li>
            </ul>
          </Section>

          <Section title="٦. التوافر">
            <p>
              نسعى لتوفير الخدمة بنسبة ٩٩.٩٪، لكن قد تنقطع لظروف صيانة أو تقنية. لا نتحمل مسؤولية
              عدم وصول الدعوة لضيف معين بسبب مشاكل في شبكة الإنترنت لديه.
            </p>
          </Section>

          <Section title="٧. التعديلات">
            <p>
              نحتفظ بالحق في تعديل هذه الشروط في أي وقت. الاستخدام المستمر للمنصة يعني الموافقة على
              التعديلات.
            </p>
          </Section>

          <Section title="٨. التواصل">
            <p>
              لأي استفسار أو شكوى، تواصل معنا على:
              <br />
              📱 واتساب: {SITE.contact.phone}
              <br />
              ✉️ {SITE.contact.email}
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
