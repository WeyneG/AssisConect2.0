package com.assisconnect.backend.api;

import java.time.LocalDate;
import java.time.LocalTime;

public class AtividadeResumoDTO {
    private Long id;
    private String nome;
    private LocalDate data;
    private LocalTime horarioInicio;
    private LocalTime horarioFim;
    private String responsavel; 

    public AtividadeResumoDTO() {}

    public AtividadeResumoDTO(Long id, String nome, LocalDate data, LocalTime horarioInicio, LocalTime horarioFim, String responsavel) {
        this.id = id;
        this.nome = nome;
        this.data = data;
        this.horarioInicio = horarioInicio;
        this.horarioFim = horarioFim;
        this.responsavel = responsavel;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }

    public LocalTime getHorarioInicio() { return horarioInicio; }
    public void setHorarioInicio(LocalTime horarioInicio) { this.horarioInicio = horarioInicio; }

    public LocalTime getHorarioFim() { return horarioFim; }
    public void setHorarioFim(LocalTime horarioFim) { this.horarioFim = horarioFim; }

    public String getResponsavel() { return responsavel; }
    public void setResponsavel(String responsavel) { this.responsavel = responsavel; }
}
