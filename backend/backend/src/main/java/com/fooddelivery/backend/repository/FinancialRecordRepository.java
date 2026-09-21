package com.fooddelivery.backend.repository;

import com.fooddelivery.backend.model.FinancialRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FinancialRecordRepository
        extends JpaRepository<FinancialRecord, Long> {

    Optional<FinancialRecord> findByOrderId(Long orderId);
}
