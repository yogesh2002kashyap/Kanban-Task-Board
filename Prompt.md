# Prompt.md — Development Prompts Journal
## Every prompt used during the Kanban Board build journey

This file documents the actual prompts sent to AI during the development of this project.
I am still learning React — I made mistakes, hit errors, and figured things out step by step.
This is not a perfect log, it is an honest one.

---

## SECTION 1 — Project Setup & Planning

### Prompt 1 — Initial Mission Brief
```
Mission 5: The "Kanban Task Board"
Theme: React.js, Components, State (useState), and Props.

Goal: Build a Trello-like Task Management Board using React.

Level 3 (Advanced Requirement) - The Professional Touch:
1. Drag and Drop: Use a library like dnd-kit or react-beautiful-dnd.
2. The Interaction: I should be able to drag a card from "To Do" and
   drop it into "Done" smoothly.
3. Filter: Add a search bar at the top to filter tasks by name.

Don't give me full code. Give me a file with all the instructions as a
roadmap and also give me just the UI because I want to learn everything
and write all the logic myself.
```

**What this produced:** A full `roadmap.md` file with sequential instructions for all 3 levels, plus a UI shell with placeholder components and TODO comments — no logic implemented yet.

**Why it worked:** Asking for no code forced AI to give instructions instead of solutions. Helped me actually understand what I was building before writing a single line.

---

### Prompt 2 — Explain useState From Scratch
```
Explain useState like I am completely new to React.
```

**What this produced:** A full breakdown of the hook with diagrams — the anatomy of `const [value, setValue] = useState(initial)`, how re-renders work, three live examples (number, string, boolean), and the most important rule: never mutate state directly, always call the setter.

**Why I needed this:** I kept writing `tasks.push(newTask)` and nothing was updating on screen. I didn't understand why. This cleared it up completely.

**Concept learned:** React doesn't watch your variables — it only re-renders when you call the setter function. Mutation is invisible to React.

---

## SECTION 2 — Building Core Features

### Prompt 3 — Adding Tasks Not Working
```
I have an input and a button in AddTask.jsx but when I click Add nothing
happens. Here is my code: [pasted AddTask.jsx]
```

**Root cause found:** I had written `tasks.push(newTask)` directly instead of calling `setTasks`. Also my `onAdd` prop wasn't being called at all — I had `onClick={handleAdd}` but `handleAdd` was defined after the return statement.

**Fix applied:** Moved `handleAdd` above the return, replaced mutation with:
```js
setTasks(prev => [...prev, newTask])
```

**Lesson learned:** Function definitions must come before the JSX return. And pushing to an array does nothing in React — you need a new array reference via the spread operator.

---

### Prompt 4 — How Do I Give Each Task a Unique ID
```
I am using array index as the key prop for my tasks list. My mentor said
this is bad. Why and what should I use instead?
```

**What this revealed:** Using index as key causes React to mix up which DOM node belongs to which item when you delete or reorder. If you delete the item at index 1, everything shifts and React updates the wrong cards.

**Fix applied:**
```js
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
```

Called `uid()` when creating each task object and stored it as `task.id`.

**Lesson learned:** Keys must be stable and unique. Index keys only work if the list never changes — which defeats the purpose of a Kanban board.

---

### Prompt 5 — Delete Button Not Working, Card Drags Instead
```
My delete button is inside the card but when I click it the card starts
dragging instead of getting deleted. Sometimes it does nothing at all.
Here is my Card.jsx: [pasted full file]
```

**Root cause found:** I had put `{...listeners}` and `{...attributes}` on the outer card `div` which wrapped everything including the delete button. The drag handler was intercepting the click event before it reached the button.

**Fix applied:** Moved `{...listeners}` and `{...attributes}` to a small dedicated drag handle element (a grip icon) at the top left of the card. The delete button now sits completely outside the drag zone.

**Lesson learned:** Drag listeners swallow click events. Always isolate them to a small handle — never the whole card. This is one of the most common `dnd-kit` mistakes.

---

## SECTION 3 — Tailwind CSS Errors

### Prompt 6 — Tailwind Classes Not Applying At All
```
I installed Tailwind CSS but none of my classes are showing up.
The page is completely unstyled. I am getting a PostCSS error in terminal.
```

**Root cause found:** Two problems at the same time:
1. `tailwind.config.js` had an empty `content` array — Tailwind was purging every single class because it didn't know where to look
2. `index.css` was missing the three required Tailwind directives

**Fix applied:**
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

**Lesson learned:** Tailwind only keeps CSS classes it actually finds in your source files. Empty `content` = zero classes kept. This is the most common Tailwind setup mistake and it gives no clear error.

---

### Prompt 7 — Opacity Modifier Classes Not Working
```
I am trying to use bg-white/5 and border-white/10 but they are not
applying at all. Regular classes like bg-gray-900 work fine.
```

**Root cause found:** I was on Tailwind CSS v2 which does not support the `/` opacity modifier syntax. That was introduced in Tailwind v3.

**Fix applied:**
```bash
npm install -D tailwindcss@3 postcss autoprefixer
```

**Lesson learned:** Always check which version of a library you installed. A lot of tutorials and Stack Overflow answers mix v2 and v3 Tailwind syntax without mentioning which version they are targeting.

---

## SECTION 4 — Drag and Drop Setup

### Prompt 8 — Setting Up dnd-kit
```
I want to add drag and drop so I can drag cards between columns.
I tried react-beautiful-dnd but I read it is deprecated. Can you show
me how dnd-kit works and how to set it up for my board?
```

**What this produced:** A step-by-step breakdown of the three core pieces:
- `<DndContext onDragEnd={...}>` wraps the whole board in `Board.jsx`
- `useDroppable({ id: col.key })` makes each `Column` a drop zone
- `useDraggable({ id: task.id })` makes each `Card` draggable

And the `onDragEnd` handler explained:
```js
function handleDragEnd(event) {
  const { active, over } = event;
  // active.id = the card that was dragged (task id)
  // over.id   = the column it was dropped on (column key)
  if (over) moveTask(active.id, over.id);
}
```

**Lesson learned:** `dnd-kit` is hook-based — you don't wrap things in special components, you attach behavior with hooks. The `onDragEnd` event is the only place you update your state.

---

### Prompt 9 — Cards Snapping Back After Drop
```
When I drag a card and drop it in another column it moves for a second
and then snaps back to the original column. The column highlight works
but the task does not actually move.
```

**Root cause found:** My `moveTask` function was updating `task.col` but my `Column.jsx` was filtering tasks by `task.status`. I had used two different field names across my files without realizing it.

**Fix applied:** Standardized everything to `status` as the field name. Updated `moveTask` to set `t.status` and confirmed every `.filter()` also used `t.status`.

**Lesson learned:** Inconsistent field names across components are a silent bug — no error is thrown, things just silently don't work. Pick one name and stick with it everywhere from the start.

---

## SECTION 5 — UI Improvements

### Prompt 10 — UI Looks Like a Prototype
```
My app works but the UI looks very rough and basic even though I am using
Tailwind. The inputs are plain white boxes, cards have no styling, and
columns all look the same. Can you help make it look more professional?
I have uploaded all my component files. I am using tailwindcss@3.4.19
```
*(Shared App.jsx, Board.jsx, Column.jsx, Card.jsx, AddTask.jsx)*

**What this produced:** A full UI overhaul across all 5 files:
- Deep dark background `bg-[#0f1117]` instead of flat `bg-gray-900`
- Inputs with `bg-white/5 border-white/10` and violet focus rings
- Cards with priority-colored left borders (`border-l-red-400`, `border-l-yellow-400`, `border-l-green-400`)
- Delete button hidden until hover using `group` + `group-hover:opacity-100`
- Column headers with colored accent dots and a live task count badge
- `DragOverlay` that shows a ghost copy of the card following the cursor while dragging

**New patterns learned:**
- `bg-white/5` — white at 5% opacity, great for subtle surfaces on dark backgrounds
- `group` + `group-hover:opacity-100` — show a child element only when hovering the parent
- `DragOverlay` from `@dnd-kit/core` renders a floating card during drag instead of moving the real one

---

### Prompt 11 — Favicon for the Tab Bar
```
How can I add a mini icon on the tab bar, same as the logo you made in the navbar?
```

**What this produced:** A `favicon.svg` file for the `public/` folder and the exact `<link>` tag to put in `index.html`.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="#7c3aed"/>
  <rect x="4" y="4" width="10" height="10" rx="3" fill="white"/>
  <rect x="18" y="4" width="10" height="10" rx="3" fill="white" opacity="0.6"/>
  <rect x="4" y="18" width="10" height="10" rx="3" fill="white" opacity="0.6"/>
  <rect x="18" y="18" width="10" height="10" rx="3" fill="white" opacity="0.3"/>
</svg>
```

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

**Lesson learned:** SVG files work as favicons in all modern browsers. The Vite scaffold ships with `/vite.svg` by default — just replace that one line in `index.html`.

---

## SECTION 6 — Deployment

### Prompt 12 — Deploying to Vercel
```
How do I deploy my Vite React app to Vercel?
```

**Steps followed:**
1. Pushed project to GitHub
2. Went to vercel.com → Import Project → selected the repo
3. Vercel auto-detected Vite — build command `npm run build`, output folder `dist`
4. Clicked Deploy

**Live URL:** https://kanban-task-board-blond.vercel.app/

**Lesson learned:** Vercel handles Vite projects with zero configuration. Just push to GitHub and import — it figures out the rest automatically.

---

## Key Lessons Learned Across the Whole Project

1. **Never mutate state directly** — `tasks.push()` is invisible to React. Always use the setter with a new value.
2. **Keys must be stable** — never use array index as a key in a list that can change.
3. **Drag listeners belong on a handle** — putting `{...listeners}` on the whole card breaks every click event inside it.
4. **Tailwind's `content` array must point to your files** — empty content = no styles at all, no error message.
5. **One field name everywhere** — mixing `task.col` and `task.status` across files causes silent bugs with no console error.
6. **Isolate local state** — the input text in `AddTask` only needs to live in `AddTask`, not in `App`. Lift state only when multiple components need it.
7. **Read the error message carefully** — most of my bugs were described directly in the browser console. I just wasn't reading them closely enough at first.

---

## Total Errors Encountered & Resolved

| # | Error | Root Cause | Resolution |
|---|---|---|---|
| 1 | Clicking Add does nothing | Called `tasks.push()` instead of `setTasks` | Replaced with `setTasks(prev => [...prev, newTask])` |
| 2 | Delete button drags card instead | `{...listeners}` placed on whole card div | Moved listeners to dedicated drag handle only |
| 3 | Tailwind classes not applying | Empty `content` array in `tailwind.config.js` | Added correct file glob paths to `content` |
| 4 | `bg-white/5` not working | Project was on Tailwind v2 | Upgraded to Tailwind v3 |
| 5 | Card snaps back after drop | Used `task.col` in some files, `task.status` in others | Standardized to `status` everywhere |
| 6 | Tasks not updating on delete | Mutating state instead of using filter | Used `setTasks(prev => prev.filter(...))` |