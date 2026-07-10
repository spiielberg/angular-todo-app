import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Listbox, Option } from '@angular/aria/listbox';

import { TodoStore } from '../../services/todo-store';
import { TODO_FILTERS, TodoFilter } from '../../types/todo';

/**
 * Segmented filter control, built with the @angular/aria Listbox in
 * single-selection mode: arrow keys navigate and select the focused option.
 */
@Component({
  selector: 'app-todo-filters',
  imports: [Listbox, Option],
  templateUrl: './todo-filters.html',
  styleUrl: './todo-filters.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoFilters {
  protected readonly store = inject(TodoStore);
  protected readonly filters = TODO_FILTERS;

  /** The listbox works with an array of selected values; here it always has 1 item. */
  protected readonly selected = computed(() => [this.store.filter()]);

  protected onSelectionChange(values: readonly TodoFilter[]): void {
    this.store.setFilter(values[0] ?? 'all');
  }
}
