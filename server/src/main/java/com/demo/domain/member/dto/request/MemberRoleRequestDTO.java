package com.demo.domain.member.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class MemberRoleRequestDTO {

    @Schema(description = "설정할 역할 (USER 또는 ADMIN)", example = "USER")
    @NotBlank(message = "역할(Role)은 필수 입력입니다.")
    @Pattern(regexp = "USER|ADMIN", message = "역할은 USER, ADMIN 중 하나여야 합니다.")
    private String role;
}
