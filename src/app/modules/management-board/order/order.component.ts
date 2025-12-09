import { Component } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgFor, NgClass } from '@angular/common';

import { Category } from '../../../core/models/category.model';
import { Item } from '../../../core/models/item.model';
import { Order, OrderItem } from '../../../core/models/order.model';

import { CategoryService } from '../../../core/services/category/category.service';
import { ItemService } from '../../../core/services/item/item.service';
import { OrderService } from '../../../core/services/order/order.service';

import { MultiSelectComponent } from '../../../shared/components/multi-select/multi-select.component';
import { ConfirmPopupComponent } from '../../../shared/components/confirm-popup/confirm-popup.component';
import { getOrderTotal } from '../../../shared/utils/common.util';

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
  styleUrl: './order.component.scss'
})
export class OrderComponent {

  form!: FormGroup;

  categories: Category[] = [];
  allItems: Item[] = [];
  filteredItems: Item[] = [];
  orders: Order[] = [];

  showOrderModal = false;
  isEdit = false;
  editOrderId: number | null = null;

  total = 0;

  showDelete = false;
  deleteId: number | null = null;

  getOrderTotal = getOrderTotal;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private itemService: ItemService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.loadAll();
    this.initForm();

    this.categoryService.categorySubject$.subscribe(list => {
      this.categories = list;
    });

    this.itemService.itemSubject$.subscribe(list => {
      this.allItems = list;
    });
  }

  initForm() {
    this.form = this.fb.group({
      categoryIds: [[]],
      itemIds: [[]],
      orderItems: [[]],
      status: ['PLACED']
    });
  }

  get orderItems(): OrderItem[] {
    return this.form.get('orderItems')?.value || [];
  }

  loadAll() {
    this.orders = this.orderService.orders;
  }

  openAddOrder() {
    this.isEdit = false;
    this.editOrderId = null;

    this.form.setValue({
      categoryIds: [],
      itemIds: [],
      orderItems: [],
      status: 'PLACED'
    });

    this.total = 0;
    this.filteredItems = [];
    this.showOrderModal = true;
  }

  openEditOrder(order: Order) {
    this.isEdit = true;
    this.editOrderId = order.id;

    this.form.patchValue({
      categoryIds: [...order.categoryIds],
      status: order.status
    });

    this.filteredItems = this.allItems.filter(it =>
      it.categoryIds.some(cid => order.categoryIds.includes(cid))
    );

    this.form.patchValue({
      itemIds: order.items.map(it => it.itemId),
      orderItems: JSON.parse(JSON.stringify(order.items))
    });

    this.updateTotal();
    this.showOrderModal = true;
  }

  closeOrderModal() {
    this.showOrderModal = false;
  }

  onCategoryChange(ids: number[]) {
    if (!ids.length) {
      this.filteredItems = [];
      this.form.patchValue({ itemIds: [], orderItems: [] });
      this.updateTotal();
      return;
    }

    this.filteredItems = this.allItems.filter(it =>
      it.categoryIds.some(cid => ids.includes(cid))
    );
  }

  onItemChange(ids: number[]) {
    if (!ids.length) {
      this.form.patchValue({ orderItems: [] });
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

    this.form.patchValue({ orderItems: items });
    this.updateTotal();
  }

  increaseQty(index: number) {
    const items = [...this.orderItems];
    items[index].qty++;
    items[index].total = items[index].qty * items[index].price;
    this.form.patchValue({ orderItems: items });
    this.updateTotal();
  }

  decreaseQty(index: number) {
    const items = [...this.orderItems];
    if (items[index].qty > 1) {
      items[index].qty--;
      items[index].total = items[index].qty * items[index].price;
      this.form.patchValue({ orderItems: items });
      this.updateTotal();
    }
  }

  updateTotal() {
    this.total = this.orderItems.reduce((s, it) => s + it.total, 0);
  }

  saveOrder() {
    const f = this.form.value;
    if (!f.orderItems.length) return;

    if (this.isEdit) {
      const updated: Order = {
        id: this.editOrderId!,
        categoryIds: f.categoryIds,
        items: f.orderItems,
        status: f.status,
        createdAt: new Date().toISOString()
      };
      this.orderService.updateOrder(updated);
    } else {
      const newOrder: Order = {
        id: Date.now(),
        categoryIds: f.categoryIds,
        items: f.orderItems,
        status: 'PLACED',
        createdAt: new Date().toISOString()
      };
      this.orderService.addOrder(newOrder);
    }

    this.showOrderModal = false;
    this.loadAll();
  }

  openDeletePopup(id: number) {
    this.deleteId = id;
    this.showDelete = true;
  }

  confirmDelete() {
    if (this.deleteId !== null) {
      this.orderService.deleteOrder(this.deleteId);
      this.loadAll();
    }
    this.showDelete = false;
  }

  cancelDelete() {
    this.showDelete = false;
  }
}
