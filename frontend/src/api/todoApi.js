const BASE_URL = 'http://localhost:8080/api/todos';

// 할일 목록 조회 (필터 + 페이지네이션)
export async function fetchTodos({ filter = 'all', page = 0, size = 5 } = {}) {
  const params = new URLSearchParams({ filter, page, size });
  const res = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) throw new Error('할일 목록을 불러오지 못했습니다.');
  return res.json(); // { content, totalElements, totalPages, number, ... }
}

// 미완료 개수 (전체 기준)
export async function fetchActiveCount() {
  const res = await fetch(`${BASE_URL}/active-count`);
  if (!res.ok) throw new Error('미완료 개수를 불러오지 못했습니다.');
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

// 완료 항목 일괄 삭제
export async function deleteCompletedTodos() {
  const res = await fetch(`${BASE_URL}/completed`, { method: 'DELETE' });
  if (!res.ok) throw new Error('완료 항목 삭제에 실패했습니다.');
}

// 전체 삭제
export async function deleteAllTodos() {
  const res = await fetch(BASE_URL, { method: 'DELETE' });
  if (!res.ok) throw new Error('전체 삭제에 실패했습니다.');
}
