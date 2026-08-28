package com.todo.controller;

import com.todo.dto.TodoRequest;
import com.todo.entity.Todo;
import com.todo.repository.TodoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
public class TodoController {

    private final TodoRepository todoRepository;

    public TodoController(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    // 목록 조회 (필터 + 페이지네이션)
    @GetMapping
    public Page<Todo> getTodos(
            @RequestParam(defaultValue = "all") String filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        if ("active".equals(filter)) {
            return todoRepository.findByCompleted(false, pageable);
        }
        if ("completed".equals(filter)) {
            return todoRepository.findByCompleted(true, pageable);
        }
        return todoRepository.findAll(pageable);
    }

    // 미완료 개수 (필터/페이지와 무관하게 항상 전체 기준)
    @GetMapping("/active-count")
    public long getActiveCount() {
        return todoRepository.countByCompleted(false);
    }

    // 단건 조회
    @GetMapping("/{id}")
    public ResponseEntity<Todo> getTodo(@PathVariable Long id) {
        return todoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 등록
    @PostMapping
    public ResponseEntity<Todo> createTodo(@RequestBody TodoRequest request) {
        Todo todo = new Todo(request.getTitle(), request.getContent(), request.getDueDate(), request.getCategory());
        return ResponseEntity.ok(todoRepository.save(todo));
    }

    // 완료 여부만 토글
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Todo> toggleTodo(@PathVariable Long id) {
        return todoRepository.findById(id)
                .map(todo -> {
                    todo.setCompleted(!todo.isCompleted());
                    return ResponseEntity.ok(todoRepository.save(todo));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 완료 항목 일괄 삭제
    @DeleteMapping("/completed")
    @Transactional
    public ResponseEntity<Void> deleteCompletedTodos() {
        todoRepository.deleteByCompleted(true);
        return ResponseEntity.noContent().build();
    }

    // 전체 삭제
    @DeleteMapping
    public ResponseEntity<Void> deleteAllTodos() {
        todoRepository.deleteAll();
        return ResponseEntity.noContent().build();
    }

    // 단건 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        if (!todoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        todoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
