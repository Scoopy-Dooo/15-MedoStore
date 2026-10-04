# Admin Dashboard API Documentation

## 🔐 Authentication Required
جميع endpoints تتطلب:
- Bearer Token في الـ Header
- Role: ADMIN أو SUPER_ADMIN

```http
Authorization: Bearer YOUR_ADMIN_TOKEN
```

---

## 📊 Dashboard Stats

### Get Dashboard Statistics
```http
GET /api/admin/dashboard/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 150,
      "active": 145,
      "verified": 130,
      "newThisMonth": 25
    },
    "orders": {
      "total": 450,
      "pending": 15,
      "processing": 30,
      "completed": 400,
      "totalRevenue": 125000.50,
      "averageOrderValue": 277.78
    },
    "games": {
      "total": 5,
      "active": 5
    },
    "packages": {
      "total": 25,
      "popular": 8
    }
  }
}
```

---

### Get Recent Orders
```http
GET /api/admin/dashboard/recent-orders?limit=10
```

**Query Parameters:**
- `limit` (optional): عدد الطلبات (default: 10)

---

### Get Recent Users
```http
GET /api/admin/dashboard/recent-users?limit=10
```

**Query Parameters:**
- `limit` (optional): عدد المستخدمين (default: 10)

---

## 👥 User Management

### Get All Users
```http
GET /api/admin/users?page=1&limit=20&search=محمد&role=USER&isActive=true
```

**Query Parameters:**
- `page` (optional): رقم الصفحة (default: 1)
- `limit` (optional): عدد المستخدمين في الصفحة (default: 20)
- `search` (optional): البحث في الاسم/البريد/الهاتف
- `role` (optional): USER | ADMIN | SUPER_ADMIN
- `isActive` (optional): true | false

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

---

### Get User Stats
```http
GET /api/admin/users/:userId/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {...},
    "orders": {
      "total": 15,
      "byStatus": {
        "COMPLETED": {
          "count": 12,
          "revenue": 3500.00
        },
        "PENDING": {
          "count": 3,
          "revenue": 850.00
        }
      }
    },
    "recentOrders": [...],
    "stats": {
      "totalSpent": 4350.00,
      "averageOrderValue": 290.00,
      "reviewsCount": 8,
      "wishlistCount": 5,
      "referralsCount": 2
    }
  }
}
```

---

### Update User Status
```http
PATCH /api/admin/users/:userId/status
Content-Type: application/json

{
  "isActive": false
}
```

---

### Update User Role
```http
PATCH /api/admin/users/:userId/role
Content-Type: application/json

{
  "role": "ADMIN"
}
```

**Allowed Roles:**
- USER
- ADMIN
- SUPER_ADMIN

---

### Delete User
```http
DELETE /api/admin/users/:userId
```

**Note:** لا يمكن حذف مستخدم لديه طلبات معلقة (PENDING أو PROCESSING)

---

## 🎯 Usage Examples

### Example 1: Get Dashboard Stats
```javascript
fetch('http://localhost:5000/api/admin/dashboard/stats', {
  headers: {
    'Authorization': 'Bearer YOUR_ADMIN_TOKEN'
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

### Example 2: Search Users
```javascript
fetch('http://localhost:5000/api/admin/users?search=محمد&page=1&limit=20', {
  headers: {
    'Authorization': 'Bearer YOUR_ADMIN_TOKEN'
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

### Example 3: Deactivate User
```javascript
fetch('http://localhost:5000/api/admin/users/user-id-here/status', {
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer YOUR_ADMIN_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    isActive: false
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## ⚠️ Error Responses

```json
{
  "success": false,
  "message": "رسالة الخطأ بالعربية"
}
```

**Common Error Codes:**
- 400: Bad Request
- 401: Unauthorized (Token غير صالح)
- 403: Forbidden (ليس Admin)
- 404: Not Found
- 500: Server Error

---

**Last Updated:** 2024-01-XX
**Version:** 2.0.0
