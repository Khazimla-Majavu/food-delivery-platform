package com.fooddelivery.backend.controller;

import com.fooddelivery.backend.dto.CreateOrderIssueReportRequest;
import com.fooddelivery.backend.dto.OrderIssueReportResponse;
import com.fooddelivery.backend.dto.UpdateOrderIssueStatusRequest;
import com.fooddelivery.backend.service.OrderIssueReportService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class OrderIssueReportController {

    private final OrderIssueReportService reportService;

    public OrderIssueReportController(OrderIssueReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping("/api/orders/{orderId}/reports")
    public OrderIssueReportResponse createReport(
            @PathVariable Long orderId,
            @RequestBody CreateOrderIssueReportRequest request,
            Authentication authentication
    ) {
        return reportService.createReport(
                orderId, request, authentication.getName()
        );
    }

    @GetMapping("/api/order-issues/mine")
    public List<OrderIssueReportResponse> getMyReports(
            Authentication authentication
    ) {
        return reportService.getMyReports(authentication.getName());
    }

    @GetMapping("/api/order-issues/admin/all")
    public List<OrderIssueReportResponse> getAllReports(
            Authentication authentication
    ) {
        return reportService.getAllReports(authentication.getName());
    }

    @PutMapping("/api/order-issues/admin/{reportId}/status")
    public OrderIssueReportResponse updateStatus(
            @PathVariable Long reportId,
            @RequestBody UpdateOrderIssueStatusRequest request,
            Authentication authentication
    ) {
        return reportService.updateStatus(
                reportId, request, authentication.getName()
        );
    }
}
