package com.fooddelivery.backend.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class DriverEarningsService {

    private final DriverCommissionService driverCommissionService;

    public DriverEarningsService(
            DriverCommissionService driverCommissionService
    ) {
        this.driverCommissionService = driverCommissionService;
    }

    public BigDecimal calculateDriverCommission(
            BigDecimal deliveryFee
    ) {
        return driverCommissionService.calculateDriverCommission(deliveryFee);
    }

    public BigDecimal calculateDriverEarnings(
            BigDecimal deliveryFee
    ) {
        BigDecimal commission =
                calculateDriverCommission(deliveryFee);

        return deliveryFee
                .subtract(commission)
                .setScale(2, RoundingMode.HALF_UP);
    }
}
