package com.auctionpalace.api.dto;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import com.auctionpalace.api.entities.Item;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class ItemOverview {
    private int id;
    private String name;
    private String seller_username;
    private int currently;
    private int buy_now;
    private long minutes_remaining;

    public ItemOverview(Item item){
        this.id = item.getId();
        this.name = item.getName();
        this.seller_username = item.getUser().getUsername();
        this.currently = item.getCurrently();
        this.buy_now = item.getBuyPrice();
        this.minutes_remaining = LocalDateTime.now().until(item.getEnds(), ChronoUnit.MINUTES);
    }
}
