import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { AuthState, User } from '@/types/auth.types';
import { PERMISSIONS, ROLE_PERMISSIONS } from '@/constants/permissions';
import { auditService } from '@/services/core/audit.service';
import { userService } from '@/services/core/user.service';

const initialState = {
  user: null,
  isLoading: true,
  error: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        signIn: async (email: string, password: string) => {
          try {
            set({ isLoading: true, error: null });
            
            // Đăng nhập với Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            
            // Lấy thêm thông tin user từ Firestore
            const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
            const userData = userDoc.data() as Omit<User, 'id'>;
            
            if (!userData.isActive) {
              throw new Error('Tài khoản đã bị vô hiệu hóa');
            }

            // Cập nhật last login
            const now = Timestamp.now();
            await updateDoc(doc(db, 'users', userCredential.user.uid), {
              lastLogin: now
            });

            const user = {
              id: userCredential.user.uid,
              ...userData,
              lastLogin: now
            };

            set({
              user,
              isAuthenticated: true,
              error: null
            });

            // Ghi audit log
            await auditService.log({
              userId: user.id,
              userEmail: user.email,
              action: 'USER_LOGIN',
              target: 'auth',
              details: {
                method: 'password'
              }
            });

          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Đăng nhập thất bại',
              isAuthenticated: false 
            });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        signOut: async () => {
          try {
            const { user } = get();
            if (user) {
              // Ghi audit log trước khi đăng xuất
              await auditService.log({
                userId: user.id,
                userEmail: user.email,
                action: 'USER_LOGOUT',
                target: 'auth'
              });
            }

            await firebaseSignOut(auth);
            set(initialState);
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Đăng xuất thất bại' 
            });
            throw error;
          }
        },

        updateProfile: async (data) => {
          const { user } = get();
          if (!user) throw new Error('Chưa đăng nhập');

          try {
            set({ isLoading: true, error: null });
            
            const now = Timestamp.now();
            await updateDoc(doc(db, 'users', user.id), {
              ...data,
              updatedAt: now
            });
            
            const updatedUser = { 
              ...user, 
              ...data,
              updatedAt: now
            };

            set({
              user: updatedUser,
              error: null
            });

            // Ghi audit log
            await auditService.log({
              userId: user.id,
              userEmail: user.email,
              action: 'USER_UPDATE',
              target: 'users',
              details: {
                changes: data
              }
            });

          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Cập nhật thất bại' 
            });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        resetPassword: async (email) => {
          try {
            set({ isLoading: true, error: null });
            await sendPasswordResetEmail(auth, email);

            // Ghi audit log
            const { user } = get();
            if (user) {
              await auditService.log({
                userId: user.id,
                userEmail: user.email,
                action: 'PASSWORD_RESET_REQUEST',
                target: 'auth',
                details: {
                  requestedEmail: email
                }
              });
            }
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Gửi email thất bại' 
            });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        hasPermission: (permission) => {
          const { user } = get();
          if (!user) return false;
          
          // Admin có tất cả quyền
          if (user.role === 'ADMIN') return true;
          
          // Kiểm tra quyền theo role và permissions
          return user.permissions.includes(permission);
        },

        hasAccess: (productionLineId) => {
          const { user } = get();
          if (!user) return false;
          
          // Admin có quyền truy cập tất cả
          if (user.role === 'ADMIN') return true;
          
          // Shareholder chỉ truy cập được dây chuyền được phân quyền
          if (user.role === 'SHAREHOLDER') {
            return user.productionLineAccess?.includes(productionLineId) || false;
          }
          
          // Staff truy cập theo permissions
          return user.permissions.includes(PERMISSIONS.PRODUCTION_VIEW);
        }
      }),
      {
        name: 'auth-store'
      }
    )
  )
);

// Theo dõi trạng thái auth
onAuthStateChanged(auth, async (firebaseUser) => {
  const store = useAuthStore.getState();
  
  if (firebaseUser) {
    if (!store.user) {
      // Lấy thông tin user từ Firestore nếu chưa có
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      const userData = userDoc.data() as Omit<User, 'id'>;
      
      useAuthStore.setState({
        user: {
          id: firebaseUser.uid,
          ...userData
        },
        isAuthenticated: true,
        isLoading: false
      });
    }
  } else {
    // Reset state khi đăng xuất
    useAuthStore.setState(initialState);
  }
}); 