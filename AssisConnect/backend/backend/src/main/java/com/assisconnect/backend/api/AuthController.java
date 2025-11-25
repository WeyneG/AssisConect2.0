package com.assisconnect.backend.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.assisconnect.backend.config.JwtUtil;
import com.assisconnect.backend.service.PasswordResetService;
import com.assisconnect.backend.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService service;
    private final JwtUtil jwt;
    private final PasswordResetService passwordResetService;

    public AuthController(UserService service,
                          JwtUtil jwt,
                          PasswordResetService passwordResetService) {
        this.service = service;
        this.jwt = jwt;
        this.passwordResetService = passwordResetService;
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

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest req) {

        passwordResetService.requestPasswordReset(req.email());
      
        return ResponseEntity.ok(
                "Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha.");
    }

    
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @Valid @RequestBody ResetPasswordRequest req) {

        passwordResetService.resetPassword(req.token(), req.newPassword());
        return ResponseEntity.ok("Senha redefinida com sucesso.");
    }
}
