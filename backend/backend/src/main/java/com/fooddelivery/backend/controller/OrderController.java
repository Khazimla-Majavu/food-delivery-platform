package com.fooddelivery.backend.controller;

import com.fooddelivery.backend.dto.CreateOrderRequest;
import com.fooddelivery.backend.dto.OrderResponse;
import com.fooddelivery.backend.service.OrderService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/restaurant/{restaurantId}")
    public OrderResponse createOrder(
            @PathVariable Long restaurantId,
            @RequestBody CreateOrderRequest request,
            Authentication authentication
    ) {
        return orderService.createOrder(
                restaurantId,
                request,
                authentication.getName()
        );
    }
}

