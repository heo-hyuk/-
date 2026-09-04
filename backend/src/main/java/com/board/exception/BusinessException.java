package com.board.exception;

import com.board.common.ErrorCode;

/**
 * 비즈니스 규칙 위반 시 던지는 예외. {@link ErrorCode} 를 담아 전역 예외 처리기가
 * 공통 응답 형식으로 변환한다.
 */
public class BusinessException extends RuntimeException {

    private final ErrorCode errorCode;

    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public BusinessException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }
}
