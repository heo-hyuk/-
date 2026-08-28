package com.todo.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class TodoRequest {
    private String title;
    private String content;
    private LocalDate dueDate;
    private String category;
}
