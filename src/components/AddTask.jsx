import { useState } from "react";

const PRIORITIES = [
  { value: "high",   label: "High",   dot: "bg-red-400" },
  { value: "medium", label: "Medium", dot: "bg-yellow-400" },
  { value: "low",    label: "Low",    dot: "bg-green-400" },
];

export default function AddTask({ onAdd }) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("medium");

  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd(text.trim(), priority);
    setText("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <div className="flex gap-2 mb-6 max-w-xl">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKey}
        className="flex-1 bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 rounded-lg px-4 py-2.5 outline-none focus:border-violet-500/60 transition-all"
        placeholder="Add a new task and press Enter..."
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="bg-white/5 border border-white/10 text-sm text-white rounded-lg px-3 py-2.5 outline-none focus:border-violet-500/60 transition-all cursor-pointer"
      >
        {PRIORITIES.map((p) => (
          <option key={p.value} value={p.value} className="bg-[#1a1d27]">
            {p.label}
          </option>
        ))}
      </select>

      <button
        onClick={handleAdd}
        className="bg-violet-600 hover:bg-violet-500 active:scale-95 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-all"
      >
        Add task
      </button>
    </div>
  );
}