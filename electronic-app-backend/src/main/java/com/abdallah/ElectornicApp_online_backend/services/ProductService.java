package com.abdallah.ElectornicApp_online_backend.services;


import com.abdallah.ElectornicApp_online_backend.entites.Product;
import com.abdallah.ElectornicApp_online_backend.repositories.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ProductService {
    @Autowired
    private ProductRepo productRepo;
    public List<Product>getAllProducts() {
        return productRepo.findAll();
    }




    public Product getProductById(int id) {
        return productRepo.findById(id).orElse(null);
    }

    public Product addOrUpdateProduct(Product product, MultipartFile image) throws IOException {
    product.setImageName(image.getOriginalFilename());
    product.setImageType(image.getContentType());
    product.setImageData(image.getBytes());
        return productRepo.save(product);
    }

    public void deleteProduct(Product product) {

        productRepo.delete(product);
    }

    public List<Product> searchProduct(String keyword) {
        return productRepo.searchProducts(keyword);
    }
}
