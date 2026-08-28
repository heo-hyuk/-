import { useEffect, useState } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import { fetchTodos, createTodo, toggleTodo, deleteTodo } from './api/todoApi';

const FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'active', label: '미완료' },
  { key: 'completed', label: '완료' },
];

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await fetchTodos();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (todoData) => {
    try {
      const newTodo = await createTodo(todoData);
      setTodos((prev) => [...prev, newTodo]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggle = async (id) => {
    try {
      const updated = await toggleTodo(id);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAll = async () => {
    if (todos.length === 0) return;
    if (!window.confirm('모든 할 일을 삭제할까요?')) return;
    try {
      await Promise.all(todos.map((t) => deleteTodo(t.id)));
      setTodos([]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCompleted = async () => {
    const completedIds = todos.filter((t) => t.completed).map((t) => t.id);
    if (completedIds.length === 0) return;
    try {
      await Promise.all(completedIds.map((id) => deleteTodo(id)));
      setTodos((prev) => prev.filter((t) => !t.completed));
    } catch (err) {
      setError(err.message);
    }
  };

  const activeCount = todos.filter((t) => !t.completed).length;
  const filteredTodos = todos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-6 sm:px-4 sm:py-12">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-4 shadow-md sm:p-6">
        <h1 className="mb-1 text-center text-xl font-bold text-gray-800 sm:text-2xl">📝 할 일 목록</h1>
        <p className="mb-6 text-center text-sm text-gray-400">{activeCount}개 남음</p>

        <TodoForm onAdd={handleAdd} />

        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`rounded-full px-3 py-1 text-sm transition ${filter === f.key
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 flex justify-end gap-3 text-xs">
          <button
            onClick={handleDeleteCompleted}
            disabled={!todos.some((t) => t.completed)}
            className="text-gray-400 transition hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-gray-400"
          >
            완료 항목 삭제
          </button>
          <button
            onClick={handleDeleteAll}
            disabled={todos.length === 0}
            className="text-gray-400 transition hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-gray-400"
          >
            전체 삭제
          </button>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-500">{error}</p>
        )}

        {loading ? (
          <p className="py-10 text-center text-gray-400">불러오는 중...</p>
        ) : (
          <TodoList todos={filteredTodos} onToggle={handleToggle} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}
