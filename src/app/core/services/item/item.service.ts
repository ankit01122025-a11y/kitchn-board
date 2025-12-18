import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../../models/item.model';


@Injectable({ providedIn: 'root' })
export class ItemService {
  private readonly API = 'http://localhost:3000/items';

  constructor(private http: HttpClient) { }

  loadItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.API);
  }

  add(item: Item): Observable<Item> {
    return this.http.post<Item>(this.API, item);
  }

  update(item: Item): Observable<Item> {
    return this.http.patch<Item>(`${this.API}/${item.id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}