package com.assisconnect.backend.service;



import com.assisconnect.backend.domain.Cardapio;
import com.assisconnect.backend.domain.CardapioRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CardapioService {

    private final CardapioRepository repository;

    public CardapioService(CardapioRepository repository) {
        this.repository = repository;
    }

    public List<Cardapio> listarTodos() {
        return repository.findAll();
    }

    public Cardapio buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cardápio não encontrado"));
    }

    public Cardapio salvar(Cardapio cardapio) {
        return repository.save(cardapio);
    }

    public Cardapio atualizar(Long id, Cardapio atualizado) {
        Cardapio existente = buscarPorId(id);

        existente.setData(atualizado.getData());
        existente.setCafeDaManha(atualizado.getCafeDaManha());
        existente.setAlmoco(atualizado.getAlmoco());
        existente.setJantar(atualizado.getJantar());

        return repository.save(existente);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}
