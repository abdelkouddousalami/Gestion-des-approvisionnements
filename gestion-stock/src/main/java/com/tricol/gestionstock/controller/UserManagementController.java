package com.tricol.gestionstock.controller;

import com.tricol.gestionstock.dto.auth.*;
import com.tricol.gestionstock.service.UserManagementService;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserManagementController {

    private final UserManagementService userManagementService;

    @GetMapping
    @PreAuthorize("hasAuthority('VIEW_USERS')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userManagementService.getAllUsers());
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasAuthority('VIEW_USERS')")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long userId) {
        return ResponseEntity.ok(userManagementService.getUserById(userId));
    }

    @PostMapping("/assign-role")
    @PreAuthorize("hasAuthority('MANAGE_ROLES')")
    public ResponseEntity<UserResponse> assignRole(
            @Valid @RequestBody AssignRoleRequest request,
            Authentication authentication) {
        String adminUsername = authentication.getName();
        return ResponseEntity.ok(userManagementService.assignRoleToUser(request, adminUsername));
    }

    @DeleteMapping("/{userId}/roles/{roleId}")
    @PreAuthorize("hasAuthority('MANAGE_ROLES')")
    public ResponseEntity<UserResponse> removeRole(
            @PathVariable Long userId,
            @PathVariable Long roleId,
            Authentication authentication) {
        String adminUsername = authentication.getName();
        return ResponseEntity.ok(userManagementService.removeRoleFromUser(userId, roleId, adminUsername));
    }

    @PutMapping("/permissions")
    @PreAuthorize("hasAuthority('MANAGE_PERMISSIONS')")
    public ResponseEntity<String> updateUserPermission(
            @Valid @RequestBody UpdateUserPermissionRequest request,
            Authentication authentication) {
        String adminUsername = authentication.getName();
        userManagementService.updateUserPermission(request, adminUsername);
        return ResponseEntity.ok("User permission updated successfully");
    }

    @PutMapping("/{userId}/enable")
    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    public ResponseEntity<String> enableUser(
            @PathVariable Long userId,
            Authentication authentication) {
        String adminUsername = authentication.getName();
        userManagementService.enableUser(userId, adminUsername);
        return ResponseEntity.ok("User enabled successfully");
    }

    @PutMapping("/{userId}/disable")
    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    public ResponseEntity<String> disableUser(
            @PathVariable Long userId,
            Authentication authentication) {
        String adminUsername = authentication.getName();
        userManagementService.disableUser(userId, adminUsername);
        return ResponseEntity.ok("User disabled successfully");
    }

    @GetMapping("/roles")
    @PreAuthorize("hasAuthority('VIEW_ROLES')")
    public ResponseEntity<List<RoleResponse>> getAllRoles() {
        return ResponseEntity.ok(userManagementService.getAllRoles());
    }

    @GetMapping("/permissions")
    @PreAuthorize("hasAuthority('VIEW_PERMISSIONS')")
    public ResponseEntity<List<PermissionResponse>> getAllPermissions() {
        return ResponseEntity.ok(userManagementService.getAllPermissions());
    }

    @GetMapping("/permissions/category/{category}")
    @PreAuthorize("hasAuthority('VIEW_PERMISSIONS')")
    public ResponseEntity<List<PermissionResponse>> getPermissionsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(userManagementService.getPermissionsByCategory(category));
    }
}
