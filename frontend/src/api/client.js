import axios from 'axios';

/**
 * 공통 axios 인스턴스. 모든 API 호출은 이 인스턴스를 통해서만 이루어진다.
 * - 요청: localStorage 의 JWT 를 Authorization 헤더로 자동 첨부
 * - 응답: 공통 응답 형식 { success, code, message, data } 를 풀어 data 만 반환
 * - 오류: success=false 또는 HTTP 에러 시 message 를 담은 Error 로 변환,
 *         401 이면 인증정보를 비우고 로그인 페이지로 이동
 */
export const TOKEN_KEY = 'board.token';
export const USER_KEY = 'board.user';

const client = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => {
    const body = response.data;
    // 공통 응답 형식이면 data 만 반환
    if (body && typeof body === 'object' && 'success' in body) {
      if (!body.success) {
        return Promise.reject(new ApiError(body.message, body.code, response.status));
      }
      return body.data;
    }
    return body;
  },
  (error) => {
    const status = error.response?.status;
    const body = error.response?.data;
    const message = body?.message || error.message || '요청 처리 중 오류가 발생했습니다.';
    const code = body?.code || 'NETWORK_ERROR';

    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }
    return Promise.reject(new ApiError(message, code, status));
  },
);

export class ApiError extends Error {
  constructor(message, code, status) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

export default client;
