package com.fooddelivery.backend.dto;

import com.fooddelivery.backend.model.Notification;

import java.time.LocalDateTime;

public class NotificationResponse {

    private Long id;
    private String message;
    private boolean read;
    private LocalDateTime createdAt;

    public NotificationResponse(
            Long id,
            String message,
            boolean read,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.message = message;
        this.read = read;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getMessage() {
        return message;
    }

    public boolean isRead() {
        return read;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public static NotificationResponse fromNotification(
            Notification notification
    ) {
        return new NotificationResponse(
                notification.getId(),
                notification.getMessage(),
                notification.isRead(),
                notification.getCreatedAt()
        );
    }
}
