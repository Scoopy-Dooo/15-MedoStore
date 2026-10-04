# دليل النشر والاستضافة
# Deployment Guide

<div dir="rtl">

---

## 🚀 نظرة عامة

هذا الدليل يشرح كيفية نشر مشروع Medo Store على منصات الاستضافة المختلفة.

---

## 📋 المتطلبات الأساسية

### قبل البدء
```
✅ Node.js v18+ مثبت
✅ npm أو pnpm مثبت
✅ Git مثبت
✅ حساب على منصة الاستضافة
✅ Domain name (اختياري)
```

### ملفات مطلوبة
```
✅ package.json
✅ vite.config.ts
✅ index.html
✅ .gitignore
```

---

## 🏗️ البناء للإنتاج

### 1. تحضير المشروع
```bash
# تأكد من نظافة الكود
npm run lint

# قم بالبناء
npm run build

# ستجد الملفات في مجلد dist/
```

### 2. اختبار البناء محليًا
```bash
npm run preview

# سيعمل على http://localhost:4173
```

### 3. التحقق من حجم الملفات
```bash
# تحقق من حجم dist/
du -sh dist/

# يجب أن يكون أقل من 1MB للحمل السريع
```

---

## ☁️ خيارات الاستضافة

### 1. Vercel (موصى به) ⭐

#### المميزات
- ✅ استضافة مجانية
- ✅ نشر تلقائي من Git
- ✅ SSL مجاني
- ✅ CDN عالمي
- ✅ دعم ممتاز لـ Vite
- ✅ سهولة الإعداد

#### خطوات النشر

##### عبر Dashboard
```bash
1. اذهب إلى https://vercel.com
2. سجل دخول بـ GitHub
3. انقر Import Project
4. اختر مشروعك
5. Framework Preset: Vite
6. انقر Deploy
```

##### عبر CLI
```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# النشر
vercel

# النشر للإنتاج
vercel --prod
```

#### إعدادات مخصصة
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

---

### 2. Netlify

#### المميزات
- ✅ استضافة مجانية
- ✅ نشر مستمر
- ✅ SSL مجاني
- ✅ Forms مدمج
- ✅ Functions support

#### خطوات النشر

##### عبر Dashboard
```bash
1. اذهب إلى https://netlify.com
2. New site from Git
3. اربط GitHub
4. Build command: npm run build
5. Publish directory: dist
6. Deploy site
```

##### عبر CLI
```bash
# تثبيت Netlify CLI
npm install -g netlify-cli

# تسجيل الدخول
netlify login

# تهيئة
netlify init

# النشر
netlify deploy --prod
```

#### إعدادات مخصصة
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### 3. GitHub Pages

#### المميزات
- ✅ مجاني تمامًا
- ✅ استضافة مباشرة من GitHub
- ✅ سهل الإعداد

#### خطوات النشر

##### تحديث vite.config.ts
```typescript
// vite.config.ts
export default defineConfig({
  base: '/medo-store/', // اسم المشروع على GitHub
  plugins: [react()],
  // ... باقي الإعدادات
});
```

##### تثبيت gh-pages
```bash
npm install --save-dev gh-pages
```

##### إضافة سكريبتات
```json
// package.json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

##### النشر
```bash
npm run deploy
```

##### إعدادات Repository
```
1. اذهب إلى Settings
2. Pages
3. Source: gh-pages branch
4. Save
```

---

### 4. Firebase Hosting

#### المميزات
- ✅ CDN سريع
- ✅ SSL مجاني
- ✅ تكامل مع Firebase
- ✅ دعم ممتاز

#### خطوات النشر

##### تثبيت Firebase Tools
```bash
npm install -g firebase-tools
```

##### تسجيل الدخول
```bash
firebase login
```

##### تهيئة المشروع
```bash
firebase init

# اختر Hosting
# Public directory: dist
# Single-page app: Yes
# GitHub integration: Optional
```

##### البناء والنشر
```bash
npm run build
firebase deploy
```

#### إعدادات مخصصة
```json
// firebase.json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

### 5. AWS S3 + CloudFront

#### المميزات
- ✅ قابل للتوسع
- ✅ موثوق جدًا
- ✅ تكامل AWS
- ✅ أداء ممتاز

#### خطوات النشر

##### إنشاء S3 Bucket
```bash
1. اذهب إلى AWS Console
2. S3 Service
3. Create bucket
4. اسم: medo-store
5. Region: اختر أقرب منطقة
6. Unblock public access
7. Create
```

##### إعدادات Bucket
```json
// Bucket Policy
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::medo-store/*"
    }
  ]
}
```

##### رفع الملفات
```bash
# تثبيت AWS CLI
# https://aws.amazon.com/cli/

# البناء
npm run build

# الرفع
aws s3 sync dist/ s3://medo-store --delete
```

##### إعداد CloudFront (CDN)
```
1. اذهب إلى CloudFront
2. Create Distribution
3. Origin: S3 bucket
4. Default Root Object: index.html
5. Create
```

---

## 🌐 ربط Domain مخصص

### Vercel
```bash
1. Project Settings
2. Domains
3. Add Domain
4. Enter your domain
5. Configure DNS (ستحصل على التعليمات)
```

### Netlify
```bash
1. Site Settings
2. Domain Management
3. Add Custom Domain
4. اتبع التعليمات
```

### CloudFlare (موصى به)
```bash
1. أضف موقعك إلى CloudFlare
2. غير Nameservers عند المزود
3. انتظر التفعيل (قد يستغرق 24 ساعة)
4. ستحصل على SSL تلقائي
```

---

## 🔒 إعدادات SSL/HTTPS

### تفعيل HTTPS
معظم المنصات توفر SSL مجاني تلقائيًا:
- ✅ Vercel: تلقائي
- ✅ Netlify: تلقائي
- ✅ GitHub Pages: تلقائي
- ✅ Firebase: تلقائي

### Let's Encrypt (للخوادم المخصصة)
```bash
# تثبيت Certbot
sudo apt-get install certbot

# الحصول على شهادة
sudo certbot certonly --webroot -w /path/to/dist -d yourdomain.com
```

---

## ⚙️ متغيرات البيئة

### للتطوير
```bash
# .env.development
VITE_API_URL=http://localhost:3000/api
VITE_WHATSAPP_NUMBER=249908180432
```

### للإنتاج
```bash
# .env.production
VITE_API_URL=https://api.medostore.com
VITE_WHATSAPP_NUMBER=249908180432
```

### في Vercel
```
Dashboard → Settings → Environment Variables
```

### في Netlify
```
Site settings → Build & deploy → Environment
```

---

## 📊 إعداد Analytics

### Google Analytics
```html
<!-- في index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### Vercel Analytics
```bash
npm install @vercel/analytics

# في main.tsx
import { Analytics } from '@vercel/analytics/react';

<Analytics />
```

---

## 🔍 تحسين SEO

### Meta Tags
```html
<!-- في index.html -->
<head>
  <title>Medo Store - أفضل متجر شحن ألعاب في السودان</title>
  <meta name="description" content="اشحن شدات PUBG وجواهر Free Fire بسرعة وأمان" />
  <meta name="keywords" content="شحن ألعاب, PUBG, Free Fire, السودان" />
  
  <!-- Open Graph -->
  <meta property="og:title" content="Medo Store" />
  <meta property="og:description" content="أفضل متجر شحن ألعاب" />
  <meta property="og:image" content="/og-image.jpg" />
  <meta property="og:url" content="https://medostore.com" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Medo Store" />
  <meta name="twitter:description" content="أفضل متجر شحن ألعاب" />
  <meta name="twitter:image" content="/twitter-image.jpg" />
</head>
```

### Sitemap
```xml
<!-- public/sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://medostore.com/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://medostore.com/games</loc>
    <priority>0.8</priority>
  </url>
</urlset>
```

### Robots.txt
```txt
# public/robots.txt
User-agent: *
Allow: /
Sitemap: https://medostore.com/sitemap.xml
```

---

## 🚨 استكشاف الأخطاء

### خطأ: Build Failed
```bash
# نظف الكاش
rm -rf node_modules
rm package-lock.json
npm install

# حاول مرة أخرى
npm run build
```

### خطأ: 404 على Refresh
```javascript
// أضف rewrite rules
// Vercel: vercel.json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}

// Netlify: _redirects في public/
/*    /index.html   200
```

### خطأ: Assets لا تظهر
```typescript
// تحقق من base في vite.config.ts
base: '/' // للـ root domain
base: '/medo-store/' // للـ subdirectory
```

---

## 📈 مراقبة الأداء

### Lighthouse
```bash
# تشغيل Lighthouse
lighthouse https://medostore.com --view
```

### الأهداف
```
Performance: 90+
Accessibility: 90+
Best Practices: 90+
SEO: 90+
```

### أدوات مفيدة
- PageSpeed Insights
- GTmetrix
- WebPageTest
- Pingdom

---

## 💾 النسخ الاحتياطي

### استراتيجية النسخ الاحتياطي

#### يومي
- النسخ الاحتياطي التلقائي عبر Git
- Push إلى GitHub يوميًا

#### أسبوعي
- نسخة من قاعدة البيانات (عند الإضافة)
- نسخة من الملفات المرفوعة

#### شهري
- نسخة كاملة من المشروع
- توثيق التغييرات

### أدوات النسخ الاحتياطي
```bash
# Git
git push origin main

# Database (للمستقبل)
pg_dump dbname > backup.sql

# Files
tar -czf backup.tar.gz dist/
```

---

## 🔄 التحديثات

### عملية التحديث

#### 1. اختبار محلي
```bash
git checkout -b update/version-x.x.x
# قم بالتحديثات
npm run build
npm run preview
# اختبر جيدًا
```

#### 2. Push للتجريب
```bash
git add .
git commit -m "Update to v x.x.x"
git push origin update/version-x.x.x
# انشر على بيئة تجريبية
```

#### 3. الدمج والنشر
```bash
git checkout main
git merge update/version-x.x.x
git push origin main
# سيتم النشر تلقائيًا
```

---

## ✅ Checklist النشر

### قبل النشر
- [ ] اختبار محلي شامل
- [ ] مراجعة الكود
- [ ] تحديث الوثائق
- [ ] اختبار على أجهزة متعددة
- [ ] مراجعة الأمان
- [ ] تحسين الأداء
- [ ] تحديث الإصدار

### بعد النشر
- [ ] اختبار الموقع المباشر
- [ ] التحقق من Analytics
- [ ] مراقبة الأخطاء
- [ ] جمع Feedback
- [ ] توثيق المشاكل

---

## 📞 الدعم

### بحاجة لمساعدة؟
- واتساب: 249908180432
- GitHub Issues
- Email: (قريبًا)

---

</div>

## 🎊 تهانينا!

موقعك الآن مباشر على الإنترنت! 🚀

**آخر تحديث**: 2024-01-XX
**الإصدار**: 1.0
