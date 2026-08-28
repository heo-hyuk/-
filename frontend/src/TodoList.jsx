import TodoItem from "./TodoItem";

function TodoList({ todos, onDelete, onToggle }) {
  if (todos.length === 0) {
    return <p className="text-center text-gray-300 text-sm py-8">할 일이 없어요</p>;
  }

  return (
    <ul className="divide-y divide-gray-100">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onDelete={onDelete} onToggle={onToggle} />
      ))}
    </ul>
  );
}

export default TodoList;
