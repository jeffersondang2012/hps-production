import { userService } from '../services/userService';

async function initData() {
  try {
    const email = 'admin@hps.com';
    // Tạo tài khoản admin
    await userService.createUser(email, 'Admin@123', {
      email,
      role: 'ADMIN',
      displayName: 'Admin',
      permissions: ['*'],
      isActive: true
    });

    console.log('Khởi tạo dữ liệu thành công!');
  } catch (error) {
    console.error('Lỗi khởi tạo dữ liệu:', error);
  }
}

initData(); 