package com.assisconnect.backend.domain;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AtividadeRepository extends JpaRepository<Atividade, Long> {

    @Query("""
       select a from Atividade a
       left join fetch a.responsavel
       order by a.data asc, a.horario_inicio asc
    """)
    List<Atividade> findAllWithResponsavel();
}
