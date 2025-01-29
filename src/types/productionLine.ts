export interface ProductionLine {
  id?: string;
  name: string;
  capacity: number;
  status: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
} 