import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly API = 'http://localhost:3000/categories';

  constructor(private http: HttpClient) { }

  loadCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.API);
  }

  add(category: Category): Observable<Category> {
    return this.http.post<Category>(this.API, category);
  }

  update(category: Category): Observable<Category> {
    return this.http.patch<Category>(`${this.API}/${category.id}`, category);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
