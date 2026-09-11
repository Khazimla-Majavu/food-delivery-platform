package com.fooddelivery.backend.controller;

import com.fooddelivery.backend.dto.DeliveryLocationResponse;
import com.fooddelivery.backend.service.DeliveryLocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/delivery-locations")
public class DeliveryLocationController {

    private final DeliveryLocationService deliveryLocationService;

    public DeliveryLocationController(
            DeliveryLocationService deliveryLocationService
    ) {
        this.deliveryLocationService = deliveryLocationService;
    }

    @PostMapping("/order/{orderId}")
    public ResponseEntity<DeliveryLocationResponse> createLocation(
            @PathVariable Long orderId,
            @RequestParam String address,
            @RequestParam(required = false) BigDecimal latitude,
            @RequestParam(required = false) BigDecimal longitude,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                deliveryLocationService.createLocation(
                        orderId,
                        authentication.getName(),
                        address,
                        latitude,
                        longitude
                )
        );
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<DeliveryLocationResponse> getLocation(
            @PathVariable Long orderId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                deliveryLocationService.getLocation(
                        orderId,
                        authentication.getName()
                )
        );
    }
}
