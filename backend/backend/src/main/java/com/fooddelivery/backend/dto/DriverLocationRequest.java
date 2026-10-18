package com.fooddelivery.backend.dto;

import java.math.BigDecimal;

public class DriverLocationRequest {

    private BigDecimal latitude;
    private BigDecimal longitude;

    public DriverLocationRequest() {
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public void setLatitude(BigDecimal latitude) {
        this.latitude = latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public void setLongitude(BigDecimal longitude) {
        this.longitude = longitude;
    }
}
