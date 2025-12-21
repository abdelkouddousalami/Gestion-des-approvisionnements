package com.tricol.gestionstock.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "permissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Permission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(length = 50)
    private String category; // e.g., "FOURNISSEUR", "COMMANDE", "STOCK", "BON_SORTIE"

    @ManyToMany(mappedBy = "permissions")
    private Set<RoleApp> roles = new HashSet<>();

    @OneToMany(mappedBy = "permission")
    private Set<UserPermission> userPermissions = new HashSet<>();

    public Permission(String name, String description, String category) {
        this.name = name;
        this.description = description;
        this.category = category;
    }
}
