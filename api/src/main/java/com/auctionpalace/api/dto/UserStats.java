package com.auctionpalace.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class UserStats {

    int total_unread_messages;
    int total_auctions_participating;
    int total_auctions_winning;
    double average_buyer_rating;
    double average_seller_rating;
}
