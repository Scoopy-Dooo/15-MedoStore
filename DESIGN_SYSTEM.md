# Medo Store - Design System
## نظام التصميم الموحّد

<div dir="rtl">

---

## 🎨 نظرة عامة

نظام التصميم الموحّد لمتجر ميدو - تصميم Gaming Modern مع Glassmorphism وتأثيرات Neon.

---

## 🎯 المبادئ الأساسية

### 1. **Gaming Aesthetic**
- تصميم عصري يناسب الألعاب
- ألوان نيون (Purple, Cyan, Pink)
- تأثيرات Glow

### 2. **Glassmorphism**
- Transparent backgrounds
- Backdrop blur effects
- Subtle borders

### 3. **Dark First**
- الوضع الداكن هو الأساس
- الوضع الفاتح كخيار إضافي

### 4. **Smooth Animations**
- Motion/React للحركات
- Hover effects تفاعلية
- Transitions سلسة

---

## 🎨 الألوان

### Primary Colors (Dark Mode)
```css
--background: #0b0f1a
--card-bg: rgba(20, 25, 45, 0.6)
--card-border: rgba(139, 92, 246, 0.2)
--primary: #8b5cf6
--secondary: #22d3ee
--accent: #ec4899
```

### Text Colors
```css
--text-primary: #ffffff
--text-secondary: #94a3b8
--text-muted: #64748b
```

---

## 🔘 Components

### Glass Card
```tsx
<div className="bg-[rgba(20,25,45,0.6)] backdrop-blur-xl
                border border-purple-500/20 rounded-2xl p-8
                hover:border-purple-500/40 
                hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]
                transition-all duration-300">
  المحتوى
</div>
```

### Primary Button
```tsx
<Button className="bg-gradient-to-r from-purple-500 to-purple-600 
                   hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]
                   transition-all duration-300">
  النص
</Button>
```

---

## 📋 Page Layouts

### Auth Pages Layout
```tsx
<div className="min-h-screen flex items-center justify-center px-4 py-12
                bg-gradient-to-br from-[#0b0f1a] via-[#1a1f35] to-[#0b0f1a]
                relative overflow-hidden">
  
  {/* Background Effect */}
  <div className="absolute inset-0 
                  bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]" />
  
  {/* Content */}
  <div className="relative z-10 w-full max-w-md">
    <div className="bg-[rgba(20,25,45,0.6)] backdrop-blur-xl
                    border border-purple-500/20 rounded-2xl p-8
                    shadow-[0_0_50px_rgba(139,92,246,0.1)]">
      {/* محتوى الصفحة */}
    </div>
  </div>
</div>
```

---

</div>
