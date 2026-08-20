package com.fooddelivery.backend.service;

import com.fooddelivery.backend.dto.CreateMenuItemRequest;
import com.fooddelivery.backend.dto.MenuItemResponse;
import com.fooddelivery.backend.model.MenuItem;
import com.fooddelivery.backend.model.Restaurant;
import com.fooddelivery.backend.model.User;
import com.fooddelivery.backend.repository.MenuItemRepository;
import com.fooddelivery.backend.repository.RestaurantRepository;
import com.fooddelivery.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import com.fooddelivery.backend.dto.UpdateMenuItemRequest;

@Service
public class MenuItemService {

    private final MenuItemRepository menuItemRepository;
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;

    public MenuItemService(
            MenuItemRepository menuItemRepository,
            RestaurantRepository restaurantRepository,
            UserRepository userRepository
    ) {
        this.menuItemRepository = menuItemRepository;
        this.restaurantRepository = restaurantRepository;
        this.userRepository = userRepository;
    }

    public MenuItemResponse createMenuItem(
            Long restaurantId,
            CreateMenuItemRequest request,
            String ownerEmail
    ) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        if (!restaurant.getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("You do not own this restaurant");
        }

        MenuItem menuItem = new MenuItem();
        menuItem.setName(request.getName());
        menuItem.setDescription(request.getDescription());
        menuItem.setPrice(request.getPrice());
        menuItem.setRestaurant(restaurant);

        MenuItem savedMenuItem = menuItemRepository.save(menuItem);

        return MenuItemResponse.fromMenuItem(savedMenuItem);
    }

    public MenuItemResponse updateMenuItem(
            Long restaurantId,
            Long menuItemId,
            UpdateMenuItemRequest request,
            String ownerEmail
    ) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        if (!restaurant.getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("You do not own this restaurant");
        }

        MenuItem menuItem = menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        if (!menuItem.getRestaurant().getId().equals(restaurantId)) {
            throw new RuntimeException("Menu item does not belong to this restaurant");
        }

        menuItem.setName(request.getName());
        menuItem.setDescription(request.getDescription());
        menuItem.setPrice(request.getPrice());

        MenuItem updatedMenuItem = menuItemRepository.save(menuItem);

        return MenuItemResponse.fromMenuItem(updatedMenuItem);
    }

    public void deleteMenuItem(
            Long restaurantId,
            Long menuItemId,
            String ownerEmail
    ) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        if (!restaurant.getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("You do not own this restaurant");
        }

        MenuItem menuItem = menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        if (!menuItem.getRestaurant().getId().equals(restaurantId)) {
            throw new RuntimeException("Menu item does not belong to this restaurant");
        }

        menuItemRepository.delete(menuItem);
    }

    public List<MenuItemResponse> getRestaurantMenu(Long restaurantId) {
        return menuItemRepository.findByRestaurantId(restaurantId)
                .stream()
                .map(MenuItemResponse::fromMenuItem)
                .toList();
    }
}
