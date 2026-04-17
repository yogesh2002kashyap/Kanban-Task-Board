import { useDroppable } from "@dnd-kit/core";
import Card from "./Card";

export default function Column({ col, tasks, deleteTask, editTask }) {
  const { setNodeRef, isOver } = useDroppable({ id: col.key });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-xl border transition-all duration-150 ${
        isOver
          ? "border-violet-500/50 bg-violet-500/5"
          : "border-white/8 bg-white/3"
      }`}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/8">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${col.accent}`} />
          <h2 className="text-sm font-medium text-white/80">{col.title}</h2>
        </div>
        <span className="text-xs font-mono text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex-1 p-3 flex flex-col gap-2 min-h-[200px]">
        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xs text-white/20">Drop cards here</p>
          </div>
        )}
        {tasks.map((task) => (
          <Card
            key={task.id}
            task={task}
            deleteTask={deleteTask}
            editTask={editTask}
          />
        ))}
      </div>
    </div>
  );
}