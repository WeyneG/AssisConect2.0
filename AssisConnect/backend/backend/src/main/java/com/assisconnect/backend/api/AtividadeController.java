
package com.assisconnect.backend.api;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.assisconnect.backend.domain.Atividade;
import com.assisconnect.backend.domain.User;
import com.assisconnect.backend.domain.UserRepository;
import com.assisconnect.backend.service.AlocacaoService;
import com.assisconnect.backend.service.AtividadeService;

@RestController
@RequestMapping("/api/atividades")
@CrossOrigin(origins = "*")
public class AtividadeController {

    private final AtividadeService atividadeService;
    private final UserRepository userRepository;
    private final AlocacaoService alocacaoService;

    public AtividadeController(AtividadeService atividadeService,
                               UserRepository userRepository,
                               AlocacaoService alocacaoService) {
        this.atividadeService = atividadeService;
        this.userRepository = userRepository;
        this.alocacaoService = alocacaoService;
    }

    // ✅ AGORA ACEITA ?idosoId= PARA LISTAR ATIVIDADES DO IDOSO
    @GetMapping
    public ResponseEntity<List<AtividadeDTO>> getAllAtividades(
            @RequestParam(value = "idosoId", required = false) Long idosoId) {

        List<Atividade> list;
        if (idosoId != null) {
            list = alocacaoService.listarAtividadesDoIdoso(idosoId);
        } else {
            list = atividadeService.getAllAtividades();
        }

        var dtos = list.stream()
            .map(a -> new AtividadeDTO(
                a.getId(),
                a.getNome(),
                a.getData(),
                a.getHorario_inicio(),
                a.getHorario_fim(),
                a.getResponsavel() != null ? a.getResponsavel().getId() : null,
                a.getResponsavel() != null ? a.getResponsavel().getName() : null,
                a.getObservacoes()
            ))
            .toList();

        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<?> createAtividade(@RequestBody AtividadeRequest req) {
        try {
            Long respId = req.getResponsavelId();
            if (respId == null) return ResponseEntity.badRequest().body("Responsável é obrigatório.");

            User resp = userRepository.findById(respId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário responsável não encontrado."));

            Atividade a = new Atividade();
            a.setNome(req.getNome());
            a.setData(req.getData());
            a.setHorario_inicio(req.parseInicio());
            a.setHorario_fim(req.parseFim());
            a.setObservacoes(req.getObservacoes());
            a.setResponsavel(resp);

            var salvo = atividadeService.createAtividade(a);

            var dto = new AtividadeDTO(
                salvo.getId(), salvo.getNome(), salvo.getData(),
                salvo.getHorario_inicio(), salvo.getHorario_fim(),
                resp.getId(), resp.getName(), salvo.getObservacoes()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(dto);

        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body("Erro ao criar atividade: " + ex.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAtividade(@PathVariable Long id, @RequestBody AtividadeRequest req) {
        try {
            User resp = null;
            Long respId = req.getResponsavelId();
            if (respId != null) {
                resp = userRepository.findById(respId)
                    .orElseThrow(() -> new IllegalArgumentException("Usuário responsável não encontrado."));
            }

            Atividade a = new Atividade();
            a.setNome(req.getNome());
            a.setData(req.getData());
            a.setHorario_inicio(req.parseInicio());
            a.setHorario_fim(req.parseFim());
            a.setObservacoes(req.getObservacoes());
            a.setResponsavel(resp);

            return atividadeService.updateAtividade(id, a)
                .map(salvo -> {
                    var dto = new AtividadeDTO(
                        salvo.getId(), salvo.getNome(), salvo.getData(),
                        salvo.getHorario_inicio(), salvo.getHorario_fim(),
                        salvo.getResponsavel() != null ? salvo.getResponsavel().getId() : null,
                        salvo.getResponsavel() != null ? salvo.getResponsavel().getName() : null,
                        salvo.getObservacoes()
                    );
                    return ResponseEntity.ok(dto);
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());

        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body("Erro ao atualizar atividade: " + ex.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAtividade(@PathVariable Long id) {
        return atividadeService.deleteAtividade(id)
            ? ResponseEntity.noContent().build()
            : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
