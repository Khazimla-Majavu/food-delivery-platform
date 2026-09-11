package com.fooddelivery.backend.service;

import com.fooddelivery.backend.dto.DeliveryDistanceResponse;
import com.fooddelivery.backend.model.DeliveryLocation;
import com.fooddelivery.backend.model.Order;
import com.fooddelivery.backend.model.Restaurant;
import com.fooddelivery.backend.repository.DeliveryLocationRepository;
import com.fooddelivery.backend.repository.OrderRepository;
import org.springframework.stereotype.Service;

@Service
public class DeliveryDistanceService {

    private final OrderRepository orderRepository;
    private final DeliveryLocationRepository deliveryLocationRepository;
    private final DistanceService distanceService;

    public DeliveryDistanceService(
            OrderRepository orderRepository,
            DeliveryLocationRepository deliveryLocationRepository,
            DistanceService distanceService
    ) {
        this.orderRepository = orderRepository;
        this.deliveryLocationRepository = deliveryLocationRepository;
        this.distanceService = distanceService;
    }

    public DeliveryDistanceResponse calculateOrderDistance(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Restaurant restaurant = order.getRestaurant();

        if (restaurant.getLatitude() == null || restaurant.getLongitude() == null) {
            throw new RuntimeException("Restaurant coordinates are not available");
        }

        DeliveryLocation location = deliveryLocationRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Delivery location not found"));

        if (location.getLatitude() == null || location.getLongitude() == null) {
            throw new RuntimeException("Customer coordinates are not available");
        }

        double distanceKm = distanceService.calculateDistance(
                restaurant.getLatitude().doubleValue(),
                restaurant.getLongitude().doubleValue(),
                location.getLatitude().doubleValue(),
                location.getLongitude().doubleValue()
        );

        return new DeliveryDistanceResponse(orderId, distanceKm);
    }
}
