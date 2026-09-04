package com.board.post.dto;

import com.board.post.Post;

import java.time.LocalDateTime;

/** 목록용 요약 응답 (본문 제외) */
public record PostSummaryResponse(
        Long id,
        String title,
        String authorNickname,
        long viewCount,
        LocalDateTime createdAt
) {
    public static PostSummaryResponse from(Post post) {
        return new PostSummaryResponse(
                post.getId(),
                post.getTitle(),
                post.getAuthor().getNickname(),
                post.getViewCount(),
                post.getCreatedAt()
        );
    }
}
