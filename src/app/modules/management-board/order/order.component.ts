import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { Store } from '@ngrx/store';

import { Category } from '../../../core/models/category.model';
import { Item } from '../../../core/models/item.model';
import { Order, OrderItem } from '../../../core/models/order.model';

import { MultiSelectComponent } from '../../../shared/components/multi-select/multi-select.component';
import { ConfirmPopupComponent } from '../../../shared/components/confirm-popup/confirm-popup.component';
import { LoaderService } from '../../../shared/services/loader/loader.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { getOrderTotal } from '../../../shared/utils/common.util';

import { selectCategories } from '../../../core/store/category/category.selectors';
import { selectItems } from '../../../core/store/item/item.selectors';
import { selectOrders } from '../../../core/store/order/order.selectors';

import * as OrderActions from '../../../core/store/order/order.actions';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    ReactiveFormsModule,
    MultiSelectComponent,
    ConfirmPopupComponent
  ],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  orderForm!: FormGroup;

  categories: Category[] = [];
  allItems: Item[] = [];
  filteredItems: Item[] = [];
  orders: Order[] = [];

  showDelete = false;
  deleteId: number | null = null;
  total = 0;

  getOrderTotal = getOrderTotal;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    public loader: LoaderService,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.initForm();

    this.store.select(selectCategories).subscribe(res => {
      this.categories = res;
    });

    this.store.select(selectItems).subscribe(res => {
      this.allItems = res;
    });

    this.store.select(selectOrders).subscribe(res => {
      this.orders = res;
    });

    this.store.dispatch(OrderActions.loadOrders());
  }

  private initForm(): void {
    this.orderForm = this.fb.group({
      id: null,
      categoryIds: [[]],
      itemIds: [[]],
      orderItems: [[]],
      status: ['PLACED']
    });
  }

  get orderItems(): OrderItem[] {
    return this.orderForm.get('orderItems')?.value || [];
  }

  openAddOrder() {
    this.initForm();
    this.filteredItems = [];
    this.total = 0;
    this.openModal();
  }

  openEditOrder(order: Order) {
    this.orderForm.patchValue({
      id: order.id,
      categoryIds: [...order.categoryIds],
      itemIds: order.items.map(i => i.itemId),
      orderItems: JSON.parse(JSON.stringify(order.items)),
      status: order.status
    });

    this.filteredItems = this.allItems.filter(it =>
      it.categoryIds.some(cid => order.categoryIds.includes(cid))
    );

    this.updateTotal();
    this.openModal();
  }

  onCategoryChange(ids: number[]) {
    if (!ids.length) {
      this.filteredItems = [];
      this.orderForm.patchValue({ itemIds: [], orderItems: [] });
      this.updateTotal();
      return;
    }

    this.filteredItems = this.allItems.filter(it =>
      it.categoryIds.some(cid => ids.includes(cid))
    );
  }

  onItemChange(ids: number[]) {
    if (!ids.length) {
      this.orderForm.patchValue({ orderItems: [] });
      this.updateTotal();
      return;
    }

    const items: OrderItem[] = ids.map(id => {
      const it = this.allItems.find(x => x.id === id)!;
      return {
        itemId: it.id,
        name: it.name,
        description: it.description,
        price: it.price,
        qty: 1,
        total: it.price
      };
    });

    this.orderForm.patchValue({ orderItems: items });
    this.updateTotal();
  }

  increaseQty(i: number) {
    const items = [...this.orderItems];
    items[i].qty++;
    items[i].total = items[i].qty * items[i].price;
    this.orderForm.patchValue({ orderItems: items });
    this.updateTotal();
  }

  decreaseQty(i: number) {
    const items = [...this.orderItems];
    if (items[i].qty > 1) {
      items[i].qty--;
      items[i].total = items[i].qty * items[i].price;
      this.orderForm.patchValue({ orderItems: items });
      this.updateTotal();
    }
  }

  updateTotal() {
    this.total = this.orderItems.reduce((s, it) => s + it.total, 0);
  }

  saveOrder() {
    const f = this.orderForm.value;

    if (!f.orderItems.length) {
      this.toast.error('Please select items.');
      return;
    }

    const payload: Order = {
      id: f.id?.toString() ?? Date.now().toString(),
      categoryIds: f.categoryIds,
      items: f.orderItems,
      status: f.status,
      createdAt: new Date().toISOString(),
      autoTime: 0
    };

    this.loader.show();

    if (f.id) {
      this.store.dispatch(OrderActions.updateOrder({ order: payload }));
      this.toast.success('Order updated');
    } else {
      this.store.dispatch(OrderActions.addOrder({ order: payload }));
      this.toast.success('Order placed');
    }

    this.closeModal();
    this.loader.hide();
  }

  openDeletePopup(id: number) {
    this.deleteId = id;
    this.showDelete = true;
  }

  confirmDelete() {
    if (!this.deleteId) return;

    this.loader.show();
    this.store.dispatch(OrderActions.deleteOrder({ id: this.deleteId }));
    this.toast.success('Order deleted');
    this.showDelete = false;
    this.loader.hide();
  }

  cancelDelete() {
    this.showDelete = false;
  }

  private openModal() {
    document.getElementById('orderModal')?.classList.add('show');
  }

  closeModal() {
    document.getElementById('orderModal')?.classList.remove('show');
  }
}