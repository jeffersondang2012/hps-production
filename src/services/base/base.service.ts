import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryConstraint,
  DocumentData,
  WithFieldValue,
  DocumentReference,
  Timestamp,
  Query
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface QueryOptions {
  where?: [string, any, any][];
  orderBy?: [string, 'asc' | 'desc'][];
  limit?: number;
  startAfter?: any;
}

export interface INotificationProvider {
  send(recipient: string, template: string, data: any): Promise<void>;
}

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class BaseService<T extends DocumentData> {
  protected collection;
  protected notificationProvider?: INotificationProvider;

  constructor(collectionName: string, notificationProvider?: INotificationProvider) {
    this.collection = collection(db, collectionName);
    this.notificationProvider = notificationProvider;
  }

  protected getDocRef(id: string): DocumentReference<T> {
    return doc(db, this.collection.path, id) as DocumentReference<T>;
  }

  protected createQuery(options: QueryOptions = {}): Query<T> {
    const constraints: QueryConstraint[] = [];
    
    if (options.where) {
      options.where.forEach(([field, operator, value]) => {
        constraints.push(where(field, operator, value));
      });
    }

    if (options.orderBy) {
      options.orderBy.forEach(([field, direction]) => {
        constraints.push(orderBy(field, direction));
      });
    }

    if (options.limit) {
      constraints.push(limit(options.limit));
    }

    if (options.startAfter) {
      constraints.push(startAfter(options.startAfter));
    }

    return query(this.collection, ...constraints) as Query<T>;
  }

  protected mapDocumentData(doc: DocumentData): T & { id: string } {
    const data = doc.data();
    return {
      id: doc.id,
      ...(data as T)
    };
  }

  async getAll(options: QueryOptions = {}): Promise<(T & { id: string })[]> {
    try {
      const q = this.createQuery(options);
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => this.mapDocumentData(doc));
    } catch (error) {
      throw new AppError(
        `Error getting ${this.collection.path} list`,
        'GET_LIST_FAILED',
        error
      );
    }
  }

  async getById(id: string): Promise<(T & { id: string }) | null> {
    try {
      const docRef = this.getDocRef(id);
      const doc = await getDoc(docRef);
      if (!doc.exists()) return null;
      return this.mapDocumentData(doc);
    } catch (error) {
      throw new AppError(
        `Error getting ${this.collection.path}`,
        'GET_BY_ID_FAILED',
        error
      );
    }
  }

  async create(data: Omit<T, 'id'>): Promise<T & { id: string }> {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(this.collection, {
        ...data,
        createdAt: now,
        updatedAt: now
      });

      const result = {
        id: docRef.id,
        ...data,
        createdAt: now,
        updatedAt: now
      };

      return result as unknown as T & { id: string };
    } catch (error) {
      throw new AppError(
        `Error creating ${this.collection.path}`,
        'CREATE_FAILED',
        error
      );
    }
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = this.getDocRef(id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      throw new AppError(
        `Error updating ${this.collection.path}`,
        'UPDATE_FAILED',
        error
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = this.getDocRef(id);
      await deleteDoc(docRef);
    } catch (error) {
      throw new AppError(
        `Error deleting ${this.collection.path}`,
        'DELETE_FAILED',
        error
      );
    }
  }
} 