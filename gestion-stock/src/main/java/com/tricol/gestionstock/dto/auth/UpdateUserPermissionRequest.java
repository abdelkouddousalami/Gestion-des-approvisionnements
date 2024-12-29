package com.tricol.gestionstock.dto.auth;

import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateUserPermissionRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Permission ID is required")
    private Long permissionId;

    @NotNull(message = "Granted status is required")
    private Boolean granted;
}
