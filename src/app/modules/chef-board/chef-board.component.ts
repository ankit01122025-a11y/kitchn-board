import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { interval, Subscription } from 'rxjs';

import { Order } from '../../core/models/order.model';
import { OrderService } from '../../core/services/order/order.service';
import { ToastService } from '../../shared/services/toast/toast.service';
import { OrderStatusColumnComponent } from './order-status-column/order-status-column.component';

@Component({
  selector: 'app-chef-board',
  standalone: true,
  imports: [NgIf, NgFor, OrderStatusColumnComponent],
  templateUrl: './chef-board.component.html',
  styleUrls: ['./chef-board.component.scss']
})
export class ChefBoardComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  placed: Order[] = [];
  preparing: Order[] = [];
  ready: Order[] = [];
  served: Order[] = [];

  private timerSub!: Subscription;
  private orderSub!: Subscription;

  constructor(
    private orderService: OrderService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadOrders();

    this.orderSub = this.orderService.orderSubject$.subscribe((res) => {
      this.orders = res;
      this.loadOrders();
    });


    this.timerSub = interval(1000).subscribe(() => {
      this.incrementTimers();
      this.autoMoveStatus();
    });
  }

  ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
    this.orderSub?.unsubscribe();
  }


  loadOrders() {
    this.orders.forEach(o => {
      if (o.autoTime == null) o.autoTime = 0;
    });

    this.placed = this.orders.filter(o => o.status === 'PLACED');
    this.preparing = this.orders.filter(o => o.status === 'PREPARING');
    this.ready = this.orders.filter(o => o.status === 'READY');
    this.served = this.orders.filter(o => o.status === 'SERVED');
  }

  incrementTimers() {
    this.orders.forEach(o => {
      if (o.status !== 'SERVED') {
        o.autoTime! += 1;
      }
    });
  }

  autoMoveStatus() {
    let changed = false;

    this.orders.forEach(o => {

      if (!o.autoTime) return;

      if (o.status === 'PLACED' && o.autoTime >= 10) {
        o.status = 'PREPARING';
        o.autoTime = 0;
        changed = true;
      }

      else if (o.status === 'PREPARING' && o.autoTime >= 30) {
        o.status = 'READY';
        o.autoTime = 0;
        changed = true;
      }

      else if (o.status === 'READY' && o.autoTime >= 60) {
        o.status = 'SERVED';
        o.autoTime = 0;
        changed = true;
      }

    });

    if (changed) {
      this.orderService.updateOrders(this.orders).subscribe({
        next: (res) => {
          if (res.success) {
            this.loadOrders();
            this.toast.success(res.message || 'Orders updated');
          } else {
            console.error('Auto update failed:', res.message);
          }
        },
        error: (err) => {
          console.error('Auto update error:', err);
        }
      });
    }
  }
}
