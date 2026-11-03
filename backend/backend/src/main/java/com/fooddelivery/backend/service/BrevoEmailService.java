package com.fooddelivery.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BrevoEmailService {

    private static final String BREVO_API_URL =
            "https://api.brevo.com/v3/smtp/email";

    private final RestClient restClient;
    private final String apiKey;
    private final String senderAddress;
    private final String senderName;

    public BrevoEmailService(
            @Value("${BREVO_API_KEY:}") String apiKey,
            @Value("${CHOW_EMAIL_SENDER:noreply@chowdelivery.co.za}") String senderAddress,
            @Value("${CHOW_EMAIL_SENDER_NAME:Chow Delivery}") String senderName
    ) {
        this.restClient = RestClient.create(BREVO_API_URL);
        this.apiKey = apiKey;
        this.senderAddress = senderAddress;
        this.senderName = senderName;
    }

    public void sendTextEmail(
            String recipient,
            String subject,
            String content,
            String replyTo
    ) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException(
                    "Brevo API key is not configured."
            );
        }

        Map<String, Object> sender = Map.of(
                "name", senderName,
                "email", senderAddress
        );

        Map<String, Object> recipientDetails = Map.of(
                "email", recipient
        );

        Map<String, Object> payload = new HashMap<>();
        payload.put("sender", sender);
        payload.put("to", List.of(recipientDetails));
        payload.put("subject", subject);
        payload.put("textContent", content);

        if (replyTo != null && !replyTo.isBlank()) {
            payload.put("replyTo", Map.of("email", replyTo));
        }

        restClient.post()
                .header("api-key", apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(payload)
                .retrieve()
                .toBodilessEntity();
    }
}
