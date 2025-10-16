package com.assisconnect.backend.service;

import com.assisconnect.backend.domain.Atividade;
import com.assisconnect.backend.domain.AtividadeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AtividadeService {

    @Autowired
    private AtividadeRepository atividadeRepository;

    // Listar todas as atividades
    public List<Atividade> getAllAtividades() {
        return atividadeRepository.findAll();
    }

    // Buscar uma atividade por ID
    public Optional<Atividade> getAtividadeById(Long id) {
        return atividadeRepository.findById(id);
    }

    // Criar uma nova atividade
    public Atividade createAtividade(Atividade atividade) {
        return atividadeRepository.save(atividade);
    }

    // Atualizar uma atividade existente
    public Optional<Atividade> updateAtividade(Long id, Atividade atividade) {
        if (atividadeRepository.existsById(id)) {
            atividade.setId(id);
            return Optional.of(atividadeRepository.save(atividade));
        }
        return Optional.empty();
    }

    // Excluir uma atividade
    public boolean deleteAtividade(Long id) {
        if (atividadeRepository.existsById(id)) {
            atividadeRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
