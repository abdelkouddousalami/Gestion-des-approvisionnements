package com.tricol.gestionstock.entity;

import javax.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_permissions", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "permission_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPermission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserApp user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "permission_id", nullable = false)
    private Permission permission;

    @Column(nullable = false)
    @Builder.Default
    private boolean granted = true; // true = granted, false = denied

    @Column
    private LocalDateTime assignedAt;

    @Column(length = 100)
    private String assignedBy; // username of admin who assigned/modified this permission

    @PrePersist
    protected void onCreate() {
        assignedAt = LocalDateTime.now();
    }

    public UserPermission(UserApp user, Permission permission, boolean granted, String assignedBy) {
        this.user = user;
        this.permission = permission;
        this.granted = granted;
        this.assignedBy = assignedBy;
    }
}
