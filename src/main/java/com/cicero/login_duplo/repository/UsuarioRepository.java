package com.cicero.login_duplo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import com.cicero.login_duplo.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    UserDetails findByLogin(String login);
}
