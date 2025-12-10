import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { ItemService } from '../../../core/services/item/item.service';
import { CategoryService } from '../../../core/services/category/category.service';
import { LoaderService } from '../../../shared/services/loader/loader.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { MultiSelectComponent } from '../../../shared/components/multi-select/multi-select.component';
import { ConfirmPopupComponent } from '../../../shared/components/confirm-popup/confirm-popup.component';
import { TableComponent } from '../../../shared/components/table/table.component';
import { Item } from '../../../core/models/item.model';
import { Category } from '../../../core/models/category.model';

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
    private itemService: ItemService,
    private categoryService: CategoryService,
    private loader: LoaderService,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.initForm();

    this.categoryService.categorySubject$.subscribe(list => {
      this.categories = list;
      this.mapCategoryNames();
    });

    this.itemService.itemSubject$.subscribe(list => {
      this.items = list;
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
    this.items = this.items.map(item => ({
      ...item,
      categoryNames: this.getCategoryNames(item.categoryIds)
    }));
  }

  openAddModal() {
    this.itemForm.reset();
    this.openModal();
  }

  openEditModal(item: any) {
    this.itemForm.patchValue(item);
    this.openModal();
  }

  saveItem() {
    if (this.itemForm.invalid) return;

    const payload = {
      ...this.itemForm.value,
      id: this.itemForm.value.id ?? Date.now(),
      createdAt: new Date().toISOString()
    };

    this.loader.show();

    const req$ = this.itemForm.value.id
      ? this.itemService.update(payload)
      : this.itemService.add(payload);

    req$.subscribe({
      next: (res) => {
        if (res.success) {
          this.toast.success(res.message);
          this.closeModal();
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
    this.deleteId = id;
    this.showDeletePopup = true;
  }

  confirmDelete() {
    this.loader.show();

    this.itemService.delete(this.deleteId).subscribe({
      next: (res) => {
        if (res.success) {
          this.toast.success(res.message);
          this.showDeletePopup = false;
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

  getCategoryNames(ids: number[]): string {
    return this.categories
      .filter(c => ids.includes(c.id))
      .map(c => c.name)
      .join(', ');
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
