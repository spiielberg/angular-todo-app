/** A single task in the list. */
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

/** Available display filters. */
export type TodoFilter = 'all' | 'active' | 'completed';

/** Filter options shown in the UI. */
export const TODO_FILTERS: ReadonlyArray<{ value: TodoFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];
