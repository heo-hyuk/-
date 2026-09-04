package com.board.auth;

import com.board.auth.dto.LoginRequest;
import com.board.auth.dto.LoginResponse;
import com.board.common.ErrorCode;
import com.board.exception.BusinessException;
import com.board.security.JwtTokenProvider;
import com.board.user.User;
import com.board.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_CREDENTIALS));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }

        String token = tokenProvider.createToken(user.getId(), user.getUsername());
        return LoginResponse.of(token, user.getId(), user.getUsername(), user.getNickname());
    }
}
