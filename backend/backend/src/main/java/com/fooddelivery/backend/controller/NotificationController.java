package com.fooddelivery.backend.controller;

import com.fooddelivery.backend.dto.NotificationResponse;
import com.fooddelivery.backend.model.User;
import com.fooddelivery.backend.repository.UserRepository;
import com.fooddelivery.backend.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public NotificationController(
            NotificationService notificationService,
            UserRepository userRepository
    ) {
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getNotifications(
            Authentication authentication
    ) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<NotificationResponse> notifications =
                notificationService.getUserNotifications(user.getId())
                        .stream()
                        .map(NotificationResponse::fromNotification)
                        .toList();

        return ResponseEntity.ok(notifications);
    }
}
