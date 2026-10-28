package com.fooddelivery.backend.service;

import com.fooddelivery.backend.dto.WorkWithChowRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;
import java.util.regex.Pattern;

@Service
public class WorkWithChowEmailService {

    private static final Logger log =
            LoggerFactory.getLogger(WorkWithChowEmailService.class);

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");

    private final JavaMailSender mailSender;
    private final String senderAddress;
    private final String adminEmail;

    public WorkWithChowEmailService(
            JavaMailSender mailSender,
            @Value("${spring.mail.username:noreply@chowdelivery.co.za}")
            String senderAddress,
            @Value("${CHOW_ADMIN_EMAIL:admin@chowdelivery.co.za}")
            String adminEmail
    ) {
        this.mailSender = mailSender;
        this.senderAddress = senderAddress;
        this.adminEmail = adminEmail;
    }

    public void sendEnquiry(WorkWithChowRequest request) {
        if (request == null) {
            throw badRequest("Please complete the form.");
        }

        // Honeypot: silently ignore simple automated submissions.
        if (request.website() != null && !request.website().isBlank()) {
            return;
        }

        String name = clean(request.name());
        String phone = clean(request.phone());
        String email = clean(request.email());
        String type = clean(request.type()).toUpperCase(Locale.ROOT);
        String messageText = clean(request.message());

        if (name.isBlank() || name.length() > 120) {
            throw badRequest("Enter a name of up to 120 characters.");
        }
        if (phone.isBlank() || phone.length() > 40) {
            throw badRequest("Enter a valid phone number.");
        }
        if (email.length() > 254 ||
                !EMAIL_PATTERN.matcher(email).matches()) {
            throw badRequest("Enter a valid email address.");
        }
        if (!type.equals("RESTAURANT") && !type.equals("DRIVER")) {
            throw badRequest("Choose Restaurant or Driver.");
        }
        if (messageText.length() > 2000) {
            throw badRequest("Your message must be 2,000 characters or fewer.");
        }

        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setFrom(senderAddress);
        mail.setTo(adminEmail);
        mail.setReplyTo(email);
        mail.setSubject("New Work with Chow enquiry: " + type);
        mail.setText(
                "A new enquiry was submitted through Work with Chow.\n\n" +
                "Name: " + name + "\n" +
                "Phone: " + phone + "\n" +
                "Email: " + email + "\n" +
                "Interested in: " + type + "\n\n" +
                "Message:\n" +
                (messageText.isBlank() ? "(No message provided)" : messageText)
        );

        try {
            mailSender.send(mail);
        } catch (MailException exception) {
            log.warn("Could not send a Work with Chow enquiry. Check SMTP configuration.");
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "We couldn't send your enquiry right now. Please try again later."
            );
        }
    }

    private String clean(String value) {
        return value == null ? "" : value.trim();
    }

    private ResponseStatusException badRequest(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }
}
