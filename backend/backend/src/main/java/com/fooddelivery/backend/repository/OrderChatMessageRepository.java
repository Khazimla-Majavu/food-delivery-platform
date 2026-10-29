package com.fooddelivery.backend.repository;

import com.fooddelivery.backend.model.OrderChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderChatMessageRepository
        extends JpaRepository<OrderChatMessage, Long> {

    List<OrderChatMessage> findByOrderIdOrderByCreatedAtAscIdAsc(
        Long orderId
    );
}
