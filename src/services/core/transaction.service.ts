import { db, auth } from '@/lib/firebase';
import { collection, addDoc, updateDoc, doc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { Transaction } from '@/types/database.types';
import { Timestamp } from 'firebase/firestore';
import { partnerService } from './partner.service';
import { INotificationProvider } from '../base/base.service';
import { formatCurrency } from '@/utils/format';
import { SystemNotificationType } from '@/types/notification.types';

export const transactionService = {
  async getAll() {
    const querySnapshot = await getDocs(collection(db, 'transactions'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as (Transaction & { id: string })[];
  },

  async getByPartner(partnerId: string) {
    const q = query(collection(db, 'transactions'), where('partnerId', '==', partnerId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as (Transaction & { id: string })[];
  },

  async create(data: Omit<Transaction, 'id' | 'createdAt' | 'createdBy'>) {
    // Đảm bảo các giá trị số được lưu đúng định dạng
    const formattedData = {
      ...data,
      createdAt: new Date(),
      createdBy: auth.currentUser?.uid,
      items: data.items.map(item => ({
        ...item,
        quantity: Number(item.quantity),
        price: Number(item.price),
        total: Number(item.quantity) * Number(item.price)
      }))
    };

    const docRef = await addDoc(collection(db, 'transactions'), formattedData);
    return docRef.id;
  },

  async update(id: string, data: Partial<Transaction>) {
    // Đảm bảo các giá trị số được lưu đúng định dạng nếu cập nhật items
    const formattedData = {
      ...data,
      items: data.items?.map(item => ({
        ...item,
        quantity: Number(item.quantity),
        price: Number(item.price),
        total: Number(item.quantity) * Number(item.price)
      }))
    };

    await updateDoc(doc(db, 'transactions', id), formattedData);
  },

  async delete(id: string) {
    await deleteDoc(doc(db, 'transactions', id));
  },

  async getByProductionLine(productionLineId: string, startDate: Date, endDate: Date): Promise<Transaction[]> {
    return this.getAll({
      where: [
        ['productionLineId', '==', productionLineId],
        ['createdAt', '>=', Timestamp.fromDate(startDate)],
        ['createdAt', '<=', Timestamp.fromDate(endDate)]
      ],
      orderBy: [['createdAt', 'desc']]
    });
  },

  async createBarter(data: {
    partnerId: string;
    vehicleNumber: string;
    outProduct: {
      productId: string;
      quantity: number;
      price: number;
    };
    inProduct: {
      productId: string;
      quantity: number;
      price: number;
    };
    createdBy: string;
  }): Promise<{ outTransaction: Transaction & { id: string }; inTransaction: Transaction & { id: string } }> {
    const now = Timestamp.now();
    
    // Tạo giao dịch xuất
    const outTransaction = await this.create({
      type: 'OUT',
      partnerId: data.partnerId,
      amount: data.outProduct.price * data.outProduct.quantity,
      paymentMethod: 'BARTER',
      paymentStatus: 'PAID',
      items: [{
        productId: data.outProduct.productId,
        quantity: data.outProduct.quantity,
        price: data.outProduct.price
      }],
      createdAt: now,
      updatedAt: now
    });

    // Tạo giao dịch nhập
    const inTransaction = await this.create({
      type: 'IN',
      partnerId: data.partnerId,
      amount: data.inProduct.price * data.inProduct.quantity,
      paymentMethod: 'BARTER',
      paymentStatus: 'PAID',
      items: [{
        productId: data.inProduct.productId,
        quantity: data.inProduct.quantity,
        price: data.inProduct.price
      }],
      createdAt: now,
      updatedAt: now
    });

    return { outTransaction, inTransaction };
  }
}; 