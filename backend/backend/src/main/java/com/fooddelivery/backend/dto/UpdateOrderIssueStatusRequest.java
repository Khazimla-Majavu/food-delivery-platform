package com.fooddelivery.backend.dto;

import com.fooddelivery.backend.model.OrderIssueReport;

public record UpdateOrderIssueStatusRequest(
    OrderIssueReport.Status status
) {}
