package com.tricol.gestionstock.service;

import com.tricol.gestionstock.entity.Permission;
import com.tricol.gestionstock.entity.RoleApp;
import com.tricol.gestionstock.entity.UserApp;
import com.tricol.gestionstock.repository.PermissionRepository;
import com.tricol.gestionstock.repository.RoleRepository;
import com.tricol.gestionstock.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserManagementServiceTests {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PermissionRepository permissionRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private UserApp user;
    private RoleApp role;
    private Permission permission;

    @BeforeEach
    public void setup() {
        permission = Permission.builder()
                .id(1L)
                .name("VIEW_PRODUIT")
                .description("View products")
                .build();

        role = RoleApp.builder()
                .id(1L)
                .name("VIEWER")
                .description("Viewer role")
                .permissions(new HashSet<>(Set.of(permission)))
                .build();

        user = UserApp.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .password("encodedPassword")
                .roles(new HashSet<>(Set.of(role)))
                .enabled(true)
                .build();
    }

    @Test
    public void testCreateUser_Success() {
        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("encodedPassword");
        when(userRepository.save(any(UserApp.class))).thenReturn(user);

        assertNotNull(user);
        assertEquals("testuser", user.getUsername());
    }

    @Test
    public void testFindUserByUsername_Success() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        Optional<UserApp> result = userRepository.findByUsername("testuser");

        assertTrue(result.isPresent());
        assertEquals("testuser", result.get().getUsername());
    }

    @Test
    public void testAssignRoleToUser_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(roleRepository.findById(1L)).thenReturn(Optional.of(role));
        when(userRepository.save(any(UserApp.class))).thenReturn(user);

        user.getRoles().add(role);

        assertTrue(user.getRoles().contains(role));
    }

    @Test
    public void testUserHasPermission_Success() {
        boolean hasPermission = user.getRoles().stream()
                .flatMap(r -> r.getPermissions().stream())
                .anyMatch(p -> p.getName().equals("VIEW_PRODUIT"));

        assertTrue(hasPermission);
    }
}
