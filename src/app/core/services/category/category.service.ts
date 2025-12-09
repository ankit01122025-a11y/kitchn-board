import { Injectable } from '@angular/core';
import { Category } from '../../models/category.model';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { ToastService } from '../../../shared/services/toast.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly KEY = 'categories';
  private categories: Category[] = [];

  categorySubject$ = new BehaviorSubject<Category[]>([]);

  constructor(private ls: LocalStorageService, private toast: ToastService) {
    this.loadCategories();
  }

  // Load categories from storage
  private loadCategories(): void {
    this.categories = this.ls.get<Category[]>(this.KEY) || [];
    this.categorySubject$.next([...this.categories]);
  }

  // Save categories to storage + emit changes
  private saveCategories(): void {
    this.ls.set<Category[]>(this.KEY, this.categories);
    this.categorySubject$.next([...this.categories]);
  }

  // Add new category
  addCategory(category: Category): void {
    this.categories.push(category);
    this.saveCategories();
    this.toast.success('Category added successfully.');
  }

  // Update existing category
  updateCategory(category: Category): void {
    this.categories = this.categories.map(c =>
      c.id === category.id ? category : c
    );
    this.saveCategories();
    this.toast.success('Category updated successfully.');
  }

  // Delete category by ID
  deleteCategory(id: number): void {
    this.categories = this.categories.filter(c => c.id !== id);
    this.saveCategories();
    this.toast.error('Category deleted successfully.');
  }
}
