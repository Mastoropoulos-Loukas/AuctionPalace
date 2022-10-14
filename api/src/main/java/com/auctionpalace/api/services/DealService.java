package com.auctionpalace.api.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.auctionpalace.api.entities.Deal;
import com.auctionpalace.api.repositories.DealRepository;

@Service
public class DealService {
    
    @Autowired private DealRepository dealRepository;

    public List<Deal> getDeals(){
        return dealRepository.findAll();
    }
}
