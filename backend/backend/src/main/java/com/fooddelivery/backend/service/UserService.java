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

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
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
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User savedUser = userRepository.save(user);

        return UserResponse.fromUser(savedUser);
    }

    public UserResponse register(
            String name,
            String email,
            String phone,
            String password
    ) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email is already registered");
        }

        User user = new User();

        user.setName(name);
        user.setEmail(email);
        user.setPhone(phone);

        // Public registration always creates a CUSTOMER account.
        user.setRole(User.Role.CUSTOMER);

        // Never store the plain-text password.
        user.setPassword(passwordEncoder.encode(password));

        User savedUser = userRepository.save(user);

        return UserResponse.fromUser(savedUser);
    }

    public LoginResponse login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
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
