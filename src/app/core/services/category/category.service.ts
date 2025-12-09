import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { Category } from '../../models/category.model';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { ToastService } from '../../../shared/services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly KEY = 'categories';
  private categories: Category[] = [];

  categorySubject$ = new BehaviorSubject<Category[]>([]);

  constructor(
    private ls: LocalStorageService,
    private toast: ToastService
  ) {
    this.loadCategories();
  }

  // LOAD Categories from LocalStorage
  private loadCategories(): void {
    this.categories = this.ls.get<Category[]>(this.KEY) || [];
    this.categorySubject$.next([...this.categories]);
  }

  // SAVE + EMIT
  private save(): void {
    this.ls.set(this.KEY, this.categories);
    this.categorySubject$.next([...this.categories]);
  }

  getAll(): Observable<Category[]> {
    return of(this.categories).pipe(delay(150));
  }

  add(category: Category): Observable<any> {
    return of(true).pipe(
      delay(200),
      map(() => {
        this.categories.push(category);
        this.save();
        this.toast.success('Category added successfully.');
        return { success: true, message: 'Category added', data: category };
      }),
      catchError(() =>
        throwError(() => ({ success: false, message: 'Add error' }))
      )
    );
  }

  update(category: Category): Observable<any> {
    return of(true).pipe(
      delay(200),
      map(() => {
        this.categories = this.categories.map(c =>
          c.id === category.id ? category : c
        );
        this.save();
        this.toast.success('Category updated successfully.');
        return { success: true, message: 'Category updated', data: category };
      }),
      catchError(() =>
        throwError(() => ({ success: false, message: 'Update error' }))
      )
    );
  }

  delete(id: number): Observable<any> {
    return of(true).pipe(
      delay(200),
      map(() => {
        this.categories = this.categories.filter(c => c.id !== id);
        this.save();
        this.toast.error('Category deleted successfully.');
        return { success: true, message: 'Category deleted' };
      }),
      catchError(() =>
        throwError(() => ({ success: false, message: 'Delete error' }))
      )
    );
  }
}
