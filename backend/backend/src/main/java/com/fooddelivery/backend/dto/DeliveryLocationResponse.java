package com.fooddelivery.backend.dto;

import com.fooddelivery.backend.model.DeliveryLocation;

import java.math.BigDecimal;

public class DeliveryLocationResponse {

    private Long id;
    private Long orderId;
    private String address;
    private BigDecimal latitude;
    private BigDecimal longitude;

    public DeliveryLocationResponse(
            Long id,
            Long orderId,
            String address,
            BigDecimal latitude,
            BigDecimal longitude
    ) {
        this.id = id;
        this.orderId = orderId;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
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

    public static DeliveryLocationResponse fromDeliveryLocation(
            DeliveryLocation location
    ) {
        return new DeliveryLocationResponse(
                location.getId(),
                location.getOrder().getId(),
                location.getAddress(),
                location.getLatitude(),
                location.getLongitude()
        );
    }
}
