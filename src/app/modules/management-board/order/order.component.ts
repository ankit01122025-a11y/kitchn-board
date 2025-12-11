import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Category } from '../../../core/models/category.model';
import { Item } from '../../../core/models/item.model';
import { Order, OrderItem } from '../../../core/models/order.model';
import { CategoryService } from '../../../core/services/category/category.service';
import { ItemService } from '../../../core/services/item/item.service';
import { OrderService } from '../../../core/services/order/order.service';
import { MultiSelectComponent } from '../../../shared/components/multi-select/multi-select.component';
import { ConfirmPopupComponent } from '../../../shared/components/confirm-popup/confirm-popup.component';
import { getOrderTotal } from '../../../shared/utils/common.util';
import { LoaderService } from '../../../shared/services/loader/loader.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { NgIf, NgFor, NgClass } from '@angular/common';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    NgIf, NgFor, NgClass,
    ReactiveFormsModule,
    MultiSelectComponent,
    ConfirmPopupComponent
  ],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy {
  orderForm!: FormGroup;
  categories: Category[] = [];
  allItems: Item[] = [];
  filteredItems: Item[] = [];
  orders: Order[] = [];
  showDelete = false;
  deleteId: number | null = null;
  total = 0;
  getOrderTotal = getOrderTotal;

  private subs: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private itemService: ItemService,
    private orderService: OrderService,
    public loader: LoaderService,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.initForm();

    this.subs.push(this.categoryService.categorySubject$.subscribe(list => this.categories = list));
    this.subs.push(this.itemService.itemSubject$.subscribe(list => this.allItems = list));
    this.subs.push(this.orderService.orderSubject$.subscribe(list => this.orders = list));

    this.categories = this.categoryService.categorySubject$.value;
    this.allItems = this.itemService.itemSubject$.value;
    this.orders = this.orderService.orderSubject$.value;
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  initForm(): void {
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
      itemIds: order.items.map(it => it.itemId),
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
      this.toast.error("Please select items.");
      return;
    }

    const payload: Order = {
      id: f.id ?? Date.now(),
      categoryIds: f.categoryIds,
      items: f.orderItems,
      status: f.status,
      createdAt: new Date().toISOString(),
      autoTime: 0
    };

    this.loader.show();

    const req$ = f.id
      ? this.orderService.update(payload)
      : this.orderService.add(payload);

    req$.subscribe({
      next: res => {
        if (res.success) {
          this.toast.success(res.message);
          this.closeModal();
        } else {
          this.toast.error(res.message);
        }
        this.loader.hide();
      },
      error: () => {
        this.toast.error("Operation failed.");
        this.loader.hide();
      }
    });
  }

  openDeletePopup(id: number) {
    this.deleteId = id;
    this.showDelete = true;
  }

  confirmDelete() {
    if (!this.deleteId) return;

    this.loader.show();
    this.orderService.delete(this.deleteId).subscribe({
      next: res => {
        if (res.success) {
          this.toast.success(res.message);
        } else {
          this.toast.error(res.message);
        }
        this.showDelete = false;
        this.loader.hide();
      },
      error: () => {
        this.toast.error("Delete failed.");
        this.loader.hide();
      }
    });
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
