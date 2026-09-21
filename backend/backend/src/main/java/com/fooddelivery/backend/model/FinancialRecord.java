package com.fooddelivery.backend.model;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "financial_records")
public class FinancialRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;

    @Column(nullable = false)
    private BigDecimal restaurantCommission;

    @Column(nullable = false)
    private BigDecimal driverCommission;

    @Column(nullable = false)
    private BigDecimal driverEarnings;

    @Column(nullable = false)
    private BigDecimal platformRevenue;

    public FinancialRecord() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public BigDecimal getRestaurantCommission() {
        return restaurantCommission;
    }

    public void setRestaurantCommission(BigDecimal restaurantCommission) {
        this.restaurantCommission = restaurantCommission;
    }

    public BigDecimal getDriverCommission() {
        return driverCommission;
    }

    public void setDriverCommission(BigDecimal driverCommission) {
        this.driverCommission = driverCommission;
    }

    public BigDecimal getDriverEarnings() {
        return driverEarnings;
    }

    public void setDriverEarnings(BigDecimal driverEarnings) {
        this.driverEarnings = driverEarnings;
    }

    public BigDecimal getPlatformRevenue() {
        return platformRevenue;
    }

    public void setPlatformRevenue(BigDecimal platformRevenue) {
        this.platformRevenue = platformRevenue;
    }
}
