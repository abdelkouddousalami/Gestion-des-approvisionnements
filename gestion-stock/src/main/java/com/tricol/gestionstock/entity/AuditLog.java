package com.tricol.gestionstock.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs", indexes = {
        @Index(name = "idx_audit_user", columnList = "user_id"),
        @Index(name = "idx_audit_action", columnList = "action"),
        @Index(name = "idx_audit_timestamp", columnList = "timestamp")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserApp user;

    @Column(length = 100)
    private String username; // Stored separately in case user is deleted

    @Column(nullable = false, length = 100)
    private String action; // e.g., "LOGIN", "LOGOUT", "CREATE_COMMANDE", "UPDATE_STOCK"

    @Column(length = 100)
    private String entityType; // e.g., "Commande", "BonSortie", "User"

    @Column
    private Long entityId;

    @Column(columnDefinition = "TEXT")
    private String details; // JSON or plain text with additional details

    @Column(length = 45)
    private String ipAddress;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    @Column(length = 20)
    private String status; // "SUCCESS", "FAILURE", "ERROR"

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
        if (user != null && username == null) {
            username = user.getUsername();
        }
    }
}
