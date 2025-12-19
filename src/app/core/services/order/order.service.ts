import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly API = 'http://localhost:3000/orders';

  constructor(private http: HttpClient) { }

  loadOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.API);
  }

  add(order: Order): Observable<Order> {
    return this.http.post<Order>(this.API, order);
  }

  update(order: Order): Observable<Order> {
    return this.http.patch<Order>(`${this.API}/${order.id}`, order);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}