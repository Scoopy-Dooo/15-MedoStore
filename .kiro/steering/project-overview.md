---
inclusion: auto
---

# Medo Store - Project Steering Guide

## Project Context
You are working on **Medo Store**, a modern gaming top-up e-commerce platform targeting Sudanese and Arabic-speaking gamers.

## Current Version
- **Version**: 1.0.0
- **Status**: Production Ready
- **Next Target**: 2.0.0 (Major upgrade)

## Technology Stack

### Frontend
- **Framework**: React 18.3.1 + TypeScript
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS 4.1.12
- **Router**: React Router 7.13.0
- **Animations**: motion/react 12.23.24
- **UI Components**: Radix UI (45+ components)
- **State Management**: React Context API + LocalStorage

### Current Architecture
```
Single Page Application (SPA)
├── Client-side only (no backend yet)
├── WhatsApp integration for orders
├── LocalStorage for user preferences
└── Static deployment (Vercel/Netlify ready)
```

## Project Structure
```
src/app/
├── components/      → Reusable UI components
│   ├── ui/         → 45+ Radix UI components
│   ├── GameCard.tsx
│   ├── ProductCard.tsx
│   ├── Navbar.tsx
│   └── Footer.tsx
├── pages/          → Application pages
│   ├── Home.tsx
│   ├── Games.tsx
│   └── GameDetail.tsx
├── context/        → Global state management
├── data/           → Games data & translations
├── hooks/          → Custom React hooks
└── routes.tsx      → Routing configuration
```

## Core Features (v1.0.0)

### ✅ Implemented
1. **Multi-language Support**: Arabic (RTL) + English (LTR)
2. **Theme System**: Dark mode + Light mode
3. **Games Catalog**: 5 games with 25+ packages
4. **WhatsApp Orders**: Direct ordering system
5. **User Preferences**: Saved in LocalStorage
6. **Responsive Design**: Mobile-first approach
7. **Animations**: Smooth transitions with motion/react

### 🎮 Available Games
1. **PUBG Mobile**: UC packages + memberships
2. **Free Fire**: Diamond packages + memberships
3. **Telegram**: Stars + Premium + login help
4. **GearUp Booster**: Subscriptions
5. **TikTok**: Coin packages

## Design System

### Colors
```css
/* Dark Mode (Default) */
Background: #0b0f1a
Primary: Purple-400 (Neon)
Accent: Pink-400 (Glow)
Text: White/Gray

/* Light Mode */
Background: White
Primary: Purple-600
Accent: Pink-600
Text: Dark Gray
```

### Visual Effects
- Glassmorphism backgrounds
- Neon glow on hover
- Smooth shadows
- Motion animations
- Gradient overlays

## Contact & Order System
- **WhatsApp**: 249908180432
- **Order Flow**: Product → WhatsApp → Manual processing
- **No payment gateway yet** (planned for v2.0)

## Version 2.0.0 Roadmap

### Major Additions Needed
1. **Backend System** (Node.js/Express)
2. **Database** (PostgreSQL/MongoDB)
3. **User Authentication** (JWT)
4. **Payment Gateway** (Electronic payments)
5. **Admin Dashboard** (Product/Order management)
6. **Order Tracking** (Real-time status)
7. **Rating System** (User reviews)
8. **Notifications** (Email/Push)
9. **PWA Support** (Offline capability)
10. **Advanced Analytics** (User behavior)

## Development Guidelines

### Code Standards
- **TypeScript**: Strict mode enabled
- **Components**: Functional components with hooks
- **Styling**: Tailwind CSS utility classes
- **State**: Context API for global, local state for components
- **Naming**: Descriptive names in English
- **Comments**: Arabic comments for complex logic

### File Organization
- One component per file
- Group related components in folders
- Separate concerns (UI, logic, data)
- Use index files for exports

### Testing (Future)
- Unit tests for utilities
- Component tests with React Testing Library
- E2E tests with Playwright
- Minimum 80% code coverage

## Important Notes

### What NOT to Change (v1.0.0 → v2.0.0)
- ❌ Core design language (Purple/Pink theme)
- ❌ Multi-language system structure
- ❌ Component architecture (keep React functional)
- ❌ Games data structure (extend, don't replace)
- ❌ WhatsApp integration (keep as fallback)

### What TO Add/Improve
- ✅ Backend API endpoints
- ✅ Database models
- ✅ Authentication system
- ✅ Payment processing
- ✅ Admin interface
- ✅ Advanced features (ratings, tracking, etc.)
- ✅ Performance optimizations
- ✅ SEO improvements

## Key Files to Reference

### Documentation
- `PROJECT_DOCUMENTATION_AR.md` - Complete Arabic docs
- `PROJECT_DOCUMENTATION_EN.md` - Complete English docs
- `TODO.md` - 200+ tasks for v2.0
- `CHANGELOG.md` - Version history
- `DEPLOYMENT_GUIDE.md` - Hosting instructions

### Code
- `src/app/data/gamesData.ts` - All games and packages
- `src/app/data/translations.ts` - i18n translations
- `src/app/context/AppContext.tsx` - Global state
- `src/app/routes.tsx` - Routing setup

## Common Tasks

### Adding a New Game
1. Add game data to `gamesData.ts`
2. Add translations to `translations.ts`
3. Prepare game image (optimized)
4. Test on all pages
5. Update documentation

### Adding a New Package
1. Update respective game object in `gamesData.ts`
2. Ensure price formatting is correct
3. Test WhatsApp message generation
4. Verify display on GameDetail page

### Modifying UI
1. Check both Dark and Light modes
2. Test on mobile screens
3. Verify RTL (Arabic) layout
4. Ensure accessibility (a11y)
5. Maintain consistent animations

## Performance Targets
```
First Contentful Paint: < 1.5s
Time to Interactive: < 2.5s
Bundle Size: < 600KB
Lighthouse Score: 90+
```

## Security Considerations
- Input sanitization for user names
- XSS protection (React default)
- HTTPS only in production
- No sensitive data in LocalStorage
- Rate limiting (future backend)

## Deployment
- **Current**: Static hosting (Vercel/Netlify)
- **Future**: Full-stack deployment with backend

## Support & Contacts
- **Developer**: Mohamed Saad (Scoopy Doo)
- **WhatsApp**: 249908180432
- **GitHub**: @Scoopy-Dooo

---

## Quick Commands Reference

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Git
git status          # Check changes
git add .           # Stage all changes
git commit -m "msg" # Commit changes
git push            # Push to remote
```

---

**Last Updated**: 2024-01-XX
**For Version**: 1.0.0 → 2.0.0 transition
**Maintained By**: Kiro AI Assistant + Mohamed Saad
