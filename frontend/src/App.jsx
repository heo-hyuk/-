import { useEffect, useState } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import {
  fetchTodos,
  fetchActiveCount,
  createTodo,
  toggleTodo,
  deleteTodo,
  deleteCompletedTodos,
  deleteAllTodos,
} from './api/todoApi';

const FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'active', label: '미완료' },
  { key: 'completed', label: '완료' },
];

const PAGE_SIZE = 5;

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadTodos(filter, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, page]);

  // 현재 필터/페이지의 목록과 상단 카운트(미완료/전체)를 함께 갱신
  const loadTodos = async (f, p) => {
    try {
      setLoading(true);
      let pageData = await fetchTodos({ filter: f, page: p, size: PAGE_SIZE });

      // 삭제/토글로 현재 페이지가 비면 이전 페이지로 보정
      if (pageData.content.length === 0 && p > 0) {
        p -= 1;
        pageData = await fetchTodos({ filter: f, page: p, size: PAGE_SIZE });
      }

      const [active, allPage] = await Promise.all([
        fetchActiveCount(),
        fetchTodos({ filter: 'all', page: 0, size: 1 }),
      ]);

      setTodos(pageData.content);
      setTotalPages(pageData.totalPages);
      setActiveCount(active);
      setTotalCount(allPage.totalElements);
      setPage(p);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key) => {
    setFilter(key);
    setPage(0);
  };

  const handleAdd = async (todoData) => {
    try {
      await createTodo(todoData);
      await loadTodos(filter, 0);
      setPage(0);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleTodo(id);
      await loadTodos(filter, page);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      await loadTodos(filter, page);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAll = async () => {
    if (totalCount === 0) return;
    if (!window.confirm('모든 할 일을 삭제할까요?')) return;
    try {
      await deleteAllTodos();
      await loadTodos(filter, 0);
      setPage(0);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCompleted = async () => {
    if (totalCount - activeCount === 0) return;
    try {
      await deleteCompletedTodos();
      await loadTodos(filter, 0);
      setPage(0);
    } catch (err) {
      setError(err.message);
    }
  };

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
                onClick={() => handleFilterChange(f.key)}
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
            disabled={totalCount - activeCount === 0}
            className="text-gray-400 transition hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-gray-400"
          >
            완료 항목 삭제
          </button>
          <button
            onClick={handleDeleteAll}
            disabled={totalCount === 0}
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
          <>
            <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />

            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-center gap-4 text-sm">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="text-gray-400 transition hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-gray-400"
                >
                  이전
                </button>
                <span className="text-gray-500">
                  {page + 1} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="text-gray-400 transition hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-gray-400"
                >
                  다음
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
