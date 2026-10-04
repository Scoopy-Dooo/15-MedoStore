---
inclusion: auto
---

# Development Workflow Guide - Medo Store

## Daily Development Routine

### 1. Starting Work
```bash
# Pull latest changes
git pull origin main

# Create feature branch
git checkout -b feature/feature-name

# Start dev server
npm run dev
```

### 2. During Development
- Write clean, typed TypeScript code
- Test changes in both Dark/Light modes
- Verify Arabic (RTL) and English (LTR) layouts
- Check mobile responsiveness
- Add comments for complex logic

### 3. Before Committing
```bash
# Build to check for errors
npm run build

# Review changes
git diff

# Stage and commit
git add .
git commit -m "type: descriptive message"
git push origin feature/feature-name
```

## Commit Message Format

### Types
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style (formatting, no logic change)
- `refactor:` Code restructuring
- `perf:` Performance improvement
- `test:` Adding tests
- `chore:` Maintenance tasks

### Examples
```
feat: add user authentication system
fix: resolve mobile navigation issue
docs: update API documentation
style: format code with prettier
refactor: simplify order processing logic
perf: optimize image loading
test: add unit tests for GameCard
chore: update dependencies
```

## Branch Strategy

### Main Branches
```
main        → Production-ready code
develop     → Active development
```

### Feature Branches
```
feature/    → New features
fix/        → Bug fixes
hotfix/     → Emergency fixes
docs/       → Documentation updates
refactor/   → Code improvements
```

### Naming Convention
```bash
feature/user-authentication
feature/payment-gateway
fix/navbar-mobile-issue
fix/price-display-bug
hotfix/critical-security-patch
docs/api-documentation
refactor/cleanup-components
```

## Code Review Checklist

### Before Requesting Review
- [ ] Code follows project standards
- [ ] No console.log or debugging code
- [ ] TypeScript types are correct
- [ ] Components are properly typed
- [ ] No unused imports or variables
- [ ] Comments added for complex logic
- [ ] Tested in both themes
- [ ] Tested in both languages
- [ ] Mobile responsive
- [ ] Build succeeds without warnings

### During Review
- Address all feedback
- Ask questions if unclear
- Make requested changes
- Re-request review when ready

## Testing Strategy (Future)

### Unit Tests
```typescript
// Component test example
describe('GameCard', () => {
  it('renders game information correctly', () => {
    // Test implementation
  });
  
  it('handles click events', () => {
    // Test implementation
  });
});
```

### Integration Tests
- Test complete user flows
- Test API integrations
- Test state management

### E2E Tests
- Test critical paths
- Order flow
- User authentication
- Payment process

## Common Development Tasks

### Adding a New Component
```typescript
// 1. Create component file
// src/app/components/NewComponent.tsx

import React from 'react';

interface NewComponentProps {
  title: string;
  // ... other props
}

export const NewComponent: React.FC<NewComponentProps> = ({ title }) => {
  return (
    <div className="...">
      <h2>{title}</h2>
    </div>
  );
};
```

### Adding a New Page
```typescript
// 1. Create page file
// src/app/pages/NewPage.tsx

export default function NewPage() {
  return (
    <div>
      {/* Page content */}
    </div>
  );
}

// 2. Add route in routes.tsx
{
  path: 'new-page',
  Component: NewPage,
}
```

### Adding New Translations
```typescript
// In translations.ts
export const translations = {
  ar: {
    // ... existing
    newKey: 'النص بالعربي',
  },
  en: {
    // ... existing
    newKey: 'Text in English',
  }
};
```

### Updating Game Data
```typescript
// In gamesData.ts
export const gamesData: Game[] = [
  // ... existing games
  {
    id: 'new-game',
    name: 'New Game',
    nameAr: 'لعبة جديدة',
    image: 'url',
    category: 'Category'
  }
];
```

## Performance Best Practices

### Images
```typescript
// Use optimized images
// Prefer WebP format
// Lazy load images
// Use appropriate sizes

<img 
  src="image.webp" 
  alt="description"
  loading="lazy"
  width={300}
  height={200}
/>
```

### Code Splitting
```typescript
// Use React.lazy for route-based splitting
const GameDetail = React.lazy(() => import('./pages/GameDetail'));

// Wrap in Suspense
<Suspense fallback={<Loading />}>
  <GameDetail />
</Suspense>
```

### State Management
```typescript
// Use local state when possible
const [state, setState] = useState();

// Use Context for global state
const { theme, language } = useApp();

// Avoid prop drilling
// Use composition patterns
```

## Debugging Tips

### Common Issues

#### 1. Build Errors
```bash
# Clear cache and rebuild
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

#### 2. TypeScript Errors
```typescript
// Check types are imported
import type { Game } from '../data/gamesData';

// Ensure props are typed
interface Props {
  game: Game;
}
```

#### 3. Styling Issues
```typescript
// Check Tailwind classes are correct
// Verify dark mode variants
// Test in both themes
className="bg-white dark:bg-gray-900"
```

#### 4. Translation Issues
```typescript
// Verify key exists in both languages
// Check useTranslation hook is used
const { t } = useTranslation();
```

## Version Control Best Practices

### Do's ✅
- Commit frequently with clear messages
- Pull before starting work
- Create feature branches
- Keep commits focused
- Write descriptive messages
- Review your own changes before pushing

### Don'ts ❌
- Don't commit to main directly
- Don't commit sensitive data
- Don't commit node_modules
- Don't commit build files
- Don't force push to shared branches
- Don't commit incomplete features to main

## Collaboration Guidelines

### Communication
- Keep team updated on progress
- Ask for help when stuck
- Document complex decisions
- Share knowledge with team
- Be respectful in code reviews

### Code Ownership
- No code is "yours" or "mine"
- Team owns the codebase
- Help improve any code
- Share responsibility for quality

## Documentation

### When to Document
- Complex algorithms
- Business logic
- API integrations
- Configuration changes
- Breaking changes
- New features

### How to Document
```typescript
/**
 * Sends order to WhatsApp with formatted message
 * @param gameName - Name of the game
 * @param amount - Package amount/type
 * @param price - Price in SDG
 * @returns void
 */
const sendOrder = (gameName: string, amount: string, price: number) => {
  // Implementation
};
```

## Emergency Procedures

### Critical Bug in Production
```bash
# 1. Create hotfix branch from main
git checkout main
git pull
git checkout -b hotfix/critical-issue

# 2. Fix the issue
# ... make changes ...

# 3. Test thoroughly
npm run build

# 4. Commit and push
git add .
git commit -m "hotfix: fix critical issue"
git push origin hotfix/critical-issue

# 5. Merge to main immediately
# 6. Deploy
# 7. Merge to develop
```

### Rollback Deployment
```bash
# Revert to previous version
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard <commit-hash>
git push --force origin main
```

## Useful Resources

### Internal
- PROJECT_DOCUMENTATION_AR.md
- TODO.md
- CONTRIBUTING.md
- DEPLOYMENT_GUIDE.md

### External
- [React Docs](https://react.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite Docs](https://vitejs.dev/)

---

**Remember**: Clean code, clear commits, constant communication! 🚀
