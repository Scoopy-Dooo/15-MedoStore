# دليل المساهمة
# Contributing Guide

<div dir="rtl">

---

## 🙏 شكرًا لاهتمامك بالمساهمة في Medo Store!

نحن نرحب بالمساهمات من الجميع! هذا الدليل سيساعدك على البدء.

---

## 📋 جدول المحتويات

1. [قواعد السلوك](#قواعد-السلوك)
2. [كيف يمكنني المساهمة؟](#كيف-يمكنني-المساهمة)
3. [إعداد بيئة التطوير](#إعداد-بيئة-التطوير)
4. [معايير الكود](#معايير-الكود)
5. [عملية Pull Request](#عملية-pull-request)
6. [الإبلاغ عن الأخطاء](#الإبلاغ-عن-الأخطاء)
7. [اقتراح ميزات جديدة](#اقتراح-ميزات-جديدة)

---

## 🤝 قواعد السلوك

### تعهدنا

نحن كمساهمين وصيانين نتعهد بجعل المشاركة في مشروعنا ومجتمعنا تجربة خالية من المضايقات للجميع.

### معاييرنا

أمثلة على السلوك الإيجابي:
- ✅ استخدام لغة ترحيبية وشاملة
- ✅ احترام وجهات النظر والتجارب المختلفة
- ✅ قبول النقد البناء بلطف
- ✅ التركيز على ما هو أفضل للمجتمع
- ✅ إظهار التعاطف مع أعضاء المجتمع الآخرين

أمثلة على السلوك غير المقبول:
- ❌ استخدام لغة أو صور جنسية
- ❌ التنمر أو التعليقات المهينة
- ❌ المضايقة العامة أو الخاصة
- ❌ نشر معلومات خاصة للآخرين
- ❌ سلوك غير مهني آخر

---

## 🤔 كيف يمكنني المساهمة؟

### أنواع المساهمات المرحب بها

#### 💻 مساهمات الكود
- إصلاح الأخطاء (Bug Fixes)
- إضافة ميزات جديدة
- تحسين الأداء
- تحديث التبعيات
- إعادة هيكلة الكود

#### 📚 مساهمات الوثائق
- تحسين README
- كتابة tutorials
- ترجمة الوثائق
- إضافة أمثلة
- تحديث التعليقات

#### 🎨 مساهمات التصميم
- تحسين UI/UX
- إضافة رسوم متحركة
- تحسين إمكانية الوصول
- إنشاء assets جديدة

#### 🧪 مساهمات الاختبار
- كتابة اختبارات جديدة
- تحسين تغطية الاختبار
- اختبار يدوي
- الإبلاغ عن الأخطاء

---

## 🛠️ إعداد بيئة التطوير

### المتطلبات الأساسية

```bash
Node.js: v18+ (موصى به)
npm: v9+ أو pnpm
Git: أحدث إصدار
محرر الكود: VS Code (موصى به)
```

### الخطوات

#### 1. Fork المشروع
```bash
# اذهب إلى GitHub وانقر على Fork
# ثم استنسخ مشروعك المستنسخ
git clone https://github.com/YOUR_USERNAME/medo-store.git
cd medo-store
```

#### 2. إضافة Remote الأصلي
```bash
git remote add upstream https://github.com/Scoopy-Dooo/medo-store.git
```

#### 3. تثبيت التبعيات
```bash
npm install
# أو
pnpm install
```

#### 4. إنشاء فرع جديد
```bash
git checkout -b feature/my-new-feature
# أو
git checkout -b fix/bug-name
```

#### 5. بدء التطوير
```bash
npm run dev
```

### هيكل الفروع

```
main           → الإنتاج المستقر
develop        → التطوير النشط
feature/*      → ميزات جديدة
fix/*          → إصلاح أخطاء
hotfix/*       → إصلاحات عاجلة
docs/*         → تحديثات الوثائق
```

---

## 📝 معايير الكود

### عام

#### TypeScript
```typescript
// ✅ جيد
interface User {
  id: string;
  name: string;
  email: string;
}

const getUser = (id: string): Promise<User> => {
  // implementation
};

// ❌ سيء
const getUser = (id) => {
  // no types
};
```

#### التسمية
```typescript
// ✅ جيد
const userProfile = {};
const getUserById = () => {};
const MAX_RETRY_COUNT = 3;

// ❌ سيء
const up = {};
const get = () => {};
const max = 3;
```

#### المكونات
```tsx
// ✅ جيد - مكون وظيفي مع TypeScript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'primary' 
}) => {
  return (
    <button 
      onClick={onClick}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
};

// ❌ سيء
export const Button = (props) => {
  return <button onClick={props.onClick}>{props.label}</button>;
};
```

### تنسيق الكود

#### استخدم Prettier
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

#### قواعد ESLint
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error"
  }
}
```

### التعليقات

#### متى تعلق؟
```typescript
// ✅ جيد - شرح المنطق المعقد
// نحسب المبلغ الإجمالي مع الخصم والضريبة
const calculateTotal = (price: number, discount: number) => {
  const discountedPrice = price * (1 - discount / 100);
  const tax = discountedPrice * 0.15; // ضريبة 15%
  return discountedPrice + tax;
};

// ❌ سيء - شرح الواضح
// هذه دالة تجمع رقمين
const add = (a: number, b: number) => a + b;
```

#### JSDoc للدوال المهمة
```typescript
/**
 * يرسل طلب شراء عبر واتساب
 * @param gameName - اسم اللعبة
 * @param amount - كمية/نوع الباقة
 * @param price - السعر بالجنيه
 * @returns void
 */
const sendWhatsAppOrder = (
  gameName: string, 
  amount: string, 
  price: number
): void => {
  // implementation
};
```

### الاختبارات

#### اكتب اختبارات للكود الجديد
```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with correct label', () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button label="Click me" onClick={handleClick} />);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## 🔄 عملية Pull Request

### قبل إنشاء PR

#### 1. تأكد من تحديث فرعك
```bash
git fetch upstream
git rebase upstream/develop
```

#### 2. اختبر تغييراتك
```bash
npm run build
npm run test  # عندما تكون الاختبارات متوفرة
```

#### 3. تأكد من نظافة الكود
```bash
npm run lint
npm run format
```

### إنشاء PR

#### عنوان PR جيد
```
✅ جيد:
feat: إضافة نظام التقييمات
fix: إصلاح مشكلة عرض الأسعار على الموبايل
docs: تحديث دليل التثبيت

❌ سيء:
تحديثات
إصلاحات
تغييرات مختلفة
```

#### وصف PR جيد
```markdown
## الوصف
وصف واضح للتغييرات

## نوع التغيير
- [ ] إصلاح خطأ (Bug fix)
- [x] ميزة جديدة (New feature)
- [ ] تغيير كبير (Breaking change)
- [ ] تحديث وثائق (Documentation update)

## كيف تم الاختبار؟
- اختبار يدوي على Chrome
- اختبار على موبايل
- اختبارات unit tests

## لقطات الشاشة (إذا كانت مطلوبة)
![screenshot](url)

## Checklist
- [x] الكود يتبع معايير المشروع
- [x] قمت بمراجعة الكود
- [x] أضفت تعليقات للأجزاء المعقدة
- [x] الوثائق محدثة
- [x] لا توجد تحذيرات جديدة
```

### مراجعة PR

بعد إنشاء PR:
1. انتظر المراجعة من maintainers
2. تعامل مع التعليقات بلطف
3. قم بالتعديلات المطلوبة
4. اطلب مراجعة أخرى إذا لزم الأمر

### دمج PR

سيتم دمج PR عندما:
- ✅ يمر جميع الاختبارات
- ✅ يحصل على موافقة reviewer واحد على الأقل
- ✅ لا يوجد تعارضات
- ✅ يتبع معايير المشروع

---

## 🐛 الإبلاغ عن الأخطاء

### قبل الإبلاغ
- [ ] تحقق من Issues الموجودة
- [ ] تأكد أنك تستخدم أحدث إصدار
- [ ] حاول إعادة إنتاج المشكلة

### معلومات يجب تضمينها

```markdown
## وصف الخطأ
وصف واضح للمشكلة

## خطوات إعادة الإنتاج
1. اذهب إلى '...'
2. انقر على '...'
3. مرر إلى '...'
4. شاهد الخطأ

## السلوك المتوقع
ما كان يجب أن يحدث

## لقطات الشاشة
إذا كانت مطلوبة

## البيئة
- نظام التشغيل: [e.g. Windows 11]
- المتصفح: [e.g. Chrome 120]
- النسخة: [e.g. 1.0.0]

## معلومات إضافية
أي معلومات أخرى مفيدة
```

---

## 💡 اقتراح ميزات جديدة

### قبل الاقتراح
- [ ] تحقق من Issues الموجودة
- [ ] تأكد أن الميزة تناسب المشروع
- [ ] فكر في التأثير على المستخدمين

### قالب اقتراح الميزة

```markdown
## المشكلة
وصف المشكلة التي ستحلها الميزة

## الحل المقترح
وصف الحل الذي تقترحه

## البدائل المحتملة
أي حلول أخرى فكرت فيها

## معلومات إضافية
أي سياق أو لقطات شاشة
```

---

## ❓ الأسئلة الشائعة

### كيف أبدأ المساهمة؟
ابدأ بالمشاكل المصنفة بـ `good first issue` أو `help wanted`.

### هل يمكنني العمل على ميزة كبيرة؟
نعم! لكن افتح Issue أولاً لمناقشة الميزة.

### كم من الوقت تستغرق مراجعة PR؟
عادة 1-3 أيام. إذا استغرق الأمر أكثر، لا تتردد في التذكير.

### ماذا لو تم رفض PR؟
لا تقلق! اطلب التوضيح وحاول مرة أخرى.

---

## 📞 الحصول على المساعدة

### لديك سؤال؟
- افتح Discussion على GitHub
- تواصل عبر واتساب: 249908180432
- أرسل بريد إلكتروني (قريبًا)

### العالق في مشكلة؟
- ابحث في Issues المغلقة
- اسأل في Discussions
- اطلب المساعدة من المجتمع

---

## 🎉 شكرًا لك!

كل مساهمة، مهما كانت صغيرة، تُحدث فرقًا!

### Contributors

شكر خاص لجميع المساهمين:
- محمد سعد (Scoopy Doo) - المطور الأساسي
- [أنت هنا؟] - المساهمون المستقبليون

---

</div>

## 📄 الترخيص

بالمساهمة في هذا المشروع، فإنك توافق على أن مساهماتك ستكون مرخصة بنفس ترخيص المشروع.

---

**آخر تحديث**: 2024-01-XX
**الإصدار**: 1.0
