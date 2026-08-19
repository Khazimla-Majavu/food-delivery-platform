package com.fooddelivery.backend.repository;

import com.fooddelivery.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}