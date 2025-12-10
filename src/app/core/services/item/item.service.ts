import { Injectable } from '@angular/core';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { Item } from '../../models/item.model';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private readonly KEY = 'items';
  private items: Item[] = [];

  itemSubject$ = new BehaviorSubject<Item[]>([]);

  constructor(
    private ls: LocalStorageService,
    private toast: ToastService
  ) {
    this.loadItems();
  }

  // Load from LocalStorage
  private loadItems(): void {
    this.items = this.ls.get<Item[]>(this.KEY) || [];
    this.itemSubject$.next([...this.items]);
  }

  // Save to LocalStorage + emit update
  private saveItems(): void {
    this.ls.set<Item[]>(this.KEY, this.items);
    this.itemSubject$.next([...this.items]);
  }

  // Add new item
  addItem(item: Item): void {
    this.items.push(item);
    this.saveItems();
    this.toast.success('Item added successfully.');
  }

  // Update existing item
  updateItem(item: Item): void {
    this.items = this.items.map(x =>
      x.id === item.id ? item : x
    );
    this.saveItems();
    this.toast.success('Item updated successfully.');
  }

  // Delete item by ID
  deleteItem(id: number): void {
    this.items = this.items.filter(x => x.id !== id);
    this.saveItems();
    this.toast.error('Item deleted successfully.');
  }


  // Get items belonging to a specific category
  getItemsByCategory(categoryId: number): Item[] {
    return this.items.filter(i => i.categoryIds.includes(categoryId));
  }
}
