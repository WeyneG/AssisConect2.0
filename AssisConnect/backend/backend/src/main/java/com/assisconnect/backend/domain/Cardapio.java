package com.assisconnect.backend.domain;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "cardapios")
public class Cardapio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

   
    private LocalDate data;

    @Column(name = "cafe_da_manha", columnDefinition = "TEXT")
    private String cafeDaManha;

    @Column(columnDefinition = "TEXT")
    private String almoco;

    @Column(columnDefinition = "TEXT")
    private String jantar;
}
