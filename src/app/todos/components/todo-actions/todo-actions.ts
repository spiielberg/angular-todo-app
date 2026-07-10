import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Toolbar, ToolbarWidget } from '@angular/aria/toolbar';

import { TodoStore } from '../../services/todo-store';

/**
 * Bulk actions over the list. The @angular/aria Toolbar groups the buttons
 * into a single Tab stop and lets arrow keys cycle between them.
 */
@Component({
  selector: 'app-todo-actions',
  imports: [Toolbar, ToolbarWidget],
  templateUrl: './todo-actions.html',
  styleUrl: './todo-actions.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoActions {
  protected readonly store = inject(TodoStore);
}
