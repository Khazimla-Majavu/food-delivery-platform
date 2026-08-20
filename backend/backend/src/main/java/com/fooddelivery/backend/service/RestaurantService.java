package com.fooddelivery.backend.service;

import com.fooddelivery.backend.dto.RestaurantResponse;
import com.fooddelivery.backend.model.Restaurant;
import com.fooddelivery.backend.model.User;
import com.fooddelivery.backend.repository.RestaurantRepository;
import com.fooddelivery.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;

    public RestaurantService(
            RestaurantRepository restaurantRepository,
            UserRepository userRepository
    ) {
        this.restaurantRepository = restaurantRepository;
        this.userRepository = userRepository;
    }

    public List<RestaurantResponse> getAllRestaurants() {
        return restaurantRepository.findAll()
                .stream()
                .map(RestaurantResponse::fromRestaurant)
                .toList();
    }

    public RestaurantResponse createRestaurant(
            String name,
            String description,
            String address,
            String ownerEmail
    ) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        Restaurant restaurant = new Restaurant();
        restaurant.setName(name);
        restaurant.setDescription(description);
        restaurant.setAddress(address);
        restaurant.setOwner(owner);

        Restaurant savedRestaurant = restaurantRepository.save(restaurant);

        return RestaurantResponse.fromRestaurant(savedRestaurant);
    }

    public List<RestaurantResponse> getMyRestaurants(String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        return restaurantRepository.findByOwnerId(owner.getId())
                .stream()
                .map(RestaurantResponse::fromRestaurant)
                .toList();
    }
}