import Link from "next/link";
import { Sparkles, Heart, Music, Image as ImageIcon, Send, Star, Check } from "lucide-react";
import { TEMPLATES, TOTAL_TEMPLATES } from "@/lib/templates";
import { SITE } from "@/lib/config";
import { TemplateCard } from "@/components/TemplateCard";
import { arabicNumber, formatEgp } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroPreview } from "@/components/HeroPreview";
import { UrgencyBar } from "@/components/UrgencyBar";
import { WEDDING_DETAILS, COUPLE_PHOTOS } from "@/lib/stock-photos";

export default function HomePage() {
  const featured = TEMPLATES.filter((t) => t.featured).slice(0, 8);
  const popular = [...TEMPLATES].sort((a, b) => b.popularity - a.popularity).slice(0, 12);

  return (
    <main className="min-h-screen">
      <UrgencyBar />
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden px-4 pb-20 pt-12 sm:pt-20">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gold-50 via-rose-50/40 to-transparent" />
        <div className="absolute -right-32 top-20 -z-10 h-96 w-96 rounded-full bg-gold-200/30 blur-3xl" />
        <div className="absolute -left-32 top-40 -z-10 h-96 w-96 rounded-full bg-rose-200/30 blur-3xl" />

        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <div className="text-center lg:text-right">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm shadow-md ring-1 ring-gold-200">
              <Sparkles className="h-4 w-4 text-gold-500" />
              <span className="font-medium text-ink-700">
                {arabicNumber(TOTAL_TEMPLATES)} قالب فاخر • السعر الترويجي
              </span>
            </div>

            <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-ink-900 sm:text-6xl">
              دعوة فرحك
              <br />
              <span className="bg-gradient-to-r from-gold-600 via-rose-600 to-gold-600 bg-clip-text text-transparent">
                بشكل يليق بفرحتك
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg text-ink-600 lg:mx-0">
              ارفع صورتك مع عروستك واختار من بين <strong>{arabicNumber(TOTAL_TEMPLATES)}</strong>{" "}
              قالب راقي. شوف دعوتك بشكلها النهائي قبل ما تشتري. كل ده بـ{" "}
              <strong className="text-gold-600">{formatEgp(SITE.pricePerInvite)}</strong> بس.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Link
                href="/templates"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-gold-600 to-rose-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-gold-500/30 transition-all hover:scale-105 hover:shadow-2xl"
              >
                ابدأ صمم دعوتك
                <Sparkles className="h-5 w-5 transition-transform group-hover:rotate-12" />
              </Link>
              <Link
                href="/templates/t001/demo"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-4 text-base font-bold text-ink-700 shadow-md ring-1 ring-ink-100 transition hover:bg-ink-50"
              >
                شوف دعوة كاملة 👁
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 border-y border-gold-100 py-6 text-center lg:max-w-md">
              <Stat value={arabicNumber(TOTAL_TEMPLATES)} label="قالب أنيق" />
              <Stat value="٥ دقائق" label="وتجهز دعوتك" />
              <Stat value="∞" label="مشاركات لاند" />
            </div>
          </div>

          <div className="relative">
            <HeroPreview />
          </div>
        </div>
      </section>

      {/* PHOTO MARQUEE — real wedding moments */}
      <section className="overflow-hidden bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-sm text-ink-500">صور حقيقية من أفراح صممت دعواتها على زفاف</p>
        </div>
        <div className="mt-6 flex gap-3 overflow-hidden">
          <div className="flex gap-3 animate-[marquee_40s_linear_infinite]">
            {[...COUPLE_PHOTOS, ...WEDDING_DETAILS, ...COUPLE_PHOTOS].map((src, i) => (
              <div
                key={i}
                className="relative h-56 w-44 flex-none overflow-hidden rounded-2xl shadow-lg"
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* "YOUR PHOTO HERE" — emotional hook */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 -z-10">
          <img src={WEDDING_DETAILS[3]} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        </div>
        <div className="mx-auto max-w-3xl px-4 text-center text-white">
          <h2 className="font-display text-3xl font-bold leading-tight sm:text-5xl">
            تخيل صورتك أنت وعروستك
            <br />
            <span className="bg-gradient-to-l from-gold-300 to-rose-300 bg-clip-text text-transparent">
              في قالب فاخر زي ده
            </span>
          </h2>
          <p className="mt-6 text-lg opacity-90">
            ارفع صورة وحدة، شوف نتيجتها على فور، ادفع لو عجبتك. بدون مفاجآت، بدون تعقيد.
          </p>
          <Link
            href="/templates/t001/demo"
            target="_blank"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-ink-900 shadow-2xl transition hover:scale-105"
          >
            شوف دعوة كاملة دلوقتي
            <Sparkles className="h-5 w-5 text-gold-600" />
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <div className="ornament-divider mx-auto max-w-md">
              <span className="text-2xl">❀</span>
            </div>
            <h2 className="mt-4 font-display text-3xl font-bold text-ink-900 sm:text-5xl">
              فرحتك تستاهل اللي يليق بيها
            </h2>
            <p className="mt-3 text-ink-600">
              كل اللي محتاجه علشان تعمل دعوة فرح إلكترونية ساحرة
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Feature
              icon={<ImageIcon className="h-6 w-6" />}
              title="ارفع صورك"
              text="ارفع صورة العريس والعروسة، شوفهم على الدعوة قبل ما تدفع"
            />
            <Feature
              icon={<Sparkles className="h-6 w-6" />}
              title="٥٠٠ قالب"
              text="من الكلاسيك للمودرن، الفرعوني والإسلامي، اختار اللي يعجبك"
            />
            <Feature
              icon={<Music className="h-6 w-6" />}
              title="موسيقى وأنيميشن"
              text="ورود طايرة، قلوب، شرارات، وموسيقى تليق بفرحك"
            />
            <Feature
              icon={<Send className="h-6 w-6" />}
              title="لينك خاص + RSVP"
              text="ابعت اللينك للضيوف، شوف مين هيحضر ومين مش هيحضر"
            />
          </div>
        </div>
      </section>

      {/* FEATURED TEMPLATES */}
      <section id="examples" className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold text-ink-900 sm:text-4xl">
                قوالب مميّزة
              </h2>
              <p className="mt-2 text-ink-600">القوالب الأكثر طلباً من العرسان دلوقتي</p>
            </div>
            <Link
              href="/templates"
              className="hidden text-sm font-bold text-gold-600 hover:text-gold-700 sm:inline-flex"
            >
              شوف الكل ←
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((t, i) => (
              <TemplateCard key={t.id} template={t} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-gradient-to-b from-gold-50/40 to-rose-50/40 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center font-display text-3xl font-bold text-ink-900 sm:text-4xl">
            ٤ خطوات وفرحك يبقى في إيد كل أحبابك
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Step n={1} title="اختار قالب" text="من بين ٥٠٠ قالب، اختار اللي يعجبك" />
            <Step n={2} title="ارفع صورك" text="صورة العريس والعروسة + بيانات الفرح" />
            <Step n={3} title="ادفع ٥٠ ج" text="فودافون كاش أو إنستا باي، ابعت إيصال الدفع" />
            <Step n={4} title="استلم اللينك" text="نفعّل دعوتك ونبعتلك لينك تشاركه" />
          </div>
        </div>
      </section>

      {/* POPULAR */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-display text-3xl font-bold text-ink-900 sm:text-4xl">
            الأكثر طلباً
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {popular.map((t, i) => (
              <TemplateCard key={t.id} template={t} index={i} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-8 py-4 text-base font-bold text-white shadow-xl transition hover:bg-ink-800"
            >
              تصفح كل الـ {arabicNumber(TOTAL_TEMPLATES)} قالب
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center font-display text-3xl font-bold text-ink-900 sm:text-4xl">
            عرسان قبل اختاروا زفاف
          </h2>
          <p className="mt-2 text-center text-ink-600">+ {arabicNumber(1247)} دعوة اتفعلت آخر ٣ شهور</p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "أحمد و سارة",
                text: "والله مكنتش متخيل إن دعوة إلكترونية تطلع بالشكل ده! كل أهلي قالولي تحفة، وحفظت فلوس الكروت الورق.",
                photo: COUPLE_PHOTOS[0],
              },
              {
                name: "محمود و دينا",
                text: "اللينك بعتته في الواتساب وكل ضيوفنا فتحوه على طول. الـ RSVP ساعدني أعرف عدد الضيوف بدون مكالمات.",
                photo: COUPLE_PHOTOS[1],
              },
              {
                name: "كريم و رنا",
                text: "الباقة الـ VIP استاهلت كل قرش. الموسيقى المخصصة ومعرض الصور خلّى الدعوة تحفة فنية.",
                photo: COUPLE_PHOTOS[2],
              },
            ].map((t, i) => (
              <div
                key={i}
                className="rounded-2xl bg-gradient-to-b from-gold-50/40 to-rose-50/30 p-6 ring-1 ring-gold-100"
              >
                <div className="flex items-center gap-3">
                  <img src={t.photo} alt={t.name} className="h-14 w-14 rounded-full object-cover ring-2 ring-gold-200" />
                  <div>
                    <div className="font-bold text-ink-900">{t.name}</div>
                    <div className="flex gap-0.5 text-gold-500">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className="h-3 w-3 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink-700">&ldquo;{t.text}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING + GUARANTEE */}
      <section className="bg-ink-900 py-20 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-display text-3xl font-bold sm:text-5xl">
            <span className="bg-gold-gradient bg-clip-text text-transparent">سعر واحد</span> لكل القوالب
          </h2>
          <p className="mt-3 text-ink-300">بدون اشتراكات، بدون مفاجآت</p>

          <div className="mx-auto mt-10 max-w-md rounded-3xl bg-gradient-to-b from-ink-800 to-ink-900 p-8 ring-1 ring-gold-500/30">
            <div className="text-7xl font-bold text-gold-400">
              ٥٠
              <span className="text-2xl text-ink-300"> ج.م</span>
            </div>
            <div className="mt-2 text-ink-300">للدعوة الواحدة - دفعة واحدة</div>

            <ul className="mt-6 space-y-3 text-right">
              {[
                "وصول لكل الـ ٥٠٠ قالب",
                "صور للعريس والعروسة",
                "أنيميشن وموسيقى",
                "لينك خاص لدعوتك",
                "RSVP وعدّاد ضيوف",
                "تعديل غير محدود قبل التفعيل",
                "دعوة فعّالة مدى الحياة",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-ink-100">
                  <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-gold-500/20 text-gold-400">
                    <Check className="h-3 w-3" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/templates"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-gradient px-6 py-4 font-bold text-ink-900 shadow-xl transition hover:scale-105"
            >
              ابدأ دلوقتي
              <Heart className="h-5 w-5 fill-current" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-bold text-gold-600">{value}</div>
      <div className="text-xs text-ink-500">{label}</div>
    </div>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="group rounded-2xl bg-gradient-to-b from-white to-gold-50/30 p-6 ring-1 ring-gold-100 transition hover:-translate-y-1 hover:shadow-xl">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold-gradient text-white shadow-md">
        {icon}
      </div>
      <h3 className="mt-4 font-bold text-ink-900">{title}</h3>
      <p className="mt-2 text-sm text-ink-600">{text}</p>
    </div>
  );
}

function Step({ n, title, text }: { n: number; title: string; text: string }) {
  return (
    <div className="relative">
      <div className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-gold-100">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-gradient text-2xl font-bold text-white shadow-lg">
          {arabicNumber(n)}
        </div>
        <h3 className="mt-4 font-bold text-ink-900">{title}</h3>
        <p className="mt-1 text-sm text-ink-600">{text}</p>
      </div>
    </div>
  );
}
