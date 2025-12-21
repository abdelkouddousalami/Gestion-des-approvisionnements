package com.tricol.gestionstock.security;

import com.tricol.gestionstock.entity.RoleApp;
import com.tricol.gestionstock.entity.UserApp;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;
    private String jwtSecret = "mySecretKeyForJWTTokenGenerationThatIsAtLeast256BitsLongForHS256Algorithm";
    private long jwtExpirationMs = 86400000L; // 24 hours

    @BeforeEach
    void setUp() {
        jwtTokenProvider = new JwtTokenProvider();
        ReflectionTestUtils.setField(jwtTokenProvider, "jwtSecret", jwtSecret);
        ReflectionTestUtils.setField(jwtTokenProvider, "jwtExpirationMs", jwtExpirationMs);
        ReflectionTestUtils.setField(jwtTokenProvider, "refreshExpirationMs", 604800000L);
    }

    @Test
    void testGenerateToken() {
        // Given
        UserApp user = createTestUser();

        // When
        String token = jwtTokenProvider.generateToken(user);

        // Then
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void testGetUsernameFromToken() {
        // Given
        UserApp user = createTestUser();
        String token = jwtTokenProvider.generateToken(user);

        // When
        String username = jwtTokenProvider.getUsernameFromToken(token);

        // Then
        assertEquals("testuser", username);
    }

    @Test
    void testValidateToken() {
        // Given
        UserApp user = createTestUser();
        String token = jwtTokenProvider.generateToken(user);

        // When
        boolean isValid = jwtTokenProvider.validateToken(token);

        // Then
        assertTrue(isValid);
    }

    @Test
    void testValidateInvalidToken() {
        // Given
        String invalidToken = "invalid.token.here";

        // When
        boolean isValid = jwtTokenProvider.validateToken(invalidToken);

        // Then
        assertFalse(isValid);
    }

    @Test
    void testGenerateRefreshToken() {
        // Given
        UserApp user = createTestUser();

        // When
        String refreshToken = jwtTokenProvider.generateRefreshToken(user);

        // Then
        assertNotNull(refreshToken);
        assertFalse(refreshToken.isEmpty());
        assertTrue(jwtTokenProvider.validateToken(refreshToken));
    }

    @Test
    void testTokenContainsCorrectClaims() {
        // Given
        UserApp user = createTestUser();
        String token = jwtTokenProvider.generateToken(user);

        // When
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        // Then
        assertEquals("testuser", claims.getSubject());
        assertNotNull(claims.get("authorities"));
    }

    private UserApp createTestUser() {
        RoleApp role = new RoleApp();
        role.setId(1L);
        role.setName("USER");

        Set<RoleApp> roles = new HashSet<>();
        roles.add(role);

        return UserApp.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .password("password")
                .roles(roles)
                .enabled(true)
                .accountNonExpired(true)
                .accountNonLocked(true)
                .credentialsNonExpired(true)
                .build();
    }
}
