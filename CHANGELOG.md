# Changelog - سجل التغييرات

<div dir="rtl">

جميع التغييرات المهمة في هذا المشروع سيتم توثيقها في هذا الملف.

يتبع التنسيق [Keep a Changelog](https://keepachangelog.com/ar/1.0.0/)،
ويلتزم المشروع بـ [Semantic Versioning](https://semver.org/lang/ar/).

---

## [Unreleased] - قيد التطوير

### تمت الإضافة ✨

#### Admin Dashboard - Statistics Page
- **feat:** صفحة إحصائيات شاملة مع grid layout متجاوب
- **feat:** بطاقات المقاييس الرئيسية (الألعاب، الباقات، الطلبات، الإيرادات)
- **feat:** قائمة أفضل 5 ألعاب حسب عدد الطلبات
- **feat:** تنبيهات الباقات منخفضة المخزون (< 10)
- **feat:** زر تحديث يدوي للبيانات
- **feat:** حالات loading مع Skeleton components
- **feat:** معالجة الأخطاء مع زر إعادة المحاولة
- **feat:** دعم ثنائي اللغة كامل للإحصائيات
- **feat:** icons ملونة لكل نوع مقياس

#### Admin Dashboard - Image Upload System
- **feat:** مكون ImageUpload مع دعم السحب والإفلات (Drag & Drop)
- **feat:** معاينة الصور قبل الرفع مع زر الإزالة
- **feat:** التحقق من نوع الملف (JPEG, PNG, WebP, GIF)
- **feat:** التحقق من حجم الملف (الحد الأقصى 5 ميجابايت)
- **feat:** مؤشر تقدم الرفع مع shadcn/ui Progress
- **feat:** useUploadImage hook مع تتبع نسبة الرفع
- **feat:** دمج ImageUpload في GameForm بدلاً من حقل URL
- **feat:** رسائل خطأ واضحة ثنائية اللغة (عربي/إنجليزي)
- **feat:** دعم كامل لـ RTL/LTR layouts

#### Admin Dashboard - Date Range Filter for Statistics
- **feat:** فلتر نطاق التاريخ في صفحة الإحصائيات
- **feat:** خيارات جاهزة: اليوم، آخر 7 أيام، آخر 30 يوماً
- **feat:** نطاق مخصص عبر shadcn/ui Calendar + Popover
- **feat:** تحديث جميع المقاييس تلقائياً عند تغيير النطاق
- **feat:** دعم ثنائي اللغة كامل للفلتر
- **feat:** مكوّن DateRangeFilter قابل لإعادة الاستخدام
- **feat:** تحديث useDashboardStats hook لقبول معاملات التاريخ

#### Admin Dashboard - Error Handling & Loading States
- **feat:** مكوّن ErrorMessage لعرض رسائل الخطأ ثنائية اللغة
- **feat:** مكوّن ErrorBoundary للإمساك بأخطاء React
- **feat:** زر إعادة المحاولة في جميع حالات الخطأ
- **feat:** skeleton loaders في جميع صفحات جلب البيانات
- **feat:** حالات loading للأزرار (spinner + disabled)
- **feat:** منع إغلاق dialogs أثناء العمليات الجارية
- **feat:** retry logic في React Query (3 مرات شبكة، 2 خادم)
- **feat:** error logging في وضع التطوير فقط

#### Admin Dashboard - Authentication & Authorization
- **feat:** فحص صلاحيات المسؤول في ProtectedAdminRoute
- **feat:** السماح بالوصول فقط لأدوار ADMIN و SUPER_ADMIN
- **feat:** تحديث admin API services مع Authorization headers تلقائية
- **feat:** معالجة 401 مع تجديد Token تلقائي
- **feat:** معالجة 403 مع تسجيل خروج وإعادة توجيه
- **feat:** التحقق التلقائي من JWT token في جميع الطلبات
- **feat:** تحديث Token تلقائياً عند انتهاء صلاحيته
- **feat:** إعادة التوجيه التلقائي عند فشل المصادقة
- **feat:** حقن Authorization header تلقائياً في جميع طلبات Admin API
- **feat:** معالجة أخطاء 401/403 مع تسجيل خروج تلقائي

#### Admin Dashboard - Packages Management Enhancements
- **feat:** نظام فلترة وترتيب شامل للباقات (Req 7.15, 7.16)
- **feat:** فلترة حسب اللعبة مع قائمة منسدلة لجميع الألعاب
- **feat:** فلترة حسب نطاق السعر (السعر الأدنى والأقصى)
- **feat:** فلترة حسب الحالة (نشط، غير نشط، الكل)
- **feat:** ترتيب حسب السعر، الكمية، أو تاريخ الإنشاء
- **feat:** معالجة الفلترة والترتيب من جانب الخادم (server-side)
- **feat:** عرض الفلاتر النشطة كـ badges قابلة للإزالة
- **feat:** زر "مسح الفلاتر" لإعادة تعيين جميع الفلاتر
- **feat:** الحفاظ على حالة الفلاتر في URL parameters
- **feat:** إضافة تبديل isPopular في جدول الباقات مع optimistic updates
- **feat:** إضافة حقل تحديث المخزون المباشر (inline stock input) مع زر الحفظ
- **feat:** تحسين UX مع التحديثات المتفائلة (optimistic updates) في useUpdatePackage
- **feat:** التحقق الكامل من صحة المدخلات لقيم المخزون (validation)
- **feat:** تنظيف تلقائي لحالة التحرير بعد التحديث الناجح
- **feat:** عرض badge تحذيري عند انخفاض المخزون (stock < 10)
- **feat:** تعطيل الحقول والأزرار أثناء عملية التحديث
- **feat:** رسائل خطأ ثنائية اللغة للمدخلات غير الصحيحة

#### Admin Dashboard - Dark Mode Support
- **feat:** دعم كامل للـ Dark Mode في صفحة إدارة الألعاب (GamesManagement)
- **feat:** تحسين قراءة النصوص في الوضع الداكن والفاتح
- **feat:** ألوان متناسقة للحدود والخلفيات في كلا الوضعين
- **feat:** تطبيق `dark:` variants على جميع عناصر الجدول والنصوص

#### Admin Dashboard - Phase 5 Complete
- **feat:** AdminLayout component مع sidebar قابل للطي و breadcrumb navigation
- **feat:** AdminSidebar component مع active route highlighting و logout confirmation
- **feat:** Dashboard home page مع stats cards و quick actions
- **feat:** دعم RTL/LTR كامل للوحة التحكم
- **feat:** Responsive design (mobile Sheet drawer, desktop collapsible sidebar)
- **feat:** Sidebar state persistence في localStorage
- **feat:** Admin routes protection مع ProtectedAdminRoute
- **feat:** Routes: /admin, /admin/games, /admin/packages, /admin/statistics
- **feat:** Integration مع React Query hooks (useDashboardStats)
- **feat:** Loading skeletons و error handling مع retry

#### Dynamic Content Integration - Phase 4 Complete  
- **feat:** Home.tsx updated لاستخدام API data بدون fallback
- **feat:** Games.tsx updated مع pagination و API integration كامل
- **feat:** GameDetail.tsx updated لاستخدام API مع loading/error states
- **feat:** تم حذف ملف البيانات الثابتة (gamesData.ts) بالكامل
- **feat:** جميع المكونات الآن تعتمد كلياً على البيانات من API
- **feat:** Loading skeletons و error handling محسّنة في جميع الصفحات
- **feat:** Loading skeletons في Home و Games pages
- **feat:** Error handling مع retry button
- **feat:** Fallback للبيانات المحفوظة عند فشل API
- **feat:** Bilingual error messages

#### React Query Integration - Phases 1-3
- **feat:** React Query setup مع QueryClient configuration
- **feat:** API service layer (games.service, packages.service, admin.service)
- **feat:** TypeScript interfaces شاملة للـ API data
- **feat:** Query hooks (useGames, useGame, usePackages, useGamePackages, useDashboardStats)
- **feat:** Mutation hooks (useCreateGame, useUpdateGame, useDeleteGame, useCreatePackage, useUpdatePackage, useDeletePackage, useUploadImage)
- **feat:** Cache invalidation strategies و optimistic updates
- **feat:** Bilingual error messages في جميع الـ hooks

#### Frontend Authentication System
- **feat:** نظام مصادقة Frontend كامل متصل بالـ Backend
- **feat:** TypeScript types للـ User, AuthState, ApiResponse
- **feat:** Axios API configuration مع interceptors
- **feat:** Auto token refresh mechanism
- **feat:** Auth Service للتواصل مع Backend API
- **feat:** AuthContext لإدارة حالة المصادقة
- **feat:** Login page مع validation كامل
- **feat:** Register page مع validation شامل
- **feat:** Forgot Password page مع success state
- **feat:** ProtectedRoute component لحماية الصفحات
- **feat:** UserMenu component في Navbar
- **feat:** تكامل Toast notifications مع sonner
- **feat:** localStorage persistence للـ tokens
- **feat:** Environment configuration (.env)
- **feat:** Routes جديدة لـ /login, /register, /forgot-password
- **feat:** ترجمات عربية وإنجليزية للـ auth pages

#### Backend Infrastructure
- **feat:** إنشاء هيكل Backend كامل مع Node.js + Express + TypeScript
- **feat:** إعداد قاعدة البيانات PostgreSQL مع Prisma ORM
- **feat:** نظام مصادقة JWT كامل مع middleware للتفويض
- **feat:** نظام معالجة الأخطاء المركزي
- **feat:** Rate limiting للحماية من DDoS
- **feat:** Logging system مع Winston
- **feat:** نموذج Database Schema كامل (11 جدول)
- **feat:** Security middleware (Helmet, CORS, Rate Limiting)
- **feat:** Environment configuration مع .env.example
- **feat:** TypeScript configuration صارم ومحسّن

#### Authentication System
- **feat:** Auth Controller كامل مع جميع الوظائف
- **feat:** Auth Service مع منطق الأعمال
- **feat:** Auth Routes مع Input Validation
- **feat:** Register, Login, Logout, Profile APIs
- **feat:** Refresh Token System
- **feat:** Forgot & Reset Password
- **feat:** Email Verification System
- **feat:** Password Hashing مع bcryptjs
- **feat:** JWT Token Generation

#### Admin Dashboard System
- **feat:** Admin Service كامل مع جميع الوظائف
- **feat:** Admin Controller مع معالجة الطلبات
- **feat:** Admin Routes محمية بـ Authorization
- **feat:** Dashboard Statistics API
- **feat:** User Management (CRUD)
- **feat:** Search & Filtering System
- **feat:** Pagination System
- **feat:** User Stats & Analytics

#### Games & Packages Management System
- **feat:** Games Service مع CRUD كامل
- **feat:** Games Controller مع جميع endpoints
- **feat:** Packages Service مع إدارة المخزون
- **feat:** Packages Controller مع التحكم الكامل
- **feat:** Slug Generation للـ SEO
- **feat:** Stock Management System (increment/decrement)
- **feat:** Popular Games & Packages APIs
- **feat:** Search & Filter بحسب السعر والفئة
- **feat:** Safe Deletion مع التحقق من الطلبات المرتبطة

#### Orders System
- **feat:** Orders Service كامل مع منطق الأعمال
- **feat:** Orders Controller مع جميع endpoints
- **feat:** Orders Routes مع Validation
- **feat:** Create Order API مع التحقق من المخزون
- **feat:** Promo Code Support مع حساب الخصم
- **feat:** Stock Management عند الطلب والإلغاء
- **feat:** Order Number Generation (MEDO-YYYYMMDD-XXXX)
- **feat:** WhatsApp Message Generator للطلبات
- **feat:** Get User Orders مع Pagination
- **feat:** Get Order by ID/Number
- **feat:** Cancel Order مع إرجاع المخزون
- **feat:** Update Order Status (Admin)
- **feat:** Get All Orders مع Search & Filter (Admin)
- **feat:** Transaction Support لضمان سلامة البيانات
- **feat:** Role-based Access Control للطلبات

#### Documentation
- **feat:** README.md شامل للـ Backend
- **feat:** BACKEND_GUIDE.md - دليل تقني
- **feat:** QUICK_START.md - دليل البدء
- **feat:** ADMIN_DASHBOARD_API.md - توثيق APIs الإدارية

### تم التحسين 🚀
- **perf:** استخدام Prisma ORM لأداء أفضل للـ queries
- **perf:** Compression middleware لضغط الـ responses
- **perf:** Connection pooling مع Prisma

### الأمان 🔒
- **security:** JWT authentication مع bcrypt لتشفير كلمات المرور
- **security:** Helmet middleware للحماية من XSS
- **security:** Rate limiting لمنع الهجمات
- **security:** Input validation middleware جاهز
- **security:** CORS configuration محكم

### مخطط للإضافة القادمة
- تطبيق Controllers و Services layers
- Routes كامل لجميع الـ endpoints
- نظام الدفع الإلكتروني
- Email service مع Nodemailer
- File upload مع Multer
- لوحة تحكم إدارية
- نظام التقييمات والمراجعات
- برنامج الإحالة والمكافآت
- إشعارات فورية
- دردشة مباشرة
- رموز ترويجية وخصومات

---

## [1.0.0] - 2024-01-XX (النسخة الحالية)

### تمت الإضافة ✨
- **واجهة المستخدم الكاملة**
  - تصميم حديث ومتجاوب بالكامل
  - دعم الوضع الداكن والفاتح
  - دعم اللغتين العربية والإنجليزية
  - رسوم متحركة سلسة باستخدام motion/react
  
- **الصفحات الرئيسية**
  - صفحة رئيسية (Home) مع قسم بطولي جذاب
  - صفحة الألعاب (Games) لعرض جميع الألعاب
  - صفحة تفاصيل اللعبة (Game Detail) لعرض الباقات
  - صفحة الجذر (Root) للتخطيط العام

- **المكونات الأساسية**
  - Navbar: شريط تنقل مع تبديل اللغة والثيم
  - Footer: تذييل شامل مع معلومات الاتصال
  - GameCard: بطاقة عرض اللعبة
  - ProductCard: بطاقة عرض المنتج/الباقة
  - WelcomeModal: نافذة ترحيب لجمع اسم المستخدم
  - WhatsAppButton: زر عائم للتواصل عبر واتساب

- **مكتبة UI Components**
  - 45+ مكون من Radix UI
  - مكونات مخصصة للاستخدام في المشروع
  - تصميم متسق عبر جميع المكونات

- **الألعاب والباقات**
  - PUBG Mobile: 5 باقات UC + 4 باقات عضوية + 2 إضافية
  - Free Fire: 4 باقات جواهر + 2 باقات عضوية
  - Telegram: نجوم، بريميوم، حل مشاكل
  - GearUp Booster: باقات اشتراك
  - TikTok: 5 باقات عملات

- **نظام الترجمة**
  - ترجمات شاملة لجميع النصوص
  - دعم RTL للعربية
  - دعم LTR للإنجليزية
  - Hook مخصص للترجمة (useTranslation)

- **إدارة الحالة**
  - Context API لإدارة الحالة العامة
  - حفظ التفضيلات في LocalStorage
  - إدارة الثيم واللغة واسم المستخدم

- **نظام الطلبات**
  - طلب مباشر عبر واتساب
  - رسائل مخصصة بناءً على اسم المستخدم
  - تنسيق تلقائي لرسالة الطلب

- **التصميم والأنماط**
  - Tailwind CSS 4.1.12
  - نظام ألوان متقدم (Dark/Light)
  - تأثيرات Glassmorphism
  - توهج نيون (Neon Glow)
  - ظلال ناعمة
  - تأثيرات hover تفاعلية

- **الأداء والتحسين**
  - بناء سريع مع Vite
  - تحسين حجم الحزمة
  - Lazy loading للصور
  - Code splitting تلقائي

### تم التحسين 🚀
- سرعة التحميل الأولي
- أداء الرسوم المتحركة
- استجابة الواجهة
- تجربة المستخدم العامة

### تم الإصلاح 🐛
- مشاكل التوافق مع المتصفحات
- مشاكل الترجمة في بعض الأقسام
- مشاكل التجاوب على الشاشات الصغيرة

---

## [0.9.0] - 2023-12-XX (Pre-release)

### تمت الإضافة
- هيكل المشروع الأساسي
- إعداد React + TypeScript + Vite
- إعداد Tailwind CSS
- المكونات الأساسية الأولى

### تم التحسين
- بنية المجلدات
- تنظيم الأكواد

---

## [0.5.0] - 2023-11-XX (Alpha)

### تمت الإضافة
- التصميم الأولي
- إعداد Git Repository
- تثبيت التبعيات الأساسية

---

## [0.1.0] - 2023-10-XX (Initial Setup)

### تمت الإضافة
- إنشاء المشروع
- إعداد البيئة التطويرية الأساسية

---

</div>

## الإصدارات القادمة

### [2.0.0] - مخطط لـ Q2-Q4 2024

#### المرحلة 1: النظام الخلفي (Backend)
```
Q2 2024:
- [ ] إعداد Node.js/Express server
- [ ] إعداد قاعدة البيانات (PostgreSQL)
- [ ] نظام المصادقة (JWT)
- [ ] API endpoints أساسية
```

#### المرحلة 2: نظام المستخدمين
```
Q2 2024:
- [ ] تسجيل المستخدمين
- [ ] تسجيل الدخول
- [ ] الحسابات الشخصية
- [ ] استعادة كلمة المرور
```

#### المرحلة 3: نظام الدفع
```
Q3 2024:
- [ ] تكامل بوابة الدفع
- [ ] معالجة المدفوعات
- [ ] الفواتير الإلكترونية
- [ ] الإيصالات التلقائية
```

#### المرحلة 4: لوحة التحكم
```
Q3 2024:
- [ ] إدارة المنتجات
- [ ] إدارة الطلبات
- [ ] تقارير المبيعات
- [ ] إدارة العملاء
- [ ] لوحة الإحصائيات
```

#### المرحلة 5: الميزات الإضافية
```
Q4 2024:
- [ ] نظام التقييمات
- [ ] برنامج الإحالة
- [ ] الإشعارات الفورية
- [ ] الدردشة المباشرة
- [ ] الرموز الترويجية
```

#### المرحلة 6: التحسينات التقنية
```
Q4 2024:
- [ ] PWA Support
- [ ] SSR (Server-Side Rendering)
- [ ] SEO Optimization
- [ ] Advanced Analytics
- [ ] Automated Testing
- [ ] CI/CD Pipeline
```

---

## أنواع التغييرات

### رموز التصنيف
- **تمت الإضافة**: ميزات جديدة
- **تم التغيير**: تغييرات في ميزات موجودة
- **تم الإيقاف**: ميزات ستُزال قريبًا
- **تمت الإزالة**: ميزات تم إزالتها
- **تم الإصلاح**: إصلاح أخطاء
- **تم التحسين**: تحسينات في الأداء
- **الأمان**: إصلاحات أمنية

---

## ملاحظات الإصدار

### نصائح للترقية من v1.0.0 إلى v2.0.0

عند إصدار النسخة 2.0.0، سيكون هناك:

1. **تغييرات كبيرة (Breaking Changes)**
   - نظام مصادقة جديد
   - بنية API مختلفة
   - تغييرات في قاعدة البيانات

2. **عملية الترحيل**
   - سكريبت ترحيل البيانات
   - تحديث التبعيات
   - إعادة تكوين الإعدادات

3. **التوافق العكسي**
   - دعم API القديم لمدة 3 أشهر
   - فترة انتقالية للمستخدمين
   - توثيق شامل للتغييرات

---

## معلومات إضافية

### الحفاظ على هذا الملف

- يتم تحديث هذا الملف مع كل إصدار جديد
- التزم بصيغة Semantic Versioning
- وثق جميع التغييرات المهمة
- أضف تاريخ الإصدار عند الإطلاق

### الإبلاغ عن المشاكل

إذا وجدت أي مشاكل:
- تواصل عبر واتساب: 249908180432
- أو أنشئ Issue على GitHub

---

**آخر تحديث**: 2024-01-XX
**المشرف**: محمد سعد (Scoopy Doo)

#### Admin Dashboard - Bilingual Support (Phase 12)
- **feat:** إضافة ترجمات شاملة للوحة التحكم (عربي/إنجليزي) في translations.ts
- **feat:** ترجمات التنقل: لوحة التحكم، إدارة الألعاب، الباقات، الإحصائيات
- **feat:** ترجمات النماذج: حقول اللعبة، الباقة، رسائل النجاح والخطأ والتحقق
- **feat:** ترجمات الجداول: رؤوس الأعمدة، حالات التحميل، الترقيم
- **feat:** ترجمات رفع الصور ونطاق التاريخ والتأكيدات
- **feat:** دعم RTL كامل في AdminLayout مع dark mode
- **feat:** تعيين document.dir تلقائياً من AppContext
- **feat:** زر تبديل اللغة في AdminSidebar
- **feat:** حفظ تفضيل اللغة في localStorage وتحميله عند البدء

#### Performance & Build Optimization
- **feat:** Code splitting لصفحات الأدمن باستخدام React.lazy() و Suspense
- **feat:** AdminPageFallback skeleton أثناء تحميل صفحات الأدمن
- **feat:** vite.config.ts مع manualChunks (vendor, query, ui, forms, admin)
- **feat:** loading="lazy" و decoding="async" لجميع صور الألعاب

#### Bug Fixes
- **fix:** إزالة staticGamesData و staticPopularProducts غير المعرَّفة من Home.tsx
- **fix:** حذف import غير مستخدم (usePackages) من Home.tsx
- **fix:** حذف ملف Games_Updated.tsx المكرر

#### Documentation
- **feat:** إنشاء .env.example مع توثيق متغيرات البيئة
- **feat:** إنشاء DEPLOYMENT_CHECKLIST.md لمراجعة النشر
