package com.fooddelivery.backend;

import com.fooddelivery.backend.service.DriverCommissionService;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;

class DriverCommissionServiceTest {

    private final DriverCommissionService service =
            new DriverCommissionService();

    @Test
    void shouldCalculate15PercentCommission() {
        assertEquals(
                new BigDecimal("150.00"),
                service.calculateDriverCommission(
                        new BigDecimal("1000.00")
                )
        );
    }

    @Test
    void shouldAllowCommissionUpTo600() {
        assertEquals(
                new BigDecimal("600.00"),
                service.calculateDriverCommission(
                        new BigDecimal("4000.00")
                )
        );
    }

    @Test
    void shouldCapCommissionAt600() {
        assertEquals(
                new BigDecimal("600.00"),
                service.calculateDriverCommission(
                        new BigDecimal("5000.00")
                )
        );
    }
}
