package com.fooddelivery.backend.service;

import com.fooddelivery.backend.model.FinancialRecord;
import com.fooddelivery.backend.model.Order;
import com.fooddelivery.backend.repository.FinancialRecordRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class FinancialRecordService {

    private final FinancialRecordRepository financialRecordRepository;
    private final CommissionService commissionService;
    private final DriverEarningsService driverEarningsService;

    public FinancialRecordService(
            FinancialRecordRepository financialRecordRepository,
            CommissionService commissionService,
            DriverEarningsService driverEarningsService
    ) {
        this.financialRecordRepository = financialRecordRepository;
        this.commissionService = commissionService;
        this.driverEarningsService = driverEarningsService;
    }

    public FinancialRecord createFinancialRecord(Order order) {

        if (financialRecordRepository.findByOrderId(order.getId()).isPresent()) {
            throw new RuntimeException(
                    "Financial record already exists for this order"
            );
        }

        if (order.getDriver() == null) {
            throw new RuntimeException(
                    "Order must have a driver before creating a financial record"
            );
        }

        BigDecimal restaurantCommission =
                commissionService.calculateRestaurantCommission(
                        order.getSubtotal()
                );

        BigDecimal driverCommission =
                driverEarningsService.calculateDriverCommission(
                        order.getDeliveryFee()
                );

        BigDecimal driverEarnings =
                driverEarningsService.calculateDriverEarnings(
                        order.getDeliveryFee()
                );

        BigDecimal platformRevenue =
                restaurantCommission
                        .add(order.getServiceFee())
                        .add(driverCommission);

        FinancialRecord record = new FinancialRecord();

        record.setOrder(order);
        record.setRestaurantCommission(restaurantCommission);
        record.setDriverCommission(driverCommission);
        record.setDriverEarnings(driverEarnings);
        record.setPlatformRevenue(platformRevenue);

        return financialRecordRepository.save(record);
    }

    public FinancialRecord getFinancialRecord(Long orderId) {
        return financialRecordRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException(
                        "Financial record not found"
                ));
    }
}
