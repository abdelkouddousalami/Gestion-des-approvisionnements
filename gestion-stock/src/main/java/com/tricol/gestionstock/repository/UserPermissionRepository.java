package com.tricol.gestionstock.repository;

import com.tricol.gestionstock.entity.UserApp;
import com.tricol.gestionstock.entity.Permission;
import com.tricol.gestionstock.entity.UserPermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserPermissionRepository extends JpaRepository<UserPermission, Long> {

    List<UserPermission> findByUser(UserApp user);

    List<UserPermission> findByUserId(Long userId);

    Optional<UserPermission> findByUserAndPermission(UserApp user, Permission permission);

    @Query("SELECT up FROM UserPermission up WHERE up.user.id = :userId AND up.permission.id = :permissionId")
    Optional<UserPermission> findByUserIdAndPermissionId(@Param("userId") Long userId, @Param("permissionId") Long permissionId);

    void deleteByUserAndPermission(UserApp user, Permission permission);
}
