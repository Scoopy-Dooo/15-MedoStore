# E2E Tests - اختبارات النهاية إلى النهاية

## Production URL
**https://medostore-sd.vercel.app**

## Framework
Playwright (recommended) or Cypress

## Installation

```bash
npm install --save-dev @playwright/test
npx playwright install
```

## Test Scenarios

### 1. Admin Login
```
URL: https://medostore-sd.vercel.app/login
Steps:
1. Navigate to /login
2. Enter admin credentials
3. Click login button
4. Verify redirect to /admin
5. Verify dashboard content loads
```

### 2. Game Creation with Image Upload
```
URL: https://medostore-sd.vercel.app/admin/games
Steps:
1. Login as admin
2. Click "Add Game" button
3. Fill in game name (EN + AR)
4. Upload game image
5. Select category
6. Submit form
7. Verify game appears in table
```

### 3. Package Creation
```
URL: https://medostore-sd.vercel.app/admin/packages
Steps:
1. Login as admin
2. Click "Add Package" button
3. Select a game from dropdown
4. Enter amount, price, stock
5. Submit form
6. Verify package appears in table
```

### 4. Customer Views Updated Content
```
URL: https://medostore-sd.vercel.app
Steps:
1. Admin creates/updates a game
2. Navigate to customer homepage
3. Verify new game appears in game list
4. Click on game card
5. Verify packages are displayed
```

### 5. Language Toggle
```
Steps:
1. Click language switcher in sidebar (AR/EN)
2. Verify UI text changes language
3. Verify RTL layout applies for Arabic
4. Refresh page, verify language persists
```

## Sample Playwright Test

```typescript
import { test, expect } from '@playwright/test';

const BASE_URL = 'https://medostore-sd.vercel.app';

test('admin can login and view dashboard', async ({ page }) => {
  await page.goto(`${BASE_URL}/login`);
  await page.fill('[name="email"]', process.env.ADMIN_EMAIL!);
  await page.fill('[name="password"]', process.env.ADMIN_PASSWORD!);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(`${BASE_URL}/admin`);
  await expect(page.locator('h1')).toContainText('Dashboard');
});

test('customer can browse games', async ({ page }) => {
  await page.goto(BASE_URL);
  await expect(page.locator('[data-testid="game-card"]').first()).toBeVisible();
});
```

## Environment Variables for E2E

```env
ADMIN_EMAIL=admin@medostore.com
ADMIN_PASSWORD=your_admin_password
PLAYWRIGHT_BASE_URL=https://medostore-sd.vercel.app
```

## Running Tests

```bash
# Run all E2E tests
npx playwright test

# Run specific test file
npx playwright test src/test/e2e/admin.spec.ts

# Run with UI mode
npx playwright test --ui

# Generate test report
npx playwright show-report
```
