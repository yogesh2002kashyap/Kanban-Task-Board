import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";
import { useState } from "react";
import Column from "./Column";
import Card from "./Card";

const COLUMNS = [
  { key: "todo",       title: "To Do",       accent: "bg-slate-400" },
  { key: "inprogress", title: "In Progress",  accent: "bg-yellow-400" },
  { key: "done",       title: "Done",         accent: "bg-green-400" },
];

export default function Board({ tasks, deleteTask, moveTask, editTask }) {
  const [activeId, setActiveId] = useState(null);
  const activeTask = tasks.find((t) => t.id === activeId);

  const handleDragStart = (event) => setActiveId(event.active.id);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over) moveTask(active.id, over.id);
    setActiveId(null);
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid md:grid-cols-3 gap-4">
        {COLUMNS.map((col) => (
          <Column
            key={col.key}
            col={col}
            tasks={tasks.filter((t) => t.status === col.key)}
            deleteTask={deleteTask}
            editTask={editTask}
          />
        ))}
      </div>

      {/* Ghost card while dragging */}
      <DragOverlay>
        {activeTask ? (
          <Card
            task={activeTask}
            deleteTask={() => {}}
            editTask={() => {}}
            isDragOverlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}