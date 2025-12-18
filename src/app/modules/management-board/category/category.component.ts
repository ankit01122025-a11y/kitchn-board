import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';

import { ConfirmPopupComponent } from '../../../shared/components/confirm-popup/confirm-popup.component';
import { TableComponent } from '../../../shared/components/table/table.component';
import { LoaderService } from '../../../shared/services/loader/loader.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { ItemService } from '../../../core/services/item/item.service';
import { Category } from '../../../core/models/category.model';

import * as CategoryActions from '../../../core/store/category/category.actions';
import { selectCategories, selectLoading } from '../../../core/store/category/category.selectors';
import { selectItemsByCategoryId } from '../../../core/store/item/item.selectors';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgFor,
    ConfirmPopupComponent,
    TableComponent
  ],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  categories: Category[] = [];
  loading$!: Observable<boolean>;

  categoryForm!: FormGroup;
  showCategoryModal = false;
  showDeletePopup = false;
  deleteId = '';

  tableColumns = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' }
  ];

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private itemService: ItemService,
    private toast: ToastService,
    public loader: LoaderService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.store.select(selectCategories).subscribe((res) => {
      this.categories = res;
    });
    this.loading$ = this.store.select(selectLoading);
    this.store.dispatch(CategoryActions.loadCategories());
  }

  private initForm() {
    this.categoryForm = this.fb.group({
      id: null,
      name: ['', [Validators.required, Validators.maxLength(7)]],
      description: ['', [Validators.required, Validators.maxLength(9)]],
      createdAt: null
    });
  }

  openAddModal() {
    this.categoryForm.reset();
    this.showCategoryModal = true;
  }

  openEditModal(cat: Category) {
    this.categoryForm.patchValue(cat);
    this.showCategoryModal = true;
  }

  saveCategory() {
    if (this.categoryForm.invalid) return;

    const payload: Category = this.categoryForm.value.id
      ? { ...this.categoryForm.value, createdAt: this.categoryForm.value.createdAt }
      : { ...this.categoryForm.value, id: Date.now().toString(), createdAt: new Date().toISOString() };

    this.loader.show();

    if (this.categoryForm.value.id) {
      this.store.dispatch(CategoryActions.updateCategory({ category: payload }));
      this.toast.success('Category updated');
    } else {
      this.store.dispatch(CategoryActions.addCategory({ category: payload }));
      this.toast.success('Category added');
    }

    this.closeModal();
    this.loader.hide();
  }

  openDeleteConfirm(id: string) {
    this.store
      .select(selectItemsByCategoryId(Number(id)))
      .pipe(take(1))
      .subscribe(items => {
        if (items.length > 0) {
          this.toast.error('This category is used in items.');
          return;
        }

        this.deleteId = id;
        this.showDeletePopup = true;
      });
  }

  confirmDelete() {
    this.loader.show();
    this.store.dispatch(CategoryActions.deleteCategory({ id: this.deleteId }));
    this.toast.success('Category deleted');
    this.showDeletePopup = false;
    this.loader.hide();
  }

  cancelDelete() {
    this.showDeletePopup = false;
  }

  closeModal() {
    this.showCategoryModal = false;
  }

  onTableAction(event: any) {
    if (event.type === 'edit') {
      this.openEditModal(event.row);
    }

    if (event.type === 'delete') {
      this.openDeleteConfirm(event.row.id);
    }
  }
}
