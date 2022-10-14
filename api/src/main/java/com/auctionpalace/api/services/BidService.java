package com.auctionpalace.api.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.auctionpalace.api.entities.Bid;
import com.auctionpalace.api.repositories.BidRepository;

@Service
public class BidService {
    
    @Autowired private BidRepository bidRepository;

    public List<Bid> getBids(){
        return bidRepository.findAll();
    }
}
