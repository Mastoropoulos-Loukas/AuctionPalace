package com.auctionpalace.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class CardDTO {

    private String card_number;
    private int cvv;
    private String expiration_date;
    
}
