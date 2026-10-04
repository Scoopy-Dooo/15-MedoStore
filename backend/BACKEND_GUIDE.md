# دليل Backend الشامل - Medo Store v2.0.0

## 📖 نظرة عامة

هذا هو Backend الكامل لمتجر ميدو، مبني على Node.js + Express + TypeScript + Prisma + PostgreSQL

---

## 🏗️ معمارية النظام

```
Backend Architecture
├── Presentation Layer (Routes)
├── Business Logic Layer (Services)
├── Data Access Layer (Prisma ORM)
└── Database (PostgreSQL)
```

---

## 🗄️ نموذج قاعدة البيانات

### الجداول الرئيسية:

#### 1. Users (المستخدمين)
- id, email, phone, password (hashed)
- name, role (USER/ADMIN/SUPER_ADMIN)
- isVerified, isActive, loyaltyPoints
- orders, reviews, referrals, wishlist

#### 2. Games (الألعاب)
- id, name, nameAr, slug, image
- description, category, isActive
- packages, sortOrder

#### 3. Packages (الباقات)
- id, gameId, amount, price, oldPrice
- isPopular, isActive, stock
- orderItems, wishlist

#### 4. Orders (الطلبات)
- id, orderNumber, userId
- status, paymentStatus, paymentMethod
- subtotal, discount, total
- items, transaction

---

## 🔐 نظام المصادقة

### JWT Token Structure:
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "role": "USER"
}
```

### Headers:
```
Authorization: Bearer <token>
```

---

## 📡 API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile

### Games
- GET /api/games
- GET /api/games/:id
- POST /api/games (Admin)

### Orders
- POST /api/orders
- GET /api/orders
- GET /api/orders/:id

---

## 🚀 التشغيل

```bash
npm install
npm run db:migrate
npm run dev
```

---

**آخر تحديث:** 2024-01-XX  
**الإصدار:** 2.0.0
