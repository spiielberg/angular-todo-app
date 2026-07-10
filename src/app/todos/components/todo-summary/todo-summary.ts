import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { TodoStore } from '../../services/todo-store';
import { remainingLabel } from '../../utils/todo-utils';

/** Footer with counters; aria-live announces changes to screen readers. */
@Component({
  selector: 'app-todo-summary',
  templateUrl: './todo-summary.html',
  styleUrl: './todo-summary.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoSummary {
  protected readonly store = inject(TodoStore);
  protected readonly remaining = computed(() => remainingLabel(this.store.activeCount()));
}
