package com.fooddelivery.backend.service;

import com.fooddelivery.backend.model.Order;
import com.fooddelivery.backend.model.Payment;
import com.fooddelivery.backend.model.User;
import com.fooddelivery.backend.repository.OrderRepository;
import com.fooddelivery.backend.repository.PaymentRepository;
import com.fooddelivery.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public PaymentService(
            PaymentRepository paymentRepository,
            OrderRepository orderRepository,
            UserRepository userRepository
    ) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    public Payment createPayment(
            Long orderId,
            String customerEmail
    ) {

        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        if (customer.getRole() != User.Role.CUSTOMER) {
            throw new RuntimeException("User is not a customer");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getCustomer().getId().equals(customer.getId())) {
            throw new RuntimeException(
                    "You are not authorized to pay for this order"
            );
        }

        if (paymentRepository.findByOrderId(orderId).isPresent()) {
            throw new RuntimeException(
                    "Payment already exists for this order"
            );
        }

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(order.getTotalAmount());
        payment.setStatus(Payment.Status.PENDING);
        payment.setCreatedAt(LocalDateTime.now());

        return paymentRepository.save(payment);
    }

    public Payment getPaymentByOrderId(
            Long orderId,
            String customerEmail
    ) {

        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        if (customer.getRole() != User.Role.CUSTOMER) {
            throw new RuntimeException("User is not a customer");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getCustomer().getId().equals(customer.getId())) {
            throw new RuntimeException(
                    "You are not authorized to view this payment"
            );
        }

        return paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException(
                        "Payment not found for this order"
                ));
    }

    public Payment updatePaymentStatus(
            Long paymentId,
            Payment.Status status
    ) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setStatus(status);

        return paymentRepository.save(payment);
    }
}
