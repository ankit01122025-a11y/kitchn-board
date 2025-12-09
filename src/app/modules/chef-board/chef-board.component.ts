import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { Order } from '../../core/models/order.model';
import { OrderService } from '../../core/services/order/order.service';

@Component({
  selector: 'app-chef-board',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './chef-board.component.html',
  styleUrl: './chef-board.component.scss'
})
export class ChefBoardComponent implements OnInit,OnDestroy {
  orders: Order[] = [];
  placed: Order[] = [];
  preparing: Order[] = [];
  ready: Order[] = [];
  served: Order[] = [];

  timerSub!: Subscription;
  orderSub!: Subscription;

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadOrders();

    // Listen for manual order updates
    this.orderSub = this.orderService.orderSubject$.subscribe(() => {
      this.loadOrders();
    });

    // Timer only updates UI (NOT SAVE)
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
    this.orders = this.orderService.orders;

    // Ensure autoTime is runtime only
    this.orders.forEach(o => {
      if (o.autoTime == null) o.autoTime = 0;
    });

    this.placed = this.orders.filter(o => o.status === 'PLACED');
    this.preparing = this.orders.filter(o => o.status === 'PREPARING');
    this.ready = this.orders.filter(o => o.status === 'READY');
    this.served = this.orders.filter(o => o.status === 'SERVED');
  }

  // ⏱ UI ONLY TIMER (DO NOT SAVE)
  incrementTimers() {
    this.orders.forEach(o => {
      if (o.status !== 'SERVED') {
        o.autoTime! += 1;
      }
    });
  }

  // Move status only when needed
  autoMoveStatus() {
    let changed = false;

    this.orders.forEach(o => {
      if (!o.autoTime) return;

      if (o.status === 'PLACED' && o.autoTime >= 10) {
        o.status = 'PREPARING';
        o.autoTime = 0;     // reset time for next stage
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

    // Save only when status changes (best practice)
    if (changed) {
      this.orderService.updateOrders(this.orders);
      this.loadOrders();
    }
  }

  // Format 1m 08s
  formatTime(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = (sec % 60).toString().padStart(2, '0');
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  }

  getOrderTotal(o: Order) {
    return o.items.reduce((s, x) => s + x.total, 0);
  }
}
