"use client"
import { useState } from "react";
import { FiPlus } from "react-icons/fi";

interface TodoInputProps {
  addTodo: (text: string) => void;
}

export default function TodoInput({ addTodo }: TodoInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text);
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex mb-4">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter a task..."
        className="flex-1 p-2 border rounded-l-lg focus:outline-none"
      />
      <button
        type="submit"
        className="px-4 bg-primary text-white rounded-r-lg hover:bg-blue-600 transition flex items-center"
      >
        <FiPlus size={20} />
      </button>
    </form>
  );
}
