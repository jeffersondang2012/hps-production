import { FC } from 'react';
import { Modal } from '@/components/molecules/Modal';
import { Table } from '@/components/molecules/Table';
import { Product } from '@/types/database.types';
import { formatCurrency, formatDate } from '@/utils/format';

interface PriceHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export const PriceHistoryModal: FC<PriceHistoryModalProps> = ({
  isOpen,
  onClose,
  product
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Lịch sử giá - ${product.name}`}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-gray-500">Giá hiện tại:</span>
            <span className="ml-2 font-medium">{formatCurrency(product.currentPrice)}</span>
          </div>
          <div>
            <span className="text-gray-500">Đơn vị:</span>
            <span className="ml-2">{product.unit}</span>
          </div>
        </div>

        <Table
          columns={[
            {
              header: 'Ngày thay đổi',
              accessor: 'date',
              cell: (value: Date) => formatDate(value)
            },
            {
              header: 'Giá',
              accessor: 'price',
              cell: (value: number) => formatCurrency(value)
            },
            {
              header: 'Ghi chú',
              accessor: 'note',
              cell: (value?: string) => value || '-'
            }
          ]}
          data={product.priceHistory}
        />
      </div>
    </Modal>
  );
}; 