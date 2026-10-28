package com.fooddelivery.backend.model;

import jakarta.persistence.*;
import jakarta.persistence.Column;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    private String phone;

    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    // Existing database rows default to verified; public registration explicitly sets false.
    @Column(name = "email_verified", nullable = false, columnDefinition = "boolean default true")
    private boolean emailVerified = true;

    @Column(name = "email_verification_token_hash")
    private String emailVerificationTokenHash;

    @Column(name = "email_verification_expires_at")
    private java.time.Instant emailVerificationExpiresAt;

    public enum Role {
        CUSTOMER,
        DRIVER,
        RESTAURANT,
        ADMIN
    }

    public User() {
    }

    public boolean isEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public String getEmailVerificationTokenHash() {
        return emailVerificationTokenHash;
    }

    public void setEmailVerificationTokenHash(String tokenHash) {
        this.emailVerificationTokenHash = tokenHash;
    }

    public java.time.Instant getEmailVerificationExpiresAt() {
        return emailVerificationExpiresAt;
    }

    public void setEmailVerificationExpiresAt(java.time.Instant expiresAt) {
        this.emailVerificationExpiresAt = expiresAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}