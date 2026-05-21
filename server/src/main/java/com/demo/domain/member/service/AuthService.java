package com.demo.domain.member.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import com.demo.domain.member.dto.AuthTokensDTO;
import com.demo.domain.member.dto.request.LoginRequestDTO;
import com.demo.domain.member.exception.LoginException;
import com.demo.domain.member.exception.RefreshTokenException;
import com.demo.global.security.jwt.JwtContents;
import com.demo.global.security.jwt.JwtUtil;
import com.demo.global.redis.RedisKeys;
import com.demo.global.redis.RedisRepository;
import com.demo.global.security.CustomUserDetails;
import java.time.Duration;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtUtil jwtUtil;
    private final RedisRepository redisRepository;
    private final AuthenticationManager authenticationManager;

    public String reissueAccessToken(String refreshToken) {
        validateRefreshToken(refreshToken);
        return jwtUtil.createJwt(JwtContents.TOKEN_TYPE_ACCESS,
                jwtUtil.getEmail(refreshToken),
                jwtUtil.getRole(refreshToken),
                jwtUtil.getMemberId(refreshToken),
                JwtContents.ACCESS_TOKEN_EXPIRE_MILLIS);
    }

    public String reissueRefreshToken(String oldRefreshToken) {
        validateRefreshToken(oldRefreshToken);

        Long memberId = jwtUtil.getMemberId(oldRefreshToken);
        redisRepository.deleteValue(RedisKeys.refreshToken(memberId, jwtUtil.getJti(oldRefreshToken)));

        String newRefreshToken = jwtUtil.createJwt(JwtContents.TOKEN_TYPE_REFRESH,
                jwtUtil.getEmail(oldRefreshToken),
                jwtUtil.getRole(oldRefreshToken),
                memberId,
                JwtContents.REFRESH_TOKEN_EXPIRE_MILLIS);

        redisRepository.setValue(
                RedisKeys.refreshToken(memberId, jwtUtil.getJti(newRefreshToken)),
                "valid",
                Duration.ofSeconds(JwtContents.REFRESH_TOKEN_EXPIRE_SECONDS));

        return newRefreshToken;
    }

    public AuthTokensDTO login(LoginRequestDTO request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            String email = userDetails.getEmail();
            String role = userDetails.getAuthorities().iterator().next().getAuthority().replaceFirst("^ROLE_", "");
            Long memberId = userDetails.getMemberId();

            String accessToken = jwtUtil.createJwt(JwtContents.TOKEN_TYPE_ACCESS, email, role, memberId,
                    JwtContents.ACCESS_TOKEN_EXPIRE_MILLIS);
            String refreshToken = jwtUtil.createJwt(JwtContents.TOKEN_TYPE_REFRESH, email, role, memberId,
                    JwtContents.REFRESH_TOKEN_EXPIRE_MILLIS);

            redisRepository.setValue(
                    RedisKeys.refreshToken(memberId, jwtUtil.getJti(refreshToken)),
                    "valid",
                    Duration.ofSeconds(JwtContents.REFRESH_TOKEN_EXPIRE_SECONDS));

            return new AuthTokensDTO(accessToken, refreshToken);

        } catch (Exception e) {
            e.printStackTrace();
            throw new LoginException("이메일 또는 비밀번호가 잘못되었습니다.");
        }
    }

    public void logout(String refreshToken) {
        if (refreshToken != null) {
            try {
                Long memberId = jwtUtil.getMemberId(refreshToken);
                String jti = jwtUtil.getJti(refreshToken);
                redisRepository.deleteValue(RedisKeys.refreshToken(memberId, jti));
            } catch (Exception ignored) {
            }
        }
    }

    private void validateRefreshToken(String refreshToken) {
        if (refreshToken == null) {
            throw new RefreshTokenException("토큰이 존재하지 않습니다.");
        }

        try {
            Long memberId = jwtUtil.getMemberId(refreshToken);
            String jti = jwtUtil.getJti(refreshToken);
            if (jwtUtil.isExpired(refreshToken) ||
                    !jwtUtil.getType(refreshToken).equals(JwtContents.TOKEN_TYPE_REFRESH) ||
                    redisRepository.getValue(RedisKeys.refreshToken(memberId, jti)) == null) {
                throw new RefreshTokenException("토큰이 유효하지 않습니다.");
            }
        } catch (RefreshTokenException e) {
            throw e;
        } catch (Exception e) {
            throw new RefreshTokenException("토큰이 유효하지 않습니다.");
        }
    }
}
