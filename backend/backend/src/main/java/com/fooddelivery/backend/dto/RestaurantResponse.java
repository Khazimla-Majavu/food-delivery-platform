package com.fooddelivery.backend.dto;

import com.fooddelivery.backend.model.Restaurant;

public class RestaurantResponse {

    private Long id;
    private String name;
    private String description;
    private String address;
    private Long ownerId;

    public RestaurantResponse() {
    }

    public RestaurantResponse(
            Long id,
            String name,
            String description,
            String address,
            Long ownerId
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.address = address;
        this.ownerId = ownerId;
    }

    public static RestaurantResponse fromRestaurant(Restaurant restaurant) {
        return new RestaurantResponse(
                restaurant.getId(),
                restaurant.getName(),
                restaurant.getDescription(),
                restaurant.getAddress(),
                restaurant.getOwner().getId()
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

    public String getAddress() {
        return address;
    }

    public Long getOwnerId() {
        return ownerId;
    }
}