package com.fooddelivery.backend.controller;

import com.fooddelivery.backend.dto.CreateRestaurantRequest;
import com.fooddelivery.backend.dto.RestaurantResponse;
import com.fooddelivery.backend.service.RestaurantService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    private final RestaurantService restaurantService;

    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    @GetMapping
    public List<RestaurantResponse> getAllRestaurants() {
        return restaurantService.getAllRestaurants();
    }

    @GetMapping("/mine")
    public List<RestaurantResponse> getMyRestaurants(
            Authentication authentication
    ) {
        return restaurantService.getMyRestaurants(
                authentication.getName()
        );
    }

    @PostMapping
    public RestaurantResponse createRestaurant(
            @RequestBody CreateRestaurantRequest request,
            Authentication authentication
    ) {
        return restaurantService.createRestaurant(
                request.getName(),
                request.getDescription(),
                request.getAddress(),
                authentication.getName()
        );
    }
}