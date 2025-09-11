package com.assisconnect.backend.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.assisconnect.backend.api.RegisterRequest;
import com.assisconnect.backend.domain.User;
import com.assisconnect.backend.domain.UserRepository;

@Service
public class UserService {

    private final UserRepository repo;
    private final PasswordEncoder encoder = new BCryptPasswordEncoder();

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    public User register(RegisterRequest r) {
        if (repo.existsByEmail(r.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já cadastrado");
        }
        User u = new User();
        u.setName(r.name());
        u.setEmail(r.email());
        u.setPasswordHash(encoder.encode(r.password()));
        u.setRole("funcionario");
        return repo.save(u);
    }

    public User authenticate(String email, String rawPassword) {
        User u = repo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas"));
        if (!encoder.matches(rawPassword, u.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas");
        }
        return u;
    }
}
