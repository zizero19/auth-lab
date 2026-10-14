package com.cicero.login_duplo.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.cicero.login_duplo.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByLogin(String login);
}
