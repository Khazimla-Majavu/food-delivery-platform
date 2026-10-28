package com.fooddelivery.backend.controller;

import com.fooddelivery.backend.dto.LoginRequest;
import com.fooddelivery.backend.dto.LoginResponse;
import com.fooddelivery.backend.dto.RegisterRequest;
import com.fooddelivery.backend.dto.UserResponse;
import com.fooddelivery.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse loginResponse = userService.login(
                request.getEmail(),
                request.getPassword()
        );

        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody RegisterRequest request) {
        UserResponse userResponse = userService.register(
                request.getName(),
                request.getEmail(),
                request.getPhone(),
                request.getPassword()
        );

        return ResponseEntity.ok(userResponse);
    }
    @PostMapping("/verify-email")
    public ResponseEntity<Map<String, String>> verifyEmail(@RequestParam String token) {
        userService.verifyEmail(token);
        return ResponseEntity.ok(Map.of("message", "Your email has been verified. You can now log in."));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<Map<String, String>> resendVerification(@RequestParam String email) {
        userService.resendVerification(email);
        return ResponseEntity.ok(Map.of(
                "message",
                "If the address belongs to an unverified customer account, a verification email will be sent."
        ));
    }
}
