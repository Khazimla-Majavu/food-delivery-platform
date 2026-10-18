package com.fooddelivery.backend.repository;

import com.fooddelivery.backend.model.DriverTrackingLocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DriverTrackingLocationRepository
        extends JpaRepository<DriverTrackingLocation, Long> {

    Optional<DriverTrackingLocation> findByOrderId(Long orderId);
}
