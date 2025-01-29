// Kiểm tra số điện thoại
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
  return phoneRegex.test(phone);
};

// Kiểm tra email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Kiểm tra giá trị số
export const isValidNumber = (value: any): boolean => {
  return !isNaN(value) && value >= 0;
};

// Kiểm tra giới hạn công nợ
export const isWithinDebtLimit = (currentDebt: number, debtLimit: number, newAmount: number): boolean => {
  return (currentDebt + newAmount) <= debtLimit;
};

// Kiểm tra tồn kho
export const hasEnoughStock = (currentStock: number, requestedQuantity: number): boolean => {
  return currentStock >= requestedQuantity;
}; 