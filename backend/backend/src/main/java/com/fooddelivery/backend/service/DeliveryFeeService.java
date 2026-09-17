package com.fooddelivery.backend.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class DeliveryFeeService {

    private static final BigDecimal FEE_UP_TO_5_KM = new BigDecimal("13.00");
    private static final BigDecimal FEE_UP_TO_10_KM = new BigDecimal("15.00");
    private static final BigDecimal FEE_ABOVE_10_KM = new BigDecimal("20.00");

    public BigDecimal calculateDeliveryFee(double distanceKm) {
        if (distanceKm <= 5.0) {
            return FEE_UP_TO_5_KM;
        }

        if (distanceKm <= 10.0) {
            return FEE_UP_TO_10_KM;
        }

        return FEE_ABOVE_10_KM;
    }
}
