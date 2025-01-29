import { BaseService } from '../base/base.service';
import { User, UserRole } from '@/types/database.types';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import { auditService } from './audit.service';

class UserService extends BaseService<User> {
  constructor() {
    super('users');
  }

  async getByRole(role: UserRole): Promise<User[]> {
    return this.getAll({
      where: [['role', '==', role]]
    });
  }

  async createUser(email: string, password: string, userData: Omit<User, 'id' | 'lastLogin' | 'createdAt' | 'updatedAt'>): Promise<User & { id: string }> {
    try {
      // Tạo tài khoản Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Tạo document trong collection users
      const user = await this.create({
        ...userData,
        email,
        isActive: true,
        lastLogin: null
      });

      // Ghi audit log
      const currentUser = auth.currentUser;
      if (currentUser) {
        await auditService.log({
          userId: currentUser.uid,
          userEmail: currentUser.email || '',
          action: 'USER_CREATE',
          target: 'users',
          details: {
            createdUserId: user.id,
            createdUserEmail: email,
            role: userData.role
          }
        });
      }

      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateRole(userId: string, role: UserRole): Promise<void> {
    await this.update(userId, { role });

    // Ghi audit log
    const currentUser = auth.currentUser;
    if (currentUser) {
      await auditService.log({
        userId: currentUser.uid,
        userEmail: currentUser.email || '',
        action: 'PERMISSION_UPDATE',
        target: 'users',
        details: {
          targetUserId: userId,
          newRole: role
        }
      });
    }
  }

  async updatePermissions(userId: string, permissions: string[]): Promise<void> {
    await this.update(userId, { permissions });

    // Ghi audit log
    const currentUser = auth.currentUser;
    if (currentUser) {
      await auditService.log({
        userId: currentUser.uid,
        userEmail: currentUser.email || '',
        action: 'PERMISSION_UPDATE',
        target: 'users',
        details: {
          targetUserId: userId,
          newPermissions: permissions
        }
      });
    }
  }

  async deactivateUser(userId: string): Promise<void> {
    await this.update(userId, { isActive: false });

    // Ghi audit log
    const currentUser = auth.currentUser;
    if (currentUser) {
      await auditService.log({
        userId: currentUser.uid,
        userEmail: currentUser.email || '',
        action: 'USER_UPDATE',
        target: 'users',
        details: {
          targetUserId: userId,
          action: 'deactivate'
        }
      });
    }
  }

  async activateUser(userId: string): Promise<void> {
    await this.update(userId, { isActive: true });

    // Ghi audit log
    const currentUser = auth.currentUser;
    if (currentUser) {
      await auditService.log({
        userId: currentUser.uid,
        userEmail: currentUser.email || '',
        action: 'USER_UPDATE',
        target: 'users',
        details: {
          targetUserId: userId,
          action: 'activate'
        }
      });
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      // Xóa tài khoản Firebase Auth
      const user = auth.currentUser;
      if (user) {
        await deleteUser(user);
      }

      // Xóa document trong collection users
      await this.delete(userId);

      // Ghi audit log
      const currentUser = auth.currentUser;
      if (currentUser) {
        await auditService.log({
          userId: currentUser.uid,
          userEmail: currentUser.email || '',
          action: 'USER_DELETE',
          target: 'users',
          details: {
            deletedUserId: userId
          }
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

export const userService = new UserService(); 