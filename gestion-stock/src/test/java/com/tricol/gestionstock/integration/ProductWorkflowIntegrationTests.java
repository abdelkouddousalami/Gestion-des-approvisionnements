package com.tricol.gestionstock.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tricol.gestionstock.dto.produit.CreateProduitDTO;
import com.tricol.gestionstock.repository.ProduitRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class ProductWorkflowIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProduitRepository produitRepository;

    @BeforeEach
    public void setup() {
        produitRepository.deleteAll();
    }

    @Test
    public void testCompleteProductWorkflow() throws Exception {
        CreateProduitDTO createDTO = CreateProduitDTO.builder()
                .reference("PROD-WORKFLOW")
                .nom("Workflow Product")
                .description("Integration Test")
                .prixUnitaire(new BigDecimal("500.00"))
                .categorie("Test")
                .stockInitial(50)
                .pointDeCommande(10)
                .uniteMesure("unité")
                .build();

        String productJson = mockMvc.perform(post("/api/produits")
                        .with(jwt().authorities(() -> "write"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.reference").value("PROD-WORKFLOW"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        Long productId = objectMapper.readTree(productJson).get("id").asLong();

        mockMvc.perform(get("/api/produits/" + productId)
                        .with(jwt().authorities(() -> "read")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reference").value("PROD-WORKFLOW"));

        mockMvc.perform(get("/api/produits")
                        .with(jwt().authorities(() -> "read")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].reference").value("PROD-WORKFLOW"));
    }

    @Test
    public void testUnauthorizedAccessDenied() throws Exception {
        mockMvc.perform(get("/api/produits"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void testInsufficientPermissionsDenied() throws Exception {
        CreateProduitDTO createDTO = CreateProduitDTO.builder()
                .reference("PROD-DENIED")
                .nom("Denied Product")
                .prixUnitaire(new BigDecimal("100.00"))
                .categorie("Test")
                .stockInitial(10)
                .pointDeCommande(5)
                .uniteMesure("unité")
                .build();

        mockMvc.perform(post("/api/produits")
                        .with(jwt().authorities(() -> "read"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDTO)))
                .andExpect(status().isForbidden());
    }
}
