package com.fooddelivery.backend.controller;

import com.fooddelivery.backend.dto.LoginRequest;
import com.fooddelivery.backend.dto.UserResponse;
import com.fooddelivery.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fooddelivery.backend.dto.LoginResponse;

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
}