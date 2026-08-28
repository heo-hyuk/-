const CATEGORY_COLORS = {
  업무: "bg-blue-50 text-blue-500",
  개인: "bg-green-50 text-green-500",
  공부: "bg-purple-50 text-purple-500",
  기타: "bg-gray-100 text-gray-500",
};

// 완료되지 않은 항목의 마감 상태를 계산 (24시간 이내면 임박, 지났으면 초과)
function getDueStatus(dueDate, completed) {
  if (!dueDate || completed) return null;
  const due = new Date(`${dueDate}T23:59:59`);
  const diffHours = (due.getTime() - Date.now()) / (1000 * 60 * 60);
  if (diffHours < 0) return "overdue";
  if (diffHours <= 24) return "imminent";
  return null;
}

const DUE_STATUS_STYLE = {
  overdue: { label: "기한 초과", className: "bg-red-50 text-red-500" },
  imminent: { label: "마감 임박", className: "bg-amber-50 text-amber-600" },
};

function TodoItem({ todo, onDelete, onToggle }) {
  const badgeClass = CATEGORY_COLORS[todo.category] || CATEGORY_COLORS["기타"];
  const dueStatus = getDueStatus(todo.dueDate, todo.completed);

  return (
    <li className="flex items-start justify-between gap-3 py-3 px-2 rounded-lg hover:bg-gray-50 transition">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="mt-1 w-4 h-4 shrink-0 accent-blue-500"
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={todo.completed ? "line-through text-gray-300" : "text-gray-700"}>
            {todo.title}
          </span>
          {todo.category && (
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${badgeClass}`}>
              {todo.category}
            </span>
          )}
          {dueStatus && (
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${DUE_STATUS_STYLE[dueStatus].className}`}>
              {DUE_STATUS_STYLE[dueStatus].label}
            </span>
          )}
        </div>
        {todo.content && (
          <p className={`mt-1 break-all text-xs ${todo.completed ? "text-gray-300" : "text-gray-400"}`}>
            {todo.content}
          </p>
        )}
        {todo.dueDate && (
          <p className={`mt-1 text-xs ${dueStatus ? DUE_STATUS_STYLE[dueStatus].className.split(" ")[1] : "text-gray-300"}`}>
            마감일 {todo.dueDate}
          </p>
        )}
      </div>

      <button
        onClick={() => onDelete(todo.id)}
        className="shrink-0 text-xs text-gray-400 hover:text-red-500 transition"
      >
        삭제
      </button>
    </li>
  );
}

export default TodoItem;
