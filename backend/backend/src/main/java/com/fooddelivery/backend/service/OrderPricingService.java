package com.fooddelivery.backend.service;

import com.fooddelivery.backend.model.DeliveryLocation;
import com.fooddelivery.backend.model.Order;
import com.fooddelivery.backend.model.Restaurant;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class OrderPricingService {

    private static final BigDecimal SERVICE_FEE = new BigDecimal("5.50");

    private final DistanceService distanceService;
    private final DeliveryFeeService deliveryFeeService;

    public OrderPricingService(
            DistanceService distanceService,
            DeliveryFeeService deliveryFeeService
    ) {
        this.distanceService = distanceService;
        this.deliveryFeeService = deliveryFeeService;
    }

    public void applyPricing(Order order, DeliveryLocation location) {

        Restaurant restaurant = order.getRestaurant();

        if (restaurant.getLatitude() == null ||
                restaurant.getLongitude() == null) {
            throw new RuntimeException(
                    "Restaurant coordinates are not available"
            );
        }

        if (location.getLatitude() == null ||
                location.getLongitude() == null) {
            throw new RuntimeException(
                    "Customer coordinates are not available"
            );
        }

        double distanceKm = distanceService.calculateDistance(
                restaurant.getLatitude().doubleValue(),
                restaurant.getLongitude().doubleValue(),
                location.getLatitude().doubleValue(),
                location.getLongitude().doubleValue()
        );

        BigDecimal deliveryFee =
                deliveryFeeService.calculateDeliveryFee(distanceKm);

        BigDecimal subtotal = order.getSubtotal();

        BigDecimal total = subtotal
                .add(deliveryFee)
                .add(SERVICE_FEE);

        order.setDeliveryFee(deliveryFee);
        order.setServiceFee(SERVICE_FEE);
        order.setTotalAmount(total);
    }
}
