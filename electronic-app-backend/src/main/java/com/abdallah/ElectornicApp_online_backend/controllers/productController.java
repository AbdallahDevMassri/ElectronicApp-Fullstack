package com.abdallah.ElectornicApp_online_backend.controllers;


import com.abdallah.ElectornicApp_online_backend.entites.Product;
import com.abdallah.ElectornicApp_online_backend.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class productController {

    @Autowired
    private ProductService productService;


    // Request to get all products
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getProducts() {

        return new ResponseEntity<>(productService.getAllProducts(), HttpStatus.OK);
    }

    //Get Product by Id
    @GetMapping("/product/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable int id) {
        Product product = productService.getProductById(id);
        if (product != null)
            return new ResponseEntity<Product>(product, HttpStatus.OK);
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);

    }

    // Add product
    @PostMapping("/product")
    public ResponseEntity<?> addProduct(@RequestPart Product product, @RequestPart MultipartFile imageFile) {

        Product saveProduct = null;
        try {
            saveProduct = productService.addOrUpdateProduct(product, imageFile);
            return new ResponseEntity<>(saveProduct, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    //get image by productId
    @GetMapping("product/{productId}/image")
    public ResponseEntity<byte[]> getImageByProductId(@PathVariable int productId){

        Product product = productService.getProductById(productId);
        return new ResponseEntity<>(product.getImageData(),HttpStatus.OK);
    }
    //Add or Update product
    @PutMapping("/product/{id}")
    public ResponseEntity<String> updateProduct(@RequestPart Product product, @RequestPart MultipartFile imageFile ){

        Product updatingProduct = null;
        try {
            updatingProduct = productService.addOrUpdateProduct(product, imageFile);
            return new ResponseEntity<>("Updating", HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    //delete product by id
    @DeleteMapping("product/{id}")
    public ResponseEntity<String> deleteProduct (@PathVariable int id){

        Product product = productService.getProductById(id);
         if(product !=null){
             productService.deleteProduct(product);
             return new ResponseEntity<>("Deleted",HttpStatus.OK);
         }
        else
            return new ResponseEntity<>("productNotFound",HttpStatus.BAD_REQUEST);
    }
    //Search product with keyword useEffect every letter you enter you will call the method
    @GetMapping("/products/search/{keyword}")
    public ResponseEntity<List<Product>> searchKeyword (@PathVariable String keyword){
    List<Product> products = productService.searchProduct(keyword);

        System.out.println("searching with : "+ keyword);
        System.out.println("____________________________________");


    if(products!=null){
        System.out.println("found"+products.size());
        System.out.println(products);
        return new ResponseEntity<>(products,HttpStatus.FOUND);

    }
    else

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    @GetMapping("/load")
    public String loadData() {


        return "Success load the Data";
    }

}
