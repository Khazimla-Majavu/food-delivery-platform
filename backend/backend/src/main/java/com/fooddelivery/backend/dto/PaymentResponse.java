package com.fooddelivery.backend.dto;

import com.fooddelivery.backend.model.Payment;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentResponse {

    private Long id;
    private Long orderId;
    private BigDecimal amount;
    private Payment.Status status;
    private LocalDateTime createdAt;

    public PaymentResponse(
            Long id,
            Long orderId,
            BigDecimal amount,
            Payment.Status status,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.orderId = orderId;
        this.amount = amount;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public Long getOrderId() {
        return orderId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public Payment.Status getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public static PaymentResponse fromPayment(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getOrder().getId(),
                payment.getAmount(),
                payment.getStatus(),
                payment.getCreatedAt()
        );
    }
}
