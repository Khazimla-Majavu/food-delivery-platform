package com.fooddelivery.backend.config;

import com.fooddelivery.backend.model.User;
import com.fooddelivery.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
@ConditionalOnProperty(
        name = "chow.local-admin.enabled",
        havingValue = "true"
)
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${chow.local-admin.email:}")
    private String adminEmail;

    @Value("${chow.local-admin.password:}")
    private String adminPassword;

    public AdminInitializer(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        if (adminEmail == null || adminEmail.isBlank()
                || adminPassword == null || adminPassword.length() < 12) {
            throw new IllegalStateException(
                    "Local admin is enabled, but valid CHOW_LOCAL_ADMIN_EMAIL "
                            + "and CHOW_LOCAL_ADMIN_PASSWORD environment variables "
                            + "are required. The password must be at least 12 characters."
            );
        }

        String email = adminEmail.trim().toLowerCase(Locale.ROOT);

        if (userRepository.existsByEmail(email)) {
            System.out.println("Local admin account already exists.");
            return;
        }

        User admin = new User();
        admin.setName("Local Admin");
        admin.setEmail(email);
        admin.setPhone("0000000000");
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setRole(User.Role.ADMIN);

        userRepository.save(admin);

        System.out.println("Local admin account created successfully.");
        System.out.println("Admin email: " + email);
    }
}
