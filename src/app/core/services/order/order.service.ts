import { Injectable } from '@angular/core';
import { Order } from '../../models/order.model';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { CrudResponse } from '../../models/crud-response.model';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({ providedIn: 'root' })
export class OrderService {

  private readonly INDEX_KEY = 'orders_index';
  private orders: Order[] = [];

  orderSubject$ = new BehaviorSubject<Order[]>([]);

  constructor(private ls: LocalStorageService) {
    this.loadOrders();
  }

  private loadOrders(): void {
    const ids = this.ls.get<number[]>(this.INDEX_KEY) || [];

    this.orders = ids
      .map(id => this.ls.get<Order>(`order_${id}`))
      .filter((o): o is Order => !!o);

    this.orders.forEach(o => {
      if (o.autoTime == null) o.autoTime = 0;
    });

    this.orderSubject$.next([...this.orders]);
  }

  private saveIndex(): void {
    const ids = this.orders.map(o => o.id);
    this.ls.set(this.INDEX_KEY, ids);
  }

  private saveOrder(order: Order): void {
    this.ls.set(`order_${order.id}`, order);
  }

  add(order: Order): Observable<CrudResponse<Order>> {
    return of(true).pipe(
      delay(200),
      map(() => {
        this.orders.push(order);
        this.saveOrder(order);
        this.saveIndex();

        this.orderSubject$.next([...this.orders]);
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

        this.saveOrder(order);
        this.saveIndex();

        this.orderSubject$.next([...this.orders]);
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

        this.ls.remove(`order_${id}`);
        this.saveIndex();

        this.orderSubject$.next([...this.orders]);
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
          if (idx !== -1) {
            this.orders[idx] = u;
            this.saveOrder(u);
          }
        });

        this.saveIndex();
        this.orderSubject$.next([...this.orders]);

        return { success: true, message: 'Orders updated.' };
      }),
      catchError(() => throwError(() => ({ success: false, message: 'Bulk update failed.' })))
    );
  }
}
