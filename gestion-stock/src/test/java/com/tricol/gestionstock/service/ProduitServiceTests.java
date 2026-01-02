package com.tricol.gestionstock.service;

import com.tricol.gestionstock.dto.produit.CreateProduitDTO;
import com.tricol.gestionstock.dto.produit.ProduitResponseDTO;
import com.tricol.gestionstock.entity.Produit;
import com.tricol.gestionstock.exception.DuplicateResourceException;
import com.tricol.gestionstock.exception.ResourceNotFoundException;
import com.tricol.gestionstock.mapper.ProduitMapper;
import com.tricol.gestionstock.repository.ProduitRepository;
import com.tricol.gestionstock.service.impl.ProduitServiceImp;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProduitServiceTests {

    @Mock
    private ProduitRepository produitRepository;

    @Mock
    private ProduitMapper produitMapper;

    @InjectMocks
    private ProduitServiceImp produitService;

    private Produit produit;
    private CreateProduitDTO createDTO;
    private ProduitResponseDTO responseDTO;

    @BeforeEach
    public void setup() {
        produit = Produit.builder()
                .id(1L)
                .reference("PROD-001")
                .nom("Test Product")
                .description("Test Description")
                .prixUnitaire(new BigDecimal("100.00"))
                .categorie("Test")
                .stockActuel(10)
                .pointDeCommande(5)
                .uniteMesure("unité")
                .build();

        createDTO = CreateProduitDTO.builder()
                .reference("PROD-001")
                .nom("Test Product")
                .description("Test Description")
                .prixUnitaire(new BigDecimal("100.00"))
                .categorie("Test")
                .stockInitial(10)
                .pointDeCommande(5)
                .uniteMesure("unité")
                .build();

        responseDTO = ProduitResponseDTO.builder()
                .id(1L)
                .reference("PROD-001")
                .nom("Test Product")
                .prixUnitaire(new BigDecimal("100.00"))
                .categorie("Test")
                .stockActuel(10)
                .build();
    }

    @Test
    public void testCreateProduit_Success() {
        when(produitRepository.existsByReference(createDTO.getReference())).thenReturn(false);
        when(produitMapper.toEntity(createDTO)).thenReturn(produit);
        when(produitRepository.save(any(Produit.class))).thenReturn(produit);
        when(produitMapper.toResponseDTO(produit)).thenReturn(responseDTO);

        ProduitResponseDTO result = produitService.createProduit(createDTO);

        assertNotNull(result);
        assertEquals("PROD-001", result.getReference());
        verify(produitRepository, times(1)).save(any(Produit.class));
    }

    @Test
    public void testCreateProduit_DuplicateReference() {
        when(produitRepository.existsByReference(createDTO.getReference())).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> {
            produitService.createProduit(createDTO);
        });

        verify(produitRepository, never()).save(any(Produit.class));
    }

    @Test
    public void testGetAllProducts_Success() {
        List<Produit> produits = Arrays.asList(produit);
        when(produitRepository.findAll()).thenReturn(produits);
        when(produitMapper.toResponseDTO(produit)).thenReturn(responseDTO);

        List<ProduitResponseDTO> result = produitService.getAllProducts();

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(produitRepository, times(1)).findAll();
    }

    @Test
    public void testGetProduitById_Success() {
        when(produitRepository.findById(1L)).thenReturn(Optional.of(produit));
        when(produitMapper.toResponseDTO(produit)).thenReturn(responseDTO);

        ProduitResponseDTO result = produitService.getProduitById(1L);

        assertNotNull(result);
        assertEquals("PROD-001", result.getReference());
        verify(produitRepository, times(1)).findById(1L);
    }

    @Test
    public void testGetProduitById_NotFound() {
        when(produitRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            produitService.getProduitById(1L);
        });
    }

    @Test
    public void testDeleteProduct_Success() {
        when(produitRepository.findById(1L)).thenReturn(Optional.of(produit));
        doNothing().when(produitRepository).delete(produit);

        produitService.deleteProduct(1L);

        verify(produitRepository, times(1)).delete(produit);
    }

    @Test
    public void testGetProductStock_Success() {
        when(produitRepository.findById(1L)).thenReturn(Optional.of(produit));

        Produit result = produitService.getProductStock(1L);

        assertNotNull(result);
        assertEquals(10, result.getStockActuel());
    }
}
