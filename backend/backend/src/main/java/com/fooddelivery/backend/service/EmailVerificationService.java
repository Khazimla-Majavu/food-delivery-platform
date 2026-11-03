package com.fooddelivery.backend.service;

import com.fooddelivery.backend.model.User;
import com.fooddelivery.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailVerificationService {
    private static final Logger log = LoggerFactory.getLogger(EmailVerificationService.class);
    private static final SecureRandom RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final BrevoEmailService brevoEmailService;
    private final String frontendUrl;

    public EmailVerificationService(
            UserRepository userRepository,
            BrevoEmailService brevoEmailService,
            @Value("${app.frontend-url:http://localhost:3000}") String frontendUrl
    ) {
        this.userRepository = userRepository;
        this.brevoEmailService = brevoEmailService;
        this.frontendUrl = frontendUrl.replaceAll("/+$", "");
    }

    @Transactional
    public void issueAndSendVerification(User user) {
        byte[] randomBytes = new byte[32];
        RANDOM.nextBytes(randomBytes);
        String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);

        user.setEmailVerified(false);
        user.setEmailVerificationTokenHash(hashToken(rawToken));
        user.setEmailVerificationExpiresAt(Instant.now().plus(24, ChronoUnit.HOURS));
        userRepository.save(user);

        String link = frontendUrl + "/verify-email?token=" + rawToken;
        String content =
                "Hi " + user.getName() + ",\n\n" +
                "Please verify your email address to activate your Chow account.\n\n" +
                link + "\n\n" +
                "This link expires in 24 hours. If you did not create this account, you can ignore this email.";

        try {
            brevoEmailService.sendTextEmail(
                    user.getEmail(),
                    "Verify your Chow account",
                    content,
                    null
            );
        } catch (RestClientException | IllegalStateException exception) {
            // The account and token remain saved so the user can request another email.
            log.warn(
                    "Could not send verification email to {}. Brevo error: {}",
                    user.getEmail(),
                    exception.getMessage(),
                    exception
            );
        }
    }

    @Transactional
    public void verify(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            throw new IllegalArgumentException("This verification link is invalid, expired, or already used. Try logging in first; if your account is not verified, request a new email.");
        }

        Optional<User> match = userRepository.findByEmailVerificationTokenHash(hashToken(rawToken));
        User user = match.orElseThrow(() ->
                new IllegalArgumentException("This verification link is invalid, expired, or already used. Try logging in first; if your account is not verified, request a new email.")
        );

        if (user.getEmailVerificationExpiresAt() == null ||
                user.getEmailVerificationExpiresAt().isBefore(Instant.now())) {
            user.setEmailVerificationTokenHash(null);
            user.setEmailVerificationExpiresAt(null);
            userRepository.save(user);
            throw new IllegalArgumentException("This verification link is invalid, expired, or already used. Try logging in first; if your account is not verified, request a new email.");
        }

        user.setEmailVerified(true);
        user.setEmailVerificationTokenHash(null);
        user.setEmailVerificationExpiresAt(null);
        userRepository.save(user);
    }

    @Transactional
    public void resend(String email) {
        if (email == null || email.isBlank()) {
            return;
        }

        userRepository.findByEmail(email.trim())
                .filter(user -> user.getRole() == User.Role.CUSTOMER)
                .filter(user -> !user.isEmailVerified())
                .ifPresent(this::issueAndSendVerification);
    }

    private String hashToken(String token) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (Exception exception) {
            throw new IllegalStateException("Unable to process verification token.", exception);
        }
    }
}
