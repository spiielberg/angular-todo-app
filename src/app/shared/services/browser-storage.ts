import { Injectable } from '@angular/core';

/**
 * Safe localStorage access: JSON serialization, validation on read, and
 * failure tolerance (storage may be unavailable or full, e.g. private tabs).
 */
@Injectable({ providedIn: 'root' })
export class BrowserStorage {
  read<T>(key: string, isValid: (value: unknown) => value is T): T | null {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return null;

      const parsed: unknown = JSON.parse(raw);
      return isValid(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  write(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage unavailable: the app keeps working in memory only.
    }
  }
}
