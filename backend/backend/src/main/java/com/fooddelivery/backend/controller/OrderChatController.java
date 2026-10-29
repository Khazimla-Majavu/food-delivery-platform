package com.fooddelivery.backend.controller;

import com.fooddelivery.backend.dto.OrderChatMessageResponse;
import com.fooddelivery.backend.dto.SendChatMessageRequest;
import com.fooddelivery.backend.service.OrderChatService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders/{orderId}/chat")
public class OrderChatController {

    private final OrderChatService chatService;

    public OrderChatController(OrderChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping
    public List<OrderChatMessageResponse> getMessages(
            @PathVariable Long orderId,
            Authentication authentication
    ) {
        return chatService.getMessages(orderId, authentication.getName());
    }

    @PostMapping
    public OrderChatMessageResponse sendMessage(
            @PathVariable Long orderId,
            @RequestBody SendChatMessageRequest request,
            Authentication authentication
    ) {
        return chatService.sendMessage(
                orderId, request, authentication.getName()
        );
    }
}
