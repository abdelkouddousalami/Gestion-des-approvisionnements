package com.tricol.gestionstock.oauth2;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tricol.gestionstock.dto.produit.CreateProduitDTO;
import com.tricol.gestionstock.entity.Produit;
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
public class OAuth2ResourceServerTests {

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
    public void testListProductWithPermissionRead() throws Exception {
        Produit produit = Produit.builder()
                .reference("PROD-001")
                .nom("Test Product")
                .description("Test Description")
                .prixUnitaire(new BigDecimal("100.00"))
                .categorie("Test")
                .stockActuel(10)
                .pointDeCommande(5)
                .uniteMesure("unité")
                .build();
        produitRepository.save(produit);

        mockMvc.perform(get("/api/produits")
                        .with(jwt().authorities(() -> "read")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    public void testListProductWithPermissionReadEmptyList() throws Exception {
        mockMvc.perform(get("/api/produits")
                        .with(jwt().authorities(() -> "read")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    public void testProductWithPermissionRead() throws Exception {
        Produit produit = Produit.builder()
                .reference("PROD-002")
                .nom("Test Product 2")
                .description("Test Description 2")
                .prixUnitaire(new BigDecimal("150.00"))
                .categorie("Test")
                .stockActuel(20)
                .pointDeCommande(10)
                .uniteMesure("unité")
                .build();
        Produit saved = produitRepository.save(produit);

        mockMvc.perform(get("/api/produits/" + saved.getId())
                        .with(jwt().authorities(() -> "read")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reference").value("PROD-002"))
                .andExpect(jsonPath("$.nom").value("Test Product 2"));
    }

    @Test
    public void testAddProductWithPermissionWrite() throws Exception {
        CreateProduitDTO createDTO = CreateProduitDTO.builder()
                .reference("PROD-003")
                .nom("New Product")
                .description("New Description")
                .prixUnitaire(new BigDecimal("200.00"))
                .categorie("Test")
                .stockInitial(15)
                .pointDeCommande(5)
                .uniteMesure("unité")
                .build();

        mockMvc.perform(post("/api/produits")
                        .with(jwt().authorities(() -> "write"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.reference").value("PROD-003"))
                .andExpect(jsonPath("$.nom").value("New Product"));
    }

    @Test
    public void testAddProductWithPermissionRead() throws Exception {
        CreateProduitDTO createDTO = CreateProduitDTO.builder()
                .reference("PROD-004")
                .nom("Forbidden Product")
                .description("Should Fail")
                .prixUnitaire(new BigDecimal("250.00"))
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

    @Test
    public void testAccessWithoutToken() throws Exception {
        mockMvc.perform(get("/api/produits"))
                .andExpect(status().isUnauthorized());
    }
}
