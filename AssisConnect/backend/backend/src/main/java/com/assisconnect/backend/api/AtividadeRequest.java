package com.assisconnect.backend.api;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

import com.assisconnect.backend.domain.User;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

public class AtividadeRequest {

    private String nome;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate data;

    @JsonProperty("horario_inicio") @JsonAlias({"horarioInicio"})
    private String horarioInicio; // string flexível

    @JsonProperty("horario_fim") @JsonAlias({"horarioFim"})
    private String horarioFim;    // string flexível

    private String observacoes;

    private Long responsavelId;
    private User responsavel; // para aceitar {responsavel:{id}}

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }

    public String getHorarioInicio() { return horarioInicio; }
    public void setHorarioInicio(String horarioInicio) { this.horarioInicio = horarioInicio; }

    public String getHorarioFim() { return horarioFim; }
    public void setHorarioFim(String horarioFim) { this.horarioFim = horarioFim; }

    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }

    public Long getResponsavelId() {
        if (responsavelId != null) return responsavelId;
        return responsavel != null ? responsavel.getId() : null;
    }
    public void setResponsavelId(Long responsavelId) { this.responsavelId = responsavelId; }

    public User getResponsavel() { return responsavel; }
    public void setResponsavel(User responsavel) { this.responsavel = responsavel; }

    // Helpers para o Controller
    public LocalTime parseInicio() { return parseHHmmOrHHmmss(horarioInicio); }
    public LocalTime parseFim()    { return parseHHmmOrHHmmss(horarioFim); }

    private static LocalTime parseHHmmOrHHmmss(String s) {
        if (s == null || s.isBlank()) return null;
        String v = s.length() == 5 ? (s + ":00") : s;
        return LocalTime.parse(v, DateTimeFormatter.ofPattern("HH:mm:ss"));
    }
}

