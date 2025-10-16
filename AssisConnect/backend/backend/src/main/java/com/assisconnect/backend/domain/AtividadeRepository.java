package com.assisconnect.backend.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AtividadeRepository extends JpaRepository<Atividade, Long> {
    // Aqui podemos adicionar consultas personalizadas, se necessário
}
