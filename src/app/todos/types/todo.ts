/** Priority levels a task can have. */
export type TodoPriority = 'low' | 'medium' | 'high';

/** A single task in the list. */
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
  priority?: TodoPriority;
  /** ISO date (YYYY-MM-DD) as produced by the date input. */
  dueDate?: string;
  tags?: string[];
}

/** Raw form values used to create a task; empty optional fields are dropped. */
export interface TodoDraft {
  title: string;
  priority?: TodoPriority | '';
  dueDate?: string;
  /** Comma-separated tags as typed by the user. */
  tags?: string;
}

/** Available display filters. */
export type TodoFilter = 'all' | 'active' | 'completed';

/** Filter options shown in the UI. */
export const TODO_FILTERS: ReadonlyArray<{ value: TodoFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

/** Priority options shown in the form select. */
export const TODO_PRIORITIES: ReadonlyArray<{ value: TodoPriority; label: string }> = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];
