package com.cicero.login_duplo.dto;

import com.cicero.login_duplo.model.Usuario;

public record UsuarioResponse(
        Long id,
        String nome,
        String login,
        String role) {
    public static UsuarioResponse from(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getLogin(),
                usuario.getRole().name());
    }
}
