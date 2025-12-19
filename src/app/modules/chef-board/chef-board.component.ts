import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Order } from '../../core/models/order.model';
import { ToastService } from '../../shared/services/toast/toast.service';
import { OrderStatusColumnComponent } from './order-status-column/order-status-column.component';

import { selectOrders } from '../../core/store/order/order.selectors';
import * as OrderActions from '../../core/store/order/order.actions';

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
    private store: Store,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.orderSub = this.store.select(selectOrders).subscribe(res => {
      this.orders = res.map(o => ({
        ...o,
        autoTime: o.autoTime ?? 0
      }));
      this.splitOrders();
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

  private splitOrders() {
    this.placed = this.orders.filter(o => o.status === 'PLACED');
    this.preparing = this.orders.filter(o => o.status === 'PREPARING');
    this.ready = this.orders.filter(o => o.status === 'READY');
    this.served = this.orders.filter(o => o.status === 'SERVED');
  }

  private incrementTimers() {
    this.orders = this.orders.map(o => {
      if (o.status !== 'SERVED') {
        return { ...o, autoTime: (o.autoTime ?? 0) + 1 };
      }
      return o;
    });
  }


  private autoMoveStatus() {
    const updated: Order[] = [];

    this.orders.forEach(o => {
      let changed = false;
      let updatedOrder = { ...o };

      if (o.status === 'PLACED' && o.autoTime! >= 10) {
        updatedOrder.status = 'PREPARING';
        updatedOrder.autoTime = 0;
        changed = true;
      }

      else if (o.status === 'PREPARING' && o.autoTime! >= 30) {
        updatedOrder.status = 'READY';
        updatedOrder.autoTime = 0;
        changed = true;
      }

      else if (o.status === 'READY' && o.autoTime! >= 60) {
        updatedOrder.status = 'SERVED';
        updatedOrder.autoTime = 0;
        changed = true;
      }

      if (changed) {
        updated.push(updatedOrder);
      }
    });

    if (updated.length) {
      updated.forEach(o => {
        this.store.dispatch(OrderActions.updateOrder({ order: o }));
      });
    }
  }
}
