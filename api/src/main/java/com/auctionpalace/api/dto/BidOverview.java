package com.auctionpalace.api.dto;

import java.time.LocalDateTime;

import com.auctionpalace.api.entities.Bid;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class BidOverview {

    private int bid_id;
    private String user_username;
    private LocalDateTime date;
    private double amount;

    public BidOverview(Bid bid){
        this.bid_id = bid.getId();
        this.user_username = bid.getUser().getUsername();
        this.date = bid.getTime();
        this.amount = bid.getAmount();
    }
}
