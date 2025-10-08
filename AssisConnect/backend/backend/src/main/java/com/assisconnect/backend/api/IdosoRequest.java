package com.assisconnect.backend.api;

import java.time.LocalDate;

import com.assisconnect.backend.domain.Idoso.EstadoSaude;
import com.assisconnect.backend.domain.Idoso.Sexo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class IdosoRequest {

    @NotBlank
    private String nome;

    @NotNull
    private LocalDate dataNascimento;

    @NotNull
    private Sexo sexo;

    @NotNull
    private EstadoSaude estadoSaude;

    private String observacoes;

    @NotNull
    private Long responsavelId;


    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public LocalDate getDataNascimento() { return dataNascimento; }
    public void setDataNascimento(LocalDate dataNascimento) { this.dataNascimento = dataNascimento; }

    public Sexo getSexo() { return sexo; }
    public void setSexo(Sexo sexo) { this.sexo = sexo; }

    public EstadoSaude getEstadoSaude() { return estadoSaude; }
    public void setEstadoSaude(EstadoSaude estadoSaude) { this.estadoSaude = estadoSaude; }

    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }

    public Long getResponsavelId() { return responsavelId; }
    public void setResponsavelId(Long responsavelId) { this.responsavelId = responsavelId; }
}
