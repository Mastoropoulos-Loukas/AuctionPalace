package com.auctionpalace.api.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.auctionpalace.api.dto.ItemOverview;
import com.auctionpalace.api.dto.PageResponse;
import com.auctionpalace.api.dto.UserOverview;
import com.auctionpalace.api.entities.Item;
import com.auctionpalace.api.entities.User;
import com.auctionpalace.api.services.AdminService;
import com.auctionpalace.api.utils.MatrixFactorization;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired private AdminService adminService;
    @Autowired private MatrixFactorization mf;

    @PostMapping("/train")
    public ResponseEntity<Integer> trainSystem(){
        mf.train();
        return ResponseEntity.ok(1);
    }

    @GetMapping("test")
    public ResponseEntity<String> testInput(){
        return ResponseEntity.ok().body("test string");    
    }

    @GetMapping("/users")
    public ResponseEntity<PageResponse<UserOverview>> getUsers(
        @RequestParam(required = false, defaultValue = "1") int pageNumber,
        @RequestParam(required = false, defaultValue = "1") int pageSize,
        @RequestHeader(HttpHeaders.AUTHORIZATION) String full_token
    ){
        try {
            return ResponseEntity.ok(
                adminService.getUsers(full_token, pageNumber, pageSize)
            );
        } catch (Exception e) {
            return ResponseEntity
                .badRequest()
                .header("error", e.getMessage())
                .body(null);
        }
    }

    @GetMapping("/users/{user_id}")
    public ResponseEntity<User> getUser(
        @RequestHeader(HttpHeaders.AUTHORIZATION) String full_token,
        @PathVariable int user_id
    ){
        try {
            return ResponseEntity.ok(
                adminService.getUser(full_token, user_id)
            );
        } catch (Exception e) {
            return ResponseEntity
                .badRequest()
                .header("error", e.getMessage())
                .body(null);
        }
    }

    @PostMapping("/block_user/{user_id}")
    public ResponseEntity<User> blockUser(
        @RequestHeader(HttpHeaders.AUTHORIZATION) String full_token,
        @PathVariable int user_id
    ){
        try {
            return ResponseEntity.ok(
                adminService.blockUser(full_token, user_id)
            );
        } catch (Exception e) {
            return ResponseEntity
                .badRequest()
                .header("error", e.getMessage())
                .body(null);
        }
    }

    @PostMapping("/approve/{user_id}")
    public ResponseEntity<User> approveUser(
        @RequestHeader(HttpHeaders.AUTHORIZATION) String full_token,
        @PathVariable int user_id
    ){
        try {
            return ResponseEntity.ok(
                adminService.approveUser(full_token, user_id)
            );
        } catch (Exception e) {
            return ResponseEntity
                .badRequest()
                .header("error", e.getMessage())
                .body(null);
        }
    }
    

    @GetMapping("/applications")
    public ResponseEntity<PageResponse<UserOverview>> getWaitingUsers(
        @RequestParam(required = false, defaultValue = "1") int pageNumber,
        @RequestParam(required = false, defaultValue = "1") int pageSize,
        @RequestHeader(HttpHeaders.AUTHORIZATION) String full_token
    ){
        try {
            return ResponseEntity.ok(
                adminService.getWaitingUsers(full_token, pageNumber, pageSize)
            );
        } catch (Exception e) {
            return ResponseEntity
                .badRequest()
                .header("error", e.getMessage())
                .body(null);
        }
    }

    @GetMapping("/items")
    public ResponseEntity<PageResponse<ItemOverview>> getItems(
        @RequestParam(required = false, defaultValue = "1") int pageNumber,
        @RequestParam(required = false, defaultValue = "1") int pageSize,
        @RequestHeader(HttpHeaders.AUTHORIZATION) String full_token
    ){
        try {
            return ResponseEntity.ok(
                adminService.getItems(full_token, pageNumber, pageSize)
            );
        } catch (Exception e) {
            return ResponseEntity
                .badRequest()
                .header("error", e.getMessage())
                .body(null);
        }
    }

    @GetMapping("/items/{item_id}")
    public ResponseEntity<Item> getItem(
        @RequestHeader(HttpHeaders.AUTHORIZATION) String full_token,
        @PathVariable int item_id
    ){
        try {
            return ResponseEntity.ok(
                adminService.getItem(full_token, item_id)
            );
        } catch (Exception e) {
            return ResponseEntity
                .badRequest()
                .header("error", e.getMessage())
                .body(null);
        }
    }
    
}
