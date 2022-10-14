package com.auctionpalace.api.repositories;

import java.util.List;

import com.auctionpalace.api.entities.Card;
import com.auctionpalace.api.entities.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CardRepository extends JpaRepository<Card, Integer>{
    public List<Card> findAllByUser(User user);
}
