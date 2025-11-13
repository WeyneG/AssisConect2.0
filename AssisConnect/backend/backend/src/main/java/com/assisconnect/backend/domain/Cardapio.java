package com.assisconnect.backend.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

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
