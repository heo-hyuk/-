import client from './client';

// 목록 조회 (페이징 + 검색) → { content, page, size, totalElements, totalPages, first, last }
export function fetchPosts({ page = 0, size = 10, searchType = 'all', keyword = '' } = {}) {
  const params = { page, size };
  if (keyword.trim()) {
    params.searchType = searchType;
    params.keyword = keyword.trim();
  }
  return client.get('/posts', { params });
}

// 상세 조회 (조회수 증가) → PostResponse
export function fetchPost(id) {
  return client.get(`/posts/${id}`);
}

// 등록 → PostResponse
export function createPost({ title, content }) {
  return client.post('/posts', { title, content });
}

// 수정 → PostResponse
export function updatePost(id, { title, content }) {
  return client.put(`/posts/${id}`, { title, content });
}

// 삭제
export function deletePost(id) {
  return client.delete(`/posts/${id}`);
}
