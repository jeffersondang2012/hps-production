import { BaseService } from '../base/base.service';
import { Timestamp } from 'firebase/firestore';

export interface AuditLog {
  id?: string;
  userId: string;
  userEmail: string;
  action: string;
  target: string;
  details: Record<string, any>;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

class AuditService extends BaseService<AuditLog> {
  constructor() {
    super('audit_logs');
  }

  async log(data: Omit<AuditLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    await this.create(data);
  }

  async getByUser(userId: string): Promise<AuditLog[]> {
    return this.getAll({
      where: [['userId', '==', userId]],
      orderBy: [['createdAt', 'desc']]
    });
  }

  async getByAction(action: string): Promise<AuditLog[]> {
    return this.getAll({
      where: [['action', '==', action]],
      orderBy: [['createdAt', 'desc']]
    });
  }

  async getByTarget(target: string): Promise<AuditLog[]> {
    return this.getAll({
      where: [['target', '==', target]],
      orderBy: [['createdAt', 'desc']]
    });
  }
}

export const auditService = new AuditService(); 