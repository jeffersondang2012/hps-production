import { FC } from 'react';
import { Table } from '@/components/molecules/Table';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { Product, ProductType } from '@/types/database.types';
import { formatCurrency } from '@/utils/format';

interface ProductListProps {
  data: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onViewPriceHistory: (product: Product) => void;
}

const productTypeLabels: Record<ProductType, string> = {
  CRUSHED_SAND: 'Cát nghiền',
  FILLING_SAND: 'Cát san lấp'
};

export const ProductList: FC<ProductListProps> = ({
  data,
  onEdit,
  onDelete,
  onViewPriceHistory
}) => {
  return (
    <Table
      columns={[
        {
          header: 'Tên sản phẩm',
          accessor: 'name'
        },
        {
          header: 'Loại',
          accessor: 'type',
          cell: (value: ProductType) => productTypeLabels[value]
        },
        {
          header: 'Đơn vị',
          accessor: 'unit'
        },
        {
          header: 'Giá hiện tại',
          accessor: 'currentPrice',
          cell: (value: number) => formatCurrency(value)
        },
        {
          header: 'Loại hình',
          accessor: 'isTrading',
          cell: (value: boolean) => value ? 'Thương mại' : 'Sản xuất'
        },
        {
          header: 'Tồn tối thiểu',
          accessor: 'minStock',
          cell: (value?: number) => value ? value.toLocaleString('vi-VN') : '-'
        },
        {
          header: 'Thao tác',
          accessor: 'id',
          cell: (value: string, row: Product) => (
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                onClick={() => onViewPriceHistory(row)}
                title="Xem lịch sử giá"
              >
                <Icon name="ChartBarIcon" className="w-4 h-4 text-blue-500" />
              </Button>
              <Button
                variant="ghost"
                onClick={() => onEdit(row)}
                title="Chỉnh sửa"
              >
                <Icon name="PencilIcon" className="w-4 h-4 text-blue-500" />
              </Button>
              <Button
                variant="ghost"
                onClick={() => onDelete(value)}
                title="Xóa"
              >
                <Icon name="TrashIcon" className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          )
        }
      ]}
      data={data}
    />
  );
}; 