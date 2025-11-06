package com.assisconnect.backend.api;

import java.time.LocalDate;
import java.time.LocalTime;

public class AtividadeDTO {
    private Long id;
    private String nome;
    private LocalDate data;
    private String horario_inicio;
    private String horario_fim;
    private Long responsavelId;
    private String responsavelNome;
    private String observacoes;

    public AtividadeDTO(Long id, String nome, LocalDate data, LocalTime ini, LocalTime fim,
                        Long respId, String respNome, String observacoes) {
        this.id = id;
        this.nome = nome;
        this.data = data;
        this.horario_inicio = ini != null ? ini.toString() : null;
        this.horario_fim    = fim != null ? fim.toString() : null;
        this.responsavelId = respId;
        this.responsavelNome = respNome;
        this.observacoes = observacoes;
    }
    public Long getId() { return id; }
    public String getNome() { return nome; }
    public LocalDate getData() { return data; }
    public String getHorario_inicio() { return horario_inicio; }
    public String getHorario_fim() { return horario_fim; }
    public Long getResponsavelId() { return responsavelId; }
    public String getResponsavelNome() { return responsavelNome; }
    public String getObservacoes() { return observacoes; }
    public void setId(Long id) {
        this.id = id;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public void setData(LocalDate data) {
        this.data = data;
    }
    public void setHorario_inicio(String horario_inicio) {
        this.horario_inicio = horario_inicio;
    }
    public void setHorario_fim(String horario_fim) {
        this.horario_fim = horario_fim;
    }
    public void setResponsavelId(Long responsavelId) {
        this.responsavelId = responsavelId;
    }
    public void setResponsavelNome(String responsavelNome) {
        this.responsavelNome = responsavelNome;
    }
    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }
    
}
