import { Injectable } from '@angular/core';
import { Order } from '../../models/order.model';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from '../../../shared/services/toast/toast.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private storageKey = 'orders';
  orders: Order[] = [];

  orderSubject$ = new BehaviorSubject<Order[]>([]);

  constructor(private toast: ToastService) {
    this.loadOrders();
  }

  // Load orders from LocalStorage
  private loadOrders() {
    const data = localStorage.getItem(this.storageKey);
    this.orders = data ? JSON.parse(data) : [];
    this.orderSubject$.next([...this.orders]);

  }

  // Save orders to LocalStorage + notify subscribers
  private saveOrders() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.orders));
    this.orderSubject$.next([...this.orders]);
  }

  // Add new order
  addOrder(order: Order): void {
    this.orders.push(order);
    this.saveOrders();
    this.toast.success('Order added successfully.');
  }

  // Update a single order
  updateOrder(updated: Order): void {
    const index = this.orders.findIndex(o => o.id === updated.id);

    if (index !== -1) {
      this.orders[index] = updated;
      this.saveOrders();
    }
  }

  // Update multiple orders
  updateOrders(updatedOrders: Order[]): void {
    updatedOrders.forEach(updated => {
      const index = this.orders.findIndex(o => o.id === updated.id);

      if (index !== -1) {
        this.orders[index] = updated;
      }
    });

    this.saveOrders();
  }

  // Delete order by ID
  deleteOrder(id: number): void {
    this.orders = this.orders.filter(o => o.id !== id);
    this.saveOrders();
    this.toast.error('Order deleted successfully.');
  }
}
