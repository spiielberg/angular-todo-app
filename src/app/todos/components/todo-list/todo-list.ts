import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Listbox, Option } from '@angular/aria/listbox';

import { TodoStore } from '../../services/todo-store';

/**
 * Task list built on the @angular/aria multi-select Listbox:
 * selected item = completed task. The listbox handles keyboard interaction
 * (arrows, Space/Enter, typeahead) and the ARIA attributes.
 */
@Component({
  selector: 'app-todo-list',
  imports: [Listbox, Option],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoList {
  protected readonly store = inject(TodoStore);

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
