package com.fooddelivery.backend.controller;

import com.fooddelivery.backend.dto.CreateMenuItemRequest;
import com.fooddelivery.backend.dto.MenuItemResponse;
import com.fooddelivery.backend.service.MenuItemService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.fooddelivery.backend.dto.UpdateMenuItemRequest;

@RestController
@RequestMapping("/api/restaurants/{restaurantId}/menu")
public class MenuItemController {

    private final MenuItemService menuItemService;

    public MenuItemController(MenuItemService menuItemService) {
        this.menuItemService = menuItemService;
    }

    @GetMapping
    public List<MenuItemResponse> getRestaurantMenu(
            @PathVariable Long restaurantId
    ) {
        return menuItemService.getRestaurantMenu(restaurantId);
    }

    @PostMapping
    public MenuItemResponse createMenuItem(
            @PathVariable Long restaurantId,
            @RequestBody CreateMenuItemRequest request,
            Authentication authentication
    ) {
        return menuItemService.createMenuItem(
                restaurantId,
                request,
                authentication.getName()
        );
    }

    @PutMapping("/{menuItemId}")
    public MenuItemResponse updateMenuItem(
            @PathVariable Long restaurantId,
            @PathVariable Long menuItemId,
            @RequestBody UpdateMenuItemRequest request,
            Authentication authentication
    ) {
        return menuItemService.updateMenuItem(
                restaurantId,
                menuItemId,
                request,
                authentication.getName()
        );
    }

    @DeleteMapping("/{menuItemId}")
    public void deleteMenuItem(
            @PathVariable Long restaurantId,
            @PathVariable Long menuItemId,
            Authentication authentication
    ) {
        menuItemService.deleteMenuItem(
                restaurantId,
                menuItemId,
                authentication.getName()
        );
    }
}
