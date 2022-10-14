package com.auctionpalace.api.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.auctionpalace.api.dto.CategoryStats;
import com.auctionpalace.api.dto.ItemDTO;
import com.auctionpalace.api.dto.ItemLongDTO;
import com.auctionpalace.api.dto.PageResponse;
import com.auctionpalace.api.entities.Deal;
import com.auctionpalace.api.entities.Item;
import com.auctionpalace.api.services.CategoryService;
import com.auctionpalace.api.services.DealService;
import com.auctionpalace.api.services.ItemService;

@RestController
@RequestMapping("/search")
public class SearchController {

    @Autowired private CategoryService categoryService;
    @Autowired private DealService dealService;
    @Autowired private ItemService itemService;
    
    @GetMapping("/categories_with_stats")
    public ResponseEntity<List<CategoryStats>> getCategoriesStats(){
        return ResponseEntity.ok().body(
            categoryService.getAllCategories().stream().map(
                cat -> {
                    try {
                        return categoryService.getCategoryStats(cat.getId());
                    } catch (Exception e) {
                        System.out.println(e.getMessage());
                        return null;
                    }
                }
            ).collect(Collectors.toList())
        );
    }

    @GetMapping("/deals")
    public ResponseEntity<List<Deal>> getDeals(){
        return ResponseEntity.ok(
            dealService.getDeals()
        );
    }

    @GetMapping("/item/{item_id}")
    public ResponseEntity<ItemLongDTO> getItem(
        @PathVariable int item_id
    ){
        Item item = itemService.getItem(item_id);
        if (item != null)
            return ResponseEntity.ok(
                new ItemLongDTO(item)
            );
        return ResponseEntity
            .badRequest()
            .header("error", "Item with id " + item_id + " does not exist")
            .body(null);
    }

    @GetMapping("")
    public ResponseEntity<?> searchItems(
        @RequestParam(required = false, defaultValue = "0") int max_price,
        @RequestParam(required = false) String text,
        @RequestParam(required = false) String location,
        @RequestParam(required = false) List<String> categories,
        @RequestParam(required = false, defaultValue = "0") int ignore_time,
        @RequestParam(required = false, defaultValue = "1") int pageNumber,
        @RequestParam(required = false, defaultValue = "1") int pageSize
    ){
        
        try {
            return ResponseEntity.ok(
                itemService.searchItems(max_price, text, location, categories, ignore_time, pageNumber, pageSize)
            );
        } catch (Exception e) {
            return ResponseEntity
                .badRequest()
                .header("error", e.getMessage())
                .body(null);
        }
    }
}
