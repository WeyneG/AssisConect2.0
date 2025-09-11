package com.assisconnect.backend.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.assisconnect.backend.config.JwtUtil;
import com.assisconnect.backend.service.UserService;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService service;
    private final JwtUtil jwt;

    public AuthController(UserService service, JwtUtil jwt) {
        this.service = service;
        this.jwt = jwt;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        var u = service.register(req);
        var token = jwt.generateToken(u.getEmail(), u.getId(), u.getRole());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthResponse(token, u.getName(), u.getEmail()));
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest req) {
        var u = service.authenticate(req.email(), req.password());
        var token = jwt.generateToken(u.getEmail(), u.getId(), u.getRole());
        return new AuthResponse(token, u.getName(), u.getEmail());
    }
}
