package com.fooddelivery.backend.dto;

import com.fooddelivery.backend.model.User;

public record UserResponse(
        Long id,
        String name,
        String email,
        String phone,
        User.Role role
) {
    public static UserResponse fromUser(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole()
        );
    }
}