# Prompt Log — React Kanban Board

A honest record of how I used AI during the development of this project.
These are not carefully engineered prompts — they reflect how I actually talked to AI while building this.

---

## Prompt 1 — Project Setup

**Prompt:**
> "I need to build a Kanban board in React with three columns: To Do, In Progress, and Done. I'm using Vite. How do I get started and what should my folder structure look like?"

**Context:**
I had just created a Vite + React project and wasn't sure how to structure the components or where to put state. I knew I needed columns and cards but didn't know how to break it into components.

**Outcome:**
AI suggested a clean folder structure with `App.jsx` holding all the state, and separate components for `Board`, `Column`, `Card`, and `AddTask`. It also explained that state should live in the lowest common ancestor — `App.jsx` in this case — and be passed down as props.

**Learning:**
State should live at the top and flow down. Breaking UI into small components makes the code much easier to manage.

---

## Prompt 2 — Adding Tasks and Rendering Lists

**Prompt:**
> "How do I add a task to the To Do column when I click a button? I have an input field and a button but nothing happens when I click."

**Context:**
I had the input and button rendered but hadn't connected them to state yet. I was unsure how to use `useState` for the input value and how to update the tasks array.

**Outcome:**
AI walked me through using a local `useState` for the input field inside `AddTask.jsx`, and calling a parent `onAdd` function passed as a prop. It also showed me how to use `.map()` to render the task list and why each item needs a `key` prop.

**Learning:**
Props are how you connect child components back to parent state. Never use array index as a `key` — use a unique ID.

---

## Prompt 3 — Delete Button Not Working

**Prompt:**
> "My delete button is inside the card but when I click it, it sometimes drags the card instead of deleting it. How do I fix this?"

**Context:**
I had put drag listeners (`{...listeners}`) on the entire card div, including the delete button. So clicking delete was being intercepted by the drag handler and the task wasn't being removed.

**Outcome:**
AI explained that I should move the `{...listeners}` and `{...attributes}` from the card wrapper to only a specific drag handle element. This way, the delete button sits outside the drag zone and `onClick` works normally without interference.

**Learning:**
Drag listeners should only go on a dedicated handle, not the entire card. Event bubbling causes hard-to-spot bugs when click and drag compete.

---

## Prompt 4 — Tailwind CSS Not Working

**Prompt:**
> "My Tailwind classes aren't applying. I installed Tailwind but nothing is showing up. I'm getting a PostCSS error."

**Context:**
I had installed Tailwind but the styles weren't working. The terminal was showing a vague PostCSS-related error and I didn't understand what `content` in `tailwind.config.js` meant.

**Outcome:**
AI diagnosed that my `tailwind.config.js` had an empty `content` array, so Tailwind wasn't scanning any files and was purging all styles. It also pointed out I needed the correct three lines in `index.css` (`@tailwind base`, `@tailwind components`, `@tailwind utilities`). After fixing both, Tailwind worked.

**Learning:**
Tailwind's `content` array tells it which files to scan for class names. If it's empty or wrong, all styles get purged and nothing shows up.

---

## Prompt 5 — Drag and Drop with dnd-kit

**Prompt:**
> "I want to add drag and drop so I can move cards between columns. I heard about dnd-kit. Can you show me how to set it up for my board?"

**Context:**
I had no experience with drag and drop libraries. I'd heard of `react-beautiful-dnd` but read it was deprecated, so I wanted to use `dnd-kit` instead. I wasn't sure where `DndContext`, `useDroppable`, and `useDraggable` fit in my existing component structure.

**Outcome:**
AI showed me where to wrap `DndContext` (in `Board.jsx`), how to make each `Column` a droppable zone using `useDroppable`, and how to make each `Card` draggable using `useDraggable`. It also explained the `onDragEnd` handler and how `active.id` and `over.id` map to the task ID and column key.

**Learning:**
`dnd-kit` is modular — you attach behavior with hooks rather than wrapping everything in a special component. The `onDragEnd` event is where you actually update your state.

---

## Prompt 6 — UI Improvements

**Prompt:**
> "My UI looks very plain and unstyled even though I'm using Tailwind. Can you help me make it look cleaner and more professional? I have a dark background but the inputs and cards look rough."

**Context:**
The app was functional but looked like an unstyled prototype. Inputs were plain white boxes, the cards had no visual hierarchy, and the columns didn't feel distinct. I wanted it to look closer to a real app.

**Outcome:**
AI suggested specific Tailwind classes for each element — subtle `bg-white/5` surfaces for inputs, `border-white/10` borders, `rounded-lg` corners, and `focus:border-violet-500/60` for focus states. It also introduced the `group` and `group-hover` pattern to hide the delete button until you hover over a card, which cleaned up the UI significantly.

**Learning:**
Tailwind's opacity modifier syntax like `bg-white/5` is great for dark UIs. The `group` + `group-hover` pattern is useful for showing contextual actions only on hover.

---

## Prompt 7 — Component Refactoring

**Prompt:**
> "Right now my Board.jsx is passing all tasks to every column and the column is filtering them. My mentor said this is not ideal. How should I fix it?"

**Context:**
`Board.jsx` was passing the full `tasks` array to all three `Column` components, and each `Column` was running `.filter()` internally. It worked, but it was doing unnecessary work and made the data flow less clear.

**Outcome:**
AI explained that it's cleaner to filter in `Board.jsx` before passing tasks down, so each `Column` only receives the tasks it actually needs. This makes props more predictable and the component easier to reason about. It also means `Column` no longer needs to know about `status` filtering logic — it just renders what it receives.

**Learning:**
Components should receive exactly the data they need — no more. Filtering and deriving data at the parent level keeps child components simpler and more reusable.