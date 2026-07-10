import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { TodoStore } from '../../services/todo-store';

/** Text field + button for adding new tasks. */
@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.html',
  styleUrl: './todo-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoForm {
  private readonly store = inject(TodoStore);

  protected readonly title = signal('');

  protected updateTitle(event: Event): void {
    this.title.set((event.target as HTMLInputElement).value);
  }

  protected submit(event: Event): void {
    event.preventDefault();
    this.store.add(this.title());
    this.title.set('');
  }
}
