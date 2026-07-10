import { Injectable, computed, effect, inject, signal } from '@angular/core';

import { BrowserStorage } from '../../shared/services/browser-storage';
import { Todo, TodoFilter } from '../types/todo';
import { createTodo, filterTodos, isTodoArray } from '../utils/todo-utils';

const STORAGE_KEY = 'angular-todo-app.todos';

/**
 * Single source of truth for the app: holds state in signals and
 * automatically persists it to localStorage on every change.
 */
@Injectable({ providedIn: 'root' })
export class TodoStore {
  private readonly storage = inject(BrowserStorage);

  // Internal state, mutable only through the methods of this service.
  private readonly _todos = signal<Todo[]>(this.storage.read(STORAGE_KEY, isTodoArray) ?? []);
  private readonly _filter = signal<TodoFilter>('all');

  // State exposed to components (read-only).
  readonly todos = this._todos.asReadonly();
  readonly filter = this._filter.asReadonly();

  // Derived values: recomputed automatically when state changes.
  readonly visibleTodos = computed(() => filterTodos(this._todos(), this._filter()));
  readonly totalCount = computed(() => this._todos().length);
  readonly completedCount = computed(() => this._todos().filter((todo) => todo.completed).length);
  readonly activeCount = computed(() => this.totalCount() - this.completedCount());
  readonly hasCompleted = computed(() => this.completedCount() > 0);

  /** Completed ids among the visible todos — feeds the listbox selection. */
  readonly completedVisibleIds = computed(() =>
    this.visibleTodos()
      .filter((todo) => todo.completed)
      .map((todo) => todo.id),
  );

  constructor() {
    effect(() => this.storage.write(STORAGE_KEY, this._todos()));
  }

  add(title: string): void {
    const todo = createTodo(title);
    if (!todo) return;

    this._todos.update((todos) => [todo, ...todos]);
  }

  remove(id: string): void {
    this._todos.update((todos) => todos.filter((todo) => todo.id !== id));
  }

  /** Syncs completion of the visible todos with the listbox selection. */
  syncVisibleCompletion(selectedIds: readonly string[]): void {
    const selected = new Set(selectedIds);
    const visible = new Set(this.visibleTodos().map((todo) => todo.id));

    this._todos.update((todos) =>
      todos.map((todo) =>
        visible.has(todo.id) ? { ...todo, completed: selected.has(todo.id) } : todo,
      ),
    );
  }

  completeAll(): void {
    this._todos.update((todos) => todos.map((todo) => ({ ...todo, completed: true })));
  }

  clearCompleted(): void {
    this._todos.update((todos) => todos.filter((todo) => !todo.completed));
  }

  setFilter(filter: TodoFilter): void {
    this._filter.set(filter);
  }
}
