/**
 * Vitest Setup File
 * إعداد بيئة الاختبارات
 *
 * - Imports jest-dom matchers for DOM assertions
 * - Mocks browser APIs not available in jsdom
 */

import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock window.location
Object.defineProperty(window, 'location', {
  value: { href: '', assign: vi.fn() },
  writable: true,
});
