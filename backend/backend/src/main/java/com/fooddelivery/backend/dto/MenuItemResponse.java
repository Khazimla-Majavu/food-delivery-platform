package com.fooddelivery.backend.dto;

import com.fooddelivery.backend.model.MenuItem;

import java.math.BigDecimal;

public class MenuItemResponse {

    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Long restaurantId;

    public MenuItemResponse() {
    }

    public MenuItemResponse(
            Long id,
            String name,
            String description,
            BigDecimal price,
            Long restaurantId
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.restaurantId = restaurantId;
    }

    public static MenuItemResponse fromMenuItem(MenuItem menuItem) {
        return new MenuItemResponse(
                menuItem.getId(),
                menuItem.getName(),
                menuItem.getDescription(),
                menuItem.getPrice(),
                menuItem.getRestaurant().getId()
        );
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public Long getRestaurantId() {
        return restaurantId;
    }
}
