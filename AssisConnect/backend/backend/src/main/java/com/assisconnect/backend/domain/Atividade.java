package com.assisconnect.backend.domain;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Table(name = "atividades")
public class Atividade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate data;

    @Column(name = "horario_inicio")
    @DateTimeFormat(pattern = "HH:mm:ss")
    private LocalTime horario_inicio;

    @Column(name = "horario_fim")
    @DateTimeFormat(pattern = "HH:mm:ss")
    private LocalTime horario_fim;

    @ManyToOne
    @JoinColumn(name = "responsavel_id")
    private User responsavel;

    private String observacoes;

    @Column(name = "criado_em")
    @Temporal(TemporalType.TIMESTAMP)
    private Date criado_em;

    @Column(name = "atualizado_em")
    @Temporal(TemporalType.TIMESTAMP)
    private Date atualizado_em;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }

    public LocalTime getHorario_inicio() { return horario_inicio; }
    public void setHorario_inicio(LocalTime horario_inicio) { this.horario_inicio = horario_inicio; }

    public LocalTime getHorario_fim() { return horario_fim; }
    public void setHorario_fim(LocalTime horario_fim) { this.horario_fim = horario_fim; }

    public User getResponsavel() { return responsavel; }
    public void setResponsavel(User responsavel) { this.responsavel = responsavel; }

    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }

    public Date getCriado_em() { return criado_em; }
    public void setCriado_em(Date criado_em) { this.criado_em = criado_em; }

    public Date getAtualizado_em() { return atualizado_em; }
    public void setAtualizado_em(Date atualizado_em) { this.atualizado_em = atualizado_em; }
}
    