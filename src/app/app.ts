import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TodoActions } from './todos/components/todo-actions/todo-actions';
import { TodoFilters } from './todos/components/todo-filters/todo-filters';
import { TodoForm } from './todos/components/todo-form/todo-form';
import { TodoList } from './todos/components/todo-list/todo-list';
import { TodoSummary } from './todos/components/todo-summary/todo-summary';

/**
 * Root component: composition and layout only.
 * Each part of the screen is a component with a single responsibility.
 */
@Component({
  selector: 'app-root',
  imports: [TodoForm, TodoFilters, TodoActions, TodoList, TodoSummary],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
