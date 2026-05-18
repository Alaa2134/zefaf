# 🤍 زفاف — منصة دعوات الأفراح الإلكترونية

> **[zefaf.online](https://zefaf.online)** — دعوة فرحك بشكل يليق بفرحتك. ٥٠٠ قالب، صور، أنيميشن، وموسيقى. بـ ٥٠ ج بس.

## 🚀 انشر الموقع (نقرة واحدة)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAlaa2134%2F-&project-name=zefaf&env=ADMIN_PASSWORD,NEXT_PUBLIC_SITE_URL&envDescription=ADMIN_PASSWORD%20%D9%83%D9%84%D9%85%D8%A9%20%D8%B3%D8%B1%20%D9%84%D9%88%D8%AD%D8%A9%20%D8%A7%D9%84%D8%A3%D8%AF%D9%85%D9%86%20%E2%80%94%20NEXT_PUBLIC_SITE_URL%20%D9%87%D9%88%20https%3A%2F%2Fzefaf.online)

## ✨ مميزات المنصة

- **٥٠٠ قالب أنيق** مولّدة من ٢٥ تصميم أساسي × ٢٠ لوحة ألوان (Classic, Modern, Royal, Floral, Islamic, Pharaonic, Vintage…)
- **معاينة فورية** — العريس يرفع صوره ويشوف الدعوة بشكلها قبل ما يدفع
- **علامة مائية على المعاينة** — مفيش حد يقدر يسرق التصميم
- **أنيميشن** — ورود، قلوب، شرارات، ستائر، ألعاب نارية
- **موسيقى خلفية** اختيارية (عود، بيانو، زفّة شعبية، قراءة قرآن)
- **عدّاد تنازلي** ليوم الفرح
- **ألقاب** (أستاذ، مهندس، دكتور، آنسة، الحاج، إلخ) — افتراضياً: أستاذ + آنسة
- **RSVP وعدّاد ضيوف** — تعرف مين هيحضر ومين لأ
- **لينك خاص** بكل دعوة (`zefaf.online/i/<slug>`)
- **توقيع &quot;صُنع بواسطة زفاف&quot;** في آخر كل دعوة + لينك للمنصة → traffic مجاني
- **إزالة التوقيع بـ ٣٠٠ ج** — upsell على العرسان اللي عايزين تجربة بالكامل
- **دفع يدوي** عبر فودافون كاش / إنستا باي + رفع إيصال + تفعيل أدمن
- **SEO جاهز** — sitemap.xml + robots.txt + Open Graph + Twitter cards

## 🌐 الدومين

المنصة على **[zefaf.online](https://zefaf.online)**. اللينكات الجاهزة:
- `zefaf.online` — الصفحة الرئيسية
- `zefaf.online/templates` — كل القوالب
- `zefaf.online/templates/t001` — قالب معيّن
- `zefaf.online/editor/t001` — محرر الدعوة
- `zefaf.online/i/<slug>` — صفحة دعوة عريس مفعّلة (للضيوف)
- `zefaf.online/admin` — لوحة الإدارة

## 🏗️ المعمارية (أقل تكلفة ممكنة)

| الطبقة | التقنية | السبب |
|---------|----------|------|
| Frontend | Next.js 15 (App Router) | Free tier على Vercel، fits static + dynamic |
| Styling | Tailwind CSS 3 | بدون CSS runtime — أخف ممكن |
| Animations | Framer Motion | smooth و tree-shakeable |
| State | Zustand + localStorage | مفيش server state للـ drafts |
| DB | JSON file (MVP) → Supabase | مجاني للـ 500MB |
| Storage (صور) | base64 inline (MVP) → Supabase Storage | مفيش CDN charges في البداية |
| Hosting | Vercel free tier | ١٠٠ جيجا bandwidth شهرياً |
| Auth Admin | Cookie + ENV password | مفيش حسابات للمستخدمين أصلاً |
| Notifications (لاحقاً) | Telegram bot | مجاني تماماً للأدمن |

## 💰 حسبة الربح والخسارة

### التكاليف الشهرية

| العنصر | عند 0–100 طلب/شهر | عند 500 طلب/شهر | عند 2000 طلب/شهر |
|--------|-------------------|------------------|-------------------|
| Vercel | مجاني | مجاني | $20 (≈1,000 ج) |
| Supabase | مجاني (500MB) | $25 (≈1,250 ج) | $25 |
| Domain `.online` | تم الشراء بالفعل ✅ | — | — |
| **إجمالي** | **~0 ج** | **~1,300 ج** | **~3,300 ج** |

### الإيرادات

| السيناريو | الطلبات/شهر | الإيراد (٥٠ ج) | upsell (٣٠٠ ج × 10%) | إجمالي شهري | صافي ربح |
|-----------|--------------|------------------|------------------------|--------------|----------|
| محافظ | 50 | 2,500 ج | 1,500 ج | 4,000 ج | **4,000 ج** |
| متوسط | 200 | 10,000 ج | 6,000 ج | 16,000 ج | **15,000 ج** |
| نشط | 500 | 25,000 ج | 15,000 ج | 40,000 ج | **38,700 ج** |
| viral | 2000 | 100,000 ج | 60,000 ج | 160,000 ج | **156,700 ج** |

### نقطة التعادل
**0 دعوات** — الدومين متدفع، Vercel + Supabase Free Tier ≈ 0 ج/شهر. كل دعوة بعدها صافي ربح ≈ 50 ج.

## 🚀 كيف تجيب ٣٠٠ عريس في الشهر الأول

1. **Instagram Reels** — صورة قبل/بعد للدعوة الورق vs الإلكترونية. Hashtags: `#دعوة_فرحي #كوشة_2026 #zefaf_online`
2. **TikTok** — فيديوهات &quot;خلي دعوتك تخطف العين&quot; مع موسيقى ترند
3. **فيسبوك** — جروبات الأفراح (يا عرسان مصر، دليل العرسان، اخطبتي إزاي)
4. **WhatsApp Status** — كل عريس استخدم المنصة، الدعوة بتحتوي لينك &quot;صُنع بواسطة زفاف&quot; → كل ضيف ممكن يكون عريس قادم
5. **Affiliate** — مع wedding planners — عمولة 10 ج على كل دعوة عبر كودهم
6. **Influencer marketing** — يا فضل شاهين / كريم نيشن — دعوة مجانية مقابل review
7. **SEO** — استهدف كلمات: "دعوة فرح إلكترونية"، "كروت أفراح اونلاين"، "دعوة فرح بصور"
8. **Google Ads** — أنفق ٥٠٠ ج/شهر يكفي يجيب ٣٠–٥٠ عريس (CPA ≈ ١٠–١٥ ج)
9. **Domain SEO advantage** — `zefaf.online` exact-match keyword لـ "زفاف" → ranking أسرع

## 🎯 خطوات لتنقل المشروع لنقلة محترمة

1. **Supabase migration** — انقل من JSON file لـ Supabase Postgres (RLS policies)
2. **Image compression** — استخدم `sharp` لضغط الصور قبل التخزين → نوفر storage
3. **Templates expansion** — كل ٣ شهور أضف ٥ base templates جدد (5 × 20 palettes = 100 قالب جديد)
4. **Telegram bot** — تنبيه فوري على تليفونك كل طلب جديد
5. **WhatsApp Business API** — auto-reply &quot;استلمنا طلبك&quot; (مجاني تحت ١٠٠٠ رسالة/شهر)
6. **Affiliate program** — كل مستخدم يجيب 3 أصحاب يدفعوا، الدعوة بتاعته تتفعل مجاناً
7. **Gift cards** — العريس يهدي دعوة لصاحبه (engagement boost)
8. **Premium plans لاحقاً**:
   - Basic: ٥٠ ج (الحالي)
   - Premium: ١٢٠ ج (بدون توقيع + موسيقى مخصصة + إحصائيات RSVP)
   - VIP: ٣٠٠ ج (Premium + خرايط GPS + سجل مدعوين)

## 🔐 الأمان

- كلمة سر الأدمن في `.env` (مش في الكود) → `ADMIN_PASSWORD=...`
- Cookie الأدمن `httpOnly + sameSite=lax` + secure في الإنتاج
- الإيصالات مرفوعة كـ base64 (للـ MVP) — في الإنتاج انقلها لـ Supabase Storage مع signed URLs
- مقترح: استخدم Cloudflare Turnstile قدّام نموذج الـ checkout عشان تمنع الـ bots

## 🛠️ التشغيل المحلي

```bash
npm install
cp .env.example .env
# عدّل ADMIN_PASSWORD
npm run dev
```

افتح:
- `http://localhost:3000` — الصفحة الرئيسية
- `http://localhost:3000/templates` — كل القوالب
- `http://localhost:3000/admin/login` — لوحة الأدمن (كلمة السر الافتراضية: `zefaf2026`)

## 🌐 النشر على Vercel + ربط zefaf.online

1. Push الكود لـ GitHub
2. ادخل [vercel.com](https://vercel.com) → Import الـ repo
3. اضف environment variables:
   - `ADMIN_PASSWORD` — كلمة سر قوية
   - `NEXT_PUBLIC_SITE_URL=https://zefaf.online`
4. Deploy → هتحصل على لينك `<project>.vercel.app`
5. في Vercel → Settings → Domains → Add `zefaf.online` + `www.zefaf.online`
6. Vercel هيدّيك DNS records (A و CNAME) — حطّهم عند مسجل الدومين (Namecheap/GoDaddy/إلخ)
7. استنى 5–30 دقيقة ⇒ SSL + الموقع شغال على zefaf.online

## 📋 الطلبات الحالية (JSON file)

في النسخة الحالية الطلبات تتخزن في `/tmp/zefaf-orders.json`. **مهم**: في الإنتاج على Vercel، الـ `/tmp` بيتمسح مع كل deploy، فلازم تنقل لـ Supabase قبل ما تطلق المنصة لجمهور حقيقي.

## 🗂️ هيكل المشروع

```
src/
├── app/
│   ├── page.tsx                 # الصفحة الرئيسية
│   ├── layout.tsx               # OG/Twitter/SEO metadata
│   ├── sitemap.ts               # /sitemap.xml لمحركات البحث
│   ├── robots.ts                # /robots.txt
│   ├── templates/               # قائمة القوالب
│   ├── editor/[templateId]/     # محرر الدعوة
│   ├── checkout/[id]/           # صفحة الدفع اليدوي
│   ├── i/[slug]/                # صفحة الدعوة العامة
│   ├── admin/                   # لوحة الأدمن
│   └── api/                     # نقاط API
├── components/
│   ├── TemplatePreview.tsx      # عرض القالب (مع كل اللاي آوت)
│   ├── TemplateOrnament.tsx     # الزخارف (SVG)
│   ├── TemplateAnimation.tsx    # الأنيميشن (ورود، قلوب…)
│   ├── EditorClient.tsx         # محرر الدعوة الكامل
│   ├── InvitationView.tsx       # صفحة العرض النهائي للضيوف
│   ├── Countdown.tsx            # عدّاد تنازلي
│   ├── RsvpForm.tsx             # نموذج RSVP
│   └── Logo.tsx                 # لوجو زفاف
└── lib/
    ├── templates.ts             # توليد الـ ٥٠٠ قالب
    ├── orders.ts                # CRUD الطلبات
    ├── store.ts                 # Zustand drafts
    ├── config.ts                # ثوابت المنصة (الدومين، الأسعار، الدفع)
    └── admin.ts                 # auth الأدمن
```

---

**صنع بحب في مصر 🤍 — [zefaf.online](https://zefaf.online)**
