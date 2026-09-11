package com.fooddelivery.backend.dto;

public class DeliveryDistanceResponse {

    private Long orderId;
    private double distanceKm;

    public DeliveryDistanceResponse(Long orderId, double distanceKm) {
        this.orderId = orderId;
        this.distanceKm = distanceKm;
    }

    public Long getOrderId() {
        return orderId;
    }

    public double getDistanceKm() {
        return distanceKm;
    }
}
