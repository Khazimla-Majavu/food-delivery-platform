package com.fooddelivery.backend;

import com.fooddelivery.backend.service.DriverCommissionService;
import com.fooddelivery.backend.service.DriverEarningsService;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;

class DriverEarningsServiceTest {

    private final DriverEarningsService service =
            new DriverEarningsService(
                    new DriverCommissionService()
            );

    @Test
    void shouldCalculateEarningsFrom13RandDeliveryFee() {
        assertEquals(
                new BigDecimal("11.05"),
                service.calculateDriverEarnings(
                        new BigDecimal("13.00")
                )
        );
    }

    @Test
    void shouldCalculateEarningsFrom15RandDeliveryFee() {
        assertEquals(
                new BigDecimal("12.75"),
                service.calculateDriverEarnings(
                        new BigDecimal("15.00")
                )
        );
    }

    @Test
    void shouldCalculateEarningsFrom20RandDeliveryFee() {
        assertEquals(
                new BigDecimal("17.00"),
                service.calculateDriverEarnings(
                        new BigDecimal("20.00")
                )
        );
    }
}
