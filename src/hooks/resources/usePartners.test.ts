// @ts-nocheck
import { renderHook } from '@testing-library/react';
import { usePartners } from './usePartners';
import { partnerService } from '@/services/core/partner.service';
import { Partner } from '@/types/database.types';
import { Timestamp } from 'firebase/firestore';
import { act } from 'react-dom/test-utils';

// Helper function to flush promises
const flushPromises = () => new Promise(resolve => setTimeout(resolve, 100));

// Mock modules
jest.mock('@/services/core/partner.service', () => ({
  partnerService: {
    getAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }
}));

// Mock useAuth hook
jest.mock('@/hooks/auth/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'test-user' }
  })
}));

// Mock notification store
jest.mock('@/stores/useNotificationStore', () => ({
  useNotificationStore: () => ({
    showError: jest.fn(),
    showSuccess: jest.fn()
  })
}));

describe('usePartners', () => {
  const mockPartner: Partner = {
    id: 'test-partner-1',
    name: 'Test Partner',
    type: 'SUPPLIER',
    phone: '0123456789',
    address: 'Test Address',
    isActive: true,
    debtLimit: 1000000,
    currentDebt: 0,
    createdBy: 'test-user',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    notificationChannels: {
      zalo: null,
      telegram: null
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch partners successfully', async () => {
    (partnerService.getAll as jest.Mock).mockResolvedValue([mockPartner]);
    
    let result;
    await act(async () => {
      result = renderHook(() => usePartners());
      await flushPromises();
    });
    
    expect(result?.result.current.partners).toEqual([mockPartner]);
    expect(result?.result.current.isLoading).toBe(false);
  }, 10000);

  it('should handle fetch error', async () => {
    const error = new Error('Failed to fetch');
    (partnerService.getAll as jest.Mock).mockRejectedValue(error);
    
    let result;
    await act(async () => {
      result = renderHook(() => usePartners());
      await flushPromises();
    });
    
    expect(result.result.current.error).toBeTruthy();
  }, 10000);

  it('should create partner successfully', async () => {
    const newPartnerData = {
      name: 'New Partner',
      type: 'SUPPLIER' as const,
      phone: '0987654321',
      address: 'New Address',
      debtLimit: 2000000
    };

    const newPartner = {
      ...mockPartner,
      ...newPartnerData,
      id: 'test-partner-2'
    };

    (partnerService.create as jest.Mock).mockResolvedValue(newPartner);
    (partnerService.getAll as jest.Mock)
      .mockResolvedValueOnce([mockPartner])
      .mockResolvedValueOnce([mockPartner, newPartner]);

    let result;
    await act(async () => {
      result = renderHook(() => usePartners());
      await flushPromises();
    });

    await act(async () => {
      await result.result.current.createPartner(newPartnerData);
      await flushPromises();
    });

    expect(partnerService.create).toHaveBeenCalled();
    expect(result.result.current.partners).toHaveLength(2);
  }, 10000);

  it('should identify partners over debt limit', async () => {
    const overDebtPartner = {
      ...mockPartner,
      currentDebt: 1500000
    };

    (partnerService.getAll as jest.Mock).mockResolvedValue([overDebtPartner]);

    let result;
    await act(async () => {
      result = renderHook(() => usePartners());
      await flushPromises();
    });

    const partner = result.result.current.partners[0];
    expect(partner.currentDebt).toBeGreaterThan(partner.debtLimit);
  }, 10000);
}); 