package com.board.auth.dto;

public record LoginResponse(
        String token,
        String tokenType,
        Long userId,
        String username,
        String nickname
) {
    public static LoginResponse of(String token, Long userId, String username, String nickname) {
        return new LoginResponse(token, "Bearer", userId, username, nickname);
    }
}
