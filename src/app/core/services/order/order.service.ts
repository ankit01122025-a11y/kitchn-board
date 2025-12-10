import { Injectable } from '@angular/core';
import { Order } from '../../models/order.model';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { CrudResponse } from '../../models/crud-response.model';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly KEY = 'orders';
  private orders: Order[] = [];

  orderSubject$ = new BehaviorSubject<Order[]>([]);

  constructor(private ls: LocalStorageService) {
    this.loadOrders();
  }

  private loadOrders(): void {
    this.orders = this.ls.get<Order[]>(this.KEY) || [];
    this.orders.forEach(o => { if (o.autoTime == null) o.autoTime = 0; });
    this.emit();
  }

  private save(): void {
    this.ls.set(this.KEY, this.orders);
    this.emit();
  }

  private emit(): void {
    this.orderSubject$.next([...this.orders]);
  }

  add(order: Order): Observable<CrudResponse<Order>> {
    return of(true).pipe(
      delay(200),
      map(() => {
        this.orders.push(order);
        this.save();
        return { success: true, message: 'Order placed successfully.' };
      }),
      catchError(() => throwError(() => ({ success: false, message: 'Add failed.' })))
    );
  }

  update(order: Order): Observable<CrudResponse<Order>> {
    return of(true).pipe(
      delay(200),
      map(() => {
        this.orders = this.orders.map(o => o.id === order.id ? order : o);
        this.save();
        return { success: true, message: 'Order updated successfully.' };
      }),
      catchError(() => throwError(() => ({ success: false, message: 'Update failed.' })))
    );
  }

  delete(id: number): Observable<CrudResponse<void>> {
    return of(true).pipe(
      delay(200),
      map(() => {
        this.orders = this.orders.filter(o => o.id !== id);
        this.save();
        return { success: true, message: 'Order deleted successfully.' };
      }),
      catchError(() => throwError(() => ({ success: false, message: 'Delete failed.' })))
    );
  }

  updateOrders(updatedOrders: Order[]): Observable<CrudResponse<void>> {
    return of(true).pipe(
      delay(200),
      map(() => {
        updatedOrders.forEach(u => {
          const idx = this.orders.findIndex(o => o.id === u.id);
          if (idx !== -1) this.orders[idx] = u;
        });
        this.save();
        return { success: true, message: 'Orders updated.' };
      }),
      catchError(() => throwError(() => ({ success: false, message: 'Bulk update failed.' })))
    );
  }
}
