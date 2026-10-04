// Integration Tests: Game Management Workflows
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router';
import React from 'react';
import gamesService from '../../services/games.service';

// Mock all services
vi.mock('../../services/games.service');
vi.mock('../../services/admin.service');
vi.mock('../../services/packages.service');

// Mock contexts
vi.mock('../../app/context/AuthContext', () => ({
  useAuth: () => ({ user: { id: '1', name: 'Admin', role: 'ADMIN' }, logout: vi.fn() }),
}));
vi.mock('../../app/context/AppContext', () => ({
  useApp: () => ({ language: 'en', theme: 'dark', userName: 'Admin', toggleLanguage: vi.fn(), toggleTheme: vi.fn(), setUserName: vi.fn() }),
}));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

// Mock DnD kit to avoid complex DOM setup
vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  closestCenter: vi.fn(),
  KeyboardSensor: vi.fn(),
  PointerSensor: vi.fn(),
  useSensor: vi.fn(),
  useSensors: vi.fn(() => []),
}));
vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  sortableKeyboardCoordinates: vi.fn(),
  verticalListSortingStrategy: vi.fn(),
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
  arrayMove: vi.fn((arr: unknown[]) => arr),
}));
vi.mock('@dnd-kit/utilities', () => ({ CSS: { Transform: { toString: vi.fn() } } }));

const mockGamesSvc = vi.mocked(gamesService);

const mockGame = {
  id: '1', name: 'PUBG Mobile', nameAr: 'ببجي موبايل', slug: 'pubg-mobile',
  image: 'https://example.com/pubg.jpg', category: 'Battle Royale',
  isActive: true, sortOrder: 0, createdAt: '', updatedAt: '',
  _count: { packages: 3 },
};

function renderWithProviders(ui: React.ReactElement) {
  const qc = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
}

describe('Game Management Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGamesSvc.getAllGames.mockResolvedValue({
      success: true,
      data: {
        games: [mockGame],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      },
    });
  });

  it('displays games in table', async () => {
    const { default: GamesManagement } = await import('../../app/pages/admin/GamesManagement');
    renderWithProviders(<GamesManagement />);
    await waitFor(() => expect(screen.getByText('PUBG Mobile')).toBeInTheDocument(), { timeout: 5000 });
  });

  it('shows add game button', async () => {
    const { default: GamesManagement } = await import('../../app/pages/admin/GamesManagement');
    renderWithProviders(<GamesManagement />);
    await waitFor(() => expect(screen.getByText('Add Game')).toBeInTheDocument(), { timeout: 5000 });
  });

  it('games list fetches on mount', async () => {
    const { default: GamesManagement } = await import('../../app/pages/admin/GamesManagement');
    renderWithProviders(<GamesManagement />);
    await waitFor(() => expect(mockGamesSvc.getAllGames).toHaveBeenCalled(), { timeout: 5000 });
  });
});
