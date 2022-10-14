package com.auctionpalace.api.dto;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import com.auctionpalace.api.entities.Item;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class ItemInfo {
    
    int item_id;
    private long minutes_remaining;
    private int currently;
    private int buy_now;
    private int ending;
    private int bidder_rating;
    private boolean editable;

    public ItemInfo(Item item, int ending){
        this.item_id = item.getId();
        this.minutes_remaining = LocalDateTime.now().until(item.getEnds(), ChronoUnit.MINUTES);
        this.currently = item.getCurrently();
        this.buy_now = item.getBuyPrice();
        this.ending = ending;
        this.bidder_rating = item.getBidderRating();
        this.editable = (item.getStarts().isAfter(LocalDateTime.now()));
    }
}
