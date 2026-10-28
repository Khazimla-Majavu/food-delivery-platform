package com.fooddelivery.backend.service;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class EmailNotVerifiedException extends ResponseStatusException {
    public EmailNotVerifiedException() {
        super(HttpStatus.FORBIDDEN, "Please verify your email address before logging in.");
    }
}
