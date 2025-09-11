package com.assisconnect.backend.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
    @GetMapping("/exemplo/protegido")
    public String hello(){ return "ok, autenticado!"; }
}
