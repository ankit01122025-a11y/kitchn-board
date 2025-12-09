import { Component, Input } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Order } from '../../../core/models/order.model';
import { getOrderTotal } from '../../../shared/utils/common.util';

@Component({
  selector: 'app-order-status-column',
  standalone: true,
  imports: [NgIf, NgFor, NgClass],
  templateUrl: './order-status-column.component.html',
  styleUrls: ['./order-status-column.component.scss']
})
export class OrderStatusColumnComponent {

  @Input() title!: string;
  @Input() color!: string;
  @Input() orders: Order[] = [];

  getOrderTotal = getOrderTotal;

  formatTime(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = (sec % 60).toString().padStart(2, '0');
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  }
}
