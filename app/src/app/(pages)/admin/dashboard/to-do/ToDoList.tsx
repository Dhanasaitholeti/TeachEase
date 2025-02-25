import TodoItem from "./ToDoItem";

interface TodoListProps {
  todos: { id: number; text: string; completed: boolean }[];
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}

export default function TodoList({ todos, toggleTodo, deleteTodo }: TodoListProps) {
  return (
    <ul>
      {todos.length > 0 ? (
        todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
        ))
      ) : (
        <p className="text-gray-500 text-center">No tasks yet! 🎉</p>
      )}
    </ul>
  );
}
