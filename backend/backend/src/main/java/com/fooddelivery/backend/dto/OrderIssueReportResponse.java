package com.fooddelivery.backend.dto;

import com.fooddelivery.backend.model.OrderIssueReport;
import java.time.LocalDateTime;

public record OrderIssueReportResponse(
    Long id,
    Long orderId,
    Long reporterId,
    String reporterName,
    String reporterRole,
    Long reportedUserId,
    String category,
    String description,
    String status,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static OrderIssueReportResponse from(
            OrderIssueReport report
    ) {
        return new OrderIssueReportResponse(
            report.getId(),
            report.getOrder().getId(),
            report.getReporter().getId(),
            report.getReporter().getName(),
            report.getReporter().getRole().name(),
            report.getReportedUser() == null
                ? null : report.getReportedUser().getId(),
            report.getCategory().name(),
            report.getDescription(),
            report.getStatus().name(),
            report.getCreatedAt(),
            report.getUpdatedAt()
        );
    }
}
