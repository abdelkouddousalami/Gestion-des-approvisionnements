package com.tricol.gestionstock.controller;

import com.tricol.gestionstock.dto.produit.CreateProduitDTO;
import com.tricol.gestionstock.dto.produit.ProduitResponseDTO;
import com.tricol.gestionstock.dto.produit.UpdateProduitDTO;
import com.tricol.gestionstock.service.ProductSservice;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/produits")
@RequiredArgsConstructor
@Slf4j
public class ProduitController {

    private final ProductSservice produitService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('CREATE_PRODUIT', 'write')")
    public ResponseEntity<ProduitResponseDTO> createProduit(
            @Valid @RequestBody CreateProduitDTO createDTO) {
            ProduitResponseDTO createdProduit = produitService.createProduit(createDTO);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(createdProduit);
    }
    @GetMapping
    @PreAuthorize("hasAnyAuthority('VIEW_PRODUIT', 'read')")
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
    @PreAuthorize("hasAnyAuthority('VIEW_PRODUIT', 'read')")
    public ResponseEntity<ProduitResponseDTO> getProductById(@PathVariable Long id){
       return ResponseEntity.ok(produitService.getProduitById(id));

    }

    @GetMapping("{id}/stock")
    @PreAuthorize("hasAuthority('VIEW_STOCK')")
    public  ResponseEntity<Map<String,Integer>> getProductStock(@PathVariable Long id){
        return ResponseEntity.ok(Map.of("Stock Actuel ",produitService.getProductStock(id).getStockActuel()));
    }


}