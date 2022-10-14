package com.auctionpalace.api.controllers;

import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.auctionpalace.api.dto.ItemDTO;
import com.auctionpalace.api.dto.ItemOverview;
import com.auctionpalace.api.entities.Authority;
import com.auctionpalace.api.entities.Category;
import com.auctionpalace.api.entities.Item;
import com.auctionpalace.api.entities.User;
import com.auctionpalace.api.services.AuthorityService;
import com.auctionpalace.api.services.BidService;
import com.auctionpalace.api.services.CategoryService;
import com.auctionpalace.api.services.DealService;
import com.auctionpalace.api.services.ItemService;
import com.auctionpalace.api.services.UserService;
import com.auctionpalace.api.utils.MatrixFactorization;
import com.auctionpalace.api.utils.RecommendationSystem;

@RestController
@RequestMapping("/test")
public class TestController {
    
    @Autowired private AuthorityService authorityService;
    @Autowired private BidService bidService;
    @Autowired private ItemService itemService;
    @Autowired private UserService userService;
    @Autowired private CategoryService categoryService;
    @Autowired private DealService dealService;
    @Autowired private MatrixFactorization rs;

    @GetMapping("/users")
    @Transactional
    public ResponseEntity<?> getUsers(){
        List<User> users = userService.getAllUsers();
        User user2 = users.get(1);
        List<Item> user2_items = user2.getItems();
        System.out.println(user2_items.get(0).getName());
        return ResponseEntity.ok().body(
            users
        );
    }

    @GetMapping("/authorities")
    public ResponseEntity<List<Authority>> getAuthorities(){
        return ResponseEntity.ok().body(
            authorityService.getAuthorities()
        );
    }

    @GetMapping("/bids")
    public ResponseEntity<?> getBids(){
        return ResponseEntity.ok().body(
            bidService.getBids().stream().map(
                bid -> new Object(){
                    public final int id = bid.getId();
                    public final String user = bid.getUser().getName();
                    public final String item = bid.getItem().getName();
                }
            )
        );
    }

    @GetMapping("/items")
    @Transactional
    public ResponseEntity<?> getItems(){
        return ResponseEntity.ok().body(
            itemService.getItems()
                .stream().map(
                    item -> new ItemDTO(item)
                ).collect(Collectors.toList())
        );
    }

    @GetMapping("/mytest")
    public ResponseEntity<?> getMyTest(){
        try {
            return ResponseEntity.ok(
            //rs.train()
            new ItemOverview(rs.predict(1))
        );
        } catch (Exception e) {
            return ResponseEntity
                .badRequest()
                .header("eroor", e.getMessage())
                .body(null);
        }
    }
}
