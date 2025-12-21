package com.tricol.gestionstock.controller;


import com.tricol.gestionstock.dto.produit.CreateProduitDTO;
import com.tricol.gestionstock.dto.produit.ProductSearchCriteria;
import com.tricol.gestionstock.dto.produit.ProduitResponseDTO;
import com.tricol.gestionstock.dto.produit.UpdateProduitDTO;
import com.tricol.gestionstock.dto.stock.MouvementStockDTO;
import com.tricol.gestionstock.service.ProductSservice;
import jakarta.validation.Valid;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.query.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Builder
@RestController
@RequestMapping("/api/produits")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ProduitController {

    private final ProductSservice produitService;

    @PostMapping
    @PreAuthorize("hasAuthority('CREATE_PRODUIT')")
    public ResponseEntity<ProduitResponseDTO> createProduit(
            @Valid @RequestBody CreateProduitDTO createDTO) {
            ProduitResponseDTO createdProduit = produitService.createProduit(createDTO);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(createdProduit);
    }
    @GetMapping
    @PreAuthorize("hasAuthority('VIEW_PRODUIT')")
    public ResponseEntity<List<ProduitResponseDTO>> getAllProducts(){
        List<ProduitResponseDTO> productList = produitService.getAllProducts();
        return ResponseEntity.ok(productList);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('UPDATE_PRODUIT')")
    public ResponseEntity<ProduitResponseDTO> updateProduit(@Valid @RequestBody UpdateProduitDTO updateProduitDTO ,@PathVariable Long id){

        ProduitResponseDTO updateProduit = produitService.updateProduit(updateProduitDTO, id);
        return ResponseEntity.ok(updateProduit);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('DELETE_PRODUIT')")
    public ResponseEntity<Map<String,String>> deleteProduct(@PathVariable Long id) {

        produitService.deleteProduct(id);
        return ResponseEntity.ok().body(Map.of("Message" , "Deleted successfuLy"));
    }
    @GetMapping("{id}")
    @PreAuthorize("hasAuthority('VIEW_PRODUIT')")
    public ResponseEntity<ProduitResponseDTO> getProductById(@PathVariable Long id){
       return ResponseEntity.ok(produitService.getProduitById(id));

    }

    @GetMapping("{id}/stock")
    @PreAuthorize("hasAuthority('VIEW_STOCK')")
    public  ResponseEntity<Map<String,Integer>> getProductStock(@PathVariable Long id){
        return ResponseEntity.ok(Map.of("Stock Actuel ",produitService.getProductStock(id).getStockActuel()));
    }


}