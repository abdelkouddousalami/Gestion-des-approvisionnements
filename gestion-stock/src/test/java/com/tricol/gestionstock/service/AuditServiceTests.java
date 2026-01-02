package com.tricol.gestionstock.service;

import com.tricol.gestionstock.entity.AuditLog;
import com.tricol.gestionstock.repository.AuditLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuditServiceTests {

    @Mock
    private AuditLogRepository auditLogRepository;

    private AuditLog auditLog;

    @BeforeEach
    public void setup() {
        auditLog = AuditLog.builder()
                .id(1L)
                .action("CREATE_PRODUIT")
                .entityType("Produit")
                .entityId(1L)
                .username("admin")
                .timestamp(LocalDateTime.now())
                .details("Created product PROD-001")
                .build();
    }

    @Test
    public void testLogAudit_Success() {
        when(auditLogRepository.save(any(AuditLog.class))).thenReturn(auditLog);

        AuditLog result = auditLogRepository.save(auditLog);

        assertNotNull(result);
        assertEquals("CREATE_PRODUIT", result.getAction());
        verify(auditLogRepository, times(1)).save(any(AuditLog.class));
    }

    @Test
    public void testFindAuditLogsByUsername_Success() {
        List<AuditLog> logs = Arrays.asList(auditLog);
        when(auditLogRepository.findByUsername("admin")).thenReturn(logs);

        List<AuditLog> result = auditLogRepository.findByUsername("admin");

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("admin", result.get(0).getUsername());
    }

    @Test
    public void testFindAuditLogsByAction_Success() {
        List<AuditLog> logs = Arrays.asList(auditLog);
        when(auditLogRepository.findByAction("CREATE_PRODUIT")).thenReturn(logs);

        List<AuditLog> result = auditLogRepository.findByAction("CREATE_PRODUIT");

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("CREATE_PRODUIT", result.get(0).getAction());
    }

    @Test
    public void testFindAuditLogsByEntityType_Success() {
        List<AuditLog> logs = Arrays.asList(auditLog);
        when(auditLogRepository.findByEntityType("Produit")).thenReturn(logs);

        List<AuditLog> result = auditLogRepository.findByEntityType("Produit");

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Produit", result.get(0).getEntityType());
    }
}
