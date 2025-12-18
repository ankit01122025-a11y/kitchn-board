import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { Store } from '@ngrx/store';

import { LoaderService } from '../../../shared/services/loader/loader.service';
import { ToastService } from '../../../shared/services/toast/toast.service';

import { MultiSelectComponent } from '../../../shared/components/multi-select/multi-select.component';
import { ConfirmPopupComponent } from '../../../shared/components/confirm-popup/confirm-popup.component';
import { TableComponent } from '../../../shared/components/table/table.component';

import { Item } from '../../../core/models/item.model';
import { Category } from '../../../core/models/category.model';

import * as ItemActions from '../../../core/store/item/item.actions';
import { selectItems } from '../../../core/store/item/item.selectors';
import { selectCategories } from '../../../core/store/category/category.selectors';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    ReactiveFormsModule,
    MultiSelectComponent,
    ConfirmPopupComponent,
    TableComponent
  ],
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  items: Item[] = [];
  categories: Category[] = [];
  itemForm!: FormGroup;
  showDeletePopup = false;
  deleteId = 0;

  tableColumns = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'price', label: 'Price', pipe: 'currency' },
    { key: 'categoryNames', label: 'Categories' }
  ];

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private loader: LoaderService,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.initForm();

    this.store.dispatch(ItemActions.loadItems());

    this.store.select(selectCategories).subscribe(cats => {
      this.categories = cats;
      this.mapCategoryNames();
    });

    this.store.select(selectItems).subscribe(items => {
      this.items = items;
      this.mapCategoryNames();
    });
  }

  private initForm() {
    this.itemForm = this.fb.group({
      id: null,
      name: ['', [Validators.required, Validators.maxLength(20)]],
      description: ['', Validators.maxLength(50)],
      price: [0, Validators.required],
      categoryIds: [[]]
    });
  }

  private mapCategoryNames() {
    if (!this.items.length || !this.categories.length) return;

    this.items = this.items.map(item => ({
      ...item,
      categoryNames: this.getCategoryNames(item.categoryIds)
    }));
  }

  getCategoryNames(ids: number[]): string {
    return this.categories
      .filter(c => ids.includes(c.id))
      .map(c => c.name)
      .join(', ');
  }

  openAddModal() {
    this.itemForm.reset();
    this.openModal();
  }

  openEditModal(item: Item) {
    this.itemForm.patchValue(item);
    this.openModal();
  }

  saveItem() {
    if (this.itemForm.invalid) return;

    const payload: Item = {
      ...this.itemForm.value,
      id: this.itemForm.value.id ?? Date.now(),
      createdAt: new Date().toISOString()
    };

    this.loader.show();

    if (this.itemForm.value.id) {
      this.store.dispatch(ItemActions.updateItem({ item: payload }));
      this.toast.success('Item updated');
    } else {
      this.store.dispatch(ItemActions.addItem({ item: payload }));
      this.toast.success('Item added');
    }

    this.closeModal();
    this.loader.hide();
  }

  openDeleteConfirm(id: number) {
    this.deleteId = id;
    this.showDeletePopup = true;
  }

  confirmDelete() {
    this.loader.show();
    this.store.dispatch(ItemActions.deleteItem({ id: this.deleteId }));
    this.toast.success('Item deleted');
    this.showDeletePopup = false;
    this.loader.hide();
  }

  cancelDelete() {
    this.showDeletePopup = false;
  }

  onTableAction(e: any) {
    if (e.type === 'edit') this.openEditModal(e.row);
    if (e.type === 'delete') this.openDeleteConfirm(e.row.id);
  }

  private openModal() {
    document.getElementById('itemModal')?.classList.add('show');
  }

  closeModal() {
    document.getElementById('itemModal')?.classList.remove('show');
  }
}
