package com.tricol.gestionstock.service;

import com.tricol.gestionstock.dto.auth.LoginRequest;
import com.tricol.gestionstock.dto.auth.AuthResponse;
import com.tricol.gestionstock.dto.auth.RegisterRequest;
import com.tricol.gestionstock.entity.RoleApp;
import com.tricol.gestionstock.entity.UserApp;
import com.tricol.gestionstock.repository.RoleRepository;
import com.tricol.gestionstock.repository.UserRepository;
import com.tricol.gestionstock.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private AuthService authService;

    private UserApp testUser;
    private RoleApp testRole;

    @BeforeEach
    void setUp() {
        testRole = new RoleApp();
        testRole.setId(1L);
        testRole.setName("USER");

        testUser = UserApp.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .password("encodedPassword")
                .firstName("Test")
                .lastName("User")
                .enabled(true)
                .accountNonExpired(true)
                .accountNonLocked(true)
                .credentialsNonExpired(true)
                .roles(new HashSet<>())
                .build();
    }

    @Test
    void testRegisterSuccess() {
        // Given
        RegisterRequest request = RegisterRequest.builder()
                .username("newuser")
                .email("newuser@example.com")
                .password("password123")
                .firstName("New")
                .lastName("User")
                .build();

        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(UserApp.class))).thenReturn(testUser);
        when(jwtTokenProvider.generateToken(any(UserApp.class))).thenReturn("accessToken");
        when(jwtTokenProvider.generateRefreshToken(any(UserApp.class))).thenReturn("refreshToken");

        // When
        AuthResponse response = authService.register(request);

        // Then
        assertNotNull(response);
        assertEquals("accessToken", response.getAccessToken());
        assertEquals("refreshToken", response.getRefreshToken());
        assertEquals(testUser.getId(), response.getUserId());
        assertEquals(testUser.getUsername(), response.getUsername());

        verify(userRepository).existsByUsername("newuser");
        verify(userRepository).existsByEmail("newuser@example.com");
        verify(userRepository).save(any(UserApp.class));
        verify(auditService).logAction(anyString(), eq("REGISTER"), eq("User"), any(), anyString(), eq("SUCCESS"));
    }

    @Test
    void testRegisterUsernameExists() {
        // Given
        RegisterRequest request = RegisterRequest.builder()
                .username("existinguser")
                .email("newuser@example.com")
                .password("password123")
                .firstName("New")
                .lastName("User")
                .build();

        when(userRepository.existsByUsername("existinguser")).thenReturn(true);

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.register(request);
        });

        assertEquals("Username already exists", exception.getMessage());
        verify(userRepository).existsByUsername("existinguser");
        verify(userRepository, never()).save(any(UserApp.class));
    }

    @Test
    void testRegisterEmailExists() {
        // Given
        RegisterRequest request = RegisterRequest.builder()
                .username("newuser")
                .email("existing@example.com")
                .password("password123")
                .firstName("New")
                .lastName("User")
                .build();

        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.register(request);
        });

        assertEquals("Email already exists", exception.getMessage());
        verify(userRepository).existsByEmail("existing@example.com");
        verify(userRepository, never()).save(any(UserApp.class));
    }

    @Test
    void testLoginSuccess() {
        // Given
        LoginRequest request = new LoginRequest("testuser", "password123");

        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(jwtTokenProvider.generateToken(any(Authentication.class))).thenReturn("accessToken");
        when(jwtTokenProvider.generateRefreshToken(any(UserApp.class))).thenReturn("refreshToken");

        // When
        AuthResponse response = authService.login(request);

        // Then
        assertNotNull(response);
        assertEquals("accessToken", response.getAccessToken());
        assertEquals("refreshToken", response.getRefreshToken());
        assertEquals(testUser.getId(), response.getUserId());
        assertEquals(testUser.getUsername(), response.getUsername());

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userRepository).findByUsername("testuser");
        verify(userRepository).save(testUser);
        verify(auditService).logAction(anyString(), eq("LOGIN"), eq("User"), any(), anyString(), eq("SUCCESS"));
    }

    @Test
    void testLoginUserNotFound() {
        // Given
        LoginRequest request = new LoginRequest("nonexistent", "password123");

        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.login(request);
        });

        assertEquals("User not found", exception.getMessage());
        verify(userRepository).findByUsername("nonexistent");
    }

    @Test
    void testLogout() {
        // Given
        String username = "testuser";

        // When
        authService.logout(username);

        // Then
        verify(auditService).logAction(eq(username), eq("LOGOUT"), eq("User"), isNull(), anyString(), eq("SUCCESS"));
    }
}
