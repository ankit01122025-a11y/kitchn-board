import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { Order } from '../../core/models/order.model';
import { OrderService } from '../../core/services/order/order.service';
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

  timerSub!: Subscription;
  orderSub!: Subscription;

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadOrders();

    // Listen for manual updates
    this.orderSub = this.orderService.orderSubject$.subscribe(() => {
      this.loadOrders();
    });

    // Timer runs every 1 second
    this.timerSub = interval(1000).subscribe(() => {
      this.incrementTimers();
      this.autoMoveStatus();
    });
  }

  ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
    this.orderSub?.unsubscribe();
  }

  // Load & split orders by status
  loadOrders() {
    this.orders = this.orderService.orders;

    // runtime-only timer
    this.orders.forEach(o => {
      if (o.autoTime == null) o.autoTime = 0;
    });

    this.placed = this.orders.filter(o => o.status === 'PLACED');
    this.preparing = this.orders.filter(o => o.status === 'PREPARING');
    this.ready = this.orders.filter(o => o.status === 'READY');
    this.served = this.orders.filter(o => o.status === 'SERVED');
  }

  // UI-only seconds counter
  incrementTimers() {
    this.orders.forEach(o => {
      if (o.status !== 'SERVED') {
        o.autoTime! += 1;
      }
    });
  }

  // Auto move orders based on timer
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

    // Save only if something changed
    if (changed) {
      this.orderService.updateOrders(this.orders);
      this.loadOrders();
    }
  }

}
