import client from './client';

// 로그인 → { token, tokenType, userId, username, nickname }
export function login({ username, password }) {
  return client.post('/auth/login', { username, password });
}
