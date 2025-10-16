package com.assisconnect.backend.domain;
import java.sql.Time;
import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
public class Atividade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private Date data;
    private Time horario_inicio;
    private Time horario_fim;

    @ManyToOne
    @JoinColumn(name = "responsavel_id")
    private User responsavel;

    private String observacoes;

    @Temporal(TemporalType.TIMESTAMP)
    private Date criado_em;

    @Temporal(TemporalType.TIMESTAMP)
    private Date atualizado_em;

    public Date getAtualizado_em() {
        return atualizado_em;
    }

    public void setAtualizado_em(Date atualizado_em) {
        this.atualizado_em = atualizado_em;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Date getData() {
        return data;
    }

    public void setData(Date data) {
        this.data = data;
    }

    public Time getHorario_inicio() {
        return horario_inicio;
    }

    public void setHorario_inicio(Time horario_inicio) {
        this.horario_inicio = horario_inicio;
    }

    public Time getHorario_fim() {
        return horario_fim;
    }

    public void setHorario_fim(Time horario_fim) {
        this.horario_fim = horario_fim;
    }

    public User getResponsavel() {
        return responsavel;
    }

    public void setResponsavel(User responsavel) {
        this.responsavel = responsavel;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public Date getCriado_em() {
        return criado_em;
    }

    public void setCriado_em(Date criado_em) {
        this.criado_em = criado_em;
    }

   
}
