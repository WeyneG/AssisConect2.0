package com.assisconnect.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String from;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(String to, String resetLink) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(from);
        msg.setTo(to);
        msg.setSubject("Redefinição de senha - Assist Connect");
        msg.setText(
            "Olá,\n\n" +
            "Recebemos uma solicitação de redefinição de senha no Assist Connect.\n" +
            "Clique no link abaixo para criar uma nova senha:\n\n" +
            resetLink + "\n\n" +
            "Se você não fez essa solicitação, apenas ignore este e-mail.\n\n" +
            "Atenciosamente,\nEquipe Assist Connect"
        );
        mailSender.send(msg);
    }
}
