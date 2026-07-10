# My Tasks — Angular + @angular/aria

A todo list built with **Angular v22**, the accessible headless components of
**[@angular/aria](https://angular.dev/guide/aria/overview)**, and persistence in the
browser's **localStorage**.

## Getting started

Requires Node.js **22.22.3+** (the project has an `.nvmrc`; with nvm just run `nvm use`).

```bash
npm install
npm start
```

Then open <http://localhost:4200>.

## Project structure

```
src/app/
├── app.ts / app.html / app.css     # Root component: composition and layout only
├── app.config.ts                   # Global application configuration
├── shared/
│   └── services/
│       └── browser-storage.ts      # Safe localStorage wrapper (JSON + validation)
└── todos/                          # Todos feature
    ├── types/
    │   └── todo.ts                 # Interfaces and types (Todo, TodoFilter)
    ├── utils/
    │   └── todo-utils.ts           # Pure functions (create, filter, validate, labels)
    ├── services/
    │   └── todo-store.ts           # Global state with signals + automatic persistence
    └── components/
        ├── todo-form/              # Input + add button
        ├── todo-filters/           # Filters (@angular/aria Listbox)
        ├── todo-actions/           # Bulk actions (@angular/aria Toolbar)
        ├── todo-list/              # The list (@angular/aria multi-select Listbox)
        └── todo-summary/           # Footer with counters
```

## How it works

- **Signals** (`signal`, `computed`) hold and derive state in the `TodoStore`;
  an `effect` writes the list to `localStorage` on every change.
- Components **inject** the `TodoStore` (dependency injection) and read its
  signals directly in the template — the UI updates automatically when state changes.
- **@angular/aria** provides behavior and accessibility **without styles**
  (keyboard, focus, and ARIA attributes); all visuals are custom CSS, styling
  states through attributes such as `[aria-selected="true"]`.

## Keyboard shortcuts in the list

| Key                 | Action                        |
| ------------------- | ----------------------------- |
| ↑ / ↓               | Move between tasks            |
| Space or Enter      | Toggle completed              |
| Delete or Backspace | Delete the focused task       |
| Type letters        | Jump to the matching task     |
