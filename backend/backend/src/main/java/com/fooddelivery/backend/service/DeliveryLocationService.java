package com.fooddelivery.backend.service;

import com.fooddelivery.backend.dto.DeliveryLocationResponse;
import com.fooddelivery.backend.model.DeliveryLocation;
import com.fooddelivery.backend.model.Order;
import com.fooddelivery.backend.model.User;
import com.fooddelivery.backend.repository.DeliveryLocationRepository;
import com.fooddelivery.backend.repository.OrderRepository;
import com.fooddelivery.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class DeliveryLocationService {

    private final DeliveryLocationRepository deliveryLocationRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final OrderPricingService orderPricingService;

    public DeliveryLocationService(
            DeliveryLocationRepository deliveryLocationRepository,
            OrderRepository orderRepository,
            UserRepository userRepository,
            OrderPricingService orderPricingService
    ) {
        this.deliveryLocationRepository = deliveryLocationRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.orderPricingService = orderPricingService;
    }

    public DeliveryLocationResponse createLocation(
            Long orderId,
            String customerEmail,
            String address,
            BigDecimal latitude,
            BigDecimal longitude
    ) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        if (customer.getRole() != User.Role.CUSTOMER) {
            throw new RuntimeException("User is not a customer");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getCustomer().getId().equals(customer.getId())) {
            throw new RuntimeException(
                    "You are not authorized to set the delivery location for this order"
            );
        }

        if (address == null || address.isBlank()) {
            throw new RuntimeException("Delivery address is required");
        }

        if (deliveryLocationRepository.findByOrderId(orderId).isPresent()) {
            throw new RuntimeException(
                    "Delivery location already exists for this order"
            );
        }

        DeliveryLocation location = new DeliveryLocation();
        location.setOrder(order);
        location.setAddress(address);
        location.setLatitude(latitude);
        location.setLongitude(longitude);

        DeliveryLocation savedLocation =
                deliveryLocationRepository.save(location);

        orderPricingService.applyPricing(order, savedLocation);
        orderRepository.save(order);

        return DeliveryLocationResponse.fromDeliveryLocation(savedLocation);
    }

    public DeliveryLocationResponse getLocation(
            Long orderId,
            String email
    ) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        boolean isCustomer =
                order.getCustomer().getId().equals(user.getId());

        boolean isDriver =
                order.getDriver() != null &&
                order.getDriver().getId().equals(user.getId());

        if (!isCustomer && !isDriver) {
            throw new RuntimeException(
                    "You are not authorized to view this delivery location"
            );
        }

        DeliveryLocation location =
                deliveryLocationRepository.findByOrderId(orderId)
                        .orElseThrow(() -> new RuntimeException(
                                "Delivery location not found"
                        ));

        return DeliveryLocationResponse.fromDeliveryLocation(location);
    }
}
