package com.assisconnect.backend.domain;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("""
        SELECT u FROM User u
        WHERE LOWER(u.name)  LIKE LOWER(CONCAT('%', :nome,  '%'))
          AND LOWER(u.email) LIKE LOWER(CONCAT('%', :email, '%'))
          AND LOWER(u.role)  LIKE LOWER(CONCAT('%', :role,  '%'))
    """)
    Page<User> search(@Param("nome") String nome,
                      @Param("email") String email,
                      @Param("role") String role,
                      Pageable pageable);
}
