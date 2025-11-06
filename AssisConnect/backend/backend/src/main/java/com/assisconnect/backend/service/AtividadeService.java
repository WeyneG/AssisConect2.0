package com.assisconnect.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.assisconnect.backend.domain.Atividade;
import com.assisconnect.backend.domain.AtividadeRepository;

@Service
public class AtividadeService {

    @Autowired
    private AtividadeRepository atividadeRepository;

    public List<Atividade> getAllAtividades() {
        return atividadeRepository.findAllWithResponsavel();
    }

    public Optional<Atividade> getAtividadeById(Long id) {
        return atividadeRepository.findById(id);
    }

    public Atividade createAtividade(Atividade atividade) {

        if (atividade.getResponsavel() == null || atividade.getResponsavel().getId() == null) {
            throw new IllegalArgumentException("Responsável é obrigatório.");
        }
        return atividadeRepository.save(atividade);
    }

    public Optional<Atividade> updateAtividade(Long id, Atividade atividade) {
        if (!atividadeRepository.existsById(id)) return Optional.empty();
        atividade.setId(id);
        return Optional.of(atividadeRepository.save(atividade));
    }

    public boolean deleteAtividade(Long id) {
        if (!atividadeRepository.existsById(id)) return false;
        atividadeRepository.deleteById(id);
        return true;
    }
}
