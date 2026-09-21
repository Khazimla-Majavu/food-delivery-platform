package com.fooddelivery.backend;

import com.fooddelivery.backend.model.FinancialRecord;
import com.fooddelivery.backend.model.Order;
import com.fooddelivery.backend.model.Restaurant;
import com.fooddelivery.backend.model.User;
import com.fooddelivery.backend.repository.FinancialRecordRepository;
import com.fooddelivery.backend.service.CommissionService;
import com.fooddelivery.backend.service.DriverCommissionService;
import com.fooddelivery.backend.service.DriverEarningsService;
import com.fooddelivery.backend.service.FinancialRecordService;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class FinancialRecordServiceTest {

    @Test
    void shouldCalculateCompleteFinancialBreakdown() {
        FinancialRecordRepository repository =
                mock(FinancialRecordRepository.class);

        when(repository.findByOrderId(1L))
                .thenReturn(Optional.empty());

        when(repository.save(any(FinancialRecord.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        FinancialRecordService service =
                new FinancialRecordService(
                        repository,
                        new CommissionService(),
                        new DriverEarningsService(
                                new DriverCommissionService()
                        )
                );

        Order order = new Order();

        order.setId(1L);
        order.setSubtotal(new BigDecimal("75.00"));
        order.setDeliveryFee(new BigDecimal("13.00"));
        order.setServiceFee(new BigDecimal("5.50"));
        order.setTotalAmount(new BigDecimal("93.50"));

        User driver = new User();
        driver.setId(2L);
        order.setDriver(driver);

        FinancialRecord record =
                service.createFinancialRecord(order);

        assertEquals(
                new BigDecimal("7.50"),
                record.getRestaurantCommission()
        );

        assertEquals(
                new BigDecimal("1.95"),
                record.getDriverCommission()
        );

        assertEquals(
                new BigDecimal("11.05"),
                record.getDriverEarnings()
        );

        assertEquals(
                new BigDecimal("14.95"),
                record.getPlatformRevenue()
        );

        assertEquals(order, record.getOrder());

        verify(repository).save(any(FinancialRecord.class));
    }
}
