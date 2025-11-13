package com.assisconnect.backend.api;



import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.assisconnect.backend.domain.Cardapio;
import com.assisconnect.backend.service.CardapioService;

@RestController
@RequestMapping("/api/cardapios")
@CrossOrigin(origins = "*")
public class CardapioController {

    private final CardapioService service;

    public CardapioController(CardapioService service) {
        this.service = service;
    }

    @GetMapping
    public List<Cardapio> listar() {
        return service.listarTodos();
    }

    @PostMapping
    public Cardapio salvar(@RequestBody Cardapio c) {
        return service.salvar(c);
    }

    @PutMapping("/{id}")
    public Cardapio atualizar(@PathVariable Long id, @RequestBody Cardapio c) {
        return service.atualizar(id, c);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}
