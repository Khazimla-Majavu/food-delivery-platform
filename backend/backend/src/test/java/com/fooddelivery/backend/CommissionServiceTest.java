package com.fooddelivery.backend;

import com.fooddelivery.backend.service.CommissionService;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;

class CommissionServiceTest {

    private final CommissionService service = new CommissionService();

    @Test
    void shouldCalculateRestaurantCommission() {
        assertEquals(
                new BigDecimal("7.50"),
                service.calculateRestaurantCommission(
                        new BigDecimal("75.00")
                )
        );
    }

    @Test
    void shouldCalculateCommissionWithDecimalSubtotal() {
        assertEquals(
                new BigDecimal("12.35"),
                service.calculateRestaurantCommission(
                        new BigDecimal("123.50")
                )
        );
    }
}
