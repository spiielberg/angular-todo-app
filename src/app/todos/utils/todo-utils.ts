import { Todo, TodoFilter } from '../types/todo';

/** Creates a task from the typed text; returns null when the text is empty. */
export function createTodo(title: string): Todo | null {
  const trimmed = title.trim();
  if (!trimmed) return null;

  return {
    id: crypto.randomUUID(),
    title: trimmed,
    completed: false,
    createdAt: Date.now(),
  };
}

/** Applies the selected filter to the full list. */
export function filterTodos(todos: readonly Todo[], filter: TodoFilter): Todo[] {
  switch (filter) {
    case 'active':
      return todos.filter((todo) => !todo.completed);
    case 'completed':
      return todos.filter((todo) => todo.completed);
    default:
      return [...todos];
  }
}

/** Validates data coming from localStorage, which may be missing or corrupted. */
export function isTodoArray(value: unknown): value is Todo[] {
  return Array.isArray(value) && value.every(isTodo);
}

function isTodo(value: unknown): value is Todo {
  if (typeof value !== 'object' || value === null) return false;
  const todo = value as Record<string, unknown>;
  return (
    typeof todo['id'] === 'string' &&
    typeof todo['title'] === 'string' &&
    typeof todo['completed'] === 'boolean' &&
    typeof todo['createdAt'] === 'number'
  );
}

/** Footer text with correct pluralization. */
export function remainingLabel(count: number): string {
  return count === 1 ? '1 task left' : `${count} tasks left`;
}
