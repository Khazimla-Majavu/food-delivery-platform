package com.fooddelivery.backend.repository;

import com.fooddelivery.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByCustomerId(Long customerId);

    List<Order> findByRestaurantId(Long restaurantId);

    List<Order> findByDriverId(Long driverId);

    List<Order> findByStatus(Order.Status status);
}