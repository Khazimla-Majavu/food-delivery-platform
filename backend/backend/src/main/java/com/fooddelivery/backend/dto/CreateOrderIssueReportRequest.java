package com.fooddelivery.backend.dto;

import com.fooddelivery.backend.model.OrderIssueReport;

public record CreateOrderIssueReportRequest(
    OrderIssueReport.Category category,
    String description
) {}
