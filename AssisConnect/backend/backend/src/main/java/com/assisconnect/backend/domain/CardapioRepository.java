package com.assisconnect.backend.domain;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CardapioRepository extends JpaRepository<Cardapio, Long> {

   
    Optional<Cardapio> findTopByDataOrderByIdDesc(LocalDate data);
}
