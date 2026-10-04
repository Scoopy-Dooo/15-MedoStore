# Steering Files & Hooks Guide
# دليل ملفات التوجيه والـ Hooks

<div dir="rtl">

---

## 📚 ملفات Steering المُنشأة

تم إنشاء 3 ملفات steering شاملة لتوجيه التطوير:

### 1. project-overview.md
**النوع**: `inclusion: auto` (يُحمّل تلقائياً)

**المحتوى**:
- نظرة عامة على المشروع
- التقنيات المستخدمة
- هيكل المشروع
- الميزات الحالية
- الألعاب المتوفرة
- نظام التصميم
- خارطة الطريق للنسخة 2.0
- معايير التطوير
- أوامر سريعة

**متى يُستخدم**: يُحمّل تلقائياً مع كل conversation للإطلاع على سياق المشروع

---

### 2. development-workflow.md
**النوع**: `inclusion: auto` (يُحمّل تلقائياً)

**المحتوى**:
- روتين التطوير اليومي
- تنسيق رسائل الـ Commit
- استراتيجية الفروع (Branches)
- قائمة مراجعة الكود
- استراتيجية الاختبار
- مهام التطوير الشائعة
- أفضل ممارسات الأداء
- نصائح التصحيح
- أفضل ممارسات Git
- إجراءات الطوارئ

**متى يُستخدم**: يُحمّل تلقائياً لتوجيه عملية التطوير اليومية

---

### 3. v2-backend-guide.md
**النوع**: `inclusion: manual` (يُحمّل يدوياً عند الحاجة)

**المحتوى**:
- بنية الـ Backend
- تصميم قاعدة البيانات
- تصميم API Endpoints
- نظام المصادقة (Authentication)
- تكامل الدفع (Payment)
- إشعارات البريد الإلكتروني
- استراتيجية الـ Caching
- معالجة الأخطاء
- رفع الملفات
- متغيرات البيئة
- الاختبار

**متى يُستخدم**: عند البدء في تطوير الـ Backend للنسخة 2.0

---

## 🪝 Hooks المُنشأة

تم إنشاء 6 hooks لتسهيل عملية التطوير:

### 1. Pre-Commit Quality Check ✅
**ID**: `pre-commit-check`
**الحدث**: `promptSubmit`

يفحص جودة الكود قبل كل تعديل

### 2. Update CHANGELOG Reminder ✅
**ID**: `update-changelog-reminder`
**الحدث**: `promptSubmit`

يذكر بتحديث CHANGELOG عند الميزات الجديدة

### 3. Review Data File Changes ✅
**ID**: `review-data-changes`
**الحدث**: `fileEdited`
**الملفات**: `src/app/data/*.ts`

يراجع تغييرات ملفات البيانات

### 4. Theme Compatibility Check ✅
**ID**: `theme-compatibility-check`
**الحدث**: `fileEdited`
**الملفات**: `src/styles/*.css,src/**/*.tsx`

يذكر باختبار الثيمات

### 5. Document New Components ✅
**ID**: `document-new-components`
**الحدث**: `fileCreated`
**الملفات**: `src/app/components/*.tsx,src/app/pages/*.tsx`

يذكر بتوثيق المكونات الجديدة

### 6. Security & Performance Review ✅
**ID**: `security-performance-review`
**الحدث**: `preToolUse`
**الأدوات**: `write`

يراجع الأمان والأداء قبل الكتابة

---

## 🎯 كيفية الاستخدام

### Steering Files تُحمّل تلقائياً
ملفان يُحملان مع كل conversation:
- `project-overview.md`
- `development-workflow.md`

### Backend Guide يُحمّل يدوياً
عند الحاجة لدليل الـ Backend:
```
"احتاج دليل Backend"
```

### Hooks تعمل تلقائياً
جميع الـ 6 hooks نشطة وتعمل في الخلفية

---

## ✅ Checklist

### ملفات Steering
- [x] project-overview.md (auto)
- [x] development-workflow.md (auto)
- [x] v2-backend-guide.md (manual)

### Hooks
- [x] Pre-Commit Quality Check
- [x] Update CHANGELOG Reminder  
- [x] Review Data File Changes
- [x] Theme Compatibility Check
- [x] Document New Components
- [x] Security & Performance Review

---

</div>

## 🎉 كل شيء جاهز!

الآن لديك نظام كامل من:
- ✅ 3 ملفات Steering
- ✅ 6 Hooks نشطة
- ✅ دليل شامل

**جاهز للتطوير نحو v2.0.0! 🚀**

---

**المسؤول**: Kiro AI + Mohamed Saad
**الحالة**: ✅ Active
