package com.assisconnect.backend.api;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.assisconnect.backend.domain.Idoso;
import com.assisconnect.backend.domain.User;
import com.assisconnect.backend.service.IdosoService;

@RestController
@RequestMapping("/idosos")
@CrossOrigin(origins = "*")
public class IdosoController {

    @Autowired
    private IdosoService idosoService;

    private IdosoResponse toResponse(Idoso i) {
        return new IdosoResponse(
            i.getId(),
            i.getNome(),
            i.getDataNascimento(),
            i.getSexo(),
            i.getEstadoSaude(),
            i.getObservacoes(),
            i.getResponsavel() != null ? i.getResponsavel().getId() : null,
            i.getCriadoEm()
        );
    }

    @PostMapping
    public ResponseEntity<?> cadastrar(@Validated @RequestBody IdosoRequest dto) {
        try {
            Idoso idoso = new Idoso();
            idoso.setNome(dto.getNome());
            idoso.setDataNascimento(dto.getDataNascimento());
            idoso.setSexo(dto.getSexo());                 
            idoso.setEstadoSaude(dto.getEstadoSaude());   
            idoso.setObservacoes(dto.getObservacoes());

            User responsavel = new User();
            responsavel.setId(dto.getResponsavelId());
            idoso.setResponsavel(responsavel);

            Idoso salvo = idosoService.cadastrar(idoso);
            return ResponseEntity.status(201).body(toResponse(salvo));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao cadastrar idoso: " + e.getMessage());
        }
    }

    
    @GetMapping
    public ResponseEntity<Page<IdosoResponse>> listar(Pageable pageable) {
        Page<Idoso> page = idosoService.listar(pageable);
        Page<IdosoResponse> mapped = page.map(this::toResponse);
        return ResponseEntity.ok(mapped);
    }

    
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Validated @RequestBody IdosoRequest dto) {
        try {
            Idoso toUpdate = new Idoso();
            toUpdate.setNome(dto.getNome());
            toUpdate.setDataNascimento(dto.getDataNascimento());
            toUpdate.setSexo(dto.getSexo());
            toUpdate.setEstadoSaude(dto.getEstadoSaude());
            toUpdate.setObservacoes(dto.getObservacoes());

            User responsavel = new User();
            responsavel.setId(dto.getResponsavelId());
            toUpdate.setResponsavel(responsavel);

            Idoso atualizado = idosoService.atualizar(id, toUpdate);
            return ResponseEntity.ok(toResponse(atualizado));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao atualizar idoso: " + e.getMessage());
        }
    }

    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> remover(@PathVariable Long id) {
        try {
            idosoService.remover(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao remover idoso: " + e.getMessage());
        }
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getCount() {
        long count = idosoService.countAll();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/aniversariantes")
    public ResponseEntity<List<IdosoResponse>> getAniversariantesDeHoje() {
        List<Idoso> aniversariantes = idosoService.findAniversariantesDeHoje();
        List<IdosoResponse> responseList = aniversariantes.stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
        return ResponseEntity.ok(responseList);
    }
}
