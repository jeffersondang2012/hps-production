import { FC, useState, useCallback, useEffect } from 'react';
import { Card } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { useTransactions, useModal, useProducts, usePartners, useBarterTransaction } from '@/hooks';
import { TransactionList } from './components/TransactionList';
import { TransactionModal } from './components/TransactionModal';
import { BarterModal } from './components/BarterModal';
import { Transaction, TransactionType } from '@/types/database.types';
import { SearchInput } from '@/components/molecules/SearchInput';
import { Select } from '@/components/atoms/Select';
import { DateRangePicker } from '@/components/molecules/DateRangePicker';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/atoms/Tabs';
import { Icon } from '@/components/atoms/Icon';

interface FilterValues {
  type?: Transaction['type'];
  paymentStatus?: Transaction['paymentStatus'];
  search?: string;
  dateRange?: [Date, Date];
}

export const TransactionsPage: FC = () => {
  const { 
    transactions, 
    isLoading, 
    error, 
    createTransaction, 
    updateTransaction, 
    deleteTransaction,
    fetchTransactions
  } = useTransactions();
  const { createBarter, isLoading: isBarterLoading } = useBarterTransaction();
  const { products } = useProducts();
  const { partners } = usePartners();
  const transactionModal = useModal();
  const barterModal = useModal();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>();
  const [transactionType, setTransactionType] = useState<TransactionType>('IN');
  const [filters, setFilters] = useState<FilterValues>({});

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleOpenTransactionModal = useCallback((type: TransactionType) => {
    setTransactionType(type);
    setSelectedTransaction(null);
    transactionModal.open();
  }, []);

  const handleAdd = () => {
    setSelectedTransaction(undefined);
    transactionModal.open();
  };

  const handleAddBarter = () => {
    barterModal.open();
  };

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setTransactionType(transaction.type);
    transactionModal.open();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa giao dịch này?')) {
      await deleteTransaction(id);
    }
  };

  const handleSubmit = async (data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (selectedTransaction) {
        await updateTransaction(selectedTransaction.id, data);
      } else {
        await createTransaction(data);
      }
      transactionModal.close();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCreateBarter = async (data: Parameters<typeof createBarter>[0]) => {
    try {
      await createBarter(data);
      barterModal.close();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleTypeChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      type: value as Transaction['type'] || undefined
    }));
  };

  const handleStatusChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      paymentStatus: value as Transaction['paymentStatus'] || undefined
    }));
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filters.type && transaction.type !== filters.type) return false;
    if (filters.paymentStatus && transaction.paymentStatus !== filters.paymentStatus) return false;
    if (filters.dateRange) {
      const [start, end] = filters.dateRange;
      const date = transaction.createdAt.toDate();
      if (date < start || date > end) return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return transaction.description?.toLowerCase().includes(searchLower);
    }
    return true;
  });

  if (isLoading) {
    return <div className="p-4">Đang tải...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Đã xảy ra lỗi: {error.message}</div>;
  }

  return (
    <Card>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Quản lý Giao dịch</h1>
          <div className="space-x-2">
            <Button
              variant="primary"
              onClick={() => handleOpenTransactionModal('IN')}
              startIcon={<Icon name="ArrowDownTrayIcon" className="w-5 h-5" />}
            >
              Nhập hàng
            </Button>
            <Button
              variant="secondary" 
              onClick={() => handleOpenTransactionModal('OUT')}
              startIcon={<Icon name="ArrowUpTrayIcon" className="w-5 h-5" />}
            >
              Xuất hàng
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            value={filters.type || ''}
            onChange={e => handleTypeChange(e.target.value)}
          >
            <option value="">Tất cả loại</option>
            <option value="IN">Nhập hàng</option>
            <option value="OUT">Xuất hàng</option>
          </Select>

          <Select
            value={filters.paymentStatus || ''}
            onChange={e => handleStatusChange(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING">Chưa thanh toán</option>
            <option value="PARTIAL">Thanh toán một phần</option>
            <option value="PAID">Đã thanh toán</option>
          </Select>

          <DateRangePicker
            value={filters.dateRange || [new Date(), new Date()]}
            onChange={range => setFilters(prev => ({ ...prev, dateRange: range }))}
          />

          <SearchInput
            value={filters.search || ''}
            onSearch={value => setFilters(prev => ({ ...prev, search: value }))}
            placeholder="Tìm kiếm giao dịch..."
          />
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="in">Nhập hàng</TabsTrigger>
            <TabsTrigger value="out">Xuất hàng</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <TransactionList 
              transactions={filteredTransactions}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </TabsContent>
          <TabsContent value="in">
            <TransactionList 
              transactions={filteredTransactions.filter(t => t.type === 'IN')}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </TabsContent>
          <TabsContent value="out">
            <TransactionList 
              transactions={filteredTransactions.filter(t => t.type === 'OUT')}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </TabsContent>
        </Tabs>

        <TransactionModal
          isOpen={transactionModal.isOpen}
          onClose={transactionModal.close}
          initialData={selectedTransaction}
          onSubmit={handleSubmit}
          type={transactionType}
        />

        <BarterModal
          isOpen={barterModal.isOpen}
          onClose={barterModal.close}
          onSubmit={handleCreateBarter}
          products={products}
          partners={partners}
          isSubmitting={isBarterLoading}
        />
      </div>
    </Card>
  );
}; 