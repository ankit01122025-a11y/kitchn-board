import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { Category } from '../../models/category.model';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { CrudResponse } from '../../models/crud-response.model';

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

  add(category: Category): Observable<CrudResponse<Category>> {
    return of(true).pipe(
      delay(200),
      map(() => {
        this.categories.push(category);
        this.save();
        return { success: true, message: 'Category added successfully.', };
      }),
      catchError(() => throwError(() => ({ success: false, message: 'Add failed.' })))
    );
  }

  update(category: Category): Observable<CrudResponse<Category>> {
    return of(true).pipe(
      delay(200),
      map(() => {
        this.categories = this.categories.map(c =>
          c.id === category.id ? category : c
        );
        this.save();
        return { success: true, message: 'Category updated successfully.' };
      }),
      catchError(() => throwError(() => ({ success: false, message: 'Update failed.' })))
    );
  }

  delete(id: number): Observable<CrudResponse<void>> {
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
