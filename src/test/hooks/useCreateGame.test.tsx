// Unit Tests: useCreateGame mutation hook
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useCreateGame } from '../../app/hooks/useCreateGame';
import adminService from '../../services/admin.service';

vi.mock('../../services/admin.service');
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const mockAdminSvc = vi.mocked(adminService);

const mockGame = { id: '1', name: 'New Game', nameAr: 'لعبة جديدة', slug: 'new-game', image: 'img.jpg', category: 'Other', isActive: true, sortOrder: 0, createdAt: '', updatedAt: '' };

function makeWrapper() {
  const qc = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

describe('useCreateGame hook', () => {
  beforeEach(() => vi.clearAllMocks());

  it('creates game and invalidates cache on success', async () => {
    mockAdminSvc.createGame.mockResolvedValueOnce({ success: true, data: mockGame });
    const { result } = renderHook(() => useCreateGame(), { wrapper: makeWrapper() });

    act(() => {
      result.current.mutate({ name: 'New Game', nameAr: 'لعبة جديدة', image: 'img.jpg', category: 'Other' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockAdminSvc.createGame).toHaveBeenCalledOnce();
  });

  it('handles mutation error', async () => {
    mockAdminSvc.createGame.mockRejectedValueOnce(new Error('Create failed'));
    const { result } = renderHook(() => useCreateGame(), { wrapper: makeWrapper() });

    act(() => {
      result.current.mutate({ name: 'Bad', nameAr: 'سيء', image: 'img.jpg', category: 'Other' });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
