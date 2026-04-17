import { useState, useEffect } from "react";
import Board from "./components/Board";
import AddTask from "./components/AddTask";

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("tasks")) || [];
    } catch {
      return [];
    }
  });

  const [query, setQuery] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text, priority) => {
    setTasks((prev) => [
      ...prev,
      {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2),
        text,
        status: "todo",
        priority,
      },
    ]);
  };

  const deleteTask = (id) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  const moveTask = (id, status) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );

  const editTask = (id, text) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text } : t))
    );

  const filtered = tasks.filter((t) =>
    t.text.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      {/* Top bar */}
      <header className="border-b border-white/10 px-8 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-violet-500 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1.5" fill="white" />
              <rect x="8" y="1" width="5" height="5" rx="1.5" fill="white" opacity="0.6" />
              <rect x="1" y="8" width="5" height="5" rx="1.5" fill="white" opacity="0.6" />
              <rect x="8" y="8" width="5" height="5" rx="1.5" fill="white" opacity="0.3" />
            </svg>
          </div>
          <h1 className="text-base font-semibold tracking-tight">Kanban Board</h1>
        </div>

        <div className="flex items-center gap-3 flex-1 max-w-sm">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10 10L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              placeholder="Search tasks..."
              className="w-full bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 rounded-lg pl-9 pr-3 py-2 outline-none focus:border-violet-500/60 focus:bg-white/8 transition-all"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="text-xs text-white/30 font-mono">
          {tasks.length} task{tasks.length !== 1 ? "s" : ""}
        </div>
      </header>

      <main className="px-8 py-6">
        <AddTask onAdd={addTask} />
        <Board
          tasks={filtered}
          deleteTask={deleteTask}
          moveTask={moveTask}
          editTask={editTask}
        />
      </main>
    </div>
  );
}