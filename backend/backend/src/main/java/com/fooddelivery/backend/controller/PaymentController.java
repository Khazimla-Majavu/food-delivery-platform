package com.fooddelivery.backend.controller;

import com.fooddelivery.backend.model.Payment;
import com.fooddelivery.backend.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/order/{orderId}")
    public ResponseEntity<Payment> createPayment(
            @PathVariable Long orderId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                paymentService.createPayment(
                        orderId,
                        authentication.getName()
                )
        );
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<Payment> getPayment(
            @PathVariable Long orderId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                paymentService.getPaymentByOrderId(
                        orderId,
                        authentication.getName()
                )
        );
    }
}
