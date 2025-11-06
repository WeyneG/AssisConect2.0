// api/AlocacaoController.java
package com.assisconnect.backend.api;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.assisconnect.backend.domain.Atividade;
import com.assisconnect.backend.service.AlocacaoService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AlocacaoController {

    private final AlocacaoService alocacaoService;

    public AlocacaoController(AlocacaoService alocacaoService) {
        this.alocacaoService = alocacaoService;
    }

    @PostMapping("/atividades/{id}/alocar")
    public ResponseEntity<?> alocar(
        @PathVariable("id") Long atividadeId,
        @RequestBody AlocarRequest req
    ) {
        if (req == null || req.getIdosoIds() == null || req.getIdosoIds().isEmpty()) {
            return ResponseEntity.badRequest().body("Lista de idosos vazia.");
        }
        int criados = alocacaoService.alocarIdososEmAtividade(atividadeId, req.getIdosoIds());
        return ResponseEntity.ok("Alocação concluída. Novos vínculos criados: " + criados);
    }


    @PostMapping("/atividades/{id}/desalocar")
    public ResponseEntity<?> desalocar(
        @PathVariable("id") Long atividadeId,
        @RequestBody AlocarRequest req
    ) {
        if (req == null || req.getIdosoIds() == null || req.getIdosoIds().isEmpty()) {
            return ResponseEntity.badRequest().body("Lista de idosos vazia.");
        }
        int removidos = alocacaoService.desalocarIdososDaAtividade(atividadeId, req.getIdosoIds());
        return ResponseEntity.ok("Desalocação concluída. Vínculos removidos: " + removidos);
    }

    @DeleteMapping("/atividades/{atividadeId}/alocar/{idosoId}")
    public ResponseEntity<?> desalocarPath(@PathVariable Long atividadeId, @PathVariable Long idosoId) {
        int removidos = alocacaoService.desalocarIdososDaAtividade(atividadeId, List.of(idosoId));
        return removidos > 0 ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/idosos/{id}/atividades")
    public ResponseEntity<List<AtividadeResumoDTO>> atividadesPorIdoso(@PathVariable("id") Long idosoId) {
        List<Atividade> lista = alocacaoService.listarAtividadesDoIdoso(idosoId);
        var dtos = lista.stream().map(a ->
            new AtividadeResumoDTO(
                a.getId(),
                a.getNome(),
                a.getData(),
                a.getHorario_inicio(),
                a.getHorario_fim(),
                a.getResponsavel() != null ? a.getResponsavel().getName() : null
            )
        ).toList();
        return ResponseEntity.ok(dtos);
    }
}
