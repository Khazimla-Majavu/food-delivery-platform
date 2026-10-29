package com.fooddelivery.backend.service;

import com.fooddelivery.backend.dto.CreateOrderIssueReportRequest;
import com.fooddelivery.backend.dto.OrderIssueReportResponse;
import com.fooddelivery.backend.dto.UpdateOrderIssueStatusRequest;
import com.fooddelivery.backend.model.Order;
import com.fooddelivery.backend.model.OrderIssueReport;
import com.fooddelivery.backend.model.User;
import com.fooddelivery.backend.repository.OrderIssueReportRepository;
import com.fooddelivery.backend.repository.OrderRepository;
import com.fooddelivery.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderIssueReportService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final OrderIssueReportRepository reportRepository;

    public OrderIssueReportService(
            OrderRepository orderRepository,
            UserRepository userRepository,
            OrderIssueReportRepository reportRepository
    ) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.reportRepository = reportRepository;
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

    private OrderIssueReport findReport(Long reportId) {
        return reportRepository.findById(reportId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Report not found"
                ));
    }

    private void requireAdmin(User user) {
        if (user.getRole() != User.Role.ADMIN) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Admin access required"
            );
        }
    }

    private void requireOrderParticipant(Order order, User user) {
        boolean customer = order.getCustomer().getId().equals(user.getId());
        boolean driver = order.getDriver() != null
                && order.getDriver().getId().equals(user.getId());

        if ((!customer && !driver)
                || (user.getRole() != User.Role.CUSTOMER
                && user.getRole() != User.Role.DRIVER)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only report issues for your own orders"
            );
        }
    }

    @Transactional
    public OrderIssueReportResponse createReport(
            Long orderId,
            CreateOrderIssueReportRequest request,
            String email
    ) {
        User reporter = findUser(email);
        Order order = findOrder(orderId);
        requireOrderParticipant(order, reporter);

        if (request == null || request.category() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Select a report category"
            );
        }

        String description = request.description() == null
                ? "" : request.description().trim();

        if (description.isEmpty() || description.length() > 2000) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Description must contain between 1 and 2000 characters"
            );
        }

        OrderIssueReport.Category category = request.category();
        User reportedUser = null;

        if (category == OrderIssueReport.Category.DRIVER_CONDUCT) {
            if (reporter.getRole() != User.Role.CUSTOMER
                    || order.getDriver() == null) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Only the customer can report the assigned driver"
                );
            }
            reportedUser = order.getDriver();
        }

        if (category == OrderIssueReport.Category.CUSTOMER_CONDUCT) {
            if (reporter.getRole() != User.Role.DRIVER
                    || order.getDriver() == null
                    || !order.getDriver().getId().equals(reporter.getId())) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Only the assigned driver can report the customer"
                );
            }
            reportedUser = order.getCustomer();
        }

        LocalDateTime now = LocalDateTime.now();

        OrderIssueReport report = new OrderIssueReport();
        report.setOrder(order);
        report.setReporter(reporter);
        report.setReportedUser(reportedUser);
        report.setCategory(category);
        report.setDescription(description);
        report.setStatus(OrderIssueReport.Status.OPEN);
        report.setCreatedAt(now);
        report.setUpdatedAt(now);

        return OrderIssueReportResponse.from(
                reportRepository.save(report)
        );
    }

    @Transactional(readOnly = true)
    public List<OrderIssueReportResponse> getMyReports(String email) {
        User user = findUser(email);

        if (user.getRole() != User.Role.CUSTOMER
                && user.getRole() != User.Role.DRIVER) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Customer or driver access required"
            );
        }

        return reportRepository
                .findByReporterIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(OrderIssueReportResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<OrderIssueReportResponse> getAllReports(String email) {
        requireAdmin(findUser(email));

        return reportRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(OrderIssueReportResponse::from)
                .toList();
    }

    @Transactional
    public OrderIssueReportResponse updateStatus(
            Long reportId,
            UpdateOrderIssueStatusRequest request,
            String email
    ) {
        requireAdmin(findUser(email));

        if (request == null || request.status() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Select a report status"
            );
        }

        OrderIssueReport report = findReport(reportId);
        report.setStatus(request.status());
        report.setUpdatedAt(LocalDateTime.now());

        return OrderIssueReportResponse.from(
                reportRepository.save(report)
        );
    }
}
