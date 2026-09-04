package com.board.common;

import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * 시큐리티 필터 단계(전역 예외 처리기가 닿지 않는 지점)에서 401/403 응답을
 * 공통 응답 형식 JSON 으로 직접 기록한다.
 */
public final class ErrorResponseWriter {

    private ErrorResponseWriter() {
    }

    public static void write(HttpServletResponse response, ErrorCode errorCode) throws IOException {
        response.setStatus(errorCode.getStatus().value());
        response.setContentType("application/json");
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        String body = """
                {"success":false,"code":"%s","message":"%s","data":null}"""
                .formatted(escape(errorCode.getCode()), escape(errorCode.getMessage()));
        response.getWriter().write(body);
    }

    private static String escape(String value) {
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
