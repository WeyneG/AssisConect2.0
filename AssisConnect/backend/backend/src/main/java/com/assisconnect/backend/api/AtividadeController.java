package com.assisconnect.backend.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.assisconnect.backend.domain.Atividade;
import com.assisconnect.backend.service.AtividadeService;

@RestController
@RequestMapping("/api/atividades")
public class AtividadeController {

    @Autowired
    private AtividadeService atividadeService;

   
    @GetMapping
    public List<Atividade> getAllAtividades() {
        return atividadeService.getAllAtividades();
    }

  
    @GetMapping("/{id}")
    public ResponseEntity<Atividade> getAtividadeById(@PathVariable Long id) {
        return atividadeService.getAtividadeById(id)
                .map(atividade -> ResponseEntity.ok(atividade))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    
    @PostMapping
    public ResponseEntity<Atividade> createAtividade(@RequestBody Atividade atividade) {
        Atividade newAtividade = atividadeService.createAtividade(atividade);
        return ResponseEntity.status(HttpStatus.CREATED).body(newAtividade);
    }

    
    @PutMapping("/{id}")
    public ResponseEntity<Atividade> updateAtividade(@PathVariable Long id, @RequestBody Atividade atividade) {
        return atividadeService.updateAtividade(id, atividade)
                .map(updatedAtividade -> ResponseEntity.ok(updatedAtividade))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

   
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAtividade(@PathVariable Long id) {
        if (atividadeService.deleteAtividade(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
