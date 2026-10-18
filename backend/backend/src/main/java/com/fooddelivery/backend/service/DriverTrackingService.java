package com.fooddelivery.backend.service;

import com.fooddelivery.backend.dto.DriverLocationRequest;
import com.fooddelivery.backend.dto.DriverLocationResponse;
import com.fooddelivery.backend.model.DriverTrackingLocation;
import com.fooddelivery.backend.model.Order;
import com.fooddelivery.backend.model.User;
import com.fooddelivery.backend.repository.DriverTrackingLocationRepository;
import com.fooddelivery.backend.repository.OrderRepository;
import com.fooddelivery.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class DriverTrackingService {

    private final DriverTrackingLocationRepository trackingRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public DriverTrackingService(
            DriverTrackingLocationRepository trackingRepository,
            OrderRepository orderRepository,
            UserRepository userRepository
    ) {
        this.trackingRepository = trackingRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public DriverLocationResponse updateLocation(
            Long orderId,
            String email,
            DriverLocationRequest request
    ) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != User.Role.DRIVER) {
            throw new RuntimeException("Only drivers can publish locations");
        }

        if (request == null
                || !isValidLatitude(request.getLatitude())
                || !isValidLongitude(request.getLongitude())) {
            throw new RuntimeException("Valid latitude and longitude are required");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getDriver() == null
                || !order.getDriver().getId().equals(user.getId())) {
            throw new RuntimeException(
                    "You are not the driver assigned to this order"
            );
        }

        if (order.getStatus() != Order.Status.OUT_FOR_DELIVERY) {
            throw new RuntimeException(
                    "Location updates are only allowed during active deliveries"
            );
        }

        DriverTrackingLocation location = trackingRepository
                .findByOrderId(orderId)
                .orElseGet(DriverTrackingLocation::new);

        location.setOrder(order);
        location.setLatitude(request.getLatitude());
        location.setLongitude(request.getLongitude());
        location.setUpdatedAt(LocalDateTime.now());

        return DriverLocationResponse.from(trackingRepository.save(location));
    }

    @Transactional(readOnly = true)
    public DriverLocationResponse getLocation(
            Long orderId,
            String email
    ) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getCustomer().getId().equals(user.getId())) {
            throw new RuntimeException(
                    "Only the customer who placed this order can track it"
            );
        }

        if (order.getStatus() != Order.Status.OUT_FOR_DELIVERY) {
            throw new RuntimeException(
                    "Live tracking is only available while the order is out for delivery"
            );
        }

        DriverTrackingLocation location = trackingRepository
                .findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException(
                        "The driver has not shared a location yet"
                ));

        return DriverLocationResponse.from(location);
    }

    private boolean isValidLatitude(BigDecimal latitude) {
        return latitude != null
                && latitude.compareTo(BigDecimal.valueOf(-90)) >= 0
                && latitude.compareTo(BigDecimal.valueOf(90)) <= 0;
    }

    private boolean isValidLongitude(BigDecimal longitude) {
        return longitude != null
                && longitude.compareTo(BigDecimal.valueOf(-180)) >= 0
                && longitude.compareTo(BigDecimal.valueOf(180)) <= 0;
    }
}
