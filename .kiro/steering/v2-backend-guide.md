---
inclusion: manual
---

# Backend Development Guide for v2.0.0

## Backend Architecture Overview

### Technology Stack (Recommended)
```
Runtime: Node.js 18+
Framework: Express.js / NestJS
Language: TypeScript
Database: PostgreSQL (main) + Redis (cache)
ORM: Prisma / TypeORM
Authentication: JWT + bcrypt
File Storage: AWS S3 / Cloudinary
Payment: Stripe / Local gateway
```

### Project Structure
```
backend/
├── src/
│   ├── config/          → Configuration files
│   ├── controllers/     → Request handlers
│   ├── services/        → Business logic
│   ├── models/          → Database models
│   ├── middleware/      → Express middleware
│   ├── routes/          → API routes
│   ├── utils/           → Helper functions
│   ├── validators/      → Input validation
│   └── types/           → TypeScript types
├── prisma/              → Database schema
├── tests/               → Test files
└── uploads/             → Temporary uploads
```

## Database Schema Design

### Core Tables

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'customer',
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Games Table
```sql
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  name_ar VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(50),
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Packages Table
```sql
CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id),
  amount VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  type VARCHAR(50),
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Orders Table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  package_id UUID REFERENCES packages(id),
  status VARCHAR(20) DEFAULT 'pending',
  total_price DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50),
  payment_status VARCHAR(20) DEFAULT 'pending',
  player_id VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Order History Table
```sql
CREATE TABLE order_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  status VARCHAR(20) NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Reviews Table
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  order_id UUID REFERENCES orders(id),
  game_id UUID REFERENCES games(id),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Promotional Codes Table
```sql
CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(20), -- 'percentage' or 'fixed'
  discount_value DECIMAL(10, 2) NOT NULL,
  max_uses INT,
  current_uses INT DEFAULT 0,
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints Design

### Authentication Endpoints
```typescript
POST   /api/auth/register           → Register new user
POST   /api/auth/login              → Login user
POST   /api/auth/logout             → Logout user
POST   /api/auth/refresh            → Refresh access token
POST   /api/auth/forgot-password    → Request password reset
POST   /api/auth/reset-password     → Reset password
POST   /api/auth/verify-email       → Verify email address
```

### User Endpoints
```typescript
GET    /api/users/profile           → Get user profile
PUT    /api/users/profile           → Update user profile
GET    /api/users/orders            → Get user orders
GET    /api/users/orders/:id        → Get specific order
POST   /api/users/change-password   → Change password
DELETE /api/users/account           → Delete account
```

### Games Endpoints
```typescript
GET    /api/games                   → Get all games
GET    /api/games/:id               → Get game details
GET    /api/games/:id/packages      → Get game packages
GET    /api/games/:id/reviews       → Get game reviews
```

### Orders Endpoints
```typescript
POST   /api/orders                  → Create new order
GET    /api/orders/:id              → Get order details
PUT    /api/orders/:id/cancel       → Cancel order
POST   /api/orders/:id/review       → Add order review
GET    /api/orders/:id/status       → Get order status
```

### Payment Endpoints
```typescript
POST   /api/payments/create         → Create payment intent
POST   /api/payments/confirm        → Confirm payment
POST   /api/payments/webhook        → Payment webhook
GET    /api/payments/:id            → Get payment details
```

### Admin Endpoints
```typescript
// Games Management
POST   /api/admin/games             → Add new game
PUT    /api/admin/games/:id         → Update game
DELETE /api/admin/games/:id         → Delete game

// Packages Management
POST   /api/admin/packages          → Add package
PUT    /api/admin/packages/:id      → Update package
DELETE /api/admin/packages/:id      → Delete package

// Orders Management
GET    /api/admin/orders            → Get all orders
PUT    /api/admin/orders/:id        → Update order status
GET    /api/admin/orders/stats      → Get orders statistics

// Users Management
GET    /api/admin/users             → Get all users
PUT    /api/admin/users/:id         → Update user
DELETE /api/admin/users/:id         → Delete user

// Promo Codes
POST   /api/admin/promo-codes       → Create promo code
GET    /api/admin/promo-codes       → Get all promo codes
DELETE /api/admin/promo-codes/:id   → Delete promo code
```

## Authentication Implementation

### JWT Strategy
```typescript
// config/jwt.ts
export const jwtConfig = {
  accessTokenSecret: process.env.JWT_ACCESS_SECRET,
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET,
  accessTokenExpiry: '15m',
  refreshTokenExpiry: '7d'
};

// Generate tokens
const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { userId, type: 'access' },
    jwtConfig.accessTokenSecret,
    { expiresIn: jwtConfig.accessTokenExpiry }
  );
  
  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    jwtConfig.refreshTokenSecret,
    { expiresIn: jwtConfig.refreshTokenExpiry }
  );
  
  return { accessToken, refreshToken };
};
```

### Password Hashing
```typescript
import bcrypt from 'bcrypt';

// Hash password
const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Compare password
const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
```

### Auth Middleware
```typescript
// middleware/auth.ts
export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, jwtConfig.accessTokenSecret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Role-based authorization
export const authorize = (...roles: string[]) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    next();
  };
};
```

## Payment Integration

### Stripe Example
```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create payment intent
export const createPaymentIntent = async (
  amount: number,
  currency: string = 'usd'
) => {
  return await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to cents
    currency,
    automatic_payment_methods: {
      enabled: true,
    },
  });
};

// Handle webhook
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object);
        break;
    }
    
    res.json({ received: true });
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};
```

## Email Notifications

### Setup
```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send email template
export const sendEmail = async (
  to: string,
  subject: string,
  html: string
) => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html,
  });
};

// Order confirmation email
export const sendOrderConfirmation = async (
  email: string,
  orderDetails: any
) => {
  const html = `
    <h1>Order Confirmation</h1>
    <p>Thank you for your order!</p>
    <p>Order ID: ${orderDetails.id}</p>
    <p>Total: ${orderDetails.total} SDG</p>
  `;
  
  await sendEmail(email, 'Order Confirmation - Medo Store', html);
};
```

## Caching Strategy

### Redis Setup
```typescript
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

// Cache middleware
export const cacheMiddleware = (duration: number) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;
    
    try {
      const cachedData = await redis.get(key);
      
      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }
      
      // Store original send function
      const originalSend = res.json.bind(res);
      
      // Override send function
      res.json = (data) => {
        redis.setex(key, duration, JSON.stringify(data));
        return originalSend(data);
      };
      
      next();
    } catch (error) {
      next();
    }
  };
};

// Usage
router.get('/api/games', cacheMiddleware(3600), getGames);
```

## Error Handling

### Global Error Handler
```typescript
// middleware/errorHandler.ts
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.details
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized'
    });
  }
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};
```

## File Upload

### Multer Configuration
```typescript
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only images allowed'));
    }
  }
});

// Usage
router.post('/upload', upload.single('image'), uploadHandler);
```

## Environment Variables

### .env Example
```bash
# Server
NODE_ENV=development
PORT=3000
API_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/medostore
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_ACCESS_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=15m

# Payment
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="Medo Store <noreply@medostore.com>"

# AWS S3 (Optional)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET_NAME=

# WhatsApp Business API (Optional)
WHATSAPP_PHONE_ID=
WHATSAPP_TOKEN=
```

## Testing

### Jest Setup
```typescript
// Example test
describe('Orders API', () => {
  it('should create a new order', async () => {
    const response = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        packageId: 'uuid',
        playerId: '123456'
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
});
```

---

**Note**: This guide provides the foundation. Implement based on project needs and scale.
