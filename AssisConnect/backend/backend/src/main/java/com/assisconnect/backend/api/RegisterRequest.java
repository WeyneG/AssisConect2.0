 package com.assisconnect.backend.api;

 import jakarta.validation.constraints.Email;
 import jakarta.validation.constraints.NotBlank;
 import jakarta.validation.constraints.Size;

 public record RegisterRequest(
     @NotBlank(message = "Nome é obrigatório") String name,
     @NotBlank(message = "E-mail é obrigatório") @Email(message = "E-mail inválido") String email, 
    @NotBlank(message = "Senha é obrigatória") @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres") String password,
    @NotBlank(message = "Papel é obrigatório") String role   
 ) {}
