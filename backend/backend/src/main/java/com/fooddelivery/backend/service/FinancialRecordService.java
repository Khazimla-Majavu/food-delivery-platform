package com.fooddelivery.backend.service;

import com.fooddelivery.backend.model.FinancialRecord;
import com.fooddelivery.backend.model.Order;
import com.fooddelivery.backend.repository.FinancialRecordRepository;
import com.fooddelivery.backend.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
public class FinancialRecordService {

    private final FinancialRecordRepository financialRecordRepository;
    private final CommissionService commissionService;
    private final DriverEarningsService driverEarningsService;
    private final OrderRepository orderRepository;

    public FinancialRecordService(
            FinancialRecordRepository financialRecordRepository,
            CommissionService commissionService,
            DriverEarningsService driverEarningsService,
            OrderRepository orderRepository
    ) {
        this.financialRecordRepository = financialRecordRepository;
        this.commissionService = commissionService;
        this.driverEarningsService = driverEarningsService;
        this.orderRepository = orderRepository;
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


    public int backfillFinancialRecords() {

        List<Order> deliveredOrders =
                orderRepository.findByStatus(Order.Status.DELIVERED);

        int createdRecords = 0;

        for (Order order : deliveredOrders) {
            if (financialRecordRepository.findByOrderId(order.getId()).isEmpty()) {
                createFinancialRecord(order);
                createdRecords++;
            }
        }

        return createdRecords;
    }

    public Map<String, Object> getFinancialSummary() {

        List<FinancialRecord> records =
                financialRecordRepository.findAll();

        BigDecimal totalRestaurantCommission =
                records.stream()
                        .map(FinancialRecord::getRestaurantCommission)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalDriverCommission =
                records.stream()
                        .map(FinancialRecord::getDriverCommission)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalDriverEarnings =
                records.stream()
                        .map(FinancialRecord::getDriverEarnings)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalPlatformRevenue =
                records.stream()
                        .map(FinancialRecord::getPlatformRevenue)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

        return Map.of(
                "completedOrders", records.size(),
                "totalRestaurantCommission", totalRestaurantCommission,
                "totalDriverCommission", totalDriverCommission,
                "totalDriverEarnings", totalDriverEarnings,
                "totalPlatformRevenue", totalPlatformRevenue
        );
    }

    public FinancialRecord getFinancialRecord(Long orderId) {
        return financialRecordRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException(
                        "Financial record not found"
                ));
    }
}
