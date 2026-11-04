package com.fooddelivery.backend.controller;

import com.fooddelivery.backend.dto.AdminCreateAccountRequest;
import com.fooddelivery.backend.dto.UserResponse;
import com.fooddelivery.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/accounts")
public class AdminAccountController {

    private final UserService userService;

    public AdminAccountController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse createAccount(
            @RequestBody AdminCreateAccountRequest request
    ) {
        return userService.createManagedAccount(request);
    }
}
