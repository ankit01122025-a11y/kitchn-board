import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { Item } from '../../models/item.model';
import { CrudResponse } from '../../models/crud-response.model';

@Injectable({ providedIn: 'root' })
export class ItemService {

  private readonly KEY = 'items';
  private items: Item[] = [];

  itemSubject$ = new BehaviorSubject<Item[]>([]);

  constructor(private ls: LocalStorageService) {
    this.loadItems();
  }

  private loadItems(): void {
    this.items = this.ls.get<Item[]>(this.KEY) || [];
    this.emit();
  }

  private save(): void {
    this.ls.set<Item[]>(this.KEY, this.items);
    this.emit();
  }

  private emit(): void {
    this.itemSubject$.next([...this.items]);
  }

  add(item: Item): Observable<CrudResponse<Item>> {
    return of(true).pipe(
      delay(200),
      map(() => {
        this.items.push(item);
        this.save();
        return { success: true, message: 'Item added successfully.', data: item };
      }),
      catchError(() => throwError(() => ({ success: false, message: 'Add failed.' })))
    );
  }

  update(item: Item): Observable<CrudResponse<Item>> {
    return of(true).pipe(
      delay(200),
      map(() => {
        this.items = this.items.map(i => i.id === item.id ? item : i);
        this.save();
        return { success: true, message: 'Item updated successfully.', data: item };
      }),
      catchError(() => throwError(() => ({ success: false, message: 'Update failed.' })))
    );
  }

  delete(id: number): Observable<CrudResponse<void>> {
    return of(true).pipe(
      delay(200),
      map(() => {
        this.items = this.items.filter(i => i.id !== id);
        this.save();
        return { success: true, message: 'Item deleted successfully.' };
      }),
      catchError(() => throwError(() => ({ success: false, message: 'Delete failed.' })))
    );
  }

  getItemsByCategory(categoryId: number): Item[] {
    return this.items.filter(i => i.categoryIds.includes(categoryId));
  }
}
