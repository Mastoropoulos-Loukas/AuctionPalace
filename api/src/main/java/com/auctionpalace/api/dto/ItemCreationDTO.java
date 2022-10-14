package com.auctionpalace.api.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.auctionpalace.api.entities.Category;
import com.auctionpalace.api.entities.Item;
import com.auctionpalace.api.entities.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class ItemCreationDTO {
    
    private int id;
    private String name;
    private LocalDateTime starts;
    private LocalDateTime ends;
    private int buy_now;
    private int first_bid;
    private List<String> categories;
    private String location;
    private String country;
    private double latitude;
    private double longitude;
    private String descritpion;

    public Item buildItem(User user, List<Category> categories) throws Exception{
        Item item = new Item();

        if(id != 0){}
            item.setId(id);
        item.setName(this.name);
        item.setStarts(this.starts);
        item.setUser(user);
        item.setEnds(this.ends);
        item.setBuyPrice(this.buy_now);
        item.setCurrently(0);
        item.setNumberOfBids(0);
        item.setFirstBid(this.first_bid);
        item.setCategories(categories);
        item.setLocation(this.location);
        item.setCountry(this.country);
        item.setLatitude(this.latitude);
        item.setLongitude(this.longitude);
        item.setDescription(this.descritpion);
        item.setBids(new ArrayList<>());
        item.setBidderRating(0);
        item.setSellerRating(0);
        
        return item;
    }

}
