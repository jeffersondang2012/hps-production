import React, { FC } from 'react';
import { Modal, TransactionList, Input, Checkbox } from '@/components';
import { useForm } from 'react-hook-form';

interface PaymentModalProps {
  partnerId: string;
  transactions: Transaction[];
}

export const PaymentModal: FC<PaymentModalProps> = ({
  partnerId,
  transactions
}) => {
  const { register } = useForm();

  const handleSelectTransaction = (transaction: Transaction) => {
    // Implementation of handleSelectTransaction
  };

  const methods = {
    cash: false,
    transfer: false,
    barter: false
  };

  return (
    <Modal title="Thanh toán công nợ">
      <form>
        {/* Danh sách giao dịch cần thanh toán */}
        <TransactionList
          transactions={transactions}
          onSelect={handleSelectTransaction}
        />

        {/* Thông tin thanh toán */}
        <div className="space-y-4">
          <div>
            <label>Phương thức thanh toán</label>
            <div className="space-x-2">
              <Checkbox {...register('methods.cash')}>Tiền mặt</Checkbox>
              <Checkbox {...register('methods.transfer')}>Chuyển khoản</Checkbox>
              <Checkbox {...register('methods.barter')}>Đổi hàng</Checkbox>
            </div>
          </div>

          {/* Số tiền cho từng phương thức */}
          {methods.cash && (
            <Input
              label="Số tiền mặt"
              type="number"
              {...register('amounts.cash')}
            />
          )}
          {/* ... other payment methods */}
        </div>
      </form>
    </Modal>
  );
}; 