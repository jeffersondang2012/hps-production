import { Payment, Transaction } from '@/types/database.types';
import { BaseService } from '../base/base.service';
import { Timestamp, doc, collection, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';

class PaymentService extends BaseService<Payment> {
  constructor() {
    super('payments');
  }

  async create(data: Omit<Payment, 'id'>): Promise<Payment & { id: string }> {
    const batch = writeBatch(db);

    // Tạo payment
    const paymentRef = doc(this.collection);
    const payment: Omit<Payment, 'id'> = {
      ...data,
      createdAt: data.createdAt || Timestamp.now()
    };
    batch.set(paymentRef, payment);

    // Cập nhật trạng thái các giao dịch
    await Promise.all(
      data.transactionIds.map(async (id) => {
        const ref = doc(collection(db, 'transactions'), id);
        const snapshot = await getDocs(query(collection(db, 'transactions'), where('id', '==', id)));
        if (snapshot.empty) {
          throw new Error(`Không tìm thấy giao dịch với id ${id}`);
        }
        const transaction = snapshot.docs[0].data() as Transaction;
        
        // Cập nhật trạng thái thanh toán
        batch.update(ref, {
          paymentStatus: data.amount >= transaction.amount ? 'PAID' : 'PARTIAL'
        });
      })
    );

    await batch.commit();
    return {
      id: paymentRef.id,
      ...payment
    };
  }

  async getByPartner(partnerId: string): Promise<(Payment & { id: string })[]> {
    return this.getAll({
      where: [['partnerId', '==', partnerId]]
    });
  }

  async getByTransaction(transactionId: string): Promise<(Payment & { id: string })[]> {
    return this.getAll({
      where: [['transactionIds', 'array-contains', transactionId]]
    });
  }
}

export const paymentService = new PaymentService(); 