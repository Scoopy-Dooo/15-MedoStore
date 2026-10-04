// Unit Tests: useGames hook
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useGames } from '../../app/hooks/useGames';
import gamesService from '../../services/games.service';

vi.mock('../../services/games.service');
const mockSvc = vi.mocked(gamesService);

const mockGame = { id: '1', name: 'PUBG', nameAr: 'ببجي', slug: 'pubg', image: 'img.jpg', category: 'Battle Royale', isActive: true, sortOrder: 0, createdAt: '', updatedAt: '' };
const mockResp = { success: true, data: { games: [mockGame], pagination: { page: 1, limit: 10, total: 1, totalPages: 1 } } };

function makeWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

describe('useGames hook', () => {
  beforeEach(() => vi.clearAllMocks());

  it('fetches games successfully', async () => {
    mockSvc.getAllGames.mockResolvedValueOnce(mockResp);
    const { result } = renderHook(() => useGames(), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.games).toHaveLength(1);
  });

  it('handles error state', async () => {
    mockSvc.getAllGames.mockRejectedValueOnce(new Error('fail'));
    const { result } = renderHook(() => useGames(), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('passes params to service', async () => {
    mockSvc.getAllGames.mockResolvedValueOnce(mockResp);
    renderHook(() => useGames({ limit: 5, page: 2 }), { wrapper: makeWrapper() });
    await waitFor(() => expect(mockSvc.getAllGames).toHaveBeenCalledWith({ limit: 5, page: 2 }));
  });
});
