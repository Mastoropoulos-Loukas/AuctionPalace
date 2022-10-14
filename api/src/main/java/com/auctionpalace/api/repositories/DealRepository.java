package com.auctionpalace.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.auctionpalace.api.entities.Deal;

@Repository
public interface DealRepository extends JpaRepository<Deal, Integer>{
    
}
