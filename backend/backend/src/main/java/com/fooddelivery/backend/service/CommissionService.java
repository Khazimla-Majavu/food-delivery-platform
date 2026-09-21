package com.fooddelivery.backend.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class CommissionService {

    private static final BigDecimal RESTAURANT_COMMISSION_RATE =
            new BigDecimal("0.10");

    public BigDecimal calculateRestaurantCommission(
            BigDecimal subtotal
    ) {
        return subtotal
                .multiply(RESTAURANT_COMMISSION_RATE)
                .setScale(2, RoundingMode.HALF_UP);
    }
}
