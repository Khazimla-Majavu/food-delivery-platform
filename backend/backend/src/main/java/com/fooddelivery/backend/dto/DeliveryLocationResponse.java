package com.fooddelivery.backend.dto;

import com.fooddelivery.backend.model.DeliveryLocation;

import java.math.BigDecimal;

public class DeliveryLocationResponse {

    private Long id;
    private Long orderId;
    private String address;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private BigDecimal subtotal;
    private BigDecimal deliveryFee;
    private BigDecimal serviceFee;
    private BigDecimal totalAmount;

    public DeliveryLocationResponse(
            Long id,
            Long orderId,
            String address,
            BigDecimal latitude,
            BigDecimal longitude,
            BigDecimal subtotal,
            BigDecimal deliveryFee,
            BigDecimal serviceFee,
            BigDecimal totalAmount
    ) {
        this.id = id;
        this.orderId = orderId;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.subtotal = subtotal;
        this.deliveryFee = deliveryFee;
        this.serviceFee = serviceFee;
        this.totalAmount = totalAmount;
    }

    public Long getId() {
        return id;
    }

    public Long getOrderId() {
        return orderId;
    }

    public String getAddress() {
        return address;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public BigDecimal getDeliveryFee() {
        return deliveryFee;
    }

    public BigDecimal getServiceFee() {
        return serviceFee;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public static DeliveryLocationResponse fromDeliveryLocation(
            DeliveryLocation location
    ) {
        return new DeliveryLocationResponse(
                location.getId(),
                location.getOrder().getId(),
                location.getAddress(),
                location.getLatitude(),
                location.getLongitude(),
                location.getOrder().getSubtotal(),
                location.getOrder().getDeliveryFee(),
                location.getOrder().getServiceFee(),
                location.getOrder().getTotalAmount()
        );
    }
}
