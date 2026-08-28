# TodoList 프로젝트

React(프론트엔드) + Spring Boot(백엔드, JPA) + H2(DB)로 구현한 TodoList 서비스입니다.

## 기술 스택

| 구분 | 기술 |
|---|---|
| 프론트엔드 | React 19, Vite, Tailwind CSS |
| 백엔드 | Spring Boot 4.1.1, Spring Data JPA |
| DB | H2 (인메모리) |
| 빌드 도구 | npm (프론트), Gradle (백엔드) |

## 폴더 구조

```
.
├── backend/                 # Spring Boot 프로젝트
│   └── src/main/java/com/todo/
│       ├── entity/Todo.java
│       ├── dto/TodoRequest.java
│       ├── repository/TodoRepository.java
│       └── controller/TodoController.java
└── frontend/                 # React(Vite) 프로젝트
    └── src/
        ├── App.jsx
        ├── TodoForm.jsx
        ├── TodoList.jsx
        ├── TodoItem.jsx
        └── api/todoApi.js
```

## 실행 방법

### 백엔드

```bash
cd backend
./gradlew bootRun
```

기본 포트: `http://localhost:8080`
H2 콘솔: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:tododb`, 사용자: `sa`)

### 프론트엔드

```bash
cd frontend
npm install
npm run dev
```

기본 포트: `http://localhost:5173`

## 주요 기능

- 할 일 등록 (제목, 내용, 마감일, 카테고리)
- 할 일 목록 조회
- 완료 여부 토글
- 개별 삭제 / 완료 항목 일괄 삭제 / 전체 삭제
- 상태별 필터 (전체 / 미완료 / 완료)

## ERD

**Todo**

| 컬럼명 | 타입 | 제약조건 | 설명 |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | 고유 식별자 |
| title | VARCHAR(255) | NOT NULL | 제목 |
| content | VARCHAR(1000) | NULL | 내용 |
| due_date | DATE | NULL | 마감일 |
| category | VARCHAR(255) | NULL | 카테고리 |
| completed | BOOLEAN | NOT NULL, DEFAULT false | 완료 여부 |
| created_at | TIMESTAMP | NOT NULL | 생성 일시 |

## API 명세

Base URL: `http://localhost:8080/api/todos`

| Method | Endpoint | 설명 | Request Body | Response |
|---|---|---|---|---|
| GET | `/api/todos` | 할 일 전체 조회 | - | `Todo[]` |
| GET | `/api/todos/{id}` | 할 일 단건 조회 | - | `Todo` |
| POST | `/api/todos` | 할 일 등록 | `{ title, content, dueDate, category }` | `Todo` |
| PATCH | `/api/todos/{id}/toggle` | 완료 여부 토글 | - | `Todo` |
| DELETE | `/api/todos/{id}` | 할 일 삭제 | - | `204 No Content` |

### Todo 응답 예시

```json
{
  "id": 1,
  "title": "보고서 작성",
  "content": "3분기 실적 보고서 작성하기",
  "dueDate": "2026-09-01",
  "category": "업무",
  "completed": false,
  "createdAt": "2026-08-28T09:05:00"
}
```
