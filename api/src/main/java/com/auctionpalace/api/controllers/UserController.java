package com.auctionpalace.api.controllers;

import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import com.auctionpalace.api.dto.AuthCredentialsRequest;
import com.auctionpalace.api.dto.CardDTO;
import com.auctionpalace.api.dto.CardInfoDTO;
import com.auctionpalace.api.dto.ItemCreationDTO;
import com.auctionpalace.api.dto.ItemDTO;
import com.auctionpalace.api.dto.ItemInfo;
import com.auctionpalace.api.dto.BidInfo;
import com.auctionpalace.api.dto.BidOverview;
import com.auctionpalace.api.dto.MessageCreationDTO;
import com.auctionpalace.api.dto.MessageDTO;
import com.auctionpalace.api.dto.PageResponse;
import com.auctionpalace.api.dto.RatingConfirmation;
import com.auctionpalace.api.dto.UserCreation;
import com.auctionpalace.api.dto.UserStats;
import com.auctionpalace.api.entities.Bid;
import com.auctionpalace.api.entities.User;
import com.auctionpalace.api.entities.Visitation;
import com.auctionpalace.api.services.UserService;
import com.auctionpalace.api.utils.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.StreamingHttpOutputMessage.Body;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired private UserService userService;
    @Autowired AuthenticationManager authenticationManager;
    @Autowired JwtUtil jwtUtil;

    @GetMapping("/recommend")
    public ResponseEntity<ItemDTO> recommend(
        @RequestHeader(HttpHeaders.AUTHORIZATION) String full_token){
            try {
                return ResponseEntity.ok(
                    userService.recommend(full_token)
                );
            } catch (Exception e) {
                return ResponseEntity
                    .badRequest()
                    .header("error", e.getMessage())
                    .body(null);
            }
        }

    @PostMapping("/visit/{item_id}")
    public ResponseEntity<Visitation> userVisitsItem(
        @RequestHeader(HttpHeaders.AUTHORIZATION) String full_token,
        @PathVariable int item_id
    ){
        try {
            return ResponseEntity.ok(
                userService.userVisitsItem(full_token, item_id)
            );
        } catch (Exception e) {
            return ResponseEntity
                .badRequest()
                .header("error", e.getMessage())
                .body(null);
        }
    }

    @GetMapping("item/{item_id}/bids")
    public ResponseEntity<List<BidOverview>> getItemBids(
        @RequestHeader(HttpHeaders.AUTHORIZATION) String full_token,
        @PathVariable int item_id
    ){
        try {
            return ResponseEntity.ok(
                userService.getItemBids(full_token, item_id)
            );
        } catch (Exception e) {
            return ResponseEntity
                .badRequest()
                .header("error", e.getMessage())
                .body(null);
        }
    }

    @GetMapping("/item/{item_id}/winning_user")
    public ResponseEntity<User> winningUser(
        @RequestHeader(HttpHeaders.AUTHORIZATION) String full_token,
        @PathVariable int item_id
    ){
        try {
            return ResponseEntity.ok(
                userService.getWinningUser(full_token, item_id)
            );
        } catch (Exception e) {
            return ResponseEntity
                .badRequest()
                .header("error", e.getMessage())
                .body(null);
        }
    }

    @PostMapping("/item/save")
    public ResponseEntity<ItemDTO> saveItem(
        @RequestBody ItemCreationDTO req,
        @RequestHeader(HttpHeaders.AUTHORIZATION) String full_token
    ){
        try {
            return ResponseEntity.ok(
                userService.saveItem(full_token, req)
            );
        } catch (Exception e) {
            return ResponseEntity
                .badRequest()
                .header("error", e.getMessage())
                .body(null);
        }
    }

    @PostMapping("/get_deal/{deal_id}")
    public ResponseEntity<User> getDeal(
        @RequestHeader(HttpHeaders.AUTHORIZATION) String full_token,
        @PathVariable int deal_id
    ){
        try {
            return ResponseEntity.ok(
                userService.getDeal(full_token, deal_id)
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().header("error", e.getMessage()).body(null);
        }
    }
    
    @PostMapping("/cash_out/{card_id}")
    public ResponseEntity<User> cashOut(
        @RequestHeader(HttpHeaders.AUTHORIZATION) String full_token,
        @PathVariable int card_id,
        @RequestParam int amount
    ){
        try {
            return ResponseEntity.ok(
                userService.cashOut(full_token, card_id, amount)
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().header("error", e.getMessage()).body(null);
        }
    }
    
    @GetMapping("/cards")
    public ResponseEntity<List<CardInfoDTO>> getUserCards(
        @RequestHeader(HttpHeaders.AUTHORIZATION) String full_token
    ){
        try {
            return ResponseEntity.ok(
                userService.getUserCards(full_token)
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().header("error", e.getMessage()).body(null);
        }
    }

    @PostMapping("/add_card")
    public ResponseEntity<CardInfoDTO> saveCard(
        @RequestHeader(HttpHeaders.AUTHORIZATION) String full_token,
        @RequestBody CardDTO card
    ){
        try {
            return ResponseEntity.ok(
                userService.saveCard(full_token, card)
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().header("error", e.getMessage()).body(null);
        }
    }

    @PostMapping("/messages/seen/{message_id}")
    public ResponseEntity<Integer> seeMessage(
        @RequestHeader(HttpHeaders.AUTHORIZATION) String full_token,
        @PathVariable int message_id
    ){
        try {
            return ResponseEntity.ok(
                userService.seeMessage(full_token, message_id)
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().header("error", e.getMessage()).body(null);
        }
    }

    @GetMapping("/messages/unseen")
    public ResponseEntity<Integer> numberOfUnseenMessages(
        @RequestHeader(HttpHeaders.AUTHORIZATION) String full_token
    ){
        try {
            return ResponseEntity.ok(
                userService.numberOfUnseenMessages(full_token)
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().header("error", e.getMessage()).body(null);
        }
    }

    @DeleteMapping("/messages/{message_id}")
    public ResponseEntity<MessageDTO> deleteMessage(
        @RequestHeader(HttpHeaders.AUTHORIZATION) String full_token,
        @PathVariable int message_id
    ){
        try {
            return ResponseEntity.ok(
                userService.deleteUserMessage(full_token, message_id)
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().header("error", e.getMessage()).body(null);
        }
    }

    @GetMapping("/messages/{message_id}")
    public ResponseEntity<MessageDTO> getMessage(
        @RequestHeader(HttpHeaders.AUTHORIZATION) String full_token,
        @PathVariable int message_id
    ){
        try {
            return ResponseEntity.ok(
                userService.getUserMessage(full_token, message_id)
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().header("error", e.getMessage()).body(null);
        }
    }

    @PostMapping("/messages/compose")
    public ResponseEntity<MessageDTO> composeMessage(
        @RequestHeader(HttpHeaders.AUTHORIZATION) String full_token,
        @RequestBody MessageCreationDTO req
    ){
        try {
            return ResponseEntity.ok(
                userService.composeMessage(full_token, req)
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().header("error", e.getMessage()).body(null);
        }
    }

    @GetMapping("/messages/inbox")
    public ResponseEntity<PageResponse<MessageDTO>> getInbox(
        @RequestHeader(HttpHeaders.AUTHORIZATION) String full_token,
        @RequestParam(required = false, defaultValue = "1") int pageNumber,
        @RequestParam(required = false, defaultValue = "1") int pageSize
    ){
        try {
            return ResponseEntity.ok(
                userService.getInbox(full_token, pageNumber, pageSize)
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().header("error", e.getMessage()).body(null);
        }
    }

    @GetMapping("/messages/sent")
    public ResponseEntity<PageResponse<MessageDTO>> getSent(
        @RequestHeader(HttpHeaders.AUTHORIZATION) String full_token,
        @RequestParam(required = false, defaultValue = "1") int pageNumber,
        @RequestParam(required = false, defaultValue = "1") int pageSize
    ){
        try {
            return ResponseEntity.ok(
                userService.getSent(full_token, pageNumber, pageSize)
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().header("error", e.getMessage()).body(null);
        }
    }

    @PostMapping("/rate/bidder/{item_id}")
    public ResponseEntity<RatingConfirmation> rateBidder(
        @RequestHeader(HttpHeaders.AUTHORIZATION) String full_token,
        @PathVariable int item_id,
        @RequestParam int rating
    ){
        try {
            return ResponseEntity.ok().body(
              userService.rateBidder(full_token, rating, item_id)  
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().header("error", e.getMessage()).body(null);
        }
    }

    @PostMapping("/rate/seller/{item_id}")
    public ResponseEntity<RatingConfirmation> rateSeller(
        @RequestHeader(HttpHeaders.AUTHORIZATION) String full_token,
        @PathVariable int item_id,
        @RequestParam int rating
    ){
        try {
            return ResponseEntity.ok().body(
              userService.rateSeller(full_token, rating, item_id)  
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().header("error", e.getMessage()).body(null);
        }
    }

    @GetMapping("/bids/completed")
    public ResponseEntity<PageResponse<BidInfo>> getCompletedBids(
        @RequestHeader(HttpHeaders.AUTHORIZATION) String full_token,
        @RequestParam(required = false, defaultValue = "1") int pageNumber,
        @RequestParam(required = false, defaultValue = "1") int pageSize
    ){
        try {
            return ResponseEntity.ok(
                userService.getCompletedBids(full_token, pageNumber, pageSize)
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .header("error", e.getMessage())
                .body(null);
        } 
    }
    
    @GetMapping("/bids/ongoing")
    public ResponseEntity<PageResponse<BidInfo>> getOngoingdBids(  
        @RequestHeader(HttpHeaders.AUTHORIZATION) String full_token,
        @RequestParam(required = false, defaultValue = "1") int pageNumber,
        @RequestParam(required = false, defaultValue = "1") int pageSize
    ){
        try {
            return ResponseEntity.ok(
                userService.getOngoingBids(full_token, pageNumber, pageSize)
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .header("error", e.getMessage())
                .body(null);
        }      
    }

    @GetMapping("/items/ongoing")
    public ResponseEntity<PageResponse<ItemInfo>> getOngoingItems(
        @RequestHeader(HttpHeaders.AUTHORIZATION) String full_token,
        @RequestParam(required = false, defaultValue = "1") int pageNumber,
        @RequestParam(required = false, defaultValue = "1") int pageSize
    ){
        try {
            return ResponseEntity.ok().body(
                userService.getOngoingItems(
                    full_token, 
                    pageNumber, 
                    pageSize
                )
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().header("error", e.getMessage()).body(null);
        }
    }

    @GetMapping("/items/completed")
    public ResponseEntity<PageResponse<ItemInfo>> getCompletedItems(
        @RequestHeader(HttpHeaders.AUTHORIZATION) String full_token,
        @RequestParam(required = false, defaultValue = "1") int pageNumber,
        @RequestParam(required = false, defaultValue = "1") int pageSize
    ){
        try {
            return ResponseEntity.ok().body(
                userService.getCompletedItems(
                    full_token, 
                    pageNumber, 
                    pageSize
                )
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().header("error", e.getMessage()).body(null);
        }
    }

    @DeleteMapping("/item/{item_id}")
    public ResponseEntity<ItemDTO> deleteItem(
        @RequestHeader(HttpHeaders.AUTHORIZATION) String full_token,
        @PathVariable int item_id
    ){
        try {
            return ResponseEntity.ok().body(
                userService.deleteItem(full_token, item_id)
            );   
        } catch (Exception e) {
            return ResponseEntity.badRequest()
            .header("error", e.getMessage())
            .body(null);
        }
    }

    @PostMapping("/bid/{item_id}")
    public ResponseEntity<Bid> userBid(
        @RequestHeader(HttpHeaders.AUTHORIZATION) String full_token,
        @RequestParam int amount,
        @PathVariable int item_id
    ){
        try {
            return ResponseEntity.ok().body(
                userService.makeBid(full_token, amount, item_id)
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest()
            .header("error", e.getMessage())
            .body(null);
        }
    }

    @PostMapping("/buy_now/{item_id}")
    public ResponseEntity<Bid> userBuyNow(
        @RequestHeader(HttpHeaders.AUTHORIZATION) String full_token,
        @PathVariable int item_id
    ){
        try {
            return ResponseEntity.ok().body(
                userService.buyNow(full_token, item_id)
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest()
            .header("error", e.getMessage())
            .body(null);
        }
    }

    @GetMapping("stats")
    public ResponseEntity<UserStats> getUserStats(@RequestHeader(HttpHeaders.AUTHORIZATION) String full_token){
        try {
            return ResponseEntity.ok().body(
                userService.getUserStatsFromJWT(full_token)
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest()
            .header("error", e.getMessage())
            .body(null);
        }
    }

    @GetMapping("/get_status")
    public ResponseEntity<String> getUserStatus(@RequestHeader(HttpHeaders.AUTHORIZATION) String full_token){

        try {
            return ResponseEntity.ok().body(
                userService.getUserStatus(full_token)
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                e.getMessage()
            );
        }
    }

    @GetMapping()
    public ResponseEntity<List<User>> getAllUsers() throws Exception{
        List<User> users = null;

        try {
            users = userService.getAllUsers();
        } catch (Exception e) {
            throw e;
        }

        return new ResponseEntity<List<User>>(users, HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody AuthCredentialsRequest request){
        Pair<User, String> res;

        try {
            res = userService.login(request.getUsername(), request.getPassword());
            return ResponseEntity.ok()
                .header(
                    HttpHeaders.AUTHORIZATION,
                    res.getSecond()
                )
                .body(res.getFirst());
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/quick_login")
    public ResponseEntity<User> quickLogin(@RequestHeader(HttpHeaders.AUTHORIZATION) String full_token){

        try {
            String token = full_token.split(" ")[1];
            Pair<User, String> pair = userService.quickLogin(token);
            User user = pair.getFirst();
            
            return ResponseEntity.ok()
                .header(
                    HttpHeaders.AUTHORIZATION,
                    token
                )
                .body(user);
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).header("error", ex.getMessage()).build();
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<User> createNewUser(@RequestBody UserCreation req){
        
        Pair<User, String> res;
        try {
            res = userService.signup(req);
            return ResponseEntity.ok().header(HttpHeaders.AUTHORIZATION, res.getSecond()).body(res.getFirst());
        } catch (Exception e) {
            return ResponseEntity.badRequest().header("error", e.getMessage()).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable int id) throws Exception{
        User user = null;

        try {
            user = userService.getUserById(id);
        } catch (Exception e) {
            throw e;
        }

        return new ResponseEntity<User>(user, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<User> deleteUser(@PathVariable int id) throws Exception{
        User user = null;
        
        try {
            user = userService.deleteUser(id);
        } catch (Exception e) {
            throw e;
        }

        return new ResponseEntity<User>(user, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<User> createUser(@RequestBody User requestUser) throws Exception{
        User user = null;
        try {
            user = userService.createOrUpdateUser(requestUser);
        } catch (Exception e) {
            throw e;
        }

        return new ResponseEntity<User>(user, HttpStatus.OK);
    }

    @GetMapping("/winning_item/{item_id}")
    public ResponseEntity<Boolean> isUserWinning(
        @PathVariable int item_id,
        @RequestHeader(HttpHeaders.AUTHORIZATION) String full_token
    ){
        try {
            return ResponseEntity.ok(
                userService.isUserWinning(full_token, item_id)
            );
        } catch (Exception e) {
            return ResponseEntity
                .badRequest()
                .header("error", e.getMessage())
                .body(null);
        }
    }

}
