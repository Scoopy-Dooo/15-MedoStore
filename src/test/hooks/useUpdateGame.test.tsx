// Unit Tests: useUpdateGame mutation hook
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useUpdateGame } from '../../app/hooks/useUpdateGame';
import adminService from '../../services/admin.service';

vi.mock('../../services/admin.service');
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const mockAdminSvc = vi.mocked(adminService);
const mockGame = { id: '1', name: 'Updated', nameAr: 'محدث', slug: 'updated', image: 'img.jpg', category: 'Other', isActive: true, sortOrder: 0, createdAt: '', updatedAt: '' };

function makeWrapper() {
  const qc = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

describe('useUpdateGame hook', () => {
  beforeEach(() => vi.clearAllMocks());

  it('updates game successfully', async () => {
    mockAdminSvc.updateGame.mockResolvedValueOnce({ success: true, data: mockGame });
    const { result } = renderHook(() => useUpdateGame(), { wrapper: makeWrapper() });

    act(() => {
      result.current.mutate({ gameId: '1', data: { name: 'Updated' } });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockAdminSvc.updateGame).toHaveBeenCalledWith('1', { name: 'Updated' });
  });

  it('handles update error', async () => {
    mockAdminSvc.updateGame.mockRejectedValueOnce(new Error('Update failed'));
    const { result } = renderHook(() => useUpdateGame(), { wrapper: makeWrapper() });

    act(() => {
      result.current.mutate({ gameId: '1', data: { name: 'Bad' } });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
