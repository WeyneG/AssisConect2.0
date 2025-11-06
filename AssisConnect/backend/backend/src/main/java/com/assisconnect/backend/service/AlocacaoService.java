
package com.assisconnect.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.assisconnect.backend.domain.Atividade;
import com.assisconnect.backend.domain.AtividadeIdoso;
import com.assisconnect.backend.domain.AtividadeIdosoRepository;
import com.assisconnect.backend.domain.AtividadeRepository;
import com.assisconnect.backend.domain.Idoso;
import com.assisconnect.backend.domain.IdosoRepository;

@Service
public class AlocacaoService {

    private final AtividadeRepository atividadeRepository;
    private final IdosoRepository idosoRepository;
    private final AtividadeIdosoRepository atividadeIdosoRepository;

    public AlocacaoService(
        AtividadeRepository atividadeRepository,
        IdosoRepository idosoRepository,
        AtividadeIdosoRepository atividadeIdosoRepository
    ) {
        this.atividadeRepository = atividadeRepository;
        this.idosoRepository = idosoRepository;
        this.atividadeIdosoRepository = atividadeIdosoRepository;
    }

    @Transactional
    public int alocarIdososEmAtividade(Long atividadeId, List<Long> idosoIds) {
        Atividade atividade = atividadeRepository.findById(atividadeId)
            .orElseThrow(() -> new IllegalArgumentException("Atividade não encontrada: " + atividadeId));

        int criados = 0;
        for (Long idosoId : idosoIds) {
            Optional<Idoso> idosoOpt = idosoRepository.findById(idosoId);
            if (idosoOpt.isEmpty()) continue;

            boolean existe = atividadeIdosoRepository.existsByAtividade_IdAndIdoso_Id(atividadeId, idosoId);
            if (!existe) {
                AtividadeIdoso ai = new AtividadeIdoso();
                ai.setAtividade(atividade);
                ai.setIdoso(idosoOpt.get());
                atividadeIdosoRepository.save(ai);
                criados++;
            }
        }
        return criados;
    }

    @Transactional
    public int desalocarIdososDaAtividade(Long atividadeId, List<Long> idosoIds) {
       
        int removidos = atividadeIdosoRepository.deleteAllByAtividadeAndIdosos(atividadeId, idosoIds);
       
        return removidos;
    }

    @Transactional(readOnly = true)
    public List<Atividade> listarAtividadesDoIdoso(Long idosoId) {
        idosoRepository.findById(idosoId)
            .orElseThrow(() -> new IllegalArgumentException("Idoso não encontrado: " + idosoId));
        return atividadeIdosoRepository.findAtividadesByIdoso(idosoId);
    }
}
