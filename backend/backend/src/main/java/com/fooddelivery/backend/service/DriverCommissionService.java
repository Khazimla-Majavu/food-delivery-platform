package com.fooddelivery.backend.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class DriverCommissionService {

    private static final BigDecimal DRIVER_COMMISSION_RATE =
            new BigDecimal("0.15");

    private static final BigDecimal DRIVER_COMMISSION_CAP =
            new BigDecimal("600.00");

    public BigDecimal calculateDriverCommission(
            BigDecimal eligibleEarnings
    ) {
        BigDecimal commission = eligibleEarnings
                .multiply(DRIVER_COMMISSION_RATE)
                .setScale(2, RoundingMode.HALF_UP);

        return commission.min(DRIVER_COMMISSION_CAP);
    }
}
