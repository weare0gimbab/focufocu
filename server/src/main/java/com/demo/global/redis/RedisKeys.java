package com.demo.global.redis;

public class RedisKeys {
    public static String signupCode(String email) {
        return "signup:code:" + email;
    }

    public static String signupVerified(String email) {
        return "signup:verified:" + email;
    }

    public static String passwordResetToken(String email) {
        return "password:reset:token:" + email;
    }

    public static String refreshToken(Long memberId, String jti) {
        return "auth:refresh:" + memberId + ":" + jti;
    }
}
