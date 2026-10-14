package com.cicero.login_duplo.service;

import com.cicero.login_duplo.dto.LoginRequest;
import com.cicero.login_duplo.dto.RegisterRequest;
import com.cicero.login_duplo.model.Usuario;
import com.cicero.login_duplo.model.enums.AuthProvider;
import com.cicero.login_duplo.model.enums.UserRole;
import com.cicero.login_duplo.repository.UsuarioRepository;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public void registrar(RegisterRequest request) {

        if (usuarioRepository.existsByLogin(request.login())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Login já cadastrado");
        }

        Usuario usuario = new Usuario();

        usuario.setNome(request.nome());
        usuario.setLogin(request.login());
        usuario.setSenha(passwordEncoder.encode(request.senha()));
        usuario.setRole(UserRole.USER);
        usuario.setProvider(AuthProvider.LOCAL);

        usuarioRepository.save(usuario);
    }

    public void login(LoginRequest request) {

        Authentication credentials = new UsernamePasswordAuthenticationToken(request.login(), request.senha());

        authenticationManager.authenticate(credentials);
    }
}
