package com.board.post.dto;

import com.board.post.Post;

import java.time.LocalDateTime;

/** 상세 조회 응답. {@code mine} 은 현재 로그인 사용자가 작성자인지 여부. */
public record PostResponse(
        Long id,
        String title,
        String content,
        Long authorId,
        String authorNickname,
        long viewCount,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        boolean mine
) {
    public static PostResponse of(Post post, Long currentUserId) {
        return new PostResponse(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getAuthor().getId(),
                post.getAuthor().getNickname(),
                post.getViewCount(),
                post.getCreatedAt(),
                post.getUpdatedAt(),
                currentUserId != null && post.isAuthoredBy(currentUserId)
        );
    }
}
