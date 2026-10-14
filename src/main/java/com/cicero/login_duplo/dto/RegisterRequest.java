package com.cicero.login_duplo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank String nome,
        @NotBlank String login,
        @NotBlank @Size(min = 8) String senha) {
}
