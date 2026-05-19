package com.demo.domain.member.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class AuthTokensDTO {
    private final String accessToken;
    private final String refreshToken;
}
