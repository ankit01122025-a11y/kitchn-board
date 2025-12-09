import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf, CurrencyPipe } from '@angular/common';

import { Item } from '../../../core/models/item.model';
import { Category } from '../../../core/models/category.model';
import { ItemService } from '../../../core/services/item/item.service';
import { CategoryService } from '../../../core/services/category/category.service';

import { MultiSelectComponent } from '../../../shared/components/multi-select/multi-select.component';
import { ConfirmPopupComponent } from '../../../shared/components/confirm-popup/confirm-popup.component';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    ReactiveFormsModule,
    CurrencyPipe,
    MultiSelectComponent,
    ConfirmPopupComponent
  ],
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

  items: Item[] = [];
  categories: Category[] = [];

  form!: FormGroup;

  showModal = false;
  showDelete = false;
  deleteId: number | null = null;

  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.createForm();

    this.categoryService.categorySubject$.subscribe(list => {
      this.categories = list;
    });

    this.itemService.itemSubject$.subscribe(list => {
      this.items = list;
    });
  }

  createForm() {
    this.form = this.fb.group({
      id: [0],
      name: ['', [Validators.required, Validators.maxLength(20)]],
      description: ['', Validators.maxLength(50)],
      price: [0, Validators.required],
      categoryIds: [[]]
    });
  }

  // OPEN ADD MODAL
  openAddModal() {
    this.isEdit = false;
    this.form.reset({
      id: 0,
      name: '',
      description: '',
      price: 0,
      categoryIds: []
    });
    this.showModal = true;
  }

  // EDIT MODAL
  openEditModal(item: Item) {
    this.isEdit = true;

    this.form.patchValue({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      categoryIds: [...item.categoryIds]
    });

    this.showModal = true;
  }

  // SAVE ITEM
  saveItem() {
    if (this.form.invalid) return;

    const data: Item = {
      ...this.form.value,
      createdAt: new Date().toISOString()
    };

    if (this.isEdit) {
      this.itemService.updateItem(data);
    } else {
      data.id = Date.now();
      this.itemService.addItem(data);
    }

    this.showModal = false;
  }

  // DELETE CONFIRM POPUP
  openDeleteConfirm(id: number) {
    this.deleteId = id;
    this.showDelete = true;
  }

  confirmDelete() {
    if (this.deleteId !== null) {
      this.itemService.deleteItem(this.deleteId);
    }
    this.showDelete = false;
  }

  cancelDelete() {
    this.showDelete = false;
  }

  // DISPLAY CATEGORY NAMES
  getCategoryNames(ids: number[]): string {
    return this.categories
      .filter(c => ids.includes(c.id))
      .map(c => c.name)
      .join(', ');
  }
}
