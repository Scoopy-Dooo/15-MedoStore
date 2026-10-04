# 🚀 دليل النشر الكامل - Medo Store
# Full Deployment Guide with Neon Database

---

## 📋 جدول المحتويات

1. [إعداد Neon Database](#1-إعداد-neon-database)
2. [إعداد Backend المحلي](#2-إعداد-backend-المحلي)
3. [إعداد Frontend المحلي](#3-إعداد-frontend-المحلي)
4. [نشر Backend على Render](#4-نشر-backend-على-render)
5. [نشر Frontend على Vercel](#5-نشر-frontend-على-vercel)
6. [الاختبار النهائي](#6-الاختبار-النهائي)
7. [استكشاف الأخطاء](#7-استكشاف-الأخطاء)

---

## 1. إعداد Neon Database

### الخطوة 1.1: إنشاء حساب Neon 🎯

1. **افتح موقع Neon:**
   ```
   https://neon.tech
   ```

2. **اضغط "Sign Up"**
   - يمكنك التسجيل بـ GitHub أو Google
   - مجاني 100%، لا يحتاج بطاقة ائتمانية ✅

3. **تأكيد البريد الإلكتروني**
   - افتح بريدك وفعّل الحساب

### الخطوة 1.2: إنشاء Project جديد 📦

1. **بعد تسجيل الدخول، اضغط "Create Project"**

2. **املأ البيانات:**
   ```
   Project Name: medo-store-production
   Region: اختر الأقرب لك (Frankfurt أو US East)
   Postgres Version: 16 (الأحدث)
   ```

3. **اضغط "Create Project"**
   - انتظر 10-20 ثانية للإنشاء ⏱️

### الخطوة 1.3: الحصول على Connection String 🔗

1. **بعد إنشاء المشروع، ستظهر لك صفحة Dashboard**

2. **ستجد "Connection Details" أو "Connection String"**
   
3. **انسخ الـ Connection String (Pooled):**
   ```
   postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```

4. **⚠️ مهم جداً:**
   - احفظ هذا الـ Connection String في ملف نصي
   - لن تراه مرة أخرى!
   - إذا نسيته، اضغط "Reset Password" وانسخ الجديد

---

## 2. إعداد Backend المحلي

### الخطوة 2.1: تثبيت Dependencies 📦

افتح Terminal في مجلد المشروع:

```bash
# ادخل مجلد backend
cd backend

# ثبت جميع الـ packages
npm install
```

**⏱️ سيأخذ 2-3 دقائق**

### الخطوة 2.2: إعداد ملف .env ⚙️

1. **انسخ ملف .env.example:**

   ```bash
   # Windows (CMD)
   copy .env.example .env

   # Windows (PowerShell)
   cp .env.example .env
   ```

2. **افتح ملف `.env` بأي محرر نصوص وعدّل:**

   ```env
   # البيئة
   NODE_ENV=development

   # منفذ الخادم
   PORT=5000

   # 🔥 قاعدة البيانات - احط الـ Connection String من Neon هنا
   DATABASE_URL="postgresql://username:password@ep-xxx.aws.neon.tech/neondb?sslmode=require"

   # 🔐 أسرار JWT - غيّر هذه القيم لقيم عشوائية طويلة
   JWT_SECRET=medo_2024_super_secret_change_this_to_random_string_xyz789
   JWT_REFRESH_SECRET=medo_refresh_2024_change_to_another_random_abc456
   JWT_EXPIRES_IN=24h
   JWT_REFRESH_EXPIRES_IN=7d

   # CORS - عناوين Frontend المسموحة
   CORS_ORIGIN=http://localhost:5173

   # رقم واتساب
   WHATSAPP_NUMBER=249908180432

   # Admin credentials
   ADMIN_EMAIL=admin@medostore.com
   ADMIN_PASSWORD=Admin@Medo2024!
   ADMIN_NAME=Mohamed Saad
   ```

**⚠️ مهم:**
- ✅ غيّر `DATABASE_URL` للـ Connection String من Neon
- ✅ غيّر `JWT_SECRET` لنص عشوائي طويل (30+ حرف)
- ✅ غيّر `ADMIN_PASSWORD` لكلمة مرور قوية

### الخطوة 2.3: إعداد قاعدة البيانات 🗄️

```bash
# 1. توليد Prisma Client
npm run db:generate
```

**⏱️ انتظر 10-15 ثانية**  
**النتيجة:** `✔ Generated Prisma Client`

```bash
# 2. إنشاء الجداول في Neon Database
npm run db:push
```

**⏱️ انتظر 20-30 ثانية**  
**سيظهر:**
```
Your database is now in sync with your Prisma schema. Done in 2.5s

✔ Generated Prisma Client
```

**✅ إذا لم تظهر أخطاء، قاعدة البيانات جاهزة!**

### الخطوة 2.4: تشغيل Backend 🚀

```bash
npm run dev
```

**النتيجة المتوقعة:**
```
Server is running on http://localhost:5000
Environment: development
Database connected successfully
```

**✅ Backend شغال محلياً!**

### الخطوة 2.5: اختبار Backend 🧪

افتح متصفح جديد:

```
http://localhost:5000
```

**يجب تظهر رسالة:**
```json
{
  "message": "Medo Store API is running",
  "version": "2.0.0"
}
```

**✅ Backend يشتغل بنجاح!**

---

## 3. إعداد Frontend المحلي

### الخطوة 3.1: تثبيت Dependencies 📦

افتح Terminal **جديد** (خلي Backend شغال):

```bash
# ارجع للمجلد الرئيسي
cd ..

# ثبت packages
npm install
```

**⏱️ سيأخذ 2-3 دقائق**

### الخطوة 3.2: تشغيل Frontend 🎨

```bash
npm run dev
```

**النتيجة المتوقعة:**
```
VITE v6.3.5  ready in 543 ms

➜  Local:   http://localhost:5173/
➜  press h + enter to show help
```

### الخطوة 3.3: فتح الموقع 🌐

افتح المتصفح:
```
http://localhost:5173
```

**✅ يجب يفتح موقع Medo Store كامل مع:**
- 🎮 الألعاب الخمسة
- 🌙 Dark/Light Mode
- 🌍 Arabic/English
- ✨ جميع الميزات

---

## 4. نشر Backend على Render

### الخطوة 4.1: إعداد GitHub Repository 📂

1. **إذا ما عندك Git مفعّل:**

   ```bash
   # في المجلد الرئيسي
   git init
   git add .
   git commit -m "feat: Initial commit - Medo Store v2.0.0"
   ```

2. **إنشاء Repository على GitHub:**
   - روح https://github.com
   - اضغط "+" → "New Repository"
   - اسم الـ repo: `medo-store`
   - **لا تختار** "Add README" أو ".gitignore"
   - اضغط "Create Repository"

3. **ارفع الكود:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/medo-store.git
   git branch -M main
   git push -u origin main
   ```

### الخطوة 4.2: إنشاء حساب Render ☁️

1. **افتح:** https://render.com

2. **اضغط "Get Started for Free"**
   - سجل بـ GitHub (الأسهل والأسرع)
   - سيطلب صلاحيات للـ repositories - وافق

### الخطوة 4.3: نشر Backend 🚀

1. **من Dashboard، اضغط "New +" → "Web Service"**

2. **اربط GitHub Repository:**
   - ابحث عن `medo-store`
   - اضغط "Connect"

3. **املأ الإعدادات:**

   ```
   Name: medo-store-backend
   Region: Frankfurt (EU Central) أو Oregon (US West)
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install && npm run db:generate && npm run build
   Start Command: npm start
   Instance Type: Free
   ```

4. **Environment Variables (مهم جداً):** 🔐
   
   اضغط "Advanced" → "Add Environment Variable"
   
   أضف واحدة واحدة:

   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=postgresql://...from-neon...?sslmode=require
   JWT_SECRET=same-as-local-env-file
   JWT_REFRESH_SECRET=same-as-local-env-file
   JWT_EXPIRES_IN=24h
   JWT_REFRESH_EXPIRES_IN=7d
   CORS_ORIGIN=*
   WHATSAPP_NUMBER=249908180432
   ADMIN_EMAIL=admin@medostore.com
   ADMIN_PASSWORD=Admin@Medo2024!
   ADMIN_NAME=Mohamed Saad
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   LOG_LEVEL=info
   ```

   **⚠️ استخدم نفس القيم من `.env` المحلي!**

5. **اضغط "Create Web Service"**

**⏱️ الـ Deploy سيأخذ 5-10 دقائق الأول مرة**

### الخطوة 4.4: التحقق من Backend ✅

بعد انتهاء الـ Deploy (لما يتحول Status إلى "Live"):

1. **انسخ الـ URL من الأعلى:**
   ```
   https://medo-store-backend.onrender.com
   ```

2. **اختبر في المتصفح:**
   ```
   https://medo-store-backend.onrender.com
   ```

   **يجب ترجع:**
   ```json
   {
     "message": "Medo Store API is running",
     "version": "2.0.0"
   }
   ```

**✅ Backend منشور بنجاح!**

---

## 5. نشر Frontend على Vercel

### الخطوة 5.1: إنشاء حساب Vercel ☁️

1. **افتح:** https://vercel.com

2. **اضغط "Sign Up"**
   - سجل بـ GitHub

3. **سيطلب صلاحيات - وافق**

### الخطوة 5.2: ربط Backend API 🔗

قبل النشر، Frontend يحتاج يعرف عنوان Backend:

1. **في المجلد الرئيسي، أنشئ ملف `.env`:**

   ```bash
   # في المجلد الرئيسي (ليس backend/)
   ```

2. **احط فيه:**
   ```env
   VITE_API_URL=https://medo-store-backend.onrender.com/api
   ```

   **⚠️ غيّر الـ URL لعنوان Backend تبعك من Render**

3. **Commit التغييرات:**
   ```bash
   git add .
   git commit -m "feat: Add production API URL"
   git push
   ```

### الخطوة 5.3: نشر على Vercel 🚀

1. **من Vercel Dashboard، اضغط "Add New..." → "Project"**

2. **Import Git Repository:**
   - ابحث عن `medo-store`
   - اضغط "Import"

3. **Configure Project:**
   ```
   Framework Preset: Vite
   Root Directory: ./
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Environment Variables:**
   
   اضغط "Environment Variables" وأضف:
   ```
   Name: VITE_API_URL
   Value: https://medo-store-backend.onrender.com/api
   ```

5. **اضغط "Deploy"**

**⏱️ سيأخذ 2-3 دقائق**

### الخطوة 5.4: الحصول على Frontend URL 🌐

بعد انتهاء الـ Deploy:

```
https://medo-store-xxx-xxx.vercel.app
```

**انسخ هذا الـ URL!**

---

## 6. تحديث CORS في Backend

**⚠️ مهم جداً:** Backend يحتاج يعرف عنوان Frontend المنشور

### الخطوة 6.1: تحديث Environment Variables في Render

1. **روح لـ Render Dashboard**

2. **افتح "medo-store-backend" service**

3. **اضغط "Environment" من القائمة اليسرى**

4. **عدّل `CORS_ORIGIN`:**
   
   **امسح القيمة القديمة (`*`) واحط:**
   ```
   https://medo-store-xxx-xxx.vercel.app
   ```
   
   **⚠️ احط عنوان موقعك من Vercel بدقة - بدون / في النهاية**

5. **اضغط "Save Changes"**

6. **Render سيعمل Re-deploy تلقائياً**

**⏱️ انتظر 3-5 دقائق**

---

## 7. تشغيل Database Migration على Render

**مهم:** تأكد إن الجداول موجودة في Production Database:

1. **في Render Dashboard → medo-store-backend**

2. **اضغط "Shell" من القائمة اليسرى**

3. **في الـ Shell، اكتب:**
   ```bash
   npm run db:push
   ```

4. **انتظر حتى تظهر:** `Your database is now in sync`

**✅ Database جاهز في Production!**

---

## 8. الاختبار النهائي

### الخطوة 8.1: اختبار Frontend 🧪

1. **افتح موقعك المنشور:**
   ```
   https://medo-store-xxx.vercel.app
   ```

2. **تحقق من:**
   - ✅ الصفحة الرئيسية تفتح
   - ✅ الألعاب تظهر
   - ✅ الباقات تظهر
   - ✅ Dark/Light Mode يشتغل
   - ✅ Arabic/English يشتغل

### الخطوة 8.2: اختبار Backend API 🔌

افتح في متصفح جديد:

```
https://medo-store-backend.onrender.com/api/games
```

**يجب ترجع قائمة الألعاب (أو array فاضي):**
```json
{
  "success": true,
  "data": {
    "games": [],
    "pagination": {...}
  }
}
```

---

## 9. استكشاف الأخطاء

### ❌ مشكلة: Backend لا يتصل بـ Database

**الأعراض:**
```
Error: P1001: Can't reach database server
```

**الحل:**
1. تحقق من DATABASE_URL في Render Environment Variables
2. يجب ينتهي بـ `?sslmode=require`
3. جرب نسخ الـ Connection String مرة أخرى من Neon
4. تأكد إنك استخدمت "Pooled Connection"

---

### ❌ مشكلة: CORS Error في Frontend

**الأعراض:**
```
Access to fetch at '...' has been blocked by CORS policy
```

**الحل:**
1. في Render → Environment Variables
2. تأكد من `CORS_ORIGIN` = عنوان Vercel بالضبط
3. **لا توجد / في النهاية**
4. **https:// موجود**
5. Save → انتظر Re-deploy

---

### ❌ مشكلة: Frontend لا يتصل بـ Backend

**الأعراض:**
- Errors في Console
- API calls تفشل

**الحل:**
1. تحقق من `.env` في المشروع:
   ```env
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
2. تأكد إنك عملت commit و push:
   ```bash
   git add .
   git commit -m "fix: Update API URL"
   git push
   ```
3. Vercel سيعمل re-deploy تلقائياً

---

### ❌ مشكلة: Render Build Failed

**الحل:**
```
تحقق من:
1. Root Directory = backend ✅
2. Build Command = npm install && npm run db:generate && npm run build
3. Start Command = npm start
4. Runtime = Node
```

---

### ❌ مشكلة: Database Tables غير موجودة

**الحل:**
```bash
# في Render Shell:
npm run db:push

# أو محلياً مع Neon URL:
cd backend
DATABASE_URL="..." npm run db:push
```

---

### ❌ مشكلة: Render Service ينام (Cold Start)

**الأعراض:**
- أول request يأخذ 30-60 ثانية

**التفسير:**
- Render Free Tier ينوّم الـ service بعد 15 دقيقة بدون استخدام

**الحل:**
1. انتظر - أول request سيستيقظ الـ service
2. أو Upgrade لـ Paid Plan ($7/شهر) = يبقى شغال دائماً

---

## 10. ملاحظات مهمة

### 🔒 الأمان

1. **غيّر JWT Secrets في Production:**
   ```
   استخدم strings عشوائية طويلة جداً
   لا تستخدم أمثلة من التوثيق
   ```

2. **غيّر Admin Password:**
   ```
   استخدم password قوي: حروف كبيرة + صغيرة + أرقام + رموز
   مثال: Medo@Admin#2024!Secure
   ```

3. **لا تشارك `.env`:**
   ```
   ملف .env موجود في .gitignore
   لا ترفعه لـ GitHub أبداً
   ```

### ⚡ الأداء

**Render Free Tier:**
- ينام بعد 15 دقيقة ⏰
- أول request بعد النوم = 30-60 ثانية 🐌
- حل: Paid plan = $7/شهر

**Neon Free Tier:**
- Database تنام بعد 5 دقائق
- تستيقظ تلقائياً (ثواني)
- حد أقصى: 0.5 GB storage

**Vercel Free Tier:**
- 100 GB bandwidth شهرياً
- لا ينام أبداً ✅
- سريع جداً 🚀

### 💰 التكاليف

| الخدمة | Free Tier | مناسب لـ |
|--------|-----------|----------|
| Neon DB | 0.5 GB | البداية ✅ |
| Render | Sleep بعد 15 دقيقة | Testing |
| Vercel | 100 GB bandwidth | Production ✅ |

**إجمالي: 0$ في البداية! 🎉**

---

## 11. الخطوات التالية

### بعد النشر الناجح: 🎯

1. ✅ **أضف Domain مخصص:**
   - اشتري domain (Namecheap: ~$10/سنة)
   - اربطه بـ Vercel (Settings → Domains)

2. ✅ **فعّل SSL:**
   - Vercel يعطيك SSL مجاني تلقائياً ✅

3. ✅ **أضف Analytics:**
   - Vercel Analytics (مجاني)
   - أو Google Analytics

4. ✅ **Setup Monitoring:**
   - Uptime Robot (مجاني) للمراقبة
   - Sentry للـ errors

5. ✅ **أضف Email Service:**
   - SendGrid (100 email/day مجاناً)
   - أو Resend

6. ✅ **Payment Gateway:**
   - حسب طلبك في النهاية ��

---

## 12. Checklist النشر

قبل ما تقول "خلاص"، تحقق من:

- [ ] ✅ حساب Neon مُنشأ
- [ ] ✅ Database مُعد ومتصل
- [ ] ✅ Backend يشتغل محلياً
- [ ] ✅ Frontend يشتغل محلياً
- [ ] ✅ GitHub Repository موجود
- [ ] ✅ Backend منشور على Render
- [ ] ✅ Frontend منشور على Vercel
- [ ] ✅ CORS مُعدّل بشكل صحيح
- [ ] ✅ Environment Variables صحيحة
- [ ] ✅ Database migrations تمت
- [ ] ✅ اختبار كامل للموقع

---

## 📞 الدعم

إذا واجهت مشكلة:

1. ✅ راجع قسم "استكشاف الأخطاء"
2. ✅ تحقق من Logs:
   - Render: Dashboard → Logs
   - Vercel: Project → Deployments → Logs
3. ✅ تواصل معي

---

## 🎉 تهانينا!

إذا وصلت هنا ومشى كل شيء، يبقى موقعك منشور ويشتغل في الإنترنت! 🚀

**موقعك الآن:**
- ✅ Live على الإنترنت
- ✅ Database في السحابة
- ✅ Backend API شغال
- ✅ Frontend سريع
- ✅ مجاني بالكامل

**بالتوفيق! 💪**

---

**آخر تحديث:** 2026-10-03  
**الإصدار:** 2.0.0  
**المطور:** Mohamed Saad (Scoopy Doo) + Kiro AI  
**الموقع:** https://medostore.com (قريباً 😉)
