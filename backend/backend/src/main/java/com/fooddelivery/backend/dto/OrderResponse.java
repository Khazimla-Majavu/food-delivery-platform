package com.fooddelivery.backend.dto;

import com.fooddelivery.backend.model.Order;
import com.fooddelivery.backend.model.OrderItem;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderResponse {

    private Long id;
    private Long customerId;
    private Long restaurantId;
    private String restaurantName;
    private String restaurantAddress;
    private Long driverId;
    private BigDecimal totalAmount;
    private Order.Status status;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items;

    public OrderResponse() {
    }

    public OrderResponse(
            Long id,
            Long customerId,
            Long restaurantId,
            String restaurantName,
            String restaurantAddress,
            Long driverId,
            BigDecimal totalAmount,
            Order.Status status,
            LocalDateTime createdAt,
            List<OrderItemResponse> items
    ) {
        this.id = id;
        this.customerId = customerId;
        this.restaurantId = restaurantId;
        this.restaurantName = restaurantName;
        this.restaurantAddress = restaurantAddress;
        this.driverId = driverId;
        this.totalAmount = totalAmount;
        this.status = status;
        this.createdAt = createdAt;
        this.items = items;
    }

    public static OrderResponse fromOrder(
            Order order,
            List<OrderItem> orderItems
    ) {
        List<OrderItemResponse> itemResponses = orderItems.stream()
                .map(OrderItemResponse::fromOrderItem)
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getCustomer().getId(),
                order.getRestaurant().getId(),
                order.getRestaurant().getName(),
                order.getRestaurant().getAddress(),
                order.getDriver() != null
                        ? order.getDriver().getId()
                        : null,
                order.getTotalAmount(),
                order.getStatus(),
                order.getCreatedAt(),
                itemResponses
        );
    }

    public Long getId() {
        return id;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public Long getRestaurantId() {
        return restaurantId;
    }

    public String getRestaurantName() {
        return restaurantName;
    }

    public String getRestaurantAddress() {
        return restaurantAddress;
    }

    public Long getDriverId() {
        return driverId;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public Order.Status getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public List<OrderItemResponse> getItems() {
        return items;
    }
}