package com.tricol.gestionstock.service;

import com.tricol.gestionstock.dto.produit.CreateProduitDTO;
import com.tricol.gestionstock.dto.produit.ProduitResponseDTO;
import com.tricol.gestionstock.dto.produit.UpdateProduitDTO;
import com.tricol.gestionstock.entity.Produit;

import java.util.List;

public interface ProductSservice {
    ProduitResponseDTO createProduit(CreateProduitDTO createDTO);
    List<ProduitResponseDTO> getAllProducts();
    void deleteProduct(Long id);
    ProduitResponseDTO updateProduit(UpdateProduitDTO updateProduitDTO, Long id);
    ProduitResponseDTO getProduitById(Long id);
    Produit getProductStock(Long id);
}
