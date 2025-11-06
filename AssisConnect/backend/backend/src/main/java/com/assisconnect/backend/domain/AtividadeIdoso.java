package com.assisconnect.backend.domain;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "atividade_idoso", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"atividade_id","idoso_id"})
})
public class AtividadeIdoso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "atividade_id")
    private Atividade atividade;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idoso_id")
    private Idoso idoso;

    @CreationTimestamp
    @Column(name = "criado_em", updatable = false)
    private LocalDateTime criadoEm;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Atividade getAtividade() { return atividade; }
    public void setAtividade(Atividade atividade) { this.atividade = atividade; }

    public Idoso getIdoso() { return idoso; }
    public void setIdoso(Idoso idoso) { this.idoso = idoso; }

    public LocalDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }
}
