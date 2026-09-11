package com.fooddelivery.backend.repository;

import com.fooddelivery.backend.model.DeliveryLocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DeliveryLocationRepository extends JpaRepository<DeliveryLocation, Long> {

    Optional<DeliveryLocation> findByOrderId(Long orderId);
}
