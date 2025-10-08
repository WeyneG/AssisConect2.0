package com.assisconnect.backend.api;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping; 
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

            IdosoResponse response = new IdosoResponse(
                    salvo.getId(),
                    salvo.getNome(),
                    salvo.getDataNascimento(),
                    salvo.getSexo(),
                    salvo.getEstadoSaude(),
                    salvo.getObservacoes(),
                    salvo.getResponsavel().getId(),
                    salvo.getCriadoEm()
            );

            return ResponseEntity.status(201).body(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao cadastrar idoso: " + e.getMessage());
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
            .map(idoso -> new IdosoResponse(
                idoso.getId(),
                idoso.getNome(),
                idoso.getDataNascimento(),
                idoso.getSexo(),
                idoso.getEstadoSaude(),
                idoso.getObservacoes(),
                idoso.getResponsavel().getId(),
                idoso.getCriadoEm()
            ))
            .collect(Collectors.toList());
            
        return ResponseEntity.ok(responseList);
    }
}