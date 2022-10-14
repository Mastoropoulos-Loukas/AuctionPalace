package com.auctionpalace.api.dto;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import com.auctionpalace.api.entities.Item;
import com.auctionpalace.api.entities.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class ItemLongDTO {

    private int id;
    private String name;
    private LocalDateTime starts;
    private LocalDateTime ends;
    private int first_bid;
    private String location;
    private String country;
    private String seller_username;
    private double seller_rating;
    private long minutes_remaining;
    private int currently;
    private int buy_now;
    private String descritpion;

    public ItemLongDTO(Item item){
        this.id = item.getId();
        this.name = item.getName();
        this.starts = item.getStarts();
        this.ends = item.getEnds();
        this.first_bid = item.getFirstBid();
        this.location = item.getLocation();
        this.country = item.getCountry();
        
        User seller = item.getUser();
        this.seller_username = seller.getUsername();
        this.seller_rating = seller.getRatingSeller();

        this.minutes_remaining = LocalDateTime.now().until(item.getEnds(), ChronoUnit.MINUTES);
        this.currently = item.getCurrently();
        this.buy_now = item.getBuyPrice();
        this.descritpion = item.getDescription();
    }
    
}
