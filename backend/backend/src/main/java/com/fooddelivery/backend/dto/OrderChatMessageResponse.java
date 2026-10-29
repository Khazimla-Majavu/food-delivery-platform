package com.fooddelivery.backend.dto;

import com.fooddelivery.backend.model.OrderChatMessage;
import com.fooddelivery.backend.model.User;
import java.time.LocalDateTime;

public record OrderChatMessageResponse(
    Long id,
    Long orderId,
    Long senderId,
    String senderName,
    String senderRole,
    String message,
    LocalDateTime createdAt
) {
    public static OrderChatMessageResponse from(
            OrderChatMessage message
    ) {
        User sender = message.getSender();

        return new OrderChatMessageResponse(
            message.getId(),
            message.getOrder().getId(),
            sender.getId(),
            sender.getName(),
            sender.getRole().name(),
            message.getMessage(),
            message.getCreatedAt()
        );
    }
}
