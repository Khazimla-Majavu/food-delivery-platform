package com.fooddelivery.backend.controller;

import com.fooddelivery.backend.dto.DriverLocationRequest;
import com.fooddelivery.backend.dto.DriverLocationResponse;
import com.fooddelivery.backend.service.DriverTrackingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/driver-tracking")
public class DriverTrackingController {

    private final DriverTrackingService trackingService;

    public DriverTrackingController(DriverTrackingService trackingService) {
        this.trackingService = trackingService;
    }

    @PostMapping("/order/{orderId}")
    public ResponseEntity<DriverLocationResponse> updateLocation(
            @PathVariable Long orderId,
            @RequestBody DriverLocationRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                trackingService.updateLocation(
                        orderId,
                        authentication.getName(),
                        request
                )
        );
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<DriverLocationResponse> getLocation(
            @PathVariable Long orderId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                trackingService.getLocation(
                        orderId,
                        authentication.getName()
                )
        );
    }
}
