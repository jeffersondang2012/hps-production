import { FC } from 'react';
import { Table } from '@/components/molecules/Table';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { ProductionLine } from '@/types/database.types';
import { formatDate } from '@/utils/format';

interface ProductionLineListProps {
  data: ProductionLine[];
  onEdit: (line: ProductionLine) => void;
  onDelete: (id: string) => void;
}

export const ProductionLineList: FC<ProductionLineListProps> = ({
  data,
  onEdit,
  onDelete
}) => {
  return (
    <Table
      columns={[
        {
          header: 'Tên dây chuyền',
          accessor: 'name'
        },
        {
          header: 'Công suất',
          accessor: 'capacity',
          cell: (value: number) => `${value} tấn/ngày`
        },
        {
          header: 'Trạng thái',
          accessor: 'status',
          cell: (value: ProductionLine['status']) => (
            <span className={`px-2 py-1 rounded-full text-sm ${
              value === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {value === 'active' ? 'Đang hoạt động' : 'Tạm dừng'}
            </span>
          )
        },
        {
          header: 'Thao tác',
          accessor: 'id',
          cell: (_value: any, row: ProductionLine) => (
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                onClick={() => onEdit(row)}
                title="Chỉnh sửa"
              >
                <Icon name="PencilIcon" className="w-4 h-4 text-blue-500" />
              </Button>
              <Button
                variant="ghost"
                onClick={() => onDelete(row.id)}
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