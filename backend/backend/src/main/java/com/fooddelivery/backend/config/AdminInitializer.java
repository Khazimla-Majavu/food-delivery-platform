package com.fooddelivery.backend.config;

import com.fooddelivery.backend.model.User;
import com.fooddelivery.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminInitializer(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        String email = "admin@fooddelivery.local";

        if (userRepository.existsByEmail(email)) {
            return;
        }

        User admin = new User();
        admin.setName("Local Admin");
        admin.setEmail(email);
        admin.setPhone("0000000000");
        admin.setPassword(passwordEncoder.encode("Admin123!"));
        admin.setRole(User.Role.ADMIN);

        userRepository.save(admin);

        System.out.println("======================================");
        System.out.println("LOCAL ADMIN CREATED");
        System.out.println("Email: admin@fooddelivery.local");
        System.out.println("Password: Admin123!");
        System.out.println("======================================");
    }
}
