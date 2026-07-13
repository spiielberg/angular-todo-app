import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { TodoStore } from '../../services/todo-store';
import { TodoPriority, TODO_PRIORITIES } from '../../types/todo';

/** Text field + optional details (priority, due date, tags) for adding new tasks. */
@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.html',
  styleUrl: './todo-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoForm {
  private readonly store = inject(TodoStore);

  protected readonly priorities = TODO_PRIORITIES;

  protected readonly title = signal('');
  protected readonly priority = signal<TodoPriority | ''>('');
  protected readonly dueDate = signal('');
  protected readonly tags = signal('');

  protected updateTitle(event: Event): void {
    this.title.set((event.target as HTMLInputElement).value);
  }

  protected updatePriority(event: Event): void {
    this.priority.set((event.target as HTMLSelectElement).value as TodoPriority | '');
  }

  protected updateDueDate(event: Event): void {
    this.dueDate.set((event.target as HTMLInputElement).value);
  }

  protected updateTags(event: Event): void {
    this.tags.set((event.target as HTMLInputElement).value);
  }

  protected submit(event: Event): void {
    event.preventDefault();
    this.store.add({
      title: this.title(),
      priority: this.priority(),
      dueDate: this.dueDate(),
      tags: this.tags(),
    });

    this.title.set('');
    this.priority.set('');
    this.dueDate.set('');
    this.tags.set('');
  }
}
