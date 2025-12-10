import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { ConfirmPopupComponent } from '../../../shared/components/confirm-popup/confirm-popup.component';
import { CategoryService } from '../../../core/services/category/category.service';
import { ItemService } from '../../../core/services/item/item.service';
import { LoaderService } from '../../../shared/services/loader/loader.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { Category } from '../../../core/models/category.model';
import { TableComponent } from '../../../shared/components/table/table.component';

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
  categoryForm!: FormGroup;
  showDeletePopup = false;
  deleteId = 0;
  showCategoryModal = false;
  tableColumns = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' }
  ];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private itemService: ItemService,
    private toast: ToastService,
    public loader: LoaderService
  ) { }

  ngOnInit(): void {
    this.initForm();

    this.categoryService.categorySubject$.subscribe(list => {
      this.categories = list;
    });
  }

  private initForm() {
    this.categoryForm = this.fb.group({
      id: null,
      name: ['', [Validators.required, Validators.maxLength(7)]],
      description: ['', [Validators.required, Validators.maxLength(9)]],
    });
  }

  openAddModal() {
    this.categoryForm.reset();
    this.showCategoryModal = true;
  }

  openEditModal(cat: any) {
    this.categoryForm.patchValue(cat);
    this.showCategoryModal = true;
  }

  saveCategory() {
    if (this.categoryForm.invalid) return;

    const payload = {
      ...this.categoryForm.value,
      id: this.categoryForm.value.id ?? Date.now(),
      createdAt: new Date().toISOString()
    };

    this.loader.show();

    const req$ = this.categoryForm.value.id
      ? this.categoryService.update(payload)
      : this.categoryService.add(payload);

    req$.subscribe({
      next: (res: any) => {
        if (res?.success) {
          this.toast.success(res.message || 'Saved successfully.');
          this.closeModal();
        } else {
          this.toast.error(res?.message || 'Operation failed.');
        }
        this.loader.hide();
      },
      error: () => {
        this.toast.error("Operation failed.");
        this.loader.hide();
      }
    });
  }

  openDeleteConfirm(id: number) {
    const used = this.itemService.getItemsByCategory(id);

    if (used && used.length > 0) {
      this.toast.error("This category is used in items.");
      return;
    }

    this.deleteId = id;
    this.showDeletePopup = true;
  }

  confirmDelete() {
    this.loader.show();

    this.categoryService.delete(this.deleteId).subscribe({
      next: (res: any) => {
        if (res?.success) {
          this.toast.success(res.message || 'Deleted successfully.');
          this.showDeletePopup = false;
        } else {
          this.toast.error(res?.message || 'Delete failed.');
        }
        this.loader.hide();
      },
      error: () => {
        this.toast.error("Delete failed.");
        this.loader.hide();
      }
    });
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
