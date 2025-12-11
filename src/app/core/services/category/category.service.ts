import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { Category } from '../../models/category.model';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { CrudResponse } from '../../models/crud-response.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {

  private readonly INDEX_KEY = 'categories_index';
  private categories: Category[] = [];

  categorySubject$ = new BehaviorSubject<Category[]>([]);

  constructor(private ls: LocalStorageService) {
    this.loadCategories();
  }

  private loadCategories(): void {
    const ids = this.ls.get<number[]>(this.INDEX_KEY) || [];

    this.categories = ids
      .map(id => this.ls.get<Category>(`category_${id}`))
      .filter((c): c is Category => !!c);

    this.categorySubject$.next([...this.categories]);
  }

  private saveIndex(): void {
    const ids = this.categories.map(c => c.id);
    this.ls.set(this.INDEX_KEY, ids);
  }

  private saveCategory(category: Category): void {
    this.ls.set(`category_${category.id}`, category);
  }

  add(category: Category): Observable<CrudResponse<Category>> {
    return of(true).pipe(
      delay(200),
      map(() => {
        this.categories.push(category);
        this.saveCategory(category);
        this.saveIndex();

        this.categorySubject$.next([...this.categories]);

        return { success: true, message: 'Category added successfully.' };
      }),
      catchError(() =>
        throwError(() => ({ success: false, message: 'Add failed.' }))
      )
    );
  }

  update(category: Category): Observable<CrudResponse<Category>> {
    return of(true).pipe(
      delay(200),
      map(() => {
        this.categories = this.categories.map(c =>
          c.id === category.id ? category : c
        );

        this.saveCategory(category);
        this.saveIndex();

        this.categorySubject$.next([...this.categories]);

        return { success: true, message: 'Category updated successfully.' };
      }),
      catchError(() =>
        throwError(() => ({ success: false, message: 'Update failed.' }))
      )
    );
  }

  delete(id: number): Observable<CrudResponse<void>> {
    return of(true).pipe(
      delay(200),
      map(() => {
        this.categories = this.categories.filter(c => c.id !== id);

        this.ls.remove(`category_${id}`);
        this.saveIndex();

        this.categorySubject$.next([...this.categories]);

        return { success: true, message: 'Category deleted successfully.' };
      }),
      catchError(() =>
        throwError(() => ({ success: false, message: 'Delete failed.' }))
      )
    );
  }
}
