package com.fooddelivery.backend.dto;

import com.fooddelivery.backend.model.OrderItem;

import java.math.BigDecimal;

public class OrderItemResponse {

    private Long id;
    private Long menuItemId;
    private String menuItemName;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal subtotal;

    public OrderItemResponse() {
    }

    public OrderItemResponse(
            Long id,
            Long menuItemId,
            String menuItemName,
            Integer quantity,
            BigDecimal price,
            BigDecimal subtotal
    ) {
        this.id = id;
        this.menuItemId = menuItemId;
        this.menuItemName = menuItemName;
        this.quantity = quantity;
        this.price = price;
        this.subtotal = subtotal;
    }

    public static OrderItemResponse fromOrderItem(OrderItem orderItem) {

        BigDecimal subtotal = orderItem.getPrice()
                .multiply(BigDecimal.valueOf(orderItem.getQuantity()));

        return new OrderItemResponse(
                orderItem.getId(),
                orderItem.getMenuItem().getId(),
                orderItem.getMenuItem().getName(),
                orderItem.getQuantity(),
                orderItem.getPrice(),
                subtotal
        );
    }

    public Long getId() {
        return id;
    }

    public Long getMenuItemId() {
        return menuItemId;
    }

    public String getMenuItemName() {
        return menuItemName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }
}