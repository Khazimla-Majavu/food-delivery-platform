package com.fooddelivery.backend.service;

import com.fooddelivery.backend.dto.OrderChatMessageResponse;
import com.fooddelivery.backend.dto.SendChatMessageRequest;
import com.fooddelivery.backend.model.Order;
import com.fooddelivery.backend.model.OrderChatMessage;
import com.fooddelivery.backend.model.User;
import com.fooddelivery.backend.repository.OrderChatMessageRepository;
import com.fooddelivery.backend.repository.OrderRepository;
import com.fooddelivery.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderChatService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final OrderChatMessageRepository messageRepository;

    public OrderChatService(
            OrderRepository orderRepository,
            UserRepository userRepository,
            OrderChatMessageRepository messageRepository
    ) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.messageRepository = messageRepository;
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "User not found"
                ));
    }

    private Order findOrder(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Order not found"
                ));
    }

    private void requireParticipant(Order order, User user) {
        boolean customer = order.getCustomer().getId().equals(user.getId());
        boolean driver = order.getDriver() != null
                && order.getDriver().getId().equals(user.getId());

        if (!customer && !driver) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot access this order's chat"
            );
        }

        if (order.getDriver() == null) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Chat becomes available when a driver is assigned"
            );
        }

        if (user.getRole() != User.Role.CUSTOMER
                && user.getRole() != User.Role.DRIVER) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
    }

    @Transactional(readOnly = true)
    public List<OrderChatMessageResponse> getMessages(
            Long orderId,
            String email
    ) {
        User user = findUser(email);
        Order order = findOrder(orderId);
        requireParticipant(order, user);

        return messageRepository
                .findByOrderIdOrderByCreatedAtAscIdAsc(orderId)
                .stream()
                .map(OrderChatMessageResponse::from)
                .toList();
    }

    @Transactional
    public OrderChatMessageResponse sendMessage(
            Long orderId,
            SendChatMessageRequest request,
            String email
    ) {
        User user = findUser(email);
        Order order = findOrder(orderId);
        requireParticipant(order, user);

        if (order.getStatus() != Order.Status.OUT_FOR_DELIVERY) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Messages can only be sent while the order is out for delivery"
            );
        }

        String message = request == null || request.message() == null
                ? "" : request.message().trim();

        if (message.isEmpty() || message.length() > 2000) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Message must contain between 1 and 2000 characters"
            );
        }

        OrderChatMessage entity = new OrderChatMessage();
        entity.setOrder(order);
        entity.setSender(user);
        entity.setMessage(message);
        entity.setCreatedAt(LocalDateTime.now());

        return OrderChatMessageResponse.from(
                messageRepository.save(entity)
        );
    }
}
