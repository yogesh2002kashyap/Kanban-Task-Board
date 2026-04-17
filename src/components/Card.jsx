import { useDraggable } from "@dnd-kit/core";
import { useState } from "react";

const PRIORITY_CONFIG = {
  high:   { border: "border-l-red-400",    badge: "bg-red-400/15 text-red-300",    dot: "bg-red-400",    label: "High" },
  medium: { border: "border-l-yellow-400", badge: "bg-yellow-400/15 text-yellow-300", dot: "bg-yellow-400", label: "Med" },
  low:    { border: "border-l-green-400",  badge: "bg-green-400/15 text-green-300",  dot: "bg-green-400",  label: "Low" },
};

export default function Card({ task, deleteTask, editTask, isDragOverlay }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id });

  const [editing, setEditing] = useState(false);
  const config = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-[#1a1d27] border border-white/8 border-l-2 ${config.border}
        rounded-lg p-3 transition-all duration-150 select-none
        ${isDragging ? "opacity-40 scale-95" : ""}
        ${isDragOverlay ? "shadow-2xl shadow-black/50 rotate-1 scale-105 opacity-100" : "hover:border-white/15"}
      `}
    >
      {/* Drag handle + content row */}
      <div className="flex items-start gap-2">
        {/* Drag handle — only this area initiates drag */}
        <div
          {...listeners}
          {...attributes}
          className="mt-0.5 cursor-grab active:cursor-grabbing text-white/20 hover:text-white/50 transition-colors flex-shrink-0"
        >
          <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor">
            <circle cx="4" cy="3"  r="1.5"/>
            <circle cx="8" cy="3"  r="1.5"/>
            <circle cx="4" cy="8"  r="1.5"/>
            <circle cx="8" cy="8"  r="1.5"/>
            <circle cx="4" cy="13" r="1.5"/>
            <circle cx="8" cy="13" r="1.5"/>
          </svg>
        </div>

        {/* Task text / edit input */}
        <div className="flex-1 min-w-0">
          {editing ? (
            <input
              defaultValue={task.text}
              autoFocus
              onBlur={(e) => {
                const val = e.target.value.trim();
                if (val) editTask(task.id, val);
                setEditing(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.target.blur();
                if (e.key === "Escape") setEditing(false);
              }}
              className="w-full bg-white/10 border border-violet-500/50 text-white text-sm rounded px-2 py-1 outline-none"
            />
          ) : (
            <p
              onDoubleClick={() => setEditing(true)}
              title="Double-click to edit"
              className="text-sm text-white/85 leading-snug break-words cursor-text"
            >
              {task.text}
            </p>
          )}
        </div>

        {/* Delete button — hidden until hover */}
        {!isDragOverlay && (
          <button
            onClick={() => deleteTask(task.id)}
            className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-all mt-0.5"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Footer — priority badge */}
      <div className="mt-2.5 flex items-center gap-1.5">
        <span className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded font-medium ${config.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
          {config.label}
        </span>
      </div>
    </div>
  );
}