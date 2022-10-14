package com.auctionpalace.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class CategoryStats {

    int category_id;
    String name;
    int total_auctions;
    int min_price;
    int max_price;
}
