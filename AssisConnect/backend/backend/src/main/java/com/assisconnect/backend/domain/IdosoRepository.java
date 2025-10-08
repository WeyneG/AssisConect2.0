package com.assisconnect.backend.domain;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository 
public interface IdosoRepository extends JpaRepository<Idoso, Long> {

    
    @Query("SELECT i FROM Idoso i WHERE FUNCTION('MONTH', i.dataNascimento) = FUNCTION('MONTH', CURRENT_DATE()) AND FUNCTION('DAY', i.dataNascimento) = FUNCTION('DAY', CURRENT_DATE())")
    List<Idoso> findAniversariantesDeHoje();



}