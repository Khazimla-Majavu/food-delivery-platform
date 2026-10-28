package com.fooddelivery.backend.dto;

public record WorkWithChowRequest(
        String name,
        String phone,
        String email,
        String type,
        String message,
        String website
) {}
