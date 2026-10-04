# دليل البدء السريع - Medo Store Backend

## Setup في 5 دقائق

### 1. تثبيت
```bash
cd backend
npm install
```

### 2. قاعدة البيانات
```bash
cp .env.example .env
# عدل DATABASE_URL في .env
npm run db:generate
npm run db:push
```

### 3. تشغيل
```bash
npm run dev
```

## اختبار API

```http
POST /api/auth/register
POST /api/auth/login
GET /api/auth/profile
```

---

**Backend جاهز! 🎉**
