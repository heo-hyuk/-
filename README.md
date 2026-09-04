# 공지 게시판 (Notice Board)

React(Vite) 프론트엔드 + Spring Boot REST API 로 구현한 공지 게시판입니다.
두 모듈은 **별도 프로세스**로 실행되며 HTTP/JSON 으로 연계합니다.

## 기술 스택

| 구분 | 기술 |
|---|---|
| 프론트엔드 | React 19, Vite, React Router, Axios, Tailwind CSS |
| 백엔드 | Spring Boot 4.1.1, Spring Security, Spring Data JPA, JWT(jjwt) |
| DB | H2 (인메모리) |
| 빌드 도구 | npm(프론트), Gradle(백엔드) |

## 구현 기능

- 게시글 목록 조회 (페이징 + 검색: 제목/내용/작성자/전체)
- 게시글 상세 조회 (조회 시 조회수 자동 증가)
- 게시글 등록 / 수정 / 삭제
- 로그인 (JWT 발급, 이후 요청은 `Authorization: Bearer` 헤더로 인증)
- 등록·수정·삭제는 **인증된 사용자만**, 수정·삭제는 **작성자 본인만** 가능

## 폴더 구조

```
.
├── backend/                                  # Spring Boot REST API
│   └── src/main/java/com/board/
│       ├── common/    ApiResponse, ErrorCode, ErrorResponseWriter
│       ├── exception/ BusinessException, GlobalExceptionHandler
│       ├── security/  JwtTokenProvider, JwtAuthenticationFilter,
│       │              RestAuthenticationEntryPoint(401), RestAccessDeniedHandler(403),
│       │              CustomUserDetailsService, UserPrincipal
│       ├── config/    SecurityConfig(CORS·인가), DataInitializer(시드)
│       ├── user/      User, UserRepository
│       ├── auth/      AuthController, AuthService, dto/
│       └── post/      Post, PostRepository, PostService, PostController, dto/
└── frontend/                                 # React (Vite)
    └── src/
        ├── api/       client.js(공통 axios 인스턴스), authApi.js, postApi.js
        ├── context/   AuthContext.jsx
        ├── components/ Navbar, ProtectedRoute, Pagination, SearchBar
        └── pages/     PostListPage, PostDetailPage, PostFormPage, LoginPage
```

## 실행 방법

두 모듈을 각각 별도 터미널에서 실행합니다.

### 1) 백엔드 (포트 8080)

```bash
cd backend
./gradlew bootRun
```

- API Base URL: `http://localhost:8080/api`
- H2 콘솔: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:boarddb`, 사용자: `sa`, 비밀번호: 없음)
- 인메모리 DB 라서 기동할 때마다 기본 계정과 샘플 공지글이 자동 시드됩니다.

### 2) 프론트엔드 (포트 5173)

```bash
cd frontend
npm install
npm run dev
```

- 접속: `http://localhost:5173`

### 기본 계정 (시드)

| 아이디 | 비밀번호 | 닉네임 |
|---|---|---|
| user1 | password1! | 홍길동 |
| user2 | password2! | 김철수 |

## 공통 응답 형식

모든 API 는 성공/실패와 무관하게 아래 형식으로 응답합니다.

```json
{ "success": true, "code": "SUCCESS", "message": "요청이 정상 처리되었습니다.", "data": { } }
```

```json
{ "success": false, "code": "POST_NOT_FOUND", "message": "게시글을 찾을 수 없습니다.", "data": null }
```

- 프론트엔드의 공통 axios 인스턴스(`src/api/client.js`)가 응답 인터셉터에서 이 형식을
  풀어 `data` 만 반환하고, `success=false` 이거나 HTTP 에러면 `message` 를 담은 예외로 변환합니다.
  `401` 응답 시 저장된 토큰을 지우고 로그인 페이지로 이동합니다.

## 오류코드 (전역 예외 처리기)

`@RestControllerAdvice` 인 `GlobalExceptionHandler` 와, 시큐리티 필터 단계의
`RestAuthenticationEntryPoint` / `RestAccessDeniedHandler` 가 처리합니다.

| HTTP | code | 상황 |
|---|---|---|
| 400 | `INVALID_INPUT` | 검증 실패(@Valid), 잘못된 요청 본문/파라미터 |
| 401 | `INVALID_CREDENTIALS` | 로그인 시 아이디/비밀번호 불일치 |
| 401 | `UNAUTHENTICATED` | 토큰 없이 보호 자원 접근 |
| 403 | `ACCESS_DENIED` | 인증되었으나 권한 없음 |
| 403 | `NOT_AUTHOR` | 작성자가 아닌 사용자의 수정/삭제 시도 |
| 404 | `POST_NOT_FOUND` | 존재하지 않는 게시글 |
| 500 | `INTERNAL_ERROR` | 그 외 서버 오류 |

## CORS

`app.cors.allowed-origins` (기본 `http://localhost:5173`) 로 허용 출처를 한정합니다.
그 외 출처의 프리플라이트 요청은 403 으로 거부됩니다. (`SecurityConfig`)

## API 명세

Base URL: `http://localhost:8080/api`

| Method | Endpoint | 인가 | 설명 |
|---|---|---|---|
| POST | `/auth/login` | 공개 | 로그인, JWT 발급. body: `{ username, password }` |
| GET | `/posts` | 공개 | 목록. query: `page`(0), `size`(10), `searchType`(title\|content\|author\|all), `keyword` |
| GET | `/posts/{id}` | 공개 | 상세 조회 (조회수 +1) |
| POST | `/posts` | 인증 | 등록. body: `{ title, content }` |
| PUT | `/posts/{id}` | 인증 + 작성자 | 수정. body: `{ title, content }` |
| DELETE | `/posts/{id}` | 인증 + 작성자 | 삭제 |

### 응답 예시

로그인 `POST /api/auth/login`

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "로그인되었습니다.",
  "data": {
    "token": "eyJhbGciOiJIUzM4NCJ9...",
    "tokenType": "Bearer",
    "userId": 1,
    "username": "user1",
    "nickname": "홍길동"
  }
}
```

목록 `GET /api/posts?page=0&size=10`

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "요청이 정상 처리되었습니다.",
  "data": {
    "content": [
      { "id": 12, "title": "만족도 조사 참여 요청", "authorNickname": "김철수", "viewCount": 0, "createdAt": "2026-09-04T09:16:21" }
    ],
    "page": 0, "size": 10, "totalElements": 12, "totalPages": 2, "first": true, "last": false
  }
}
```

상세 `GET /api/posts/{id}`

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "요청이 정상 처리되었습니다.",
  "data": {
    "id": 5, "title": "고객센터 운영시간 변경", "content": "고객센터 운영시간이 ...",
    "authorId": 1, "authorNickname": "홍길동", "viewCount": 4,
    "createdAt": "2026-09-04T09:23:53", "updatedAt": "2026-09-04T09:23:53",
    "mine": false
  }
}
```

> `mine` 은 현재 로그인 사용자가 작성자인지 여부이며, 프론트엔드가 수정/삭제 버튼 노출을 판단하는 데 사용합니다.

## ERD

**users**

| 컬럼명 | 타입 | 제약조건 | 설명 |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | 고유 식별자 |
| username | VARCHAR(50) | NOT NULL, UNIQUE | 로그인 아이디 |
| password | VARCHAR(255) | NOT NULL | BCrypt 해시 |
| nickname | VARCHAR(50) | NOT NULL | 표시 이름 |
| created_at | TIMESTAMP | NOT NULL | 생성 일시 |

**posts**

| 컬럼명 | 타입 | 제약조건 | 설명 |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | 고유 식별자 |
| title | VARCHAR(200) | NOT NULL | 제목 |
| content | VARCHAR(4000) | NOT NULL | 내용 |
| author_id | BIGINT | FK → users.id, NOT NULL | 작성자 |
| view_count | BIGINT | NOT NULL, DEFAULT 0 | 조회수 |
| created_at | TIMESTAMP | NOT NULL | 작성 일시 |
| updated_at | TIMESTAMP | NOT NULL | 수정 일시 (조회수 증가와 무관, 본문 수정 시에만 갱신) |
