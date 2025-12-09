import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { Category } from '../../../core/models/category.model';
import { CategoryService } from '../../../core/services/category/category.service';
import { ConfirmPopupComponent } from '../../../shared/components/confirm-popup/confirm-popup.component';
import { ItemService } from '../../../core/services/item/item.service';

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
    private itemService: ItemService
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

  openAddModal() {
    this.isEdit = false;
    this.editId = 0;
    this.form.reset();
    this.openModal();
  }

  openEditModal(cat: any) {
    this.isEdit = true;
    this.editId = cat.id;
    this.form.patchValue(cat);
    this.openModal();
  }

  saveCategory(): void {
    if (this.form.invalid) return;

    const value = this.form.value;

    const payload = {
      id: this.isEdit ? this.editId : Date.now(),
      ...value,
      createdAt: new Date().toISOString()
    };

    if (this.isEdit) {
      this.categoryService.update(payload).subscribe(res => {
        if (res.success) this.closeModal();
      });
    } else {
      this.categoryService.add(payload).subscribe(res => {
        if (res.success) this.closeModal();
      });
    }
  }

  openDeleteConfirm(id: number) {
    const used = this.itemService.getItemsByCategory(id);

    if (used.length > 0) {
      alert(
        'This category is used in items:\n' +
        used.map(i => '- ' + i.name).join('\n')
      );
      return;
    }

    this.deleteId = id;
    this.showDeletePopup = true;
  }

  confirmDelete() {
    this.categoryService.delete(this.deleteId).subscribe(res => {
      if (res.success) this.showDeletePopup = false;
    });
  }

  cancelDelete() {
    this.showDeletePopup = false;
  }

  openModal() {
    document.getElementById('categoryModal')?.classList.add('show');
  }

  closeModal() {
    document.getElementById('categoryModal')?.classList.remove('show');
  }
}
