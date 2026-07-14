import { Listbox, Option } from '@angular/aria/listbox';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  viewChild,
} from '@angular/core';
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
  private readonly injector = inject(Injector);
  private readonly listbox = viewChild(Listbox);

  protected readonly isOverdue = isOverdue;
  protected readonly formatDueDate = formatDueDate;

  /**
   * Toggling completion moves the task away (down the sorted list, or out of
   * the filtered view), and the @for repeater re-inserting the <li> drops DOM
   * focus. Keep focus at the same list position — the task below takes it, or
   * the one above when nothing is below. gotoIndex (instead of a raw focus())
   * keeps the listbox's active item in sync for the arrow-key navigation.
   */
  protected onSelectionChange(selectedIds: readonly string[]): void {
    const focused = document.activeElement;
    const index =
      focused?.matches('.todo-item') && focused.parentElement
        ? Array.prototype.indexOf.call(focused.parentElement.children, focused)
        : -1;

    this.store.syncVisibleCompletion(selectedIds);

    if (index < 0) return;
    // The listbox re-sorts its options via MutationObserver, whose callback is a
    // microtask queued during the render — gotoIndex only sees the new order
    // after it runs, hence the queueMicrotask inside afterNextRender.
    afterNextRender(
      { write: () => queueMicrotask(() => this.listbox()?.gotoIndex(index)) },
      { injector: this.injector },
    );
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
