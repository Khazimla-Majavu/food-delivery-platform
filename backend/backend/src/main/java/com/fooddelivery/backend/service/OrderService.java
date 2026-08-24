package com.fooddelivery.backend.service;

import com.fooddelivery.backend.dto.CreateOrderRequest;
import com.fooddelivery.backend.dto.OrderResponse;
import com.fooddelivery.backend.model.MenuItem;
import com.fooddelivery.backend.model.Order;
import com.fooddelivery.backend.model.OrderItem;
import com.fooddelivery.backend.model.Restaurant;
import com.fooddelivery.backend.model.User;
import com.fooddelivery.backend.repository.MenuItemRepository;
import com.fooddelivery.backend.repository.OrderItemRepository;
import com.fooddelivery.backend.repository.OrderRepository;
import com.fooddelivery.backend.repository.RestaurantRepository;
import com.fooddelivery.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;
    private final UserRepository userRepository;

    public OrderService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            RestaurantRepository restaurantRepository,
            MenuItemRepository menuItemRepository,
            UserRepository userRepository
    ) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.restaurantRepository = restaurantRepository;
        this.menuItemRepository = menuItemRepository;
        this.userRepository = userRepository;
    }

    public OrderResponse createOrder(
            Long restaurantId,
            CreateOrderRequest request,
            String customerEmail
    ) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Order must contain at least one item");
        }

        Order order = new Order();
        order.setCustomer(customer);
        order.setRestaurant(restaurant);
        order.setStatus(Order.Status.PENDING);
        order.setCreatedAt(LocalDateTime.now());

        BigDecimal total = BigDecimal.ZERO;

        List<OrderItem> orderItems = new ArrayList<>();

        for (CreateOrderRequest.OrderItemRequest itemRequest : request.getItems()) {

            if (itemRequest.getMenuItemId() == null) {
                throw new RuntimeException("Menu item ID is required");
            }

            if (itemRequest.getQuantity() == null || itemRequest.getQuantity() <= 0) {
                throw new RuntimeException("Quantity must be greater than zero");
            }

            MenuItem menuItem = menuItemRepository.findById(
                    itemRequest.getMenuItemId()
            ).orElseThrow(() -> new RuntimeException("Menu item not found"));

            if (!menuItem.getRestaurant().getId().equals(restaurantId)) {
                throw new RuntimeException(
                        "Menu item does not belong to this restaurant"
                );
            }

            BigDecimal price = menuItem.getPrice();

            BigDecimal subtotal = price.multiply(
                    BigDecimal.valueOf(itemRequest.getQuantity())
            );

            total = total.add(subtotal);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setMenuItem(menuItem);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPrice(price);

            orderItems.add(orderItem);
        }

        order.setTotalAmount(total);

        Order savedOrder = orderRepository.save(order);

        for (OrderItem orderItem : orderItems) {
            orderItem.setOrder(savedOrder);
        }

        List<OrderItem> savedItems = orderItemRepository.saveAll(orderItems);

        return OrderResponse.fromOrder(savedOrder, savedItems);
    }
}