import { FC, useState, useCallback, useMemo } from 'react';
import { Card } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { FilterBar } from '@/components/molecules/FilterBar';
import { Table } from '@/components/molecules/Table';
import { usePartners } from '@/hooks/resources/usePartners';
import { PartnerModal } from './components/PartnerModal';
import { PartnerDetail } from './components/PartnerDetail';
import { Icon } from '@/components/atoms/Icon';
import { formatCurrency } from '@/utils/format';
import { Partner, PartnerType } from '@/types/database.types';
import { toast } from 'react-toastify';
import { useTransactions } from '@/hooks/resources/useTransactions';
import { Timestamp } from 'firebase/firestore';

interface FilterValues {
  type?: PartnerType;
  search?: string;
}

const partnerTypeLabels: Record<PartnerType, string> = {
  CUSTOMER: 'Khách hàng',
  SUPPLIER: 'Nhà cung cấp'
};

export const PartnersPage: FC = () => {
  const [filters, setFilters] = useState<FilterValues>({});
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { partners, isLoading, error, createPartner, updatePartner, deletePartner } = usePartners();
  const { transactions: partnerTransactions, isLoading: isLoadingTransactions } = useTransactions({
    partnerId: selectedPartner?.id
  });

  // Memoize filterOptions
  const filterOptions = useMemo(() => [
    {
      field: 'type',
      label: 'Loại đối tác',
      type: 'select' as const,
      options: [
        { value: 'SUPPLIER', label: 'Nhà cung cấp' },
        { value: 'CUSTOMER', label: 'Khách hàng' },
        { value: 'BOTH', label: 'Cả hai' }
      ]
    },
    {
      field: 'search',
      label: 'Tìm kiếm',
      type: 'search' as const
    }
  ], []); // Empty dependency array since options don't change

  // Keep the memoized handleFilterChange from previous change
  const handleFilterChange = useCallback((newFilters: FilterValues) => {
    setFilters(newFilters);
  }, []);

  // Memoize filteredPartners as well to prevent unnecessary filtering
  const filteredPartners = useMemo(() => 
    partners.filter(partner => {
      if (filters.type && partner.type !== filters.type) {
        return false;
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          partner.name.toLowerCase().includes(searchLower) ||
          partner.phone.includes(searchLower) ||
          partner.address.toLowerCase().includes(searchLower)
        );
      }
      return true;
    }), [partners, filters.type, filters.search]
  );

  const handleCreate = useCallback(async (data: Omit<Partner, 'id'>) => {
    try {
      await createPartner(data);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating partner:', error);
    }
  }, [createPartner]);

  const handleUpdate = useCallback(async (id: string, data: Partial<Partner>) => {
    try {
      setIsSubmitting(true);
      const updatedData = {
        ...selectedPartner,
        ...data,
        updatedAt: Timestamp.now()
      };
      await updatePartner(id, updatedData);
      setIsModalOpen(false);
      setSelectedPartner(null);
      toast.success('Cập nhật đối tác thành công');
    } catch (error) {
      toast.error('Lỗi khi cập nhật đối tác');
    } finally {
      setIsSubmitting(false);
    }
  }, [updatePartner, selectedPartner]);

  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đối tác này?')) {
      await deletePartner(id);
      toast.success('Xóa đối tác thành công');
    }
  }, [deletePartner]);

  const handleEdit = useCallback((partner: Partner) => {
    setSelectedPartner({
      ...partner,
      notificationChannels: {
        zalo: partner.notificationChannels?.zalo || null,
        telegram: partner.notificationChannels?.telegram || null
      }
    });
    setIsModalOpen(true);
  }, []);

  const handleViewDetail = useCallback((partner: Partner) => {
    setSelectedPartner(partner);
    setIsDetailOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedPartner(null);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setIsDetailOpen(false);
    setSelectedPartner(null);
  }, []);

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 text-center">
        <p>Đã xảy ra lỗi: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý Đối tác</h1>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedPartner(null);
            setIsModalOpen(true);
          }}
        >
          Thêm đối tác
        </Button>
      </div>

      <Card>
        <div className="p-4">
          <FilterBar
            filters={filterOptions}
            value={filters}
            onChange={handleFilterChange}
          />
        </div>

        <Table
          columns={[
            {
              header: 'Tên đối tác',
              accessor: 'name'
            },
            {
              header: 'Loại',
              accessor: 'type',
              cell: (value: PartnerType) => partnerTypeLabels[value]
            },
            {
              header: 'Số điện thoại',
              accessor: 'phone'
            },
            {
              header: 'Địa chỉ',
              accessor: 'address'
            },
            {
              header: 'Hạn mức công nợ',
              accessor: 'debtLimit',
              cell: (value: number) => formatCurrency(value)
            },
            {
              header: 'Kênh thông báo',
              accessor: 'notificationChannels',
              cell: (value: Partner['notificationChannels']) => (
                <div className="flex space-x-2">
                  {value?.zalo && (
                    <Icon name="ChatBubbleLeftIcon" className="w-5 h-5 text-blue-500" title="Zalo" />
                  )}
                  {value?.telegram && (
                    <Icon name="PaperAirplaneIcon" className="w-5 h-5 text-blue-500" title="Telegram" />
                  )}
                </div>
              )
            },
            {
              header: 'Thao tác',
              accessor: 'id',
              cell: (_: string, row: Partner) => (
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => handleViewDetail(row)}
                    title="Xem chi tiết"
                  >
                    <Icon name="EyeIcon" className="w-4 h-4 text-blue-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleEdit(row)}
                    title="Chỉnh sửa"
                  >
                    <Icon name="PencilIcon" className="w-4 h-4 text-blue-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleDelete(row.id)}
                    title="Xóa"
                  >
                    <Icon name="TrashIcon" className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              )
            }
          ]}
          data={filteredPartners}
        />
      </Card>

      <PartnerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={selectedPartner ? 
          (data) => handleUpdate(selectedPartner.id, data) : 
          handleCreate
        }
        isSubmitting={isSubmitting}
        initialData={selectedPartner}
      />

      {selectedPartner && (
        <PartnerDetail
          isOpen={isDetailOpen}
          onClose={handleCloseDetail}
          partner={selectedPartner}
          transactions={partnerTransactions}
          isLoadingTransactions={isLoadingTransactions}
        />
      )}
    </div>
  );
}; 