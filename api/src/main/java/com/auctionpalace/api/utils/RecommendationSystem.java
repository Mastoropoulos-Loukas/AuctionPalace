package com.auctionpalace.api.utils;

import com.auctionpalace.api.entities.Item;

public interface RecommendationSystem {
    
    public void train();
    public Item predict(int user_id) throws Exception;
}
