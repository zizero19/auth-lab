package com.cicero.login_duplo.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.cicero.login_duplo.dto.LoginRequest;
import com.cicero.login_duplo.dto.RegisterRequest;
import com.cicero.login_duplo.service.AuthService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/registrar")
    @ResponseStatus(HttpStatus.CREATED)
    public void registrarUsuario(@Valid @RequestBody RegisterRequest request) {
        authService.registrar(request);
    }

    @PostMapping("/login")
    public ResponseEntity<Void> login(@Valid @RequestBody LoginRequest request) {
        authService.login(request);

        return ResponseEntity.ok().build();
    }

}
