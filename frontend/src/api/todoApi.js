const BASE_URL = 'http://localhost:8080/api/todos';

// 전체 할일 조회
export async function fetchTodos() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('할일 목록을 불러오지 못했습니다.');
  return res.json();
}

// 할일 등록 (제목, 내용, 마감일, 카테고리)
export async function createTodo({ title, content, dueDate, category }) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content, dueDate, category }),
  });
  if (!res.ok) throw new Error('할일 등록에 실패했습니다.');
  return res.json();
}

// 완료 여부 토글
export async function toggleTodo(id) {
  const res = await fetch(`${BASE_URL}/${id}/toggle`, { method: 'PATCH' });
  if (!res.ok) throw new Error('상태 변경에 실패했습니다.');
  return res.json();
}

// 할일 삭제
export async function deleteTodo(id) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('할일 삭제에 실패했습니다.');
}
