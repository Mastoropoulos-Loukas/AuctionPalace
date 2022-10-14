package com.auctionpalace.api.dto;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import com.auctionpalace.api.entities.Item;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class BidInfo {
    
    private int item_id;
    private long minutes_remaining;
    private int currently;
    private int buy_now;
    private Boolean winning;
    private int seller_rating;

    public BidInfo(Item item, Boolean winning){
        
        this.item_id = item.getId();
        this.minutes_remaining = LocalDateTime.now().until(item.getEnds(), ChronoUnit.MINUTES);
        this.currently = item.getCurrently();
        this.buy_now = item.getBuyPrice();
        this.winning = winning;
        this.seller_rating = item.getSellerRating();
    }

}
