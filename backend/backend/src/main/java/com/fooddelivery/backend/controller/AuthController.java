package com.fooddelivery.backend.controller;

import com.fooddelivery.backend.dto.LoginRequest;
import com.fooddelivery.backend.dto.UserResponse;
import com.fooddelivery.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody LoginRequest request) {
        UserResponse user = userService.login(
                request.getEmail(),
                request.getPassword()
        );

        return ResponseEntity.ok(user);
    }
}