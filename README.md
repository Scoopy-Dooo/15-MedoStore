# Medo Store

A modern, high-end gaming top-up UI built with React and Vite. This project showcases a premium digital storefront for popular games and services, with Arabic and English support, theme persistence, and seamless order integration via WhatsApp.

## Overview

Medo Store is designed as an elegant marketplace for gaming top-ups, digital currencies, and service packages. The interface is optimized for gamers and digital customers in Arabic-speaking regions while also supporting English users.

## Key Features

- Premium gaming marketplace UI
- Responsive product category grid
- Detailed game package pages
- Dark and light theme support
- Arabic and English localization
- WhatsApp order flow with pre-filled messages
- Smooth animated transitions powered by `motion/react`
- Persistent user preferences using localStorage

## Built With

- React
- Vite
- TypeScript
- Tailwind CSS
- Radix UI primitives
- Material UI icons
- React Router
- `motion/react` animations

## Project Structure

- `src/app` - core app entry, routing, and context
- `src/app/components` - reusable UI components like `Navbar`, `Footer`, `GameCard`, and `ProductCard`
- `src/app/context` - application state and theme/language persistence
- `src/app/pages` - route pages for home, games list, and game detail
- `src/app/data` - game catalog and package data
- `src/styles` - global styles, theme, and utility CSS

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- npm, pnpm, or yarn installed

### Install Dependencies

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

## Usage

Open the local development URL printed in the console after running `npm run dev`. Browse the games page, view package details, and use the WhatsApp order buttons to test the order flow.

## Notes

- The project is currently configured as a private Vite app.
- WhatsApp ordering is implemented through a direct link with a pre-filled message based on the selected package and user name.
- The design is inspired by premium esports and digital store experiences.

## Author

- GitHub: [Scoopy-Dooo](https://github.com/Scoopy-Dooo/)

## License

This repository does not include an explicit license. Add one if you want to open-source the project.
