package com.auctionpalace.api.dto;

import com.auctionpalace.api.entities.Card;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class CardInfoDTO {

    private int card_id;
    private int user_id;
    private String user_username;
    private String card_number;
    private int cvv;
    private String expiration_date;

    public CardInfoDTO(Card card){
        this.card_id = card.getId();
        this.user_id = card.getUser().getId();
        this.user_username = card.getUser().getUsername();
        this.card_number = card.getCard_number();
        this.cvv = card.getCvv();
        this.expiration_date = card.getExpiration_date();
    }
    
}
