package com.fooddelivery.backend.controller;

import com.fooddelivery.backend.dto.PaymentResponse;
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
    public ResponseEntity<PaymentResponse> createPayment(
            @PathVariable Long orderId,
            Authentication authentication
    ) {
        Payment payment = paymentService.createPayment(
                orderId,
                authentication.getName()
        );

        return ResponseEntity.ok(
                PaymentResponse.fromPayment(payment)
        );
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<PaymentResponse> getPayment(
            @PathVariable Long orderId,
            Authentication authentication
    ) {
        Payment payment = paymentService.getPaymentByOrderId(
                orderId,
                authentication.getName()
        );

        return ResponseEntity.ok(
                PaymentResponse.fromPayment(payment)
        );
    }

    @PutMapping("/{paymentId}/status")
    public ResponseEntity<PaymentResponse> updatePaymentStatus(
            @PathVariable Long paymentId,
            @RequestParam Payment.Status status
    ) {
        Payment payment = paymentService.updatePaymentStatus(
                paymentId,
                status
        );

        return ResponseEntity.ok(
                PaymentResponse.fromPayment(payment)
        );
    }
}
