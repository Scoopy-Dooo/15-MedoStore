# Orders System API Documentation
# توثيق نظام الطلبات

## نظرة عامة

نظام الطلبات الكامل مع إدارة المخزون، الرموز الترويجية، وتكامل WhatsApp.

---

## المسارات (Endpoints)

### 1. إنشاء طلب جديد
**Create New Order**

```http
POST /api/orders
```

**Authentication Required:** ✅ Yes (User Token)

**Request Body:**
```json
{
  "items": [
    {
      "packageId": "uuid-package-id",
      "quantity": 1
    }
  ],
  "playerInfo": {
    "playerId": "123456789",
    "playerName": "محمد"
  },
  "notes": "ملاحظات إضافية",
  "promoCode": "SUMMER2024"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "تم إنشاء الطلب بنجاح",
  "data": {
    "id": "uuid",
    "orderNumber": "MEDO-20261003-0001",
    "userId": "uuid",
    "status": "PENDING",
    "paymentStatus": "PENDING",
    "subtotal": "500.00",
    "discount": "50.00",
    "total": "450.00",
    "playerInfo": {...},
    "notes": "...",
    "promoCode": "SUMMER2024",
    "items": [...],
    "user": {...},
    "createdAt": "2026-10-03T..."
  }
}
```

**Validation Rules:**
- `items`: مطلوب، array مع عنصر واحد على الأقل
- `items.*.packageId`: مطلوب، UUID صالح
- `items.*.quantity`: مطلوب، عدد صحيح >= 1
- `promoCode`: اختياري، string
- `notes`: اختياري، max 500 characters

**Error Responses:**
- `400` - بيانات غير صالحة
- `401` - غير مصرح
- `404` - باقة غير موجودة
- `400` - المخزون غير كافٍ
- `400` - كود ترويجي منتهي أو مستخدم

---

### 2. الحصول على طلبات المستخدم
**Get User Orders**

```http
GET /api/orders/my-orders?page=1&limit=20
```

**Authentication Required:** ✅ Yes

**Query Parameters:**
- `page`: رقم الصفحة (default: 1)
- `limit`: عدد النتائج (default: 20)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "orders": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

---

### 3. الحصول على طلب واحد
**Get Order by ID**

```http
GET /api/orders/:orderId
```

**Authentication Required:** ✅ Yes

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderNumber": "MEDO-20261003-0001",
    "status": "PENDING",
    "items": [...],
    "user": {...},
    "transaction": {...}
  }
}
```

**Error Responses:**
- `404` - الطلب غير موجود
- `403` - غير مصرح بعرض هذا الطلب

---

### 4. الحصول على طلب برقم الطلب
**Get Order by Order Number**

```http
GET /api/orders/number/:orderNumber
```

**Authentication Required:** ✅ Yes

**Example:**
```http
GET /api/orders/number/MEDO-20261003-0001
```

**Response:** نفس استجابة Get Order by ID

---

### 5. إلغاء طلب
**Cancel Order**

```http
PATCH /api/orders/:orderId/cancel
```

**Authentication Required:** ✅ Yes

**Response (200 OK):**
```json
{
  "success": true,
  "message": "تم إلغاء الطلب بنجاح",
  "data": {
    "id": "uuid",
    "status": "CANCELLED",
    ...
  }
}
```

**Business Logic:**
- ✅ إرجاع المخزون للباقات
- ✅ تحديث حالة الطلب إلى CANCELLED
- ❌ لا يمكن إلغاء طلب مكتمل (COMPLETED)
- ❌ لا يمكن إلغاء طلب ملغي مسبقاً

**Error Responses:**
- `400` - لا يمكن إلغاء طلب مكتمل
- `400` - الطلب ملغي مسبقاً
- `403` - غير مصرح بإلغاء هذا الطلب
- `404` - الطلب غير موجود

---

### 6. توليد رسالة WhatsApp
**Generate WhatsApp Message**

```http
GET /api/orders/:orderId/whatsapp
```

**Authentication Required:** ✅ Yes

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "🎮 *طلب جديد من Medo Store*\n\n...",
    "whatsappUrl": "https://wa.me/249908180432?text=..."
  }
}
```

---

## Admin Endpoints

### 7. الحصول على جميع الطلبات (Admin)
**Get All Orders**

```http
GET /api/orders?page=1&limit=20&status=PENDING&search=محمد
```

**Authentication Required:** ✅ Yes (Admin/Super Admin)

**Query Parameters:**
- `page`: رقم الصفحة
- `limit`: عدد النتائج
- `status`: PENDING, PROCESSING, COMPLETED, CANCELLED, REFUNDED
- `paymentStatus`: PENDING, PAID, FAILED, REFUNDED
- `userId`: UUID المستخدم
- `search`: البحث في رقم الطلب، اسم المستخدم، البريد

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "orders": [...],
    "pagination": {...}
  }
}
```

---

### 8. تحديث حالة الطلب (Admin)
**Update Order Status**

```http
PATCH /api/orders/:orderId/status
```

**Authentication Required:** ✅ Yes (Admin/Super Admin)

**Request Body:**
```json
{
  "status": "COMPLETED",
  "paymentStatus": "PAID"
}
```

**Valid Status Values:**
- `PENDING`: قيد الانتظار
- `PROCESSING`: قيد المعالجة
- `COMPLETED`: مكتمل
- `CANCELLED`: ملغي
- `REFUNDED`: مسترجع

**Valid Payment Status Values:**
- `PENDING`: قيد الانتظار
- `PAID`: مدفوع
- `FAILED`: فشل
- `REFUNDED`: مسترجع

**Response (200 OK):**
```json
{
  "success": true,
  "message": "تم تحديث حالة الطلب بنجاح",
  "data": {...}
}
```

**Business Logic:**
- ❌ لا يمكن تحديث طلب ملغي أو مسترجع
- ✅ إضافة `completedAt` عند تغيير الحالة إلى COMPLETED

---

## Order Number Format

```
MEDO-YYYYMMDD-XXXX
```

**مثال:**
- `MEDO-20261003-0001` - أول طلب في 2026-10-03
- `MEDO-20261003-0002` - ثاني طلب في نفس اليوم
- `MEDO-20261004-0001` - أول طلب في اليوم التالي

**التوليد التلقائي:**
- يتم توليد الرقم تلقائياً عند إنشاء الطلب
- Sequential numbering لكل يوم
- Zero-padded إلى 4 أرقام

---

## Stock Management

### عند إنشاء الطلب:
```typescript
package.stock -= quantity  // خصم من المخزون
```

### عند إلغاء الطلب:
```typescript
package.stock += quantity  // إرجاع للمخزون
```

### التحقق من التوفر:
```typescript
if (package.stock < quantity) {
  throw Error('المخزون غير كافٍ')
}
```

---

## Promo Code System

### التحقق من الكود:
1. ✅ الكود موجود و active
2. ✅ لم ينته (`expiresAt` > now)
3. ✅ لم يستخدم بالكامل (`usedCount` < `maxUses`)

### حساب الخصم:
```typescript
discount = subtotal * (promoCode.discount / 100)
total = subtotal - discount
```

### تحديث الاستخدام:
```typescript
promoCode.usedCount++
```

---

## Transaction Safety

جميع عمليات إنشاء وإلغاء الطلبات تستخدم Prisma Transactions:

```typescript
await prisma.$transaction(async (tx) => {
  // 1. إنشاء/تحديث الطلب
  // 2. تحديث المخزون
  // 3. تحديث الكود الترويجي
})
```

**الفوائد:**
- ✅ Atomicity - كل شيء ينجح أو كل شيء يفشل
- ✅ Consistency - البيانات متسقة دائماً
- ✅ Isolation - لا تتداخل المعاملات
- ✅ Durability - البيانات محفوظة بشكل دائم

---

## WhatsApp Integration

### تنسيق الرسالة:
```
🎮 *طلب جديد من Medo Store*

*رقم الطلب:* MEDO-20261003-0001
*الاسم:* محمد سعد
*الهاتف:* 249908180432

*العناصر:*
• PUBG Mobile: 60 UC x1
• Free Fire: 100 جوهرة x2

*المجموع الفرعي:* 500 جنيه
*الخصم:* 50 جنيه
*المجموع النهائي:* 450 جنيه

*معلومات اللاعب:*
{
  "playerId": "123456789",
  "playerName": "محمد"
}

*ملاحظات:*
شحن سريع من فضلك

_تم إرسال الطلب بتاريخ: 03/10/2026, 02:30 م_
```

### URL Encoding:
```typescript
const encodedMessage = encodeURIComponent(message)
const whatsappUrl = `https://wa.me/249908180432?text=${encodedMessage}`
```

---

## Error Handling

### Common Errors:

**400 Bad Request:**
```json
{
  "success": false,
  "message": "بيانات العنصر غير صالحة",
  "statusCode": 400
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "المستخدم غير مصرح",
  "statusCode": 401
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "غير مصرح لك بعرض هذا الطلب",
  "statusCode": 403
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "الطلب غير موجود",
  "statusCode": 404
}
```

---

## Testing Examples

### إنشاء طلب بسيط:
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "packageId": "package-uuid",
        "quantity": 1
      }
    ]
  }'
```

### إنشاء طلب مع كود ترويجي:
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [...],
    "promoCode": "SUMMER2024",
    "notes": "شحن سريع"
  }'
```

### الحصول على طلبات المستخدم:
```bash
curl -X GET "http://localhost:5000/api/orders/my-orders?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### إلغاء طلب:
```bash
curl -X PATCH http://localhost:5000/api/orders/ORDER_ID/cancel \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Performance Considerations

### Pagination:
- Default: 20 items per page
- Maximum: 100 items per page
- Use for large result sets

### Indexes:
```prisma
@@index([userId])
@@index([orderNumber])
@@index([status])
```

### Optimization Tips:
1. ✅ استخدام `select` لجلب الحقول المطلوبة فقط
2. ✅ استخدام `include` بحذر
3. ✅ Pagination للنتائج الكبيرة
4. ✅ Caching للبيانات المتكررة (TODO)

---

## Security Features

### Authentication:
- ✅ JWT Token Required
- ✅ Token Expiration Checking
- ✅ User Verification

### Authorization:
- ✅ User can only see their orders
- ✅ Admin can see all orders
- ✅ Role-based access control

### Input Validation:
- ✅ express-validator middleware
- ✅ Type checking with TypeScript
- ✅ Business logic validation

### Data Protection:
- ✅ Prisma ORM (SQL Injection Prevention)
- ✅ Password exclusion from responses
- ✅ Sensitive data handling

---

## Future Enhancements

### Planned Features:
- [ ] Order Tracking System
- [ ] Email Notifications
- [ ] SMS Notifications
- [ ] Payment Gateway Integration
- [ ] Order History Export
- [ ] Advanced Analytics
- [ ] Order Templates
- [ ] Bulk Order Creation
- [ ] Order Scheduling
- [ ] Loyalty Points Integration

---

**آخر تحديث:** 2026-10-03  
**النسخة:** 2.0.0  
**المطور:** Mohamed Saad (Scoopy Doo)
