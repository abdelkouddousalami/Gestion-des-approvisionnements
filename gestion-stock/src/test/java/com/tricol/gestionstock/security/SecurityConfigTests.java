package com.tricol.gestionstock.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class SecurityConfigTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testPublicEndpointsAccessible() throws Exception {
        mockMvc.perform(get("/api/auth/login"))
                .andExpect(status().isMethodNotAllowed());
    }

    @Test
    public void testProtectedEndpointsRequireAuth() throws Exception {
        mockMvc.perform(get("/api/produits"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void testSwaggerAccessible() throws Exception {
        mockMvc.perform(get("/swagger-ui.html"))
                .andExpect(status().isFound());
    }

    @Test
    public void testActuatorAccessible() throws Exception {
        mockMvc.perform(get("/actuator/health"))
                .andExpect(status().isOk());
    }
}
