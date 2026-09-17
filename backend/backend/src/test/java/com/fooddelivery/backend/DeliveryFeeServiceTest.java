package com.fooddelivery.backend;

import com.fooddelivery.backend.service.DeliveryFeeService;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;

class DeliveryFeeServiceTest {

    private final DeliveryFeeService service = new DeliveryFeeService();

    @Test
    void shouldCharge13ForUpTo5Km() {
        assertEquals(
                new BigDecimal("13.00"),
                service.calculateDeliveryFee(5.0)
        );
    }

    @Test
    void shouldCharge15ForOver5UpTo10Km() {
        assertEquals(
                new BigDecimal("15.00"),
                service.calculateDeliveryFee(5.01)
        );

        assertEquals(
                new BigDecimal("15.00"),
                service.calculateDeliveryFee(10.0)
        );
    }

    @Test
    void shouldCharge20ForOver10Km() {
        assertEquals(
                new BigDecimal("20.00"),
                service.calculateDeliveryFee(10.01)
        );
    }
}
