# Deployment Checklist - قائمة مراجعة النشر

## قبل النشر - Pre-deployment

### متغيرات البيئة - Environment Variables

- [ ] نسخ `.env.example` إلى `.env.production`
- [ ] تعيين `VITE_API_URL` لرابط الـ Backend الإنتاجي
- [ ] تعيين `VITE_UPLOAD_URL` لرابط رفع الملفات
- [ ] (اختياري) تعيين `VITE_CLOUDINARY_CLOUD_NAME` و `VITE_CLOUDINARY_UPLOAD_PRESET`

### بناء الإنتاج - Production Build

```bash
# تثبيت التبعيات
npm install

# بناء الإنتاج
npm run build

# معاينة البناء محلياً
npm run preview
```

### التحقق من البناء - Build Verification

- [ ] لا توجد أخطاء TypeScript
- [ ] لا توجد chunks تتجاوز 600KB
- [ ] Admin routes محملة lazily (تحقق من dist/)
- [ ] الصور تستخدم loading="lazy"

## بعد النشر - Post-deployment

### التحقق الوظيفي - Functional Verification

- [ ] الصفحة الرئيسية تحمل الألعاب من API
- [ ] صفحة الألعاب تعمل مع Pagination
- [ ] تسجيل الدخول يعمل بشكل صحيح
- [ ] لوحة التحكم تظهر فقط للمسؤولين
- [ ] إدارة الألعاب والباقات: CRUD تعمل
- [ ] رفع الصور يعمل
- [ ] صفحة الإحصائيات تعرض البيانات

### الأمان - Security

- [ ] HTTPS مفعّل
- [ ] Admin routes تُعيد توجيه غير المصرح لهم
- [ ] JWT tokens تنتهي وتُجدَّد بشكل صحيح

## المراقبة - Monitoring

- [ ] مراقبة أخطاء JavaScript في browser console
- [ ] التحقق من connectivity مع Backend
