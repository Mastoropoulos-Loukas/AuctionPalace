package com.auctionpalace.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class RatingConfirmation {

    private int rating_from;
    private int rating_to;
    private int rating;
}
