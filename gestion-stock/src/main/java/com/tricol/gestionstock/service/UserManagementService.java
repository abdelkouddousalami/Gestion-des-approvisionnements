package com.tricol.gestionstock.service;

import com.tricol.gestionstock.dto.auth.*;
import com.tricol.gestionstock.entity.*;
import com.tricol.gestionstock.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserManagementService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserPermissionRepository userPermissionRepository;
    private final AuditService auditService;

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long userId) {
        UserApp user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return mapToUserResponse(user);
    }

    @Transactional
    public UserResponse assignRoleToUser(AssignRoleRequest request, String adminUsername) {
        UserApp user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        RoleApp role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        user.getRoles().add(role);
        userRepository.save(user);

        // Log action
        auditService.logAction(adminUsername, "ASSIGN_ROLE", "User", user.getId(),
                String.format("Assigned role %s to user %s", role.getName(), user.getUsername()), "SUCCESS");

        return mapToUserResponse(user);
    }

    @Transactional
    public UserResponse removeRoleFromUser(Long userId, Long roleId, String adminUsername) {
        UserApp user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        RoleApp role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        user.getRoles().remove(role);
        userRepository.save(user);

        // Log action
        auditService.logAction(adminUsername, "REMOVE_ROLE", "User", user.getId(),
                String.format("Removed role %s from user %s", role.getName(), user.getUsername()), "SUCCESS");

        return mapToUserResponse(user);
    }

    @Transactional
    public void updateUserPermission(UpdateUserPermissionRequest request, String adminUsername) {
        UserApp user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Permission permission = permissionRepository.findById(request.getPermissionId())
                .orElseThrow(() -> new RuntimeException("Permission not found"));

        // Check if user permission already exists
        UserPermission userPermission = userPermissionRepository
                .findByUserAndPermission(user, permission)
                .orElse(UserPermission.builder()
                        .user(user)
                        .permission(permission)
                        .build());

        userPermission.setGranted(request.getGranted());
        userPermission.setAssignedBy(adminUsername);
        userPermissionRepository.save(userPermission);

        // Log action
        String action = request.getGranted() ? "GRANT_PERMISSION" : "REVOKE_PERMISSION";
        auditService.logAction(adminUsername, action, "UserPermission", userPermission.getId(),
                String.format("%s permission %s for user %s", 
                        request.getGranted() ? "Granted" : "Revoked", 
                        permission.getName(), 
                        user.getUsername()), 
                "SUCCESS");
    }

    @Transactional
    public void enableUser(Long userId, String adminUsername) {
        UserApp user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEnabled(true);
        userRepository.save(user);

        auditService.logAction(adminUsername, "ENABLE_USER", "User", user.getId(),
                String.format("Enabled user %s", user.getUsername()), "SUCCESS");
    }

    @Transactional
    public void disableUser(Long userId, String adminUsername) {
        UserApp user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEnabled(false);
        userRepository.save(user);

        auditService.logAction(adminUsername, "DISABLE_USER", "User", user.getId(),
                String.format("Disabled user %s", user.getUsername()), "SUCCESS");
    }

    @Transactional(readOnly = true)
    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(this::mapToRoleResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PermissionResponse> getAllPermissions() {
        return permissionRepository.findAll().stream()
                .map(this::mapToPermissionResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PermissionResponse> getPermissionsByCategory(String category) {
        return permissionRepository.findByCategory(category).stream()
                .map(this::mapToPermissionResponse)
                .collect(Collectors.toList());
    }

    private UserResponse mapToUserResponse(UserApp user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .enabled(user.getEnabled())
                .createdAt(user.getCreatedAt())
                .lastLoginAt(user.getLastLoginAt())
                .roles(user.getRoles().stream().map(RoleApp::getName).collect(Collectors.toSet()))
                .permissions(user.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .filter(auth -> !auth.startsWith("ROLE_"))
                        .collect(Collectors.toSet()))
                .build();
    }

    private RoleResponse mapToRoleResponse(RoleApp role) {
        return RoleResponse.builder()
                .id(role.getId())
                .name(role.getName())
                .description(role.getDescription())
                .permissions(role.getPermissions().stream()
                        .map(this::mapToPermissionResponse)
                        .collect(Collectors.toSet()))
                .build();
    }

    private PermissionResponse mapToPermissionResponse(Permission permission) {
        return PermissionResponse.builder()
                .id(permission.getId())
                .name(permission.getName())
                .description(permission.getDescription())
                .category(permission.getCategory())
                .build();
    }
}
