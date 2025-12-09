import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { Category } from '../../../core/models/category.model';
import { CategoryService } from '../../../core/services/category/category.service';
import { ConfirmPopupComponent } from '../../../shared/components/confirm-popup/confirm-popup.component';
import { ItemService } from '../../../core/services/item/item.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgFor,
    ConfirmPopupComponent
  ],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  categories: Category[] = [];
  form!: FormGroup;

  isEdit = false;
  editId = 0;

  showDeletePopup = false;
  deleteId = 0;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private itemService: ItemService,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.createForm();

    this.categoryService.categorySubject$.subscribe(list => {
      this.categories = list;
    });
  }

  createForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(7)]],
      description: ['', [Validators.required, Validators.maxLength(9)]]
    });
  }

  openAddModal(): void {
    this.isEdit = false;
    this.editId = 0;
    this.form.reset();
    this.openModal();
  }

  openEditModal(cat: Category): void {
    this.isEdit = true;
    this.editId = cat.id;
    this.form.patchValue({
      name: cat.name,
      description: cat.description
    });
    this.openModal();
  }

  saveCategory(): void {
    if (this.form.invalid) return;

    const value = this.form.value;

    if (this.isEdit) {
      // UPDATE
      const updated: Category = {
        id: this.editId,
        name: value.name,
        description: value.description,
        createdAt: new Date().toISOString()
      };

      this.categoryService.updateCategory(updated);

    } else {
      // CREATE
      const newCategory: Category = {
        id: Date.now(),
        name: value.name,
        description: value.description,
        createdAt: new Date().toISOString()
      };

      this.categoryService.addCategory(newCategory);
    }

    this.closeModal();
  }

  openDeleteConfirm(id: number): void {
    this.deleteId = id;
    const usedItems = this.itemService.getItemsByCategory(id);

    if (usedItems.length > 0) {
      let ErrorMessage;
      ErrorMessage = 'This category is used in the following items:\n\n' +
        usedItems.map(i => '• ' + i.name).join('\n') + ' ' + 'Cannot Delete Category.'
      this.toast.error(ErrorMessage);
    } else {
      this.showDeletePopup = true;
    }
  }

  confirmDelete(): void {
    this.categoryService.deleteCategory(this.deleteId);
    this.showDeletePopup = false;
  }

  cancelDelete(): void {
    this.showDeletePopup = false;
  }

  openModal(): void {
    document.getElementById('categoryModal')?.classList.add('show');
  }

  closeModal(): void {
    document.getElementById('categoryModal')?.classList.remove('show');
  }
}
