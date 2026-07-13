import { Todo, TodoDraft, TodoFilter, TODO_PRIORITIES } from '../types/todo';

/** Creates a task from the form draft; returns null when the title is empty. */
export function createTodo(draft: TodoDraft): Todo | null {
  const title = draft.title.trim();
  if (!title) return null;

  const tags = parseTags(draft.tags ?? '');

  return {
    id: crypto.randomUUID(),
    title,
    completed: false,
    createdAt: Date.now(),
    ...(draft.priority ? { priority: draft.priority } : {}),
    ...(draft.dueDate ? { dueDate: draft.dueDate } : {}),
    ...(tags.length ? { tags } : {}),
  };
}

/** Splits the comma-separated input into unique, non-empty tags. */
export function parseTags(input: string): string[] {
  const tags = input.split(',').map((tag) => tag.trim());
  return [...new Set(tags.filter(Boolean))];
}

/** True when the due date is before today (local time). */
export function isOverdue(dueDate: string): boolean {
  return dueDate < toIsoDate(new Date());
}

/** Compact label for the due-date pill, e.g. "Jul 20" or "Jan 5, 2027". */
export function formatDueDate(dueDate: string): string {
  const date = new Date(`${dueDate}T00:00:00`);
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
}

function toIsoDate(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
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
    typeof todo['createdAt'] === 'number' &&
    (todo['priority'] === undefined ||
      TODO_PRIORITIES.some((priority) => priority.value === todo['priority'])) &&
    (todo['dueDate'] === undefined || typeof todo['dueDate'] === 'string') &&
    (todo['tags'] === undefined ||
      (Array.isArray(todo['tags']) && todo['tags'].every((tag) => typeof tag === 'string')))
  );
}

/** Footer text with correct pluralization. */
export function remainingLabel(count: number): string {
  return count === 1 ? '1 task left' : `${count} tasks left`;
}
