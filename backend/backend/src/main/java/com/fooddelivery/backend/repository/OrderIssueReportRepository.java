package com.fooddelivery.backend.repository;

import com.fooddelivery.backend.model.OrderIssueReport;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderIssueReportRepository
        extends JpaRepository<OrderIssueReport, Long> {

    List<OrderIssueReport> findAllByOrderByCreatedAtDesc();

    List<OrderIssueReport> findByReporterIdOrderByCreatedAtDesc(
        Long reporterId
    );
}
