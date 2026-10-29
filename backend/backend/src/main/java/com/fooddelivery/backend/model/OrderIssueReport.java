package com.fooddelivery.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "order_issue_reports",
    indexes = {
        @Index(name = "idx_issue_order", columnList = "order_id"),
        @Index(name = "idx_issue_status", columnList = "status")
    }
)
public class OrderIssueReport {

    public enum Category {
        MISSING_ITEMS,
        WRONG_ORDER,
        LATE_DELIVERY,
        RESTAURANT_ISSUE,
        DELIVERY_ADDRESS,
        PAYMENT_ISSUE,
        DRIVER_CONDUCT,
        CUSTOMER_CONDUCT,
        SAFETY_CONCERN,
        OTHER
    }

    public enum Status {
        OPEN,
        IN_REVIEW,
        RESOLVED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_user_id")
    private User reportedUser;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private Category category;

    @Column(nullable = false, length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.OPEN;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public OrderIssueReport() {}

    public Long getId() { return id; }
    public Order getOrder() { return order; }
    public User getReporter() { return reporter; }
    public User getReportedUser() { return reportedUser; }
    public Category getCategory() { return category; }
    public String getDescription() { return description; }
    public Status getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setOrder(Order order) { this.order = order; }
    public void setReporter(User reporter) { this.reporter = reporter; }
    public void setReportedUser(User reportedUser) {
        this.reportedUser = reportedUser;
    }
    public void setCategory(Category category) { this.category = category; }
    public void setDescription(String description) {
        this.description = description;
    }
    public void setStatus(Status status) { this.status = status; }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
