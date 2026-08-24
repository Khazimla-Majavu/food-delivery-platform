package com.fooddelivery.backend.controller;

import com.fooddelivery.backend.dto.CreateOrderRequest;
import com.fooddelivery.backend.dto.OrderResponse;
import com.fooddelivery.backend.service.OrderService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.fooddelivery.backend.model.Order;

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

    @GetMapping("/mine")
    public List<OrderResponse> getMyOrders(
            Authentication authentication
    ) {
        return orderService.getCustomerOrders(
                authentication.getName()
        );
    }

    @GetMapping("/restaurant/{restaurantId}")
    public List<OrderResponse> getRestaurantOrders(
            @PathVariable Long restaurantId,
            Authentication authentication
    ) {
        return orderService.getRestaurantOrders(
                restaurantId,
                authentication.getName()
        );
    }

    @PutMapping("/{orderId}/status")
    public OrderResponse updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam Order.Status status,
            Authentication authentication
    ) {
        return orderService.updateOrderStatus(
                orderId,
                status,
                authentication.getName()
        );
    }
}