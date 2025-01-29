import { Card } from '@/components/atoms/Card';
import { useProduction } from '@/hooks/resources/useProduction';
import { useInventory } from '@/hooks/resources/useInventory';
import { formatCurrency } from '@/utils/format';

export const DashboardPage = () => {
  const { productionLines } = useProduction();
  const { inventory } = useInventory();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tổng quan</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-gray-500 text-sm">Doanh thu tháng</h3>
            <p className="text-2xl font-bold mt-2">{formatCurrency(128500000)}</p>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <h3 className="text-gray-500 text-sm">Công nợ</h3>
            <p className="text-2xl font-bold mt-2 text-red-600">{formatCurrency(45000000)}</p>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <h3 className="text-gray-500 text-sm">Tồn kho</h3>
            <p className="text-2xl font-bold mt-2">{formatCurrency(89000000)}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="font-semibold mb-4">Dây chuyền sản xuất</h3>
            <div className="space-y-4">
              {productionLines?.map(line => (
                <div key={line.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{line.name}</p>
                    <p className="text-sm text-gray-500">
                      Cổ phần: {line.shareholderPercentage}%
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-sm ${
                    line.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {line.isActive ? 'Đang hoạt động' : 'Tạm dừng'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="font-semibold mb-4">Tồn kho theo sản phẩm</h3>
            <div className="space-y-4">
              {inventory?.map(item => (
                <div key={item.productId} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} {item.unit}
                    </p>
                  </div>
                  <p className="font-medium">
                    {formatCurrency(item.value)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}; 