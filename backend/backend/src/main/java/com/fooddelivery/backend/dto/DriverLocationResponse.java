package com.fooddelivery.backend.dto;

import com.fooddelivery.backend.model.DriverTrackingLocation;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record DriverLocationResponse(
        Long orderId,
        BigDecimal latitude,
        BigDecimal longitude,
        LocalDateTime updatedAt
) {
    public static DriverLocationResponse from(
            DriverTrackingLocation location
    ) {
        return new DriverLocationResponse(
                location.getOrder().getId(),
                location.getLatitude(),
                location.getLongitude(),
                location.getUpdatedAt()
        );
    }
}
