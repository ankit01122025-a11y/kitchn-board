// Order status values
export type OrderStatus = 'PLACED' | 'PREPARING' | 'READY' | 'SERVED';

// Line item inside an order
export interface OrderItem {
  itemId: number;
  name: string;
  description?: string;
  price: number;
  qty: number;
  total: number;
}

// Complete order
export interface Order {
  id: number;
  categoryIds: number[];
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string;
  autoTime?: number;
}