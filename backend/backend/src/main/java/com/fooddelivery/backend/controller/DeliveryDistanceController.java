package com.fooddelivery.backend.controller;

import com.fooddelivery.backend.dto.DeliveryDistanceResponse;
import com.fooddelivery.backend.service.DeliveryDistanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/delivery-distance")
public class DeliveryDistanceController {

    private final DeliveryDistanceService deliveryDistanceService;

    public DeliveryDistanceController(
            DeliveryDistanceService deliveryDistanceService
    ) {
        this.deliveryDistanceService = deliveryDistanceService;
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<DeliveryDistanceResponse> calculateDistance(
            @PathVariable Long orderId
    ) {
        return ResponseEntity.ok(
                deliveryDistanceService.calculateOrderDistance(orderId)
        );
    }
}
