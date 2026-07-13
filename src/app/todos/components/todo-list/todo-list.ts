import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Listbox, Option } from '@angular/aria/listbox';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendar, lucideCheck, lucideFlag, lucideTag, lucideX } from '@ng-icons/lucide';

import { TodoStore } from '../../services/todo-store';
import { formatDueDate, isOverdue } from '../../utils/todo-utils';

/**
 * Task list built on the @angular/aria multi-select Listbox:
 * selected item = completed task. The listbox handles keyboard interaction
 * (arrows, Space/Enter, typeahead) and the ARIA attributes.
 */
@Component({
  selector: 'app-todo-list',
  imports: [Listbox, Option, NgIcon],
  providers: [provideIcons({ lucideCalendar, lucideCheck, lucideFlag, lucideTag, lucideX })],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoList {
  protected readonly store = inject(TodoStore);

  protected readonly isOverdue = isOverdue;
  protected readonly formatDueDate = formatDueDate;

  protected onSelectionChange(selectedIds: readonly string[]): void {
    this.store.syncVisibleCompletion(selectedIds);
  }

  /** Click on the “×”: keep the click from reaching the item (it would toggle selection). */
  protected removeByPointer(event: Event, id: string): void {
    event.stopPropagation();
    this.store.remove(id);
  }

  /** Delete/Backspace on the focused item: remove it and move focus to a neighbor. */
  protected removeByKeyboard(event: Event, id: string): void {
    event.preventDefault();
    event.stopPropagation();

    const item = event.currentTarget as HTMLElement;
    const neighbor = (item.nextElementSibling ?? item.previousElementSibling) as HTMLElement | null;

    this.store.remove(id);
    queueMicrotask(() => neighbor?.focus());
  }
}
