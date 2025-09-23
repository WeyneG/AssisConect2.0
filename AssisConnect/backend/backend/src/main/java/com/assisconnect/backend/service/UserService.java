package com.assisconnect.backend.service;

import java.util.Optional;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.assisconnect.backend.api.RegisterRequest;
import com.assisconnect.backend.api.UpdateUserRequest;
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
        String role = r.role() == null ? "" : r.role().trim().toLowerCase();
        if (!role.equals("admin") && !role.equals("funcionario") && !role.equals("familiar")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role inválido. Use admin, funcionario ou familiar.");
        }
        u.setRole(role);
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
    @Transactional
    public User updateUser(Long id, UpdateUserRequest req) {
        User u = repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        if (req.getName() != null && !req.getName().isBlank()) {
            u.setName(req.getName().trim());
        }

        if (req.getEmail() != null && !req.getEmail().isBlank()) {
            String newEmail = req.getEmail().trim().toLowerCase();
            Optional<User> existing = repo.findByEmail(newEmail);
            if (existing.isPresent() && !existing.get().getId().equals(id)) {
                throw new DataIntegrityViolationException("E-mail já está em uso");
            }
            u.setEmail(newEmail);
        }

        if (req.getRole() != null && !req.getRole().isBlank()) {
          
            String normalized = req.getRole().trim().toLowerCase();
            if (!normalized.equals("admin") && !normalized.equals("funcionario") && !normalized.equals("familiar")) {
                throw new IllegalArgumentException("Role inválida");
            }
            u.setRole(normalized);
        }

        return repo.save(u);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!repo.existsById(id)) {
            throw new IllegalArgumentException("Usuário não encontrado");
        }
        repo.deleteById(id);
    }
}
