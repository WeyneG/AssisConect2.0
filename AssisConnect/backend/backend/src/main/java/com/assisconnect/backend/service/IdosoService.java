package com.assisconnect.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.assisconnect.backend.domain.Idoso;
import com.assisconnect.backend.domain.IdosoRepository;
import com.assisconnect.backend.domain.User;
import com.assisconnect.backend.domain.UserRepository;

import jakarta.validation.Valid;

@Service
public class IdosoService {

    @Autowired
    private IdosoRepository idosoRepository;

    @Autowired
    private UserRepository userRepository;

    public Idoso cadastrar(@Valid Idoso idoso) {
        Long idResponsavel = idoso.getResponsavel().getId();

        User responsavel = userRepository.findById(idResponsavel)
                .orElseThrow(() -> new IllegalArgumentException("Usuário responsável não encontrado"));

        idoso.setResponsavel(responsavel);
        return idosoRepository.save(idoso);
    }
    
    public long countAll() {
        return idosoRepository.count();
    }
    public List<Idoso> findAniversariantesDeHoje() {
        return idosoRepository.findAniversariantesDeHoje();
    }
}