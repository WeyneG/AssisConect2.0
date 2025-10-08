package com.assisconnect.backend.api;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.assisconnect.backend.domain.Idoso.EstadoSaude;
import com.assisconnect.backend.domain.Idoso.Sexo;

public class IdosoResponse {
    private Long id;
    private String nome;
    private LocalDate dataNascimento;
    private Sexo sexo;
    private EstadoSaude estadoSaude;
    private String observacoes;
    private Long responsavelId;
    private LocalDateTime criadoEm;

    public IdosoResponse(Long id, String nome, LocalDate dataNascimento, Sexo sexo,
            EstadoSaude estadoSaude, String observacoes,
            Long responsavelId, LocalDateTime criadoEm) {
        this.id = id;
        this.nome = nome;
        this.dataNascimento = dataNascimento;
        this.sexo = sexo;
        this.estadoSaude = estadoSaude;
        this.observacoes = observacoes;
        this.responsavelId = responsavelId;
        this.criadoEm = criadoEm;
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public LocalDate getDataNascimento() {
        return dataNascimento;
    }

    public Sexo getSexo() {
        return sexo;
    }

    public EstadoSaude getEstadoSaude() {
        return estadoSaude;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public Long getResponsavelId() {
        return responsavelId;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setDataNascimento(LocalDate dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    public void setSexo(Sexo sexo) {
        this.sexo = sexo;
    }

    public void setEstadoSaude(EstadoSaude estadoSaude) {
        this.estadoSaude = estadoSaude;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public void setResponsavelId(Long responsavelId) {
        this.responsavelId = responsavelId;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }
}
