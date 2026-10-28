package com.fooddelivery.backend.service;

import com.fooddelivery.backend.dto.LoginResponse;
import com.fooddelivery.backend.dto.UserResponse;
import com.fooddelivery.backend.model.User;
import com.fooddelivery.backend.repository.UserRepository;
import com.fooddelivery.backend.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailVerificationService emailVerificationService;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            EmailVerificationService emailVerificationService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailVerificationService = emailVerificationService;
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserResponse::fromUser)
                .toList();
    }

    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return UserResponse.fromUser(user);
    }

    public UserResponse createUser(User user) {
        user.setRole(User.Role.CUSTOMER);
        user.setEmailVerified(false);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User savedUser = userRepository.save(user);
        emailVerificationService.issueAndSendVerification(savedUser);

        return UserResponse.fromUser(savedUser);
    }

    public UserResponse register(
            String name,
            String email,
            String phone,
            String password
    ) {
        String normalizedEmail = email == null ? "" : email.trim();

        java.util.Optional<User> existingUser = userRepository.findByEmail(normalizedEmail);
        if (existingUser.isPresent()) {
            User existing = existingUser.get();

            if (existing.getRole() == User.Role.CUSTOMER && !existing.isEmailVerified()) {
                // Reuse the pending account and issue a fresh verification link.
                emailVerificationService.issueAndSendVerification(existing);
                return UserResponse.fromUser(existing);
            }

            throw new RuntimeException("Email is already registered");
        }

        User user = new User();

        user.setName(name);
        user.setEmail(email);
        user.setPhone(phone);

        // Public registration always creates a CUSTOMER account.
        user.setRole(User.Role.CUSTOMER);
        user.setEmailVerified(false);

        // Never store the plain-text password.
        user.setPassword(passwordEncoder.encode(password));

        User savedUser = userRepository.save(user);
        emailVerificationService.issueAndSendVerification(savedUser);

        return UserResponse.fromUser(savedUser);
    }

    public void verifyEmail(String token) {
        emailVerificationService.verify(token);
    }

    public void resendVerification(String email) {
        emailVerificationService.resend(email);
    }

    public LoginResponse login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        if (!user.isEmailVerified()) {
            throw new EmailNotVerifiedException();
        }

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        return new LoginResponse(
                token,
                UserResponse.fromUser(user)
        );
    }
}
