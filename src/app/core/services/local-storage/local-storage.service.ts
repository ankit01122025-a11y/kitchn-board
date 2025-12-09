import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  // Save value to LocalStorage
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`LocalStorage set error: ${key}`, err);
    }
  }

  // Get value from LocalStorage
  get<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(key);
      return data ? (JSON.parse(data) as T) : null;
    } catch (err) {
      console.error(`LocalStorage get error: ${key}`, err);
      return null;
    }
  }

  // Remove single entry
  remove(key: string): void {
    localStorage.removeItem(key);
  }
}
