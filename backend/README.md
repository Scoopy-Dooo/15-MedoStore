# Medo Store Backend API 🎮

Backend API لمتجر ميدو - منصة شحن الألعاب الإلكترونية

## 📋 المتطلبات

- Node.js >= 18.0.0
- PostgreSQL >= 14
- npm >= 9.0.0

## 🚀 التثبيت

```bash
# تثبيت التبعيات
npm install

# نسخ ملف البيئة
cp .env.example .env

# تعديل متغيرات البيئة في .env
```

## ⚙️ إعداد قاعدة البيانات

```bash
# إنشاء قاعدة البيانات
# تأكد من تشغيل PostgreSQL أولاً

# تطبيق Migrations
npm run db:migrate

# إنشاء بيانات تجريبية (اختياري)
npm run db:seed
```

## 🏃‍♂️ التشغيل

```bash
# بيئة التطوير
npm run dev

# الإنتاج
npm run build
npm start
```

## 📁 هيكل المشروع

```
backend/
├── src/
│   ├── controllers/     # معالجات الطلبات
│   ├── middlewares/     # Middlewares
│   ├── models/          # نماذج البيانات
│   ├── routes/          # المسارات
│   ├── services/        # منطق الأعمال
│   ├── utils/           # أدوات مساعدة
│   ├── config/          # الإعدادات
│   └── server.ts        # نقطة البداية
├── prisma/
│   └── schema.prisma    # مخطط قاعدة البيانات
└── package.json
```

## 🔐 المصادقة

يستخدم المشروع JWT للمصادقة:

```
Authorization: Bearer <token>
```

## 📚 API Documentation

### Auth Endpoints
- `POST /api/auth/register` - تسجيل مستخدم جديد
- `POST /api/auth/login` - تسجيل الدخول
- `POST /api/auth/refresh` - تحديث Token
- `POST /api/auth/logout` - تسجيل الخروج

### Games Endpoints
- `GET /api/games` - قائمة الألعاب
- `GET /api/games/:id` - تفاصيل لعبة
- `POST /api/games` - إضافة لعبة (Admin)
- `PUT /api/games/:id` - تحديث لعبة (Admin)
- `DELETE /api/games/:id` - حذف لعبة (Admin)

### Packages Endpoints
- `GET /api/packages` - قائمة الباقات
- `GET /api/packages/:id` - تفاصيل باقة
- `POST /api/packages` - إضافة باقة (Admin)

### Orders Endpoints
- `GET /api/orders` - طلبات المستخدم
- `POST /api/orders` - إنشاء طلب جديد
- `GET /api/orders/:id` - تفاصيل الطلب
- `PATCH /api/orders/:id` - تحديث حالة الطلب (Admin)

## 🧪 الاختبارات

```bash
npm test
```

## 📝 Logging

السجلات موجودة في مجلد `logs/`:
- `error.log` - سجل الأخطاء فقط
- `combined.log` - جميع السجلات

## 🔒 الأمان

- ✅ Helmet للحماية من XSS
- ✅ CORS configured
- ✅ Rate limiting
- ✅ JWT authentication
- ✅ Password hashing
- ✅ Input validation
- ✅ SQL injection protection (Prisma)

## 📧 الدعم

للمساعدة أو الأسئلة:
- WhatsApp: 249908180432
- Email: support@medostore.com

## 👨‍💻 المطور

Mohamed Saad (Scoopy Doo)

## 📄 الترخيص

MIT License
