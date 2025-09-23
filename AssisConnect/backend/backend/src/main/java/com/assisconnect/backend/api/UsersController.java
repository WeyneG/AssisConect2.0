package com.assisconnect.backend.api;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.assisconnect.backend.domain.User;
import com.assisconnect.backend.domain.UserRepository;
import com.assisconnect.backend.service.UserService;

@RestController
@RequestMapping
public class UsersController {
    private final UserRepository repo;
    private final UserService service;

    public UsersController(UserRepository repo, UserService service) {
        this.repo = repo;
        this.service = service;
    }

    
    @GetMapping("/usuarios")
    public ResponseEntity<Page<UserResponse>> list(
        @RequestParam(defaultValue = "") String nome,
        @RequestParam(defaultValue = "") String email,
        @RequestParam(defaultValue = "") String role,
        Pageable pageable
    ) {
        Page<User> page = repo.search(nome, email, role, pageable);
        Page<UserResponse> mapped = page.map(u ->
            new UserResponse(u.getId(), u.getName(), u.getEmail(), u.getRole())
        );
        return ResponseEntity.ok(mapped);
    }

    
    @PutMapping("/usuarios/{id}")
    public ResponseEntity<UserResponse> update(
        @PathVariable Long id,
        @RequestBody UpdateUserRequest req
    ) {
        var u = service.updateUser(id, req);
        return ResponseEntity.ok(new UserResponse(u.getId(), u.getName(), u.getEmail(), u.getRole()));
    }

  
    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
