import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { Category, CategoryResponse } from '../../models/category.model';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({ providedIn: 'root' })
export class CategoryService {

  private readonly KEY = 'categories';
  private categories: Category[] = [];

  categorySubject$ = new BehaviorSubject<Category[]>([]);

  constructor(private ls: LocalStorageService) {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.categories = this.ls.get<Category[]>(this.KEY) || [];
    this.emit();
  }

  private save(): void {
    this.ls.set(this.KEY, this.categories);
    this.emit();
  }

  private emit(): void {
    this.categorySubject$.next([...this.categories]);
  }

  add(category: Category): Observable<CategoryResponse> {
    return of(true).pipe(
      delay(200),
      map(() => {
        this.categories.push(category);
        this.save();
        return { success: true, message: 'Category added successfully.', data: category };
      }),
      catchError(() => throwError(() => ({ success: false, message: 'Add failed.' })))
    );
  }

  update(category: Category): Observable<CategoryResponse> {
    return of(true).pipe(
      delay(200),
      map(() => {
        this.categories = this.categories.map(c =>
          c.id === category.id ? category : c
        );
        this.save();
        return { success: true, message: 'Category updated successfully.', data: category };
      }),
      catchError(() => throwError(() => ({ success: false, message: 'Update failed.' })))
    );
  }

  delete(id: number): Observable<CategoryResponse> {
    return of(true).pipe(
      delay(200),
      map(() => {
        this.categories = this.categories.filter(c => c.id !== id);
        this.save();
        return { success: true, message: 'Category deleted successfully.' };
      }),
      catchError(() => throwError(() => ({ success: false, message: 'Delete failed.' })))
    );
  }
}
