import { FiCheckCircle, FiTrash2, FiCircle } from "react-icons/fi";

interface TodoItemProps {
  todo: { id: number; text: string; completed: boolean };
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}

export default function TodoItem({ todo, toggleTodo, deleteTodo }: TodoItemProps) {
  return (
    <li className="flex items-center justify-between bg-gray-50 p-3 mb-2 rounded-lg shadow">
      <div
        className="flex items-center gap-3 cursor-pointer flex-1"
        onClick={() => toggleTodo(todo.id)}
      >
        {todo.completed ? (
          <FiCheckCircle className="text-green-500" size={20} />
        ) : (
          <FiCircle className="text-gray-400" size={20} />
        )}
        <span className={`text-lg ${todo.completed ? "line-through text-gray-500" : "text-gray-800"}`}>
          {todo.text}
        </span>
      </div>
      <button onClick={() => deleteTodo(todo.id)} className="text-red-500 hover:text-red-600">
        <FiTrash2 size={20} />
      </button>
    </li>
  );
}
