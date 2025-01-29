import { collection, query, where, getDocs, addDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Transaction, Partner } from '@/types/database.types';

export interface DebtSummary {
  partnerId: string;
  partnerName: string;
  partnerType: Partner['type'];
  debtAmount: number; // Số tiền nợ (dương là đối tác nợ, âm là công ty nợ)
  debtLimit: number;
  lastTransactionDate: Timestamp;
  isOverLimit: boolean;
}

export interface DebtDetail extends DebtSummary {
  transactions: Transaction[];
}

export class DebtService {
  private collection = collection(db, 'transactions');

  async getDebtSummaries(): Promise<DebtSummary[]> {
    const snapshot = await getDocs(this.collection);
    const transactions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Transaction[];

    // Nhóm giao dịch theo đối tác
    const debtByPartner = new Map<string, {
      transactions: Transaction[];
      debtAmount: number;
      lastTransactionDate: Timestamp;
    }>();

    transactions.forEach(transaction => {
      if (transaction.paymentStatus === 'PAID') return;

      const current = debtByPartner.get(transaction.partnerId) || {
        transactions: [],
        debtAmount: 0,
        lastTransactionDate: transaction.createdAt
      };

      const amount = transaction.price * transaction.quantity;
      // Nếu là nhập hàng (IN), công ty nợ đối tác (số âm)
      // Nếu là xuất hàng (OUT), đối tác nợ công ty (số dương)
      const debtChange = transaction.type === 'IN' ? -amount : amount;

      current.transactions.push(transaction);
      current.debtAmount += debtChange;
      if (transaction.createdAt > current.lastTransactionDate) {
        current.lastTransactionDate = transaction.createdAt;
      }

      debtByPartner.set(transaction.partnerId, current);
    });

    // Lấy thông tin đối tác
    const partnersSnapshot = await getDocs(collection(db, 'partners'));
    const partners = new Map(
      partnersSnapshot.docs.map(doc => [
        doc.id,
        { id: doc.id, ...doc.data() } as Partner
      ])
    );

    // Tổng hợp thông tin công nợ
    return Array.from(debtByPartner.entries()).map(([partnerId, data]) => {
      const partner = partners.get(partnerId);
      if (!partner) throw new Error(`Không tìm thấy đối tác với id ${partnerId}`);

      return {
        partnerId,
        partnerName: partner.name,
        partnerType: partner.type,
        debtAmount: data.debtAmount,
        debtLimit: partner.debtLimit,
        lastTransactionDate: data.lastTransactionDate,
        isOverLimit: Math.abs(data.debtAmount) > partner.debtLimit
      };
    });
  }

  async getDebtDetail(partnerId: string): Promise<DebtDetail> {
    // Lấy thông tin đối tác
    const partnerDoc = await getDocs(
      query(collection(db, 'partners'), where('id', '==', partnerId))
    );
    if (partnerDoc.empty) {
      throw new Error('Không tìm thấy đối tác');
    }
    const partner = { id: partnerId, ...partnerDoc.docs[0].data() } as Partner;

    // Lấy giao dịch của đối tác
    const transactionsSnapshot = await getDocs(
      query(this.collection, where('partnerId', '==', partnerId))
    );
    const transactions = transactionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Transaction[];

    // Tính tổng nợ
    let debtAmount = 0;
    let lastTransactionDate = transactions[0]?.createdAt;

    transactions.forEach(transaction => {
      if (transaction.paymentStatus === 'PAID') return;

      const amount = transaction.price * transaction.quantity;
      debtAmount += transaction.type === 'IN' ? -amount : amount;

      if (transaction.createdAt > lastTransactionDate) {
        lastTransactionDate = transaction.createdAt;
      }
    });

    return {
      partnerId,
      partnerName: partner.name,
      partnerType: partner.type,
      debtAmount,
      debtLimit: partner.debtLimit,
      lastTransactionDate,
      isOverLimit: Math.abs(debtAmount) > partner.debtLimit,
      transactions
    };
  }
}

export const debtService = new DebtService(); 