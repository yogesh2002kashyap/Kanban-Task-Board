# React Kanban Board

**Live demo → [kanban-task-board-blond.vercel.app](https://kanban-task-board-blond.vercel.app/)**

A task management board built with React and Tailwind CSS, inspired by tools like Trello.
This was built as a learning project to practice React fundamentals — component structure, state management, hooks, and drag-and-drop interaction.

---

## Overview

The board has three columns: **To Do**, **In Progress**, and **Done**. You can add tasks, assign them a priority, drag them between columns, edit them inline, delete them, and search across all tasks. Everything persists in `localStorage` so your tasks survive a page refresh.

---

## Features

- Add tasks with a priority level (High, Medium, Low)
- Drag and drop cards between columns using `dnd-kit`
- Inline editing — double-click any card to edit its text
- Delete cards with a hover-revealed close button
- Search bar to filter tasks across all columns in real time
- Priority color coding — red, yellow, and green left border per card
- Tasks saved to `localStorage` — persists on refresh
- Responsive layout using Tailwind CSS grid

---

## Tech Stack

| Tool | Purpose |
|---|---|
| React 18 | UI and component logic |
| Vite | Project setup and dev server |
| Tailwind CSS 3 | Styling |
| @dnd-kit/core | Drag and drop |
| localStorage | Client-side persistence |

---

## Installation

Make sure you have Node.js installed, then run:

```bash
# Clone the repository
git clone https://github.com/yogesh2002kashyap/kanban-task-board.git
cd kanban-task-board

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open `http://localhost:5173` in your browser.

> **Tailwind note:** If styles are not applying, check that your `tailwind.config.js` has the correct `content` paths and that `index.css` includes the three Tailwind directives.

```js
// tailwind.config.js
content: ["./index.html", "./src/**/*.{js,jsx}"]
```

```css
/* index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Folder Structure

```
kanban-board/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Board.jsx       — renders columns, wraps DndContext
│   │   ├── Column.jsx      — single column, droppable zone
│   │   ├── Card.jsx        — single task card, draggable
│   │   └── AddTask.jsx     — input form to create new tasks
│   ├── App.jsx             — root component, holds all state
│   ├── main.jsx            — React entry point
│   └── index.css           — Tailwind imports
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## Learnings

A few things that stuck from building this project:

**React fundamentals**
- State lives in the lowest common ancestor of all components that need it. In this project, that's `App.jsx`.
- Props flow down, events bubble up via callback functions.
- Never mutate state directly — always use the setter function with a new value.

**Hooks**
- `useState` is for values the UI depends on. When state changes, React re-renders automatically.
- `useEffect` is for syncing with the outside world. Saving to `localStorage` after every state change is a classic use case.

**Drag and drop**
- `dnd-kit` is hook-based. You use `useDraggable` on cards and `useDroppable` on columns. The `onDragEnd` event is where you update state based on where the card was dropped.
- Drag listeners should only go on a dedicated handle element — not the whole card — otherwise click events (like delete) get intercepted.

**Tailwind CSS**
- The `content` array in `tailwind.config.js` must point to your source files, otherwise Tailwind purges all classes and nothing shows up.
- The `group` and `group-hover` pattern is useful for showing UI elements (like a delete button) only when hovering a parent element.

---

## AI Usage

AI was used throughout this project in an iterative, conversational way — not through carefully engineered prompts. The typical pattern was: write some code, run into a problem, ask AI to explain or fix it, understand the fix, and move on.

Some areas where AI helped: initial component structure, understanding how props and callbacks work, fixing the drag-and-drop conflict between the delete button and drag listeners, diagnosing the Tailwind PostCSS setup issue, and general UI improvements with Tailwind classes.

AI was used as a learning aid, not to generate the entire project in one go. Each suggestion was read, understood, and manually applied.

A full log of prompts and what was learned from each is in [`Prompt.md`](./Prompt.md).

---

## License

MIT — free to use for learning and personal projects.