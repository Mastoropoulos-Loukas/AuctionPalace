package com.auctionpalace.api.controllers;

import java.util.List;

import com.auctionpalace.api.entities.Category;
import com.auctionpalace.api.services.CategoryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/categories")
public class CategoryController {
    
    @Autowired private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<Category>> getCategories(){
        return new ResponseEntity<List<Category>>(categoryService.getAllCategories(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable int id){
        return new ResponseEntity<Category>(categoryService.getCategoryById(id), HttpStatus.OK);
    }
}
