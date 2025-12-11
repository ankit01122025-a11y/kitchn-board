import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { Item } from '../../models/item.model';
import { CrudResponse } from '../../models/crud-response.model';

@Injectable({ providedIn: 'root' })
export class ItemService {

  private readonly INDEX_KEY = 'items_index';
  private items: Item[] = [];

  itemSubject$ = new BehaviorSubject<Item[]>([]);

  constructor(private ls: LocalStorageService) {
    this.loadItems();
  }

  private loadItems(): void {
    const ids = this.ls.get<number[]>(this.INDEX_KEY) || [];

    this.items = ids
      .map(id => this.ls.get<Item>(`item_${id}`))
      .filter((i): i is Item => !!i);

    this.itemSubject$.next([...this.items]);
  }

  private saveIndex(): void {
    const ids = this.items.map(i => i.id);
    this.ls.set(this.INDEX_KEY, ids);
  }

  private saveItem(item: Item): void {
    this.ls.set(`item_${item.id}`, item);
  }

  add(item: Item): Observable<CrudResponse<Item>> {
    return of(true).pipe(
      delay(200),
      map(() => {
        this.items.push(item);
        this.saveItem(item);
        this.saveIndex();

        this.itemSubject$.next([...this.items]);
        return { success: true, message: 'Item added successfully.' };
      }),
      catchError(() => throwError(() => ({ success: false, message: 'Add failed.' })))
    );
  }

  update(item: Item): Observable<CrudResponse<Item>> {
    return of(true).pipe(
      delay(200),
      map(() => {
        this.items = this.items.map(i => i.id === item.id ? item : i);

        this.saveItem(item);
        this.saveIndex();

        this.itemSubject$.next([...this.items]);
        return { success: true, message: 'Item updated successfully.' };
      }),
      catchError(() => throwError(() => ({ success: false, message: 'Update failed.' })))
    );
  }

  delete(id: number): Observable<CrudResponse<void>> {
    return of(true).pipe(
      delay(200),
      map(() => {
        this.items = this.items.filter(i => i.id !== id);

        this.ls.remove(`item_${id}`);
        this.saveIndex();

        this.itemSubject$.next([...this.items]);
        return { success: true, message: 'Item deleted successfully.' };
      }),
      catchError(() => throwError(() => ({ success: false, message: 'Delete failed.' })))
    );
  }

  getItemsByCategory(categoryId: number): Item[] {
    return this.items.filter(i => i.categoryIds.includes(categoryId));
  }
}
